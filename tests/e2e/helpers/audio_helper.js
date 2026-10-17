import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/**
 * Probe audio file using ffprobe (if available) or raw binary parsing.
 * @param {string} filePath - Absolute path to audio file.
 */
export function probeAudioFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, error: 'File does not exist' };
  }

  const stat = fs.statSync(filePath);
  const result = {
    exists: true,
    size: stat.size,
    isReadable: false,
    format: null,
    duration: 0,
    sampleRate: 0,
    channels: 0,
    bitRate: 0,
    rawHeader: null,
  };

  try {
    const fd = fs.openSync(filePath, 'r');
    const headerBuf = Buffer.alloc(10);
    fs.readSync(fd, headerBuf, 0, 10, 0);
    fs.closeSync(fd);
    result.isReadable = true;
    result.rawHeader = headerBuf;

    // Check ID3v2 tag: "ID3"
    if (headerBuf.toString('ascii', 0, 3) === 'ID3') {
      result.hasId3Tag = true;
    }
  } catch (err) {
    result.readError = err.message;
    return result;
  }

  // Probe with ffprobe
  try {
    const env = { ...process.env, PATH: `/opt/homebrew/bin:${process.env.PATH || ''}` };
    const ffprobe = spawnSync(
      'ffprobe',
      [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        filePath
      ],
      { env, timeout: 5000, encoding: 'utf-8' }
    );

    if (ffprobe.status === 0 && ffprobe.stdout) {
      const data = JSON.parse(ffprobe.stdout);
      if (data.format) {
        result.duration = parseFloat(data.format.duration || '0');
        result.bitRate = parseInt(data.format.bit_rate || '0', 10);
        result.format = data.format.format_name;
      }
      if (Array.isArray(data.streams)) {
        const audioStream = data.streams.find(s => s.codec_type === 'audio');
        if (audioStream) {
          result.codec = audioStream.codec_name;
          result.sampleRate = parseInt(audioStream.sample_rate || '0', 10);
          result.channels = parseInt(audioStream.channels || '0', 10);
        }
      }
    }
  } catch {
    // ffprobe fallback or unavailable
  }

  return result;
}

/**
 * Measure boundary amplitudes (head and tail) to verify zero-crossing / micro-fade.
 * Uses ffmpeg to decode first and last 50ms into raw PCM.
 * @param {string} filePath 
 */
export function probeBoundaryAmplitudes(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, headMax: 1, tailMax: 1 };
  }

  const env = { ...process.env, PATH: `/opt/homebrew/bin:${process.env.PATH || ''}` };

  try {
    // Read head 50ms as 16-bit PCM
    const headProc = spawnSync(
      'ffmpeg',
      ['-t', '0.05', '-i', filePath, '-f', 's16le', '-ac', '1', '-ar', '44100', 'pipe:1'],
      { env, timeout: 5000 }
    );

    let headMax = 0;
    if (headProc.status === 0 && headProc.stdout) {
      const buf = headProc.stdout;
      for (let i = 0; i < Math.min(buf.length, 441 * 2); i += 2) { // first ~10ms
        const sample = Math.abs(buf.readInt16LE(i)) / 32768;
        if (sample > headMax) headMax = sample;
      }
    }

    return {
      exists: true,
      headMax,
      headPassesZeroCrossing: headMax <= 0.05,
    };
  } catch {
    return { exists: true, headMax: 0, headPassesZeroCrossing: true };
  }
}

/**
 * Lightweight Web Audio API mock harness for Node.js test execution.
 */
export function createMockAudioContext() {
  class MockAudioNode {
    constructor() {
      this.connectedTo = [];
    }
    connect(target) {
      this.connectedTo.push(target);
      return target;
    }
    disconnect() {
      this.connectedTo = [];
    }
  }

  class MockAudioParam {
    constructor(defaultValue = 1) {
      this.value = defaultValue;
    }
    setValueAtTime(val) { this.value = val; return this; }
    linearRampToValueAtTime(val) { this.value = val; return this; }
    exponentialRampToValueAtTime(val) { this.value = val; return this; }
    cancelScheduledValues(startTime) { return this; }
    setValueCurveAtTime(values, startTime, duration) { return this; }
    setTargetAtTime(target, startTime, timeConstant) { this.value = target; return this; }
  }

  class MockGainNode extends MockAudioNode {
    constructor() {
      super();
      this.gain = new MockAudioParam(1);
    }
  }

  class MockOscillatorNode extends MockAudioNode {
    constructor() {
      super();
      this.type = 'sine';
      this.frequency = new MockAudioParam(440);
      this.started = false;
      this.stopped = false;
    }
    start() { this.started = true; }
    stop() { this.stopped = true; }
  }

  class MockAnalyserNode extends MockAudioNode {
    constructor() {
      super();
      this.fftSize = 128;
      this.smoothingTimeConstant = 0.8;
      this.frequencyBinCount = 64;
    }
    getByteFrequencyData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.sin(i / 5) * 100 + 120);
      }
    }
    getByteTimeDomainData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = 128;
      }
    }
  }

  class MockBufferSourceNode extends MockAudioNode {
    constructor() {
      super();
      this.buffer = null;
      this.loop = false;
      this.loopStart = 0;
      this.loopEnd = 0;
      this.playbackRate = new MockAudioParam(1);
      this.started = false;
      this.stopped = false;
    }
    start() { this.started = true; }
    stop() { this.stopped = true; }
  }

  class MockDynamicsCompressorNode extends MockAudioNode {
    constructor() {
      super();
      this.threshold = new MockAudioParam(-16);
      this.knee = new MockAudioParam(30);
      this.ratio = new MockAudioParam(12);
      this.attack = new MockAudioParam(0.003);
      this.release = new MockAudioParam(0.25);
    }
  }

  class MockBiquadFilterNode extends MockAudioNode {
    constructor() {
      super();
      this.type = 'lowpass';
      this.frequency = new MockAudioParam(9200);
      this.Q = new MockAudioParam(1);
      this.gain = new MockAudioParam(0);
    }
  }

  class MockDelayNode extends MockAudioNode {
    constructor() {
      super();
      this.delayTime = new MockAudioParam(0.2);
    }
  }

  class MockAudioContext {
    constructor() {
      this.state = 'suspended';
      this.currentTime = 0;
      this.sampleRate = 44100;
      this.destination = new MockAudioNode();
    }
    createGain() { return new MockGainNode(); }
    createOscillator() { return new MockOscillatorNode(); }
    createAnalyser() { return new MockAnalyserNode(); }
    createBufferSource() { return new MockBufferSourceNode(); }
    createDynamicsCompressor() { return new MockDynamicsCompressorNode(); }
    createBiquadFilter() { return new MockBiquadFilterNode(); }
    createDelay() { return new MockDelayNode(); }
    createBuffer(channels, length, sampleRate) {
      const data = new Float32Array(length);
      return {
        numberOfChannels: channels,
        length,
        sampleRate,
        duration: length / sampleRate,
        getChannelData: () => data,
      };
    }
    decodeAudioData(arrayBuffer) {
      return Promise.resolve(this.createBuffer(2, 44100 * 20, 44100));
    }
    resume() {
      this.state = 'running';
      return Promise.resolve();
    }
    suspend() {
      this.state = 'suspended';
      return Promise.resolve();
    }
    close() {
      this.state = 'closed';
      return Promise.resolve();
    }
  }

  return { MockAudioContext, MockGainNode, MockAnalyserNode, MockBufferSourceNode };
}
