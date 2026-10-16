// =========================================================================
// ALL THE STARS — KENDRICK LAMAR & SZA (BLACK PANTHER SOUNDTRACK)
// Curated Luxury Boutique Acoustic Mix — Web Audio API Synthesizer
//
// Key: Bb Major | Tempo: 97 BPM
// Signature Progression: Bb - F/A - Gm - Eb
// Iconic Chorus Hook: "All the stars are closer..."
// Acoustics: Filtered through upscale boutique acoustics (Aesop / Dover Street Market)
// =========================================================================

export interface EqualizerLevels {
  bar1: number
  bar2: number
  bar3: number
  bar4: number
}

// Note frequencies in Hz
const NOTE = {
  Eb1: 38.89,
  G1: 49.00,
  A1: 55.00,
  Bb1: 58.27,
  Eb2: 77.78,
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
}

interface MelodyEvent {
  step: number // 0 to 127 (sixteenth notes in 8-measure cycle)
  freq: number
  duration: number // in seconds
  velocity?: number
}

// 8-measure iconic SZA Chorus melody sequence
const ALL_THE_STARS_MELODY: MelodyEvent[] = [
  // Measure 1 (Bb) - "All the stars are closer"
  { step: 2, freq: NOTE.F4, duration: 0.28 },
  { step: 4, freq: NOTE.G4, duration: 0.28 },
  { step: 6, freq: NOTE.Bb4, duration: 0.55 },
  { step: 10, freq: NOTE.C5, duration: 0.28 },
  { step: 12, freq: NOTE.Bb4, duration: 0.3 },
  { step: 14, freq: NOTE.F4, duration: 0.35 },

  // Measure 2 (F/A) - "All the stars are closer"
  { step: 16 + 2, freq: NOTE.F4, duration: 0.28 },
  { step: 16 + 4, freq: NOTE.G4, duration: 0.28 },
  { step: 16 + 6, freq: NOTE.Bb4, duration: 0.55 },
  { step: 16 + 10, freq: NOTE.C5, duration: 0.28 },
  { step: 16 + 12, freq: NOTE.D5, duration: 0.3 },
  { step: 16 + 14, freq: NOTE.C5, duration: 0.5 },

  // Measure 3 (Gm) - "All the stars are closer"
  { step: 32 + 2, freq: NOTE.F4, duration: 0.28 },
  { step: 32 + 4, freq: NOTE.G4, duration: 0.28 },
  { step: 32 + 6, freq: NOTE.Bb4, duration: 0.55 },
  { step: 32 + 10, freq: NOTE.C5, duration: 0.28 },
  { step: 32 + 12, freq: NOTE.Bb4, duration: 0.3 },
  { step: 32 + 14, freq: NOTE.G4, duration: 0.4 },

  // Measure 4 (Eb) - "Tell me what you gon' do to me"
  { step: 48 + 0, freq: NOTE.F4, duration: 0.24 },
  { step: 48 + 2, freq: NOTE.D4, duration: 0.24 },
  { step: 48 + 4, freq: NOTE.F4, duration: 0.26 },
  { step: 48 + 6, freq: NOTE.G4, duration: 0.28 },
  { step: 48 + 8, freq: NOTE.F4, duration: 0.45 },
  { step: 48 + 12, freq: NOTE.D4, duration: 0.3 },
  { step: 48 + 14, freq: NOTE.Bb3, duration: 0.45 },

  // Measure 5 (Bb) - "This may be the night that my dreams..."
  { step: 64 + 0, freq: NOTE.D4, duration: 0.25 },
  { step: 64 + 2, freq: NOTE.F4, duration: 0.25 },
  { step: 64 + 4, freq: NOTE.G4, duration: 0.25 },
  { step: 64 + 6, freq: NOTE.F4, duration: 0.25 },
  { step: 64 + 8, freq: NOTE.D4, duration: 0.25 },
  { step: 64 + 10, freq: NOTE.F4, duration: 0.25 },
  { step: 64 + 12, freq: NOTE.Bb4, duration: 0.5 },

  // Measure 6 (F/A) - "All the stars are closer"
  { step: 80 + 2, freq: NOTE.F4, duration: 0.28 },
  { step: 80 + 4, freq: NOTE.G4, duration: 0.28 },
  { step: 80 + 6, freq: NOTE.Bb4, duration: 0.55 },
  { step: 80 + 10, freq: NOTE.C5, duration: 0.28 },
  { step: 80 + 12, freq: NOTE.D5, duration: 0.3 },
  { step: 80 + 14, freq: NOTE.C5, duration: 0.45 },

  // Measure 7 (Gm) - "All the stars are closer"
  { step: 96 + 2, freq: NOTE.F4, duration: 0.28 },
  { step: 96 + 4, freq: NOTE.G4, duration: 0.28 },
  { step: 96 + 6, freq: NOTE.Bb4, duration: 0.55 },
  { step: 96 + 10, freq: NOTE.C5, duration: 0.28 },
  { step: 96 + 12, freq: NOTE.Bb4, duration: 0.3 },
  { step: 96 + 14, freq: NOTE.G4, duration: 0.4 },

  // Measure 8 (Eb) - "All the stars are closer..."
  { step: 112 + 2, freq: NOTE.F4, duration: 0.25 },
  { step: 112 + 4, freq: NOTE.G4, duration: 0.25 },
  { step: 112 + 6, freq: NOTE.Bb4, duration: 0.4 },
  { step: 112 + 8, freq: NOTE.C5, duration: 0.25 },
  { step: 112 + 10, freq: NOTE.Bb4, duration: 0.28 },
  { step: 112 + 12, freq: NOTE.G4, duration: 0.28 },
  { step: 112 + 14, freq: NOTE.F4, duration: 0.55 },
]

export class AllTheStarsBoutiqueSynthesizer {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private boutiqueFilter: BiquadFilterNode | null = null
  private analyser: AnalyserNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private spatialDelayNodes: AudioNode[] = []

  // State
  public isPlaying = false
  public volume = 0.18 // Minimal, classy default volume (18%)
  private tempo = 97
  private stepDuration = 60 / 97 / 4 // Sixteenth note duration in seconds (~0.1546s)

  // Scheduler
  private schedulerTimer: ReturnType<typeof setInterval> | null = null
  private stopCleanupTimer: ReturnType<typeof setTimeout> | null = null
  private currentStep = 0
  private nextStepTime = 0
  private lookaheadMs = 45
  private scheduleAheadSec = 0.16

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    try {
      if (!this.ctx || this.ctx.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!AudioCtx) return null
        this.ctx = new AudioCtx()
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
      return this.ctx
    } catch {
      return null
    }
  }

  // Generate white noise buffer for soft boutique hi-hats
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
      this.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.05)
    }
  }

  public start(): boolean {
    if (this.isPlaying) return true

    // Clear any pending cleanup timer from a previous stop() call to prevent cut-off race condition
    if (this.stopCleanupTimer) {
      clearTimeout(this.stopCleanupTimer)
      this.stopCleanupTimer = null
    }

    const ctx = this.getAudioContext()
    if (!ctx) return false

    try {
      // Resume if suspended by browser autoplay policy
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }

      const now = ctx.currentTime

      // 1. Analyser for real-time live equalizer visualization
      this.analyser = ctx.createAnalyser()
      this.analyser.fftSize = 64
      this.analyser.smoothingTimeConstant = 0.82

      // 2. Master Gain Node with gentle boutique fade-in
      this.masterGain = ctx.createGain()
      this.masterGain.gain.setValueAtTime(0, now)
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 1.1)

      // 3. High-End Boutique Acoustic Biquad Filter (Warm roll-off at 3400Hz)
      // Produces the velvety luxury store ambience (Aesop / Dover Street Market / Colette)
      this.boutiqueFilter = ctx.createBiquadFilter()
      this.boutiqueFilter.type = 'lowpass'
      this.boutiqueFilter.frequency.setValueAtTime(3400, now)
      this.boutiqueFilter.Q.setValueAtTime(0.85, now)

      // 4. Subtle spatial room reflections (Boutique acoustic stereo delay)
      const delayL = ctx.createDelay()
      delayL.delayTime.setValueAtTime(0.048, now)
      const delayR = ctx.createDelay()
      delayR.delayTime.setValueAtTime(0.076, now)

      const feedbackL = ctx.createGain()
      feedbackL.gain.setValueAtTime(0.15, now)
      const feedbackR = ctx.createGain()
      feedbackR.gain.setValueAtTime(0.13, now)

      const delayFilter = ctx.createBiquadFilter()
      delayFilter.type = 'lowpass'
      delayFilter.frequency.setValueAtTime(2200, now)

      // Delay routing
      this.boutiqueFilter.connect(delayL)
      this.boutiqueFilter.connect(delayR)
      delayL.connect(delayFilter)
      delayR.connect(delayFilter)
      delayFilter.connect(feedbackL)
      delayFilter.connect(feedbackR)
      feedbackL.connect(delayL)
      feedbackR.connect(delayR)

      // Track spatial nodes for clean disconnection
      this.spatialDelayNodes = [delayL, delayR, feedbackL, feedbackR, delayFilter]

      // Mix direct + reflected room sound into Master Gain
      this.boutiqueFilter.connect(this.masterGain)
      delayFilter.connect(this.masterGain)

      // Master Gain connects through Analyser to Destination
      this.masterGain.connect(this.analyser)
      this.analyser.connect(ctx.destination)

      this.currentStep = 0
      this.nextStepTime = now + 0.08
      this.isPlaying = true

      // Start Lookahead Scheduler Loop
      this.schedulerTimer = setInterval(() => {
        this.runScheduler()
      }, this.lookaheadMs)

      return true
    } catch {
      this.isPlaying = false
      return false
    }
  }

  public stop(): boolean {
    if (!this.isPlaying) {
      return false
    }

    this.isPlaying = false

    // Immediately halt scheduling so no new notes/chords are enqueued
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer)
      this.schedulerTimer = null
    }

    if (!this.masterGain || !this.ctx) {
      return true
    }

    try {
      const now = this.ctx.currentTime
      const currentGain = Math.max(0, this.masterGain.gain.value)
      this.masterGain.gain.setValueAtTime(currentGain, now)
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.6)

      // Delayed full node cleanup with timer tracking to prevent race condition
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
        if (this.masterGain) {
          try {
            this.masterGain.disconnect()
          } catch {}
          this.masterGain = null
        }
        this.stopCleanupTimer = null
      }, 700)

      return true
    } catch {
      return false
    }
  }

  // Web Audio Lookahead Engine
  private runScheduler() {
    if (!this.ctx || !this.isPlaying) return

    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadSec) {
      this.scheduleStep(this.currentStep, this.nextStepTime)
      this.nextStepTime += this.stepDuration
      this.currentStep = (this.currentStep + 1) % 128 // 8 measures (16 steps each)
    }
  }

  private scheduleStep(step: number, time: number) {
    if (!this.ctx || !this.boutiqueFilter) return

    const stepInMeasure = step % 16
    const measureIndex = Math.floor(step / 16)

    // 1. Chords & Bass Trigger on Measure Boundaries (Steps 0, 16, 32, 48, 64, 80, 96, 112)
    if (stepInMeasure === 0) {
      this.scheduleChordAndBass(measureIndex, time)
    }

    // 2. SZA Chorus Melody ("All The Stars")
    const melodyEvents = ALL_THE_STARS_MELODY.filter((evt) => evt.step === step)
    melodyEvents.forEach((evt) => {
      this.scheduleMelodyNote(evt.freq, time, evt.duration, evt.velocity || 1)
    })

    // 3. Signature Syncopated Warm Boutique Kick ("All The Stars" rhythmic bounce)
    // Beat 1 (step 0), Beat 2-and (step 6), and Beat 3-and (step 10)
    if (stepInMeasure === 0) {
      this.scheduleBoutiqueKick(time, true)
    } else if (stepInMeasure === 6) {
      this.scheduleBoutiqueKick(time, false)
    } else if (stepInMeasure === 10 && (measureIndex % 2 === 1)) {
      // Syncopated kick push on alternate measures
      this.scheduleBoutiqueKick(time, false)
    }

    // 4. Boutique Soft Hi-Hat Ticks (on eighth notes: steps 0, 2, 4, 6, 8, 10, 12, 14)
    if (step % 2 === 0) {
      const isOffbeat = step % 4 !== 0
      this.scheduleBoutiqueHiHat(time, isOffbeat ? 0.015 : 0.010)
    }

    // 5. Muted Boutique Rimshot / Snare Snap on Beats 2 & 4 (Steps 4 & 12 of each measure)
    if (stepInMeasure === 4 || stepInMeasure === 12) {
      this.scheduleBoutiqueRimshot(time)
    }
  }

  // Synthesizes the warm analog pad chords and deep sub-bass
  private scheduleChordAndBass(measureIndex: number, time: number) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx
    const chordDuration = this.stepDuration * 16

    // Progression:
    // Measures 0 & 4: Bb major (Bb1, Bb2, Bb3, D4, F4, Bb4)
    // Measures 1 & 5: F/A (A1, A2, A3, C4, F4, C5)
    // Measures 2 & 6: Gm (G1, G2, G3, Bb3, D4, G4)
    // Measures 3 & 7: Eb (Eb1, Eb2, Eb3, G3, Bb3, Eb4)
    const chordTypes = [
      { bass: NOTE.Bb1, sub: NOTE.Bb2, pad: [NOTE.Bb3, NOTE.D4, NOTE.F4, NOTE.Bb4] }, // Bb
      { bass: NOTE.A1, sub: NOTE.A2, pad: [NOTE.A3, NOTE.C4, NOTE.F4, NOTE.C5] }, // F/A
      { bass: NOTE.G1, sub: NOTE.G2, pad: [NOTE.G3, NOTE.Bb3, NOTE.D4, NOTE.G4] }, // Gm
      { bass: NOTE.Eb1, sub: NOTE.Eb2, pad: [NOTE.Eb3, NOTE.G3, NOTE.Bb3, NOTE.Eb4] }, // Eb
    ]

    const chord = chordTypes[measureIndex % 4]

    // A. Sub-Bass + Mid-Harmonic Bass (Audible on both headphones & phone/laptop speakers)
    try {
      const subOsc = ctx.createOscillator()
      const warmOsc = ctx.createOscillator()
      const bassGain = ctx.createGain()
      const bassFilter = ctx.createBiquadFilter()

      subOsc.type = 'sine'
      subOsc.frequency.setValueAtTime(chord.sub, time)

      warmOsc.type = 'triangle'
      warmOsc.frequency.setValueAtTime(chord.sub, time)

      bassFilter.type = 'lowpass'
      bassFilter.frequency.setValueAtTime(260, time)

      const subGain = ctx.createGain()
      const warmGain = ctx.createGain()
      subGain.gain.setValueAtTime(0.7, time)
      warmGain.gain.setValueAtTime(0.3, time)

      // Bass envelope: smooth attack & sustain
      bassGain.gain.setValueAtTime(0, time)
      bassGain.gain.linearRampToValueAtTime(0.12, time + 0.12)
      bassGain.gain.linearRampToValueAtTime(0.10, time + chordDuration - 0.1)
      bassGain.gain.linearRampToValueAtTime(0, time + chordDuration)

      subOsc.connect(subGain)
      warmOsc.connect(warmGain)
      subGain.connect(bassFilter)
      warmGain.connect(bassFilter)
      bassFilter.connect(bassGain)
      bassGain.connect(this.boutiqueFilter)

      subOsc.start(time)
      warmOsc.start(time)
      subOsc.stop(time + chordDuration)
      warmOsc.stop(time + chordDuration)

      setTimeout(() => {
        try {
          subOsc.disconnect()
          warmOsc.disconnect()
          subGain.disconnect()
          warmGain.disconnect()
          bassFilter.disconnect()
          bassGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + chordDuration + 0.1) * 1000)
    } catch {}

    // B. Lush Analog Synth Pad Chords
    try {
      const padOscs: OscillatorNode[] = []
      const padGains: GainNode[] = []

      // Pad filter with slow organic breathing
      const padFilter = ctx.createBiquadFilter()
      padFilter.type = 'lowpass'
      padFilter.frequency.setValueAtTime(680, time)
      padFilter.frequency.linearRampToValueAtTime(840, time + chordDuration * 0.5)
      padFilter.frequency.linearRampToValueAtTime(650, time + chordDuration)

      const masterPadGain = ctx.createGain()
      masterPadGain.gain.setValueAtTime(0, time)
      masterPadGain.gain.linearRampToValueAtTime(0.065, time + 0.35)
      masterPadGain.gain.setValueAtTime(0.065, time + chordDuration - 0.4)
      masterPadGain.gain.linearRampToValueAtTime(0, time + chordDuration)

      masterPadGain.connect(padFilter)
      padFilter.connect(this.boutiqueFilter)

      chord.pad.forEach((freq, idx) => {
        // Dual detuned oscillators for lush boutique texture
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const voiceGain = ctx.createGain()

        osc1.type = 'sawtooth'
        osc2.type = 'triangle'
        osc1.frequency.setValueAtTime(freq, time)
        osc2.frequency.setValueAtTime(freq, time)

        // Subtle micro-detuning
        osc1.detune.setValueAtTime(-5.5 + idx * 1.5, time)
        osc2.detune.setValueAtTime(5.5 - idx * 1.5, time)

        voiceGain.gain.setValueAtTime(0.26, time)

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

  // SZA Chorus Melody Rhodes/Bell Synthesis
  private scheduleMelodyNote(freq: number, time: number, duration: number, velocity = 1) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      // Bell/Rhodes Dual Sine Engine with subtle shimmer
      const fundamental = ctx.createOscillator()
      const overtone = ctx.createOscillator()
      const bellChime = ctx.createOscillator()

      const noteGain = ctx.createGain()
      const overtoneGain = ctx.createGain()
      const chimeGain = ctx.createGain()

      fundamental.type = 'sine'
      fundamental.frequency.setValueAtTime(freq, time)

      // Slight chorus overtone
      overtone.type = 'sine'
      overtone.frequency.setValueAtTime(freq * 2.003, time)

      // High bell sparkle
      bellChime.type = 'triangle'
      bellChime.frequency.setValueAtTime(freq * 3.0, time)

      overtoneGain.gain.setValueAtTime(0.18, time)
      chimeGain.gain.setValueAtTime(0.06, time)

      // Strictly monotonic tactile bell envelope
      const peakAmp = 0.092 * velocity
      const attackTime = 0.008
      const decayTime = Math.min(0.12, duration * 0.4)

      noteGain.gain.setValueAtTime(0, time)
      noteGain.gain.linearRampToValueAtTime(peakAmp, time + attackTime)
      noteGain.gain.linearRampToValueAtTime(peakAmp * 0.35, time + attackTime + decayTime)
      noteGain.gain.linearRampToValueAtTime(0, time + duration)

      fundamental.connect(noteGain)
      overtone.connect(overtoneGain)
      overtoneGain.connect(noteGain)
      bellChime.connect(chimeGain)
      chimeGain.connect(noteGain)

      noteGain.connect(this.boutiqueFilter)

      fundamental.start(time)
      overtone.start(time)
      bellChime.start(time)

      fundamental.stop(time + duration + 0.02)
      overtone.stop(time + duration + 0.02)
      bellChime.stop(time + duration + 0.02)

      setTimeout(() => {
        try {
          fundamental.disconnect()
          overtone.disconnect()
          bellChime.disconnect()
          overtoneGain.disconnect()
          chimeGain.disconnect()
          noteGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + duration + 0.1) * 1000)
    } catch {}
  }

  // Soft Boutique Warm Kick Pulse (Syncopated "All The Stars" signature bounce)
  private scheduleBoutiqueKick(time: number, accent = false) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const kickFilter = ctx.createBiquadFilter()

      osc.type = 'sine'
      // Warm pitch drop from 72Hz down to 42Hz
      osc.frequency.setValueAtTime(74, time)
      osc.frequency.exponentialRampToValueAtTime(42, time + 0.08)

      // Pillowy boutique low-pass roll-off so it never clicks harshly
      kickFilter.type = 'lowpass'
      kickFilter.frequency.setValueAtTime(160, time)

      const peak = accent ? 0.085 : 0.065
      gain.gain.setValueAtTime(0, time)
      gain.gain.linearRampToValueAtTime(peak, time + 0.012)
      gain.gain.linearRampToValueAtTime(0, time + 0.12)

      osc.connect(kickFilter)
      kickFilter.connect(gain)
      gain.connect(this.boutiqueFilter)

      osc.start(time)
      osc.stop(time + 0.13)

      setTimeout(() => {
        try {
          osc.disconnect()
          kickFilter.disconnect()
          gain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + 0.15) * 1000)
    } catch {}
  }

  // Soft Boutique Hi-Hat Ticks
  private scheduleBoutiqueHiHat(time: number, amplitude: number) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      const buffer = this.getNoiseBuffer(ctx)
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = buffer

      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.setValueAtTime(6200, time)
      bandpass.Q.setValueAtTime(3.5, time)

      const hatGain = ctx.createGain()
      hatGain.gain.setValueAtTime(amplitude, time)
      hatGain.gain.linearRampToValueAtTime(0, time + 0.024)

      noiseSource.connect(bandpass)
      bandpass.connect(hatGain)
      hatGain.connect(this.boutiqueFilter)

      noiseSource.start(time)
      noiseSource.stop(time + 0.03)

      setTimeout(() => {
        try {
          noiseSource.disconnect()
          bandpass.disconnect()
          hatGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + 0.1) * 1000)
    } catch {}
  }

  // Soft Boutique Rimshot / Snare Snap
  private scheduleBoutiqueRimshot(time: number) {
    if (!this.ctx || !this.boutiqueFilter) return
    const ctx = this.ctx

    try {
      const toneOsc = ctx.createOscillator()
      const toneGain = ctx.createGain()
      toneOsc.type = 'sine'
      toneOsc.frequency.setValueAtTime(260, time)
      toneOsc.frequency.exponentialRampToValueAtTime(90, time + 0.038)

      toneGain.gain.setValueAtTime(0.035, time)
      toneGain.gain.linearRampToValueAtTime(0, time + 0.04)

      toneOsc.connect(toneGain)
      toneGain.connect(this.boutiqueFilter)

      toneOsc.start(time)
      toneOsc.stop(time + 0.045)

      // Snap texture
      const buffer = this.getNoiseBuffer(ctx)
      const snapSource = ctx.createBufferSource()
      snapSource.buffer = buffer

      const snapFilter = ctx.createBiquadFilter()
      snapFilter.type = 'bandpass'
      snapFilter.frequency.setValueAtTime(1400, time)
      snapFilter.Q.setValueAtTime(1.8, time)

      const snapGain = ctx.createGain()
      snapGain.gain.setValueAtTime(0.025, time)
      snapGain.gain.linearRampToValueAtTime(0, time + 0.035)

      snapSource.connect(snapFilter)
      snapFilter.connect(snapGain)
      snapGain.connect(this.boutiqueFilter)

      snapSource.start(time)
      snapSource.stop(time + 0.04)

      setTimeout(() => {
        try {
          toneOsc.disconnect()
          toneGain.disconnect()
          snapSource.disconnect()
          snapFilter.disconnect()
          snapGain.disconnect()
        } catch {}
      }, (time - ctx.currentTime + 0.1) * 1000)
    } catch {}
  }

  // Get real-time equalizer levels for visualizer
  public getEqualizerLevels(): EqualizerLevels {
    if (!this.analyser || !this.isPlaying) {
      return { bar1: 0.1, bar2: 0.1, bar3: 0.1, bar4: 0.1 }
    }
    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyser.getByteFrequencyData(dataArray)

    // Segment frequency bins across 4 bars (sub-bass, low-mid, high-mid, high)
    const b1 = (dataArray[1] || 20) / 255
    const b2 = (dataArray[3] || 35) / 255
    const b3 = (dataArray[6] || 25) / 255
    const b4 = (dataArray[10] || 15) / 255

    return {
      bar1: Math.max(0.15, b1),
      bar2: Math.max(0.2, b2),
      bar3: Math.max(0.18, b3),
      bar4: Math.max(0.12, b4),
    }
  }

  // UI Tactile Click
  public playTick() {
    const ctx = this.getAudioContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(840, now)
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.028)
      gain.gain.setValueAtTime(0.025, now)
      gain.gain.linearRampToValueAtTime(0, now + 0.028)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.032)
      setTimeout(() => {
        try {
          osc.disconnect()
          gain.disconnect()
        } catch {}
      }, 50)
    } catch {}
  }
}

export const boutiqueSoundEngine = new AllTheStarsBoutiqueSynthesizer()
