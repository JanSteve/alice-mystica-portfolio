// =========================================================================
// ALL THE STARS — KENDRICK LAMAR & SZA (BLACK PANTHER SOUNDTRACK)
// Curated Luxury Boutique Acoustic Mix — Web Audio API Synthesizer
//
// Key: Bb Major | Tempo: 97 BPM
// Signature Progression: Bb - F/A - Gm - Eb
// Iconic SZA Chorus Hook & Pre-Chorus Climax:
//   "This may be the night that my dreams might let me know...
//    All the stars are closer, all the stars are closer, all the stars are closer..."
// Production: Dual-harmonic bass, Kendrick syncopated beat, SZA vocal lead,
// crystalline staccato plucks, and warm boutique acoustics.
// =========================================================================

export interface EqualizerLevels {
  bar1: number
  bar2: number
  bar3: number
  bar4: number
  beatIntensity?: number
}

// Note frequencies in Hz (Bb Major tuning)
const NOTE = {
  Eb1: 38.89,
  F1: 43.65,
  G1: 49.00,
  A1: 55.00,
  Bb1: 58.27,
  C2: 65.41,
  D2: 73.42,
  Eb2: 77.78,
  F2: 87.31,
  G2: 98.00,
  A2: 110.00,
  Bb2: 116.54,
  C3: 130.81,
  D3: 146.83,
  Eb3: 155.56,
  F3: 174.61,
  G3: 196.00,
  A3: 220.00,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  Eb4: 311.13,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  Bb4: 466.16,
  C5: 523.25,
  D5: 587.33,
  Eb5: 622.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.00,
  Bb5: 932.33,
}

interface MelodyEvent {
  step: number // 0 to 127 (sixteenth notes in 8-measure cycle)
  freq: number
  duration: number // in seconds
  velocity?: number
}

// 8-measure iconic SZA Chorus melody sequence ("All The Stars")
const ALL_THE_STARS_MELODY: MelodyEvent[] = [
  // Measure 0 (Bb Major) - "All the stars are closer"
  { step: 2, freq: NOTE.F4, duration: 0.28, velocity: 0.95 },
  { step: 4, freq: NOTE.G4, duration: 0.28, velocity: 0.95 },
  { step: 6, freq: NOTE.Bb4, duration: 0.55, velocity: 1.05 },
  { step: 10, freq: NOTE.C5, duration: 0.28, velocity: 1.0 },
  { step: 12, freq: NOTE.D5, duration: 0.32, velocity: 1.05 },
  { step: 14, freq: NOTE.Bb4, duration: 0.42, velocity: 0.95 },

  // Measure 1 (F/A) - "All the stars are closer" (lift to high note)
  { step: 16 + 2, freq: NOTE.F4, duration: 0.28, velocity: 0.95 },
  { step: 16 + 4, freq: NOTE.G4, duration: 0.28, velocity: 0.95 },
  { step: 16 + 6, freq: NOTE.Bb4, duration: 0.55, velocity: 1.05 },
  { step: 16 + 10, freq: NOTE.C5, duration: 0.28, velocity: 1.0 },
  { step: 16 + 12, freq: NOTE.D5, duration: 0.32, velocity: 1.05 },
  { step: 16 + 14, freq: NOTE.C5, duration: 0.5, velocity: 0.95 },

  // Measure 2 (Gm) - "All the stars are closer" (minor cadence)
  { step: 32 + 2, freq: NOTE.F4, duration: 0.28, velocity: 0.95 },
  { step: 32 + 4, freq: NOTE.G4, duration: 0.28, velocity: 0.95 },
  { step: 32 + 6, freq: NOTE.Bb4, duration: 0.55, velocity: 1.05 },
  { step: 32 + 10, freq: NOTE.C5, duration: 0.28, velocity: 1.0 },
  { step: 32 + 12, freq: NOTE.Bb4, duration: 0.3, velocity: 0.95 },
  { step: 32 + 14, freq: NOTE.G4, duration: 0.45, velocity: 0.9 },

  // Measure 3 (Eb) - "Tell me what you gon' do to me"
  { step: 48 + 0, freq: NOTE.F4, duration: 0.22, velocity: 0.9 },
  { step: 48 + 2, freq: NOTE.D4, duration: 0.22, velocity: 0.9 },
  { step: 48 + 4, freq: NOTE.F4, duration: 0.26, velocity: 0.95 },
  { step: 48 + 6, freq: NOTE.G4, duration: 0.28, velocity: 1.0 },
  { step: 48 + 8, freq: NOTE.F4, duration: 0.4, velocity: 0.95 },
  { step: 48 + 11, freq: NOTE.D4, duration: 0.22, velocity: 0.9 },
  { step: 48 + 13, freq: NOTE.C4, duration: 0.22, velocity: 0.88 },
  { step: 48 + 15, freq: NOTE.Bb3, duration: 0.42, velocity: 0.92 },

  // Measure 4 (Bb Major) - "This may be the night that my dreams might let me know"
  { step: 64 + 0, freq: NOTE.D4, duration: 0.22, velocity: 0.9 },
  { step: 64 + 2, freq: NOTE.F4, duration: 0.22, velocity: 0.92 },
  { step: 64 + 4, freq: NOTE.G4, duration: 0.24, velocity: 0.95 },
  { step: 64 + 6, freq: NOTE.F4, duration: 0.22, velocity: 0.92 },
  { step: 64 + 8, freq: NOTE.D4, duration: 0.22, velocity: 0.9 },
  { step: 64 + 10, freq: NOTE.F4, duration: 0.24, velocity: 0.95 },
  { step: 64 + 12, freq: NOTE.Bb4, duration: 0.48, velocity: 1.05 },
  { step: 64 + 15, freq: NOTE.C5, duration: 0.25, velocity: 0.95 },

  // Measure 5 (F/A) - "...let me know, all the stars are closer"
  { step: 80 + 0, freq: NOTE.D5, duration: 0.35, velocity: 1.05 },
  { step: 80 + 2, freq: NOTE.F4, duration: 0.24, velocity: 0.92 },
  { step: 80 + 4, freq: NOTE.G4, duration: 0.24, velocity: 0.92 },
  { step: 80 + 6, freq: NOTE.Bb4, duration: 0.52, velocity: 1.05 },
  { step: 80 + 10, freq: NOTE.C5, duration: 0.26, velocity: 1.0 },
  { step: 80 + 12, freq: NOTE.D5, duration: 0.3, velocity: 1.05 },
  { step: 80 + 14, freq: NOTE.C5, duration: 0.45, velocity: 0.95 },

  // Measure 6 (Gm) - "All the stars are closer"
  { step: 96 + 2, freq: NOTE.F4, duration: 0.28, velocity: 0.95 },
  { step: 96 + 4, freq: NOTE.G4, duration: 0.28, velocity: 0.95 },
  { step: 96 + 6, freq: NOTE.Bb4, duration: 0.55, velocity: 1.05 },
  { step: 96 + 10, freq: NOTE.C5, duration: 0.28, velocity: 1.0 },
  { step: 96 + 12, freq: NOTE.Bb4, duration: 0.3, velocity: 0.95 },
  { step: 96 + 14, freq: NOTE.G4, duration: 0.45, velocity: 0.9 },

  // Measure 7 (Eb Major) - "All the stars are closer..." (grand soaring resolution)
  { step: 112 + 2, freq: NOTE.F4, duration: 0.24, velocity: 0.95 },
  { step: 112 + 4, freq: NOTE.G4, duration: 0.24, velocity: 0.95 },
  { step: 112 + 6, freq: NOTE.Bb4, duration: 0.4, velocity: 1.0 },
  { step: 112 + 8, freq: NOTE.C5, duration: 0.24, velocity: 1.0 },
  { step: 112 + 10, freq: NOTE.D5, duration: 0.28, velocity: 1.05 },
  { step: 112 + 12, freq: NOTE.Eb5, duration: 0.32, velocity: 1.1 },
  { step: 112 + 14, freq: NOTE.D5, duration: 0.48, velocity: 1.0 },
]

// 8-measure signature Black Panther crystalline synth bell arpeggiator
const ARP_PATTERNS: number[][] = [
  // Measure 0 (Bb): F4, Bb4, D5, F5, D5, Bb4, F4, Bb4
  [NOTE.F4, NOTE.Bb4, NOTE.D5, NOTE.F5, NOTE.D5, NOTE.Bb4, NOTE.F4, NOTE.Bb4],
  // Measure 1 (F/A): F4, A4, C5, F5, C5, A4, F4, C5
  [NOTE.F4, NOTE.A4, NOTE.C5, NOTE.F5, NOTE.C5, NOTE.A4, NOTE.F4, NOTE.C5],
  // Measure 2 (Gm): D4, G4, Bb4, D5, Bb4, G4, D4, G4
  [NOTE.D4, NOTE.G4, NOTE.Bb4, NOTE.D5, NOTE.Bb4, NOTE.G4, NOTE.D4, NOTE.G4],
  // Measure 3 (Eb): Eb4, G4, Bb4, Eb5, Bb4, G4, Eb4, Bb4
  [NOTE.Eb4, NOTE.G4, NOTE.Bb4, NOTE.Eb5, NOTE.Bb4, NOTE.G4, NOTE.Eb4, NOTE.Bb4],
  // Measure 4 (Bb)
  [NOTE.F4, NOTE.Bb4, NOTE.D5, NOTE.F5, NOTE.D5, NOTE.Bb4, NOTE.F4, NOTE.Bb4],
  // Measure 5 (F/A)
  [NOTE.F4, NOTE.A4, NOTE.C5, NOTE.F5, NOTE.C5, NOTE.A4, NOTE.F4, NOTE.C5],
  // Measure 6 (Gm)
  [NOTE.D4, NOTE.G4, NOTE.Bb4, NOTE.D5, NOTE.Bb4, NOTE.G4, NOTE.D4, NOTE.G4],
  // Measure 7 (Eb)
  [NOTE.Eb4, NOTE.G4, NOTE.Bb4, NOTE.Eb5, NOTE.Bb4, NOTE.G4, NOTE.D5, NOTE.Bb4],
]

export class AllTheStarsBoutiqueSynthesizer {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private masterCompressor: DynamicsCompressorNode | null = null
  private boutiqueFilter: BiquadFilterNode | null = null
  private analyser: AnalyserNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private spatialDelayNodes: AudioNode[] = []

  // State
  public isPlaying = false
  public volume = 0.55 // High-polish, rich default volume (55%)
  private tempo = 97
  private stepDuration = 60 / 97 / 4 // Sixteenth note duration in seconds (~0.1546s)

  // Scheduler
  private schedulerTimer: ReturnType<typeof setInterval> | null = null
  private stopCleanupTimer: ReturnType<typeof setTimeout> | null = null
  private currentStep = 0
  private nextStepTime = 0
  private lookaheadMs = 40
  private scheduleAheadSec = 0.18

  public getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!AudioCtx) return null
        this.ctx = new AudioCtx()
      }
      return this.ctx
    } catch {
      return null
    }
  }

  // Ensure AudioContext is resumed inside user gestures
  public async ensureContextReady(): Promise<boolean> {
    const ctx = this.getAudioContext()
    if (!ctx) return false
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }
      return ctx.state === 'running'
    } catch {
      return false
    }
  }

  // Generate white noise buffer for crisp boutique hi-hats & snare claps
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer
    }
    const bufferSize = ctx.sampleRate * 1.0
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }
    this.noiseBuffer = buffer
    return buffer
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol))
    this.volume = clamped
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
      this.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.04)
    }
  }

  public start(): boolean {
    if (this.isPlaying) return true

    if (this.stopCleanupTimer) {
      clearTimeout(this.stopCleanupTimer)
      this.stopCleanupTimer = null
    }

    const ctx = this.getAudioContext()
    if (!ctx) return false

    this.isPlaying = true

    const launchEngine = () => {
      if (!this.isPlaying || !this.ctx) return
      const now = this.ctx.currentTime

      // 1. Analyser Node for real-time live equalizer visualization
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 128
      this.analyser.smoothingTimeConstant = 0.8

      // 2. Studio Master Dynamics Compressor (glues kick, 808 bass, SZA vocal, and pluck arps)
      this.masterCompressor = this.ctx.createDynamicsCompressor()
      this.masterCompressor.threshold.setValueAtTime(-16, now)
      this.masterCompressor.knee.setValueAtTime(18, now)
      this.masterCompressor.ratio.setValueAtTime(3.5, now)
      this.masterCompressor.attack.setValueAtTime(0.008, now)
      this.masterCompressor.release.setValueAtTime(0.22, now)

      // 3. Master Gain Node with smooth fade-in
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0, now)
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.35)

      // 4. Boutique Acoustic Tone Filter (Warm analog roll-off at 9200Hz)
      this.boutiqueFilter = this.ctx.createBiquadFilter()
      this.boutiqueFilter.type = 'lowpass'
      this.boutiqueFilter.frequency.setValueAtTime(9200, now)
      this.boutiqueFilter.Q.setValueAtTime(0.707, now)

      // 5. Luxury Boutique Room Reflections (Stereo Space Delay)
      const delayL = this.ctx.createDelay()
      delayL.delayTime.setValueAtTime(0.065, now)
      const delayR = this.ctx.createDelay()
      delayR.delayTime.setValueAtTime(0.095, now)

      const feedbackL = this.ctx.createGain()
      feedbackL.gain.setValueAtTime(0.18, now)
      const feedbackR = this.ctx.createGain()
      feedbackR.gain.setValueAtTime(0.16, now)

      const delayFilter = this.ctx.createBiquadFilter()
      delayFilter.type = 'lowpass'
      delayFilter.frequency.setValueAtTime(2800, now)

      // Delay Routing
      this.boutiqueFilter.connect(delayL)
      this.boutiqueFilter.connect(delayR)
      delayL.connect(delayFilter)
      delayR.connect(delayFilter)
      delayFilter.connect(feedbackL)
      delayFilter.connect(feedbackR)
      feedbackL.connect(delayL)
      feedbackR.connect(delayR)

      this.spatialDelayNodes = [delayL, delayR, feedbackL, feedbackR, delayFilter]

      // Mix Direct + Space Reflections into Master Compressor
      this.boutiqueFilter.connect(this.masterCompressor)
      delayFilter.connect(this.masterCompressor)

      // Compressor -> Master Gain -> Analyser -> Speakers
      this.masterCompressor.connect(this.masterGain)
      this.masterGain.connect(this.analyser)
      this.analyser.connect(this.ctx.destination)

      this.currentStep = 0
      this.nextStepTime = now + 0.05

      if (this.schedulerTimer) {
        clearInterval(this.schedulerTimer)
      }
      this.schedulerTimer = setInterval(() => {
        this.runScheduler()
      }, this.lookaheadMs)
    }

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        launchEngine()
      }).catch(() => {
        this.isPlaying = false
      })
    } else {
      launchEngine()
    }

    return true
  }

  public stop(): boolean {
    if (!this.isPlaying) return false

    this.isPlaying = false

    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer)
      this.schedulerTimer = null
    }

    if (!this.masterGain || !this.ctx) return true

    try {
      const now = this.ctx.currentTime
      const currentGain = Math.max(0, this.masterGain.gain.value)
      this.masterGain.gain.setValueAtTime(currentGain, now)
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.45)

      this.stopCleanupTimer = setTimeout(() => {
        this.spatialDelayNodes.forEach((node) => {
          try {
            node.disconnect()
          } catch {}
        })
        this.spatialDelayNodes = []

        if (this.boutiqueFilter) {
          try {
            this.boutiqueFilter.disconnect()
          } catch {}
          this.boutiqueFilter = null
        }
        if (this.masterCompressor) {
          try {
            this.masterCompressor.disconnect()
          } catch {}
          this.masterCompressor = null
        }
        if (this.masterGain) {
          try {
            this.masterGain.disconnect()
          } catch {}
          this.masterGain = null
        }
        this.stopCleanupTimer = null
      }, 550)

      return true
    } catch {
      return false
    }
  }

  // Lookahead Scheduling Engine
  private runScheduler() {
    if (!this.ctx || !this.isPlaying) return

    // If context resumed from suspension, avoid catch-up burst
    if (this.nextStepTime < this.ctx.currentTime) {
      this.nextStepTime = this.ctx.currentTime + 0.02
    }

    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadSec) {
      this.scheduleStep(this.currentStep, this.nextStepTime)
      this.nextStepTime += this.stepDuration
      this.currentStep = (this.currentStep + 1) % 128 // 8 measures (16 sixteenths each)
    }
  }

  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.boutiqueFilter) return

    const stepInMeasure = step % 16
    const measureIndex = Math.floor(step / 16)

    // 1. Chords & Dual-Harmonic Bass Trigger on Measure Boundaries
    if (stepInMeasure === 0) {
      this.scheduleChordAndBass(measureIndex, time)
    }

    // Additional syncopated bass bounce on steps 6 & 10
    if (stepInMeasure === 6 || stepInMeasure === 10) {
      this.scheduleBassSyncopation(measureIndex, time, stepInMeasure === 6 ? 4 : 6)
    }

    // 2. Signature Black Panther Staccato Synth Bell Arpeggio (8th-notes: steps 0, 2, 4, 6, 8, 10, 12, 14)
    if (step % 2 === 0) {
      const arpIdx = Math.floor(stepInMeasure / 2)
      const chordArp = ARP_PATTERNS[measureIndex % 8]
      const noteFreq = chordArp[arpIdx % chordArp.length]
      if (noteFreq) {
        this.scheduleArpPluck(noteFreq, time, arpIdx === 0 || arpIdx === 3 ? 1.05 : 0.85)
      }
    }

    // 3. SZA Iconic Chorus Vocal Melody ("All The Stars")
    const melodyEvents = ALL_THE_STARS_MELODY.filter((evt) => evt.step === step)
    melodyEvents.forEach((evt) => {
      this.scheduleSzaVocalLead(evt.freq, time, evt.duration, evt.velocity || 1)
    })

    // 4. Modern Syncopated Boutique Kick (Kendrick Lamar & Sounwave bounce)
    // Primary Beat 1 (step 0), Syncopated Beat 2-and (step 6), Driving Beat 3-and (step 10)
    if (stepInMeasure === 0) {
      this.scheduleBoutiqueKick(time, true)
    } else if (stepInMeasure === 6) {
      this.scheduleBoutiqueKick(time, false)
    } else if (stepInMeasure === 10) {
      this.scheduleBoutiqueKick(time, false)
    } else if (stepInMeasure === 14 && measureIndex % 2 === 1) {
      // Alternate measure pickup bounce
      this.scheduleBoutiqueKick(time, false)
    }

    // 5. Crisp Boutique Hi-Hat Patterns
    if (step % 2 === 0) {
      const isDownbeat = step % 4 === 0
      const isAltPickup = stepInMeasure === 14 && measureIndex % 2 === 1
      this.scheduleBoutiqueHiHat(time, isAltPickup ? 0.045 : isDownbeat ? 0.038 : 0.024, isAltPickup)
    }

    // 6. Snappy Boutique Snare & Clap on Beats 2 & 4 (Steps 4 & 12 of each measure)
    if (stepInMeasure === 4 || stepInMeasure === 12) {
      this.scheduleBoutiqueSnareClap(time)
    }
  }

  // Synthesizes the lush analog synth pad chords & primary dual-harmonic bass
  private scheduleChordAndBass(measureIndex: number, time: number) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx
    const chordDuration = this.stepDuration * 16

    // Iconic Progression:
    // Measures 0 & 4: Bb Major
    // Measures 1 & 5: F/A
    // Measures 2 & 6: Gm
    // Measures 3 & 7: Eb Major
    const chordTypes = [
      { bass: NOTE.Bb1, midBass: NOTE.Bb2, pad: [NOTE.Bb3, NOTE.D4, NOTE.F4, NOTE.Bb4] }, // Bb
      { bass: NOTE.A1, midBass: NOTE.A2, pad: [NOTE.A3, NOTE.C4, NOTE.F4, NOTE.C5] }, // F/A
      { bass: NOTE.G1, midBass: NOTE.G2, pad: [NOTE.G3, NOTE.Bb3, NOTE.D4, NOTE.G4] }, // Gm
      { bass: NOTE.Eb1, midBass: NOTE.Eb2, pad: [NOTE.Eb3, NOTE.G3, NOTE.Bb3, NOTE.Eb4] }, // Eb
    ]

    const chord = chordTypes[measureIndex % 4]

    // A. Dual-Harmonic Bass (Sub Sine + Warm Saturated Mid Triangle/Saw)
    // Audible on both high-end headphones AND mobile/laptop speakers!
    try {
      const subOsc = ctx.createOscillator()
      const midOsc = ctx.createOscillator()
      const bassFilter = ctx.createBiquadFilter()
      const bassGain = ctx.createGain()

      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(chord.bass, time)

      midOsc.type = 'triangle'
      midOsc.frequency.setValueAtTime(chord.midBass, time)

      bassFilter.type = 'lowpass'
      bassFilter.frequency.setValueAtTime(320, time)

      const subGain = ctx.createGain()
      const midGain = ctx.createGain()
      subGain.gain.setValueAtTime(0.75, time)
      midGain.gain.setValueAtTime(0.45, time)

      // Bass Envelope: punchy front attack with sustained warmth
      const noteLen = this.stepDuration * 5.8
      bassGain.gain.setValueAtTime(0, time)
      bassGain.gain.linearRampToValueAtTime(0.24, time + 0.02)
      bassGain.gain.linearRampToValueAtTime(0.18, time + 0.15)
      bassGain.gain.setValueAtTime(0.18, time + noteLen - 0.04)
      bassGain.gain.linearRampToValueAtTime(0, time + noteLen)

      subOsc.connect(subGain)
      midOsc.connect(midGain)
      subGain.connect(bassFilter)
      midGain.connect(bassFilter)
      bassFilter.connect(bassGain)
      bassGain.connect(this.boutiqueFilter)

      subOsc.start(time)
      midOsc.start(time)
      subOsc.stop(time + noteLen + 0.02)
      midOsc.stop(time + noteLen + 0.02)

      setTimeout(() => {
        try {
          subOsc.disconnect()
          midOsc.disconnect()
          subGain.disconnect()
          midGain.disconnect()
          bassFilter.disconnect()
          bassGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + noteLen + 0.1) * 1000)
    } catch {}

    // B. Lush Polyphonic Pad Chords (4-voice analog warmth)
    try {
      const padFilter = ctx.createBiquadFilter()
      padFilter.type = 'lowpass'
      padFilter.frequency.setValueAtTime(800, time)
      padFilter.frequency.linearRampToValueAtTime(1100, time + chordDuration * 0.5)
      padFilter.frequency.linearRampToValueAtTime(800, time + chordDuration)

      const masterPadGain = ctx.createGain()
      masterPadGain.gain.setValueAtTime(0, time)
      masterPadGain.gain.linearRampToValueAtTime(0.12, time + 0.3)
      masterPadGain.gain.setValueAtTime(0.12, time + chordDuration - 0.35)
      masterPadGain.gain.linearRampToValueAtTime(0, time + chordDuration)

      masterPadGain.connect(padFilter)
      padFilter.connect(this.boutiqueFilter)

      const padOscs: OscillatorNode[] = []
      const padGains: GainNode[] = []

      chord.pad.forEach((freq, idx) => {
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const voiceGain = ctx.createGain()

        osc1.type = 'sawtooth'
        osc2.type = 'triangle'
        osc1.frequency.setValueAtTime(freq, time)
        osc2.frequency.setValueAtTime(freq, time)

        osc1.detune.setValueAtTime(-6 + idx * 2, time)
        osc2.detune.setValueAtTime(6 - idx * 2, time)

        voiceGain.gain.setValueAtTime(0.24, time)

        osc1.connect(voiceGain)
        osc2.connect(voiceGain)
        voiceGain.connect(masterPadGain)

        osc1.start(time)
        osc2.start(time)
        osc1.stop(time + chordDuration)
        osc2.stop(time + chordDuration)

        padOscs.push(osc1, osc2)
        padGains.push(voiceGain)
      })

      setTimeout(() => {
        try {
          padOscs.forEach((o) => {
            o.stop()
            o.disconnect()
          })
          padGains.forEach((g) => g.disconnect())
          masterPadGain.disconnect()
          padFilter.disconnect()
        } catch {}
      }, (time - ctx.currentTime + chordDuration + 0.1) * 1000)
    } catch {}
  }

  // Secondary syncopated bass hit
  private scheduleBassSyncopation(measureIndex: number, time: number, stepsLen: number) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx
    const chordTypes = [
      { bass: NOTE.Bb1, midBass: NOTE.Bb2 },
      { bass: NOTE.A1, midBass: NOTE.A2 },
      { bass: NOTE.G1, midBass: NOTE.G2 },
      { bass: NOTE.Eb1, midBass: NOTE.Eb2 },
    ]
    const chord = chordTypes[measureIndex % 4]
    const noteLen = this.stepDuration * (stepsLen - 0.2)

    try {
      const subOsc = ctx.createOscillator()
      const midOsc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(chord.bass, time)

      midOsc.type = 'triangle'
      midOsc.frequency.setValueAtTime(chord.midBass, time)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(320, time)

      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(0.22, time + 0.015)
      gain.gain.linearRampToValueAtTime(0.16, time + 0.1)
      gain.gain.setValueAtTime(0.16, time + noteLen - 0.03)
      gain.gain.linearRampToValueAtTime(0, time + noteLen)

      subOsc.connect(filter)
      midOsc.connect(filter)
      filter.connect(gain)
      gain.connect(this.boutiqueFilter)

      subOsc.start(time)
      midOsc.start(time)
      subOsc.stop(time + noteLen + 0.02)
      midOsc.stop(time + noteLen + 0.02)

      setTimeout(() => {
        try {
          subOsc.disconnect()
          midOsc.disconnect()
          filter.disconnect()
          gain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + noteLen + 0.1) * 1000)
    } catch {}
  }

  // SZA Vocal Lead Hook Synth Engine (Soaring, expressive, with natural subtle vibrato)
  private scheduleSzaVocalLead(freq: number, time: number, duration: number, velocity = 1) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      // Primary Vocal Core + Upper Shimmer
      const oscPrimary = ctx.createOscillator()
      const oscWarm = ctx.createOscillator()
      const oscAir = ctx.createOscillator()

      const leadGain = ctx.createGain()
      const primaryGain = ctx.createGain()
      const warmGain = ctx.createGain()
      const airGain = ctx.createGain()

      // Formant-like bandpass vocal filter (simulates human vocal tract vowel)
      const vocalFilter = ctx.createBiquadFilter()
      vocalFilter.type = 'bandpass'
      vocalFilter.frequency.setValueAtTime(1850, time)
      vocalFilter.Q.setValueAtTime(1.4, time)

      oscPrimary.type = 'sawtooth'
      oscPrimary.frequency.setValueAtTime(freq, time)

      oscWarm.type = 'sine'
      oscWarm.frequency.setValueAtTime(freq, time)

      oscAir.type = 'triangle'
      oscAir.frequency.setValueAtTime(freq * 2.002, time)

      // Expressive Vocal Vibrato (LFO kicks in after 70ms, replicating SZA's natural vibrato)
      const vibratoLFO = ctx.createOscillator()
      const vibratoGain = ctx.createGain()
      vibratoLFO.type = 'sine'
      vibratoLFO.frequency.setValueAtTime(5.3, time)

      vibratoGain.gain.setValueAtTime(0, time)
      vibratoGain.gain.setValueAtTime(0, time + 0.07)
      vibratoGain.gain.linearRampToValueAtTime(4.2, time + Math.min(0.25, duration * 0.7))

      vibratoLFO.connect(vibratoGain)
      vibratoGain.connect(oscPrimary.frequency)
      vibratoGain.connect(oscWarm.frequency)

      primaryGain.gain.setValueAtTime(0.45, time)
      warmGain.gain.setValueAtTime(0.55, time)
      airGain.gain.setValueAtTime(0.2, time)

      // Tactile vocal envelope
      const peakAmp = 0.22 * velocity
      const attackTime = 0.018
      const decayTime = Math.min(0.12, duration * 0.35)

      leadGain.gain.setValueAtTime(0, time)
      leadGain.gain.linearRampToValueAtTime(peakAmp, time + attackTime)
      leadGain.gain.linearRampToValueAtTime(peakAmp * 0.85, time + attackTime + decayTime)
      leadGain.gain.setValueAtTime(peakAmp * 0.85, time + duration - 0.05)
      leadGain.gain.linearRampToValueAtTime(0, time + duration)

      oscPrimary.connect(primaryGain)
      oscWarm.connect(warmGain)
      oscAir.connect(airGain)

      primaryGain.connect(vocalFilter)
      warmGain.connect(leadGain)
      airGain.connect(leadGain)
      vocalFilter.connect(leadGain)

      leadGain.connect(this.boutiqueFilter)

      oscPrimary.start(time)
      oscWarm.start(time)
      oscAir.start(time)
      vibratoLFO.start(time)

      oscPrimary.stop(time + duration + 0.03)
      oscWarm.stop(time + duration + 0.03)
      oscAir.stop(time + duration + 0.03)
      vibratoLFO.stop(time + duration + 0.03)

      setTimeout(() => {
        try {
          oscPrimary.disconnect()
          oscWarm.disconnect()
          oscAir.disconnect()
          vibratoLFO.disconnect()
          vibratoGain.disconnect()
          primaryGain.disconnect()
          warmGain.disconnect()
          airGain.disconnect()
          vocalFilter.disconnect()
          leadGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + duration + 0.1) * 1000)
    } catch {}
  }

  // Signature Black Panther Staccato Synth Bell Pluck (Crystalline 8th-note arp)
  private scheduleArpPluck(freq: number, time: number, velocity = 1) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const pluckFilter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc1.type = 'triangle'
      osc1.frequency.setValueAtTime(freq, time)

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(freq * 2.001, time)

      // Fast decaying filter sweep for crystalline snap
      pluckFilter.type = 'lowpass'
      pluckFilter.frequency.setValueAtTime(3200, time)
      pluckFilter.frequency.exponentialRampToValueAtTime(800, time + 0.12)
      pluckFilter.Q.setValueAtTime(2.2, time)

      const peakAmp = 0.095 * velocity
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(peakAmp, time + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.13)
      gain.gain.setValueAtTime(0, time + 0.14)

      osc1.connect(pluckFilter)
      osc2.connect(pluckFilter)
      pluckFilter.connect(gain)
      gain.connect(this.boutiqueFilter)

      osc1.start(time)
      osc2.start(time)
      osc1.stop(time + 0.15)
      osc2.stop(time + 0.15)

      setTimeout(() => {
        try {
          osc1.disconnect()
          osc2.disconnect()
          pluckFilter.disconnect()
          gain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + 0.2) * 1000)
    } catch {}
  }

  // Modern Kendrick Lamar / Sounwave Boutique Kick
  private scheduleBoutiqueKick(time: number, accent = false) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      const osc = ctx.createOscillator()
      const clickOsc = ctx.createOscillator()
      const gain = ctx.createGain()
      const clickGain = ctx.createGain()
      const kickFilter = ctx.createBiquadFilter()

      // Deep 808 Pitch Drop: 160Hz -> 50Hz -> 42Hz
      osc.type = 'sine'
      osc.frequency.setValueAtTime(160, time)
      osc.frequency.exponentialRampToValueAtTime(52, time + 0.045)
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.16)

      // Transient Click (260Hz) for clarity on laptop/mobile speakers
      clickOsc.type = 'sine'
      clickOsc.frequency.setValueAtTime(260, time)
      clickOsc.frequency.exponentialRampToValueAtTime(80, time + 0.015)

      clickGain.gain.setValueAtTime(accent ? 0.08 : 0.05, time)
      clickGain.gain.linearRampToValueAtTime(0, time + 0.015)

      kickFilter.type = 'lowpass'
      kickFilter.frequency.setValueAtTime(240, time)

      const peak = accent ? 0.28 : 0.22
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(peak, time + 0.006)
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18)
      gain.gain.setValueAtTime(0, time + 0.19)

      clickOsc.connect(clickGain)
      clickGain.connect(gain)

      osc.connect(kickFilter)
      kickFilter.connect(gain)
      gain.connect(this.boutiqueFilter)

      osc.start(time)
      clickOsc.start(time)
      osc.stop(time + 0.2)
      clickOsc.stop(time + 0.02)

      setTimeout(() => {
        try {
          osc.disconnect()
          clickOsc.disconnect()
          clickGain.disconnect()
          kickFilter.disconnect()
          gain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + 0.25) * 1000)
    } catch {}
  }

  // Crisp Boutique Hi-Hat Ticks & Open Hat Splash
  private scheduleBoutiqueHiHat(time: number, amplitude: number, isOpen = false) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      const buffer = this.getNoiseBuffer(ctx)
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.setValueAtTime(6800, time)
      bandpass.Q.setValueAtTime(3.8, time)

      const hatGain = ctx.createGain()
      const decay = isOpen ? 0.12 : 0.028

      hatGain.gain.setValueAtTime(amplitude, time)
      hatGain.gain.exponentialRampToValueAtTime(0.001, time + decay)
      hatGain.gain.setValueAtTime(0, time + decay + 0.005)

      noiseSource.connect(bandpass)
      bandpass.connect(hatGain)
      hatGain.connect(this.boutiqueFilter)

      noiseSource.start(time)
      noiseSource.stop(time + decay + 0.01)

      setTimeout(() => {
        try {
          noiseSource.disconnect()
          bandpass.disconnect()
          hatGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + decay + 0.05) * 1000)
    } catch {}
  }

  // Snappy Boutique Snare & Acoustic Clap (Beats 2 & 4)
  private scheduleBoutiqueSnareClap(time: number) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      // 1. Snare Body Resonance (210Hz downward tone)
      const bodyOsc = ctx.createOscillator()
      const bodyGain = ctx.createGain()
      bodyOsc.type = 'sine'
      bodyOsc.frequency.setValueAtTime(210, time)
      bodyOsc.frequency.exponentialRampToValueAtTime(95, time + 0.035)

      bodyGain.gain.setValueAtTime(0.12, time)
      bodyGain.gain.linearRampToValueAtTime(0, time + 0.045)

      bodyOsc.connect(bodyGain)
      bodyGain.connect(this.boutiqueFilter)

      bodyOsc.start(time)
      bodyOsc.stop(time + 0.05)

      // 2. White Noise Acoustic Clap Burst
      const buffer = this.getNoiseBuffer(ctx)
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const snapFilter = ctx.createBiquadFilter()
      snapFilter.type = 'bandpass'
      snapFilter.frequency.setValueAtTime(1550, time)
      snapFilter.Q.setValueAtTime(1.6, time)

      const snapGain = ctx.createGain()
      snapGain.gain.setValueAtTime(0.14, time)
      snapGain.gain.exponentialRampToValueAtTime(0.001, time + 0.065)
      snapGain.gain.setValueAtTime(0, time + 0.07)

      noise.connect(snapFilter)
      snapFilter.connect(snapGain)
      snapGain.connect(this.boutiqueFilter)

      noise.start(time)
      noise.stop(time + 0.075)

      setTimeout(() => {
        try {
          bodyOsc.disconnect()
          bodyGain.disconnect()
          noise.disconnect()
          snapFilter.disconnect()
          snapGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + 0.1) * 1000)
    } catch {}
  }

  // Real-time equalizer levels & beat intensity for visualizers
  public getEqualizerLevels(): EqualizerLevels {
    if (!this.analyser || !this.isPlaying) {
      return { bar1: 0.1, bar2: 0.1, bar3: 0.1, bar4: 0.1, beatIntensity: 0.1 }
    }
    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyser.getByteFrequencyData(dataArray)

    // Segment frequency bins:
    // bar1: sub & punchy bass (bins 1-2, ~40-150Hz)
    // bar2: low-mids & snare body (bins 3-5, ~200-500Hz)
    // bar3: vocal lead & arp shimmer (bins 6-12, ~600-1500Hz)
    // bar4: crystalline hats & air (bins 13-28, ~1600-4500Hz)
    const b1 = ((dataArray[1] || 30) * 0.6 + (dataArray[2] || 25) * 0.4) / 255
    const b2 = ((dataArray[3] || 40) * 0.5 + (dataArray[4] || 35) * 0.5) / 255
    const b3 = ((dataArray[7] || 35) * 0.6 + (dataArray[10] || 30) * 0.4) / 255
    const b4 = ((dataArray[16] || 20) * 0.5 + (dataArray[22] || 15) * 0.5) / 255

    const beatIntensity = Math.max(0.1, (b1 * 1.4 + b2 * 0.8) / 2)

    return {
      bar1: Math.min(1.0, Math.max(0.18, b1 * 1.35)),
      bar2: Math.min(1.0, Math.max(0.22, b2 * 1.3)),
      bar3: Math.min(1.0, Math.max(0.18, b3 * 1.25)),
      bar4: Math.min(1.0, Math.max(0.14, b4 * 1.2)),
      beatIntensity: Math.min(1.0, beatIntensity),
    }
  }

  // UI Tactile Click Tick
  public playTick() {
    const ctx = this.getAudioContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.025)
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.linearRampToValueAtTime(0, now + 0.025)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.03)
      setTimeout(() => {
        try {
          osc.disconnect()
          gain.disconnect()
        } catch {}
      }, 45)
    } catch {}
  }
}

export const boutiqueSoundEngine = new AllTheStarsBoutiqueSynthesizer()
