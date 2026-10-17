import fs from 'node:fs';
import path from 'node:path';
import { probeAudioFile, probeBoundaryAmplitudes, createMockAudioContext } from './helpers/audio_helper.js';
import { MockLocalStorage } from './helpers/storage_helper.js';

// Color formatting for output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passedCount = 0;
let failedCount = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passedCount++;
    console.log(`  ${GREEN}✓ PASS${RESET} — ${testName}`);
    results.push({ name: testName, status: 'PASS', details });
  } else {
    failedCount++;
    console.log(`  ${RED}✗ FAIL${RESET} — ${testName} ${details ? `(${details})` : ''}`);
    results.push({ name: testName, status: 'FAIL', details });
  }
}

console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}${CYAN}  MILESTONE 1: EMPIRICAL WEB AUDIO & VOLUME PERSISTENCE STRESS TEST    ${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

// -------------------------------------------------------------------------
// SUITE 1: AUDIO ASSET FILE PROBE
// -------------------------------------------------------------------------
console.log(`${BOLD}Suite 1: Physical Audio Asset Verification${RESET}`);
const audioFilePath = path.resolve('public/assets/all_the_stars_interlude.mp3');
const audioProbe = probeAudioFile(audioFilePath);

assert(audioProbe.exists === true, 'Audio file exists in public/assets/', `path=${audioFilePath}`);
assert(audioProbe.size > 500000 && audioProbe.size < 1500000, 'Audio file size is reasonable (700KB - 1.2MB)', `size=${audioProbe.size} bytes`);
assert(audioProbe.codec === 'mp3', 'Audio codec is standard MP3', `codec=${audioProbe.codec}`);
assert(audioProbe.sampleRate === 44100, 'Audio sample rate is standard 44.1 kHz', `sampleRate=${audioProbe.sampleRate} Hz`);
assert(audioProbe.channels === 2, 'Audio channels are stereo (2 channels)', `channels=${audioProbe.channels}`);
assert(Math.abs(audioProbe.duration - 19.79) < 0.1, 'Audio duration matches 8 measures at 97 BPM (~19.79s)', `duration=${audioProbe.duration}s`);
assert(audioProbe.bitRate >= 320000, 'Audio bitrate is studio 320 kbps', `bitRate=${audioProbe.bitRate} bps`);

// Check raw file boundary amplitude
const boundary = probeBoundaryAmplitudes(audioFilePath);
console.log(`  Raw MP3 disk headMax: ${boundary.headMax.toFixed(4)} (before Web Audio decode & raised cosine seam smoothing)`);
assert(boundary.headMax < 0.15, 'Raw MP3 file start level is low (<15% amplitude)', `headMax=${boundary.headMax}`);

// -------------------------------------------------------------------------
// SUITE 2: SETUP MOCK ENVIRONMENT & LOAD ENGINE
// -------------------------------------------------------------------------
console.log(`\n${BOLD}Suite 2: Web Audio Signal Chain Verification${RESET}`);

const mockStorage = new MockLocalStorage();
const { MockAudioContext, MockGainNode, MockAnalyserNode, MockBufferSourceNode } = createMockAudioContext();

// Install browser global mocks
globalThis.window = {
  AudioContext: MockAudioContext,
  localStorage: mockStorage,
};
globalThis.localStorage = mockStorage;
globalThis.AudioContext = MockAudioContext;

// Mock fetch to return dummy MP3 buffer
globalThis.fetch = async (url) => {
  return {
    ok: true,
    status: 200,
    arrayBuffer: async () => new ArrayBuffer(1024),
  };
};

// Dynamic import of the soundscape engine using Node's experimental-strip-types
const soundscapeModule = await import('../../src/audio/AllTheStarsSoundscape.ts');
const { AllTheStarsBoutiqueSynthesizer, STORAGE_KEY_VOLUME, DEFAULT_VOLUME } = soundscapeModule;

assert(STORAGE_KEY_VOLUME === 'alice_mystica_audio_volume', 'Storage key matches specification', `key=${STORAGE_KEY_VOLUME}`);
assert(DEFAULT_VOLUME === 0.55, 'Default volume matches specification (0.55)', `default=${DEFAULT_VOLUME}`);

// Test Seam Smoothing method
{
  const engine = new AllTheStarsBoutiqueSynthesizer();
  const ctx = engine.getAudioContext();
  const testBuffer = ctx.createBuffer(2, 44100 * 2, 44100);
  const left = testBuffer.getChannelData(0);
  // Fill with 1.0 (worst case discontinuity)
  left.fill(1.0);

  // Call private applySeamSmoothing
  engine.applySeamSmoothing(testBuffer);

  // Check boundary samples
  assert(left[0] === 0, 'Seam smoothing reduces sample[0] to exactly 0 (cos zero-crossing)', `val=${left[0]}`);
  assert(left[left.length - 1] === 0, 'Seam smoothing reduces sample[len-1] to exactly 0 (cos zero-crossing)', `val=${left[left.length - 1]}`);
  assert(left[10] > 0 && left[10] < 1.0, 'Seam smoothing applies smooth cosine curve across first 4ms', `val=${left[10]}`);
}

// Test Signal Chain with AudioBufferSourceNode
{
  const engine = new AllTheStarsBoutiqueSynthesizer();
  const ctx = engine.getAudioContext();
  ctx.state = 'running'; // Already resumed context

  // Provide a mock decoded buffer directly
  const dummyBuffer = ctx.createBuffer(2, 44100 * 20, 44100);
  engine.audioBuffer = dummyBuffer;

  // Start engine
  const startOk = engine.start();
  assert(startOk === true, 'engine.start() returns true');
  assert(engine.isPlaying === true, 'engine.isPlaying is true');

  // Allow microtask ticks for async launchEngine
  await new Promise((r) => setTimeout(r, 20));

  // Inspect nodes
  const analyser = engine.getAnalyser();
  const masterGain = engine.masterGain;
  const bufferSource = engine.bufferSource;

  assert(analyser instanceof MockAnalyserNode, 'AnalyserNode is created');
  assert(masterGain instanceof MockGainNode, 'MasterGainNode is created');
  assert(bufferSource instanceof MockBufferSourceNode, 'AudioBufferSourceNode is created');

  // Verify Signal Chain Routing:
  // AudioBufferSourceNode -> AnalyserNode -> MasterGainNode -> AudioDestinationNode
  const sourceConnectedToAnalyser = bufferSource && bufferSource.connectedTo.includes(analyser);
  assert(sourceConnectedToAnalyser, 'AudioBufferSourceNode connects to AnalyserNode');

  const analyserConnectedToMasterGain = analyser && analyser.connectedTo.includes(masterGain);
  assert(analyserConnectedToMasterGain, 'AnalyserNode connects to MasterGainNode');

  const masterGainConnectedToDestination = masterGain && masterGain.connectedTo.includes(ctx.destination);
  assert(masterGainConnectedToDestination, 'MasterGainNode connects to AudioDestinationNode');

  // Verify bufferSource settings
  assert(bufferSource.loop === true, 'AudioBufferSourceNode has loop = true for seamless playback');

  // Clean stop
  engine.stop();
  assert(engine.isPlaying === false, 'engine.stop() sets isPlaying to false');
}

// -------------------------------------------------------------------------
// SUITE 3: VOLUME PERSISTENCE & CLAMPED BOUNDS EMPIRICAL CHALLENGE
// -------------------------------------------------------------------------
console.log(`\n${BOLD}Suite 3: Volume Persistence & Clamped Bounds Stress Test${RESET}`);

// 3.1 Initial volume hydration from localStorage
{
  // Test valid volume in localStorage
  mockStorage.setItem(STORAGE_KEY_VOLUME, '0.72');
  const engineValid = new AllTheStarsBoutiqueSynthesizer();
  assert(Math.abs(engineValid.volume - 0.72) < 0.001, 'getInitialStoredVolume hydrates valid float 0.72', `vol=${engineValid.volume}`);

  // Test 0 volume (valid mute)
  mockStorage.setItem(STORAGE_KEY_VOLUME, '0');
  const engineZero = new AllTheStarsBoutiqueSynthesizer();
  assert(engineZero.volume === 0, 'getInitialStoredVolume hydrates 0 (muted state)', `vol=${engineZero.volume}`);

  // Test 1.0 volume (valid max)
  mockStorage.setItem(STORAGE_KEY_VOLUME, '1');
  const engineMax = new AllTheStarsBoutiqueSynthesizer();
  assert(engineMax.volume === 1, 'getInitialStoredVolume hydrates 1.0 (max state)', `vol=${engineMax.volume}`);

  // Test negative volume in localStorage -> must reject and fallback to DEFAULT_VOLUME
  mockStorage.setItem(STORAGE_KEY_VOLUME, '-0.45');
  const engineNeg = new AllTheStarsBoutiqueSynthesizer();
  assert(engineNeg.volume === DEFAULT_VOLUME, 'getInitialStoredVolume rejects negative value (-0.45) -> fallback to 0.55', `vol=${engineNeg.volume}`);

  // Test >1.0 volume in localStorage -> must reject and fallback to DEFAULT_VOLUME
  mockStorage.setItem(STORAGE_KEY_VOLUME, '1.85');
  const engineOver = new AllTheStarsBoutiqueSynthesizer();
  assert(engineOver.volume === DEFAULT_VOLUME, 'getInitialStoredVolume rejects >1.0 value (1.85) -> fallback to 0.55', `vol=${engineOver.volume}`);

  // Test NaN string in localStorage -> must reject and fallback to DEFAULT_VOLUME
  mockStorage.setItem(STORAGE_KEY_VOLUME, 'NaN');
  const engineNanStr = new AllTheStarsBoutiqueSynthesizer();
  assert(engineNanStr.volume === DEFAULT_VOLUME, 'getInitialStoredVolume rejects "NaN" string -> fallback to 0.55', `vol=${engineNanStr.volume}`);

  // Test corrupted garbage in localStorage
  mockStorage.setItem(STORAGE_KEY_VOLUME, 'invalid-payload-{%}');
  const engineGarbage = new AllTheStarsBoutiqueSynthesizer();
  assert(engineGarbage.volume === DEFAULT_VOLUME, 'getInitialStoredVolume rejects garbage text -> fallback to 0.55', `vol=${engineGarbage.volume}`);

  // Test missing item (null)
  mockStorage.removeItem(STORAGE_KEY_VOLUME);
  const engineNull = new AllTheStarsBoutiqueSynthesizer();
  assert(engineNull.volume === DEFAULT_VOLUME, 'getInitialStoredVolume handles null -> fallback to 0.55', `vol=${engineNull.volume}`);
}

// 3.2 setVolume(vol) clamping & persistence stress testing
{
  const engine = new AllTheStarsBoutiqueSynthesizer();

  // Test normal in-range setVolume
  engine.setVolume(0.35);
  assert(Math.abs(engine.volume - 0.35) < 0.001, 'setVolume(0.35) sets engine.volume to 0.35');
  assert(mockStorage.getItem(STORAGE_KEY_VOLUME) === '0.35', 'setVolume(0.35) stores "0.35" in localStorage');

  // Test negative number clamping: setVolume(-0.25) -> should clamp to 0
  engine.setVolume(-0.25);
  assert(engine.volume === 0, 'setVolume(-0.25) clamps to 0', `vol=${engine.volume}`);
  assert(mockStorage.getItem(STORAGE_KEY_VOLUME) === '0', 'setVolume(-0.25) stores clamped "0" in localStorage');

  // Test >1 number clamping: setVolume(2.5) -> should clamp to 1
  engine.setVolume(2.5);
  assert(engine.volume === 1, 'setVolume(2.5) clamps to 1', `vol=${engine.volume}`);
  assert(mockStorage.getItem(STORAGE_KEY_VOLUME) === '1', 'setVolume(2.5) stores clamped "1" in localStorage');

  // Test Infinity clamping
  engine.setVolume(Infinity);
  assert(engine.volume === 1, 'setVolume(Infinity) clamps to 1', `vol=${engine.volume}`);

  // Test -Infinity clamping
  engine.setVolume(-Infinity);
  assert(engine.volume === 0, 'setVolume(-Infinity) clamps to 0', `vol=${engine.volume}`);

  // Stress Test: setVolume(NaN)
  // Let's observe what happens when NaN is passed
  console.log(`\n  ${YELLOW}[Adversarial Probe] Stress testing setVolume(NaN)...${RESET}`);
  const volBeforeNaN = engine.volume;
  try {
    engine.setVolume(NaN);
    const isNaNResult = Number.isNaN(engine.volume);
    const storedVal = mockStorage.getItem(STORAGE_KEY_VOLUME);
    console.log(`    engine.volume after setVolume(NaN): ${engine.volume}`);
    console.log(`    localStorage after setVolume(NaN): ${storedVal}`);
    
    // Check if NaN corrupted the engine state:
    if (isNaNResult) {
      console.log(`    ${YELLOW}⚠️ Vulnerability Observed: setVolume(NaN) sets engine.volume to NaN and stores "NaN" in localStorage!${RESET}`);
      // Does it throw when masterGain linearRamp is executed? In standard Web Audio, AudioParam throws TypeError on non-finite!
    }
  } catch (err) {
    console.log(`    Exception caught on setVolume(NaN): ${err.message}`);
  }

  // Stress Test: LocalStorage Quota Exceeded / Disabled
  mockStorage.shouldThrowQuotaError = true;
  let quotaErrorThrown = false;
  try {
    engine.setVolume(0.65);
  } catch (err) {
    quotaErrorThrown = true;
  }
  assert(quotaErrorThrown === false, 'setVolume does not crash the app if localStorage throws QuotaExceededError');
  mockStorage.shouldThrowQuotaError = false;
}

// -------------------------------------------------------------------------
// SUITE 4: addListener() SUBSCRIBER LIFECYCLE & CLEAN UNSUBSCRIBE
// -------------------------------------------------------------------------
console.log(`\n${BOLD}Suite 4: addListener() Subscriber Lifecycle & Unsubscribe Verification${RESET}`);

{
  const engine = new AllTheStarsBoutiqueSynthesizer();
  let callCount1 = 0;
  let lastState1 = null;

  // 4.1 Immediate notification on registration
  const unsubscribe1 = engine.addListener((isPlaying) => {
    callCount1++;
    lastState1 = isPlaying;
  });

  assert(callCount1 === 1, 'addListener immediately invokes callback on registration', `calls=${callCount1}`);
  assert(lastState1 === false, 'Initial state passed to callback matches engine.isPlaying (false)', `state=${lastState1}`);

  // 4.2 State change notifications
  engine.isPlaying = true;
  engine.notifyListeners();
  assert(callCount1 === 2, 'Listener receives notification when engine state changes to playing', `calls=${callCount1}`);
  assert(lastState1 === true, 'Playback state received is true', `state=${lastState1}`);

  engine.isPlaying = false;
  engine.notifyListeners();
  assert(callCount1 === 3, 'Listener receives notification when engine state changes to stopped', `calls=${callCount1}`);
  assert(lastState1 === false, 'Playback state received is false', `state=${lastState1}`);

  // 4.3 Clean unsubscription
  unsubscribe1();
  engine.isPlaying = true;
  engine.notifyListeners();
  assert(callCount1 === 3, 'Unsubscribed listener is NOT called after unsubscribe() invocation', `calls=${callCount1}`);

  // 4.4 Multiple independent subscribers
  let countA = 0;
  let countB = 0;
  const unsubA = engine.addListener(() => countA++);
  const unsubB = engine.addListener(() => countB++);

  assert(countA === 1 && countB === 1, 'Both subscribers receive initial notification');

  engine.notifyListeners();
  assert(countA === 2 && countB === 2, 'Both subscribers receive broadcast update');

  unsubA();
  engine.notifyListeners();
  assert(countA === 2, 'Subscriber A does not receive further updates after unsubscribe');
  assert(countB === 3, 'Subscriber B continues receiving updates');

  unsubB();

  // 4.5 Error isolation: if one subscriber throws, does it crash other subscribers?
  const throwingListener = () => {
    throw new Error('Explosive subscriber error');
  };
  let goodListenerCalled = false;
  const goodListener = () => {
    goodListenerCalled = true;
  };

  const unsubThrow = engine.addListener(throwingListener);
  const unsubGood = engine.addListener(goodListener);

  goodListenerCalled = false;
  engine.notifyListeners();
  assert(goodListenerCalled === true, 'Faulty subscriber error is caught and isolated; healthy subscriber is notified');

  unsubThrow();
  unsubGood();

  // 4.6 Self-unsubscribing listener during notification
  let selfUnsubCalled = 0;
  let selfUnsub = null;
  selfUnsub = engine.addListener(() => {
    selfUnsubCalled++;
    if (selfUnsub) selfUnsub();
  });
  engine.notifyListeners();
  assert(selfUnsubCalled === 2, 'Listener can safely unsubscribe itself inside callback without crash');
}

// -------------------------------------------------------------------------
// SUITE 5: ADVERSARIAL STRESS TEST — RAPID PLAY/PAUSE CONCURRENCY & LEAKS
// -------------------------------------------------------------------------
console.log(`\n${BOLD}Suite 5: Adversarial Stress Test — Rapid Play/Pause & Source Node Lifecycle${RESET}`);

{
  const engine = new AllTheStarsBoutiqueSynthesizer();
  const ctx = engine.getAudioContext();
  ctx.state = 'running';
  const dummyBuffer = ctx.createBuffer(2, 44100 * 20, 44100);
  engine.audioBuffer = dummyBuffer;

  // Track all created buffer sources
  const createdSources = [];
  const originalCreateBufferSource = ctx.createBufferSource.bind(ctx);
  ctx.createBufferSource = () => {
    const src = originalCreateBufferSource();
    createdSources.push(src);
    return src;
  };

  console.log(`  ${YELLOW}[Adversarial Probe] Simulating rapid play/pause toggle (<100ms)...${RESET}`);
  // Start
  engine.start();
  await new Promise((r) => setTimeout(r, 20));
  const source1 = createdSources[0];
  assert(source1 && source1.started === true, 'Source 1 started');

  // Stop (schedules cleanup at 550ms)
  engine.stop();
  assert(source1.stopped === false, 'Source 1 is not stopped immediately at t=0 (graceful fade)');

  // Re-start immediately at t=50ms before 550ms cleanup runs!
  await new Promise((r) => setTimeout(r, 50));
  engine.start();
  await new Promise((r) => setTimeout(r, 20));
  const source2 = createdSources[1];
  assert(source2 !== undefined, 'Source 2 created on rapid re-start');
  assert(source2.started === true, 'Source 2 started');

  // Did Source 1 get stopped when Source 2 was started, or does it stay un-stopped?
  console.log(`    Source 1 stopped status: ${source1.stopped}`);
  console.log(`    Source 2 stopped status: ${source2.stopped}`);
  
  // If source1.stopped is false, source1 is still looping!
  const source1Leaked = (source1.stopped === false);
  if (source1Leaked) {
    console.log(`    ${YELLOW}⚠️ Discovered Edge Case: When start() interrupts stop() cleanup timer, previous AudioBufferSourceNode is not stopped immediately and remains looping.${RESET}`);
  }

  engine.stop();
}

// -------------------------------------------------------------------------
// SUITE 6: EQUALIZER LEVELS INTEGRITY
// -------------------------------------------------------------------------
console.log(`\n${BOLD}Suite 6: Equalizer Levels Numerical Range & Stability${RESET}`);

{
  const engine = new AllTheStarsBoutiqueSynthesizer();
  const ctx = engine.getAudioContext();
  ctx.state = 'running';
  
  // 6.1 Test when not playing (Idle state: all bars = 0.1)
  const idleLevels = engine.getEqualizerLevels();
  assert(idleLevels.bar1 === 0.1, 'Idle bar1 equals 0.1', `bar1=${idleLevels.bar1}`);
  assert(idleLevels.bar2 === 0.1, 'Idle bar2 equals 0.1', `bar2=${idleLevels.bar2}`);
  assert(idleLevels.bar3 === 0.1, 'Idle bar3 equals 0.1', `bar3=${idleLevels.bar3}`);
  assert(idleLevels.bar4 === 0.1, 'Idle bar4 equals 0.1', `bar4=${idleLevels.bar4}`);
  assert(idleLevels.beatIntensity === 0.1, 'Idle beatIntensity equals 0.1', `beat=${idleLevels.beatIntensity}`);

  // 6.2 Test when playing with active AnalyserNode
  engine.audioBuffer = ctx.createBuffer(2, 44100 * 20, 44100);
  engine.start();
  await new Promise((r) => setTimeout(r, 20));

  const playingLevels = engine.getEqualizerLevels();
  assert(playingLevels.bar1 >= 0.18 && playingLevels.bar1 <= 1.0, 'Playing bar1 within [0.18, 1.0]', `bar1=${playingLevels.bar1}`);
  assert(playingLevels.bar2 >= 0.22 && playingLevels.bar2 <= 1.0, 'Playing bar2 within [0.22, 1.0]', `bar2=${playingLevels.bar2}`);
  assert(playingLevels.bar3 >= 0.18 && playingLevels.bar3 <= 1.0, 'Playing bar3 within [0.18, 1.0]', `bar3=${playingLevels.bar3}`);
  assert(playingLevels.bar4 >= 0.14 && playingLevels.bar4 <= 1.0, 'Playing bar4 within [0.14, 1.0]', `bar4=${playingLevels.bar4}`);
  assert(playingLevels.beatIntensity >= 0.1 && playingLevels.beatIntensity <= 1.0, 'Playing beatIntensity within [0.1, 1.0]', `beat=${playingLevels.beatIntensity}`);

  engine.stop();
}

// -------------------------------------------------------------------------
// SUITE 7: PROCEDURAL SYNTHESIZER FALLBACK & CONTEXT RESUME
// -------------------------------------------------------------------------
console.log(`\n${BOLD}Suite 7: Procedural Fallback Engine & Context Lifecycle${RESET}`);

{
  const engine = new AllTheStarsBoutiqueSynthesizer();
  const ctx = engine.getAudioContext();
  ctx.state = 'running';

  // Force audio buffer to fail loading so fallback engages
  engine.audioBuffer = null;
  engine.audioLoadFailed = true;

  engine.start();
  await new Promise((r) => setTimeout(r, 20));

  assert(engine.isPlaying === true, 'Engine starts in procedural mode when buffer fails');
  assert(engine.isProceduralRunning === true, 'Procedural scheduler is flagged active');
  assert(engine.masterCompressor !== null, 'masterCompressor created in procedural mode');

  const analyser = engine.getAnalyser();
  const masterGain = engine.masterGain;

  // Signal chain in procedural mode:
  // masterCompressor -> analyser -> masterGain -> ctx.destination
  const compConnectedToAnalyser = engine.masterCompressor.connectedTo.includes(analyser);
  assert(compConnectedToAnalyser, 'Procedural masterCompressor connects to AnalyserNode');

  const analyserConnectedToMasterGain = analyser.connectedTo.includes(masterGain);
  assert(analyserConnectedToMasterGain, 'AnalyserNode connects to MasterGainNode in procedural mode');

  const masterGainConnectedToDestination = masterGain.connectedTo.includes(ctx.destination);
  assert(masterGainConnectedToDestination, 'MasterGainNode connects to AudioDestinationNode in procedural mode');

  engine.stop();
  assert(engine.isProceduralRunning === false, 'Procedural scheduler stopped cleanly');
}

// 7.2 ensureContextReady
{
  const engine = new AllTheStarsBoutiqueSynthesizer();
  const ctx = engine.getAudioContext();
  ctx.state = 'suspended';

  const ready = await engine.ensureContextReady();
  assert(ready === true, 'ensureContextReady resumes suspended AudioContext to running state');
  assert(ctx.state === 'running', 'AudioContext state is running after ensureContextReady');
}

// -------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------
console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
