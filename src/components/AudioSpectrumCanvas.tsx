import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Volume2, Play, Pause, Activity, BarChart3, Sparkles } from 'lucide-react'
import { boutiqueSoundEngine } from '../audio/AllTheStarsSoundscape'
import { triggerHaptic } from '../utils/haptics'

export interface AudioSpectrumCanvasProps {
  height?: number
  className?: string
  defaultMode?: 'bars' | 'wave'
  showControls?: boolean
  accent?: 'amber' | 'indigo' | 'rose'
  isPlaying?: boolean
  onTogglePlay?: () => void
}

interface StarParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

export function AudioSpectrumCanvas({
  height = 90,
  className = '',
  defaultMode = 'bars',
  showControls = true,
  accent = 'amber',
  isPlaying: propIsPlaying,
  onTogglePlay,
}: AudioSpectrumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'bars' | 'wave'>(defaultMode)
  const isPlaying = propIsPlaying !== undefined ? propIsPlaying : boutiqueSoundEngine.isPlaying
  const peaksRef = useRef<number[]>([])
  const particlesRef = useRef<StarParticle[]>([])
  const idlePhaseRef = useRef<number>(0)

  // Switch visualizer mode
  const toggleMode = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerHaptic('light')
    boutiqueSoundEngine.playTick()
    setMode((prev) => (prev === 'bars' ? 'wave' : 'bars'))
  }

  // Handle click to play/pause
  const handleCanvasClick = () => {
    triggerHaptic('medium')
    if (onTogglePlay) {
      onTogglePlay()
    } else {
      if (boutiqueSoundEngine.isPlaying) {
        boutiqueSoundEngine.stop()
      } else {
        boutiqueSoundEngine.start()
      }
    }
  }

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
      }
    }

    resize()
    window.addEventListener('resize', resize)

    // Palette setup based on accent
    const getGradients = (h: number) => {
      const grad = ctx.createLinearGradient(0, h, 0, 0)
      if (accent === 'indigo') {
        grad.addColorStop(0, 'rgba(99, 102, 241, 0.2)')
        grad.addColorStop(0.5, 'rgba(129, 140, 248, 0.85)')
        grad.addColorStop(1, 'rgba(238, 242, 255, 1.0)')
      } else if (accent === 'rose') {
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.25)')
        grad.addColorStop(0.5, 'rgba(251, 113, 133, 0.85)')
        grad.addColorStop(1, 'rgba(255, 241, 242, 1.0)')
      } else {
        // Luxury Amber / Gold (Aesop/Dover St aesthetic)
        grad.addColorStop(0, 'rgba(255, 170, 34, 0.2)')
        grad.addColorStop(0.45, 'rgba(245, 158, 11, 0.8)')
        grad.addColorStop(0.85, 'rgba(251, 191, 36, 0.95)')
        grad.addColorStop(1, 'rgba(254, 243, 199, 1.0)')
      }
      return grad
    }

    const render = () => {
      const w = canvas.width
      const h = canvas.height
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, w, h)

      const analyser = boutiqueSoundEngine.getAnalyser()
      const active = isPlaying && analyser !== null

      if (active && analyser) {
        // Active Live Visualizer
        if (mode === 'bars') {
          const bufferLength = analyser.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)
          analyser.getByteFrequencyData(dataArray)

          const barCount = 36
          const barWidth = (w / barCount) * 0.72
          const gap = (w / barCount) * 0.28
          const barGradient = getGradients(h)

          if (peaksRef.current.length !== barCount) {
            peaksRef.current = new Array(barCount).fill(0)
          }

          for (let i = 0; i < barCount; i++) {
            // Perceptually map frequency bins (focus more bins in low and mid ranges)
            const binIndex = Math.min(
              bufferLength - 1,
              Math.floor(Math.pow(i / barCount, 1.45) * (bufferLength * 0.75)) + 1
            )
            const rawVal = dataArray[binIndex] || 0
            const percent = rawVal / 255
            const barH = Math.max(3 * dpr, percent * (h * 0.88))
            const x = i * (barWidth + gap) + gap / 2
            const y = h - barH

            // Bar drawing with rounded cap
            ctx.fillStyle = barGradient
            ctx.beginPath()
            ctx.roundRect(x, y, barWidth, barH, [3 * dpr, 3 * dpr, 0, 0])
            ctx.fill()

            // Peak Hold Marker
            if (barH > peaksRef.current[i]) {
              peaksRef.current[i] = barH
            } else {
              peaksRef.current[i] = Math.max(0, peaksRef.current[i] - 1.2 * dpr)
            }

            const peakY = h - peaksRef.current[i] - 2 * dpr
            ctx.fillStyle = accent === 'indigo' ? '#c7d2fe' : accent === 'rose' ? '#fecdd3' : '#fef08a'
            ctx.fillRect(x, peakY, barWidth, 1.5 * dpr)

            // Spawn particles on heavy bass (bins 0-4)
            if (i < 4 && rawVal > 210 && Math.random() < 0.2) {
              particlesRef.current.push({
                x: x + barWidth / 2,
                y: y,
                vx: (Math.random() - 0.5) * 1.5 * dpr,
                vy: -Math.random() * 2.5 * dpr - 1 * dpr,
                radius: (Math.random() * 2 + 1) * dpr,
                alpha: 0.9,
                color: '#ffaa22',
              })
            }
          }
        } else {
          // Oscilloscope Wave
          const bufferLength = analyser.fftSize
          const waveData = new Uint8Array(bufferLength)
          analyser.getByteTimeDomainData(waveData)

          ctx.lineWidth = 2.5 * dpr
          ctx.strokeStyle = accent === 'indigo' ? '#818cf8' : accent === 'rose' ? '#fb7185' : '#ffaa22'
          ctx.shadowBlur = 10 * dpr
          ctx.shadowColor = accent === 'indigo' ? 'rgba(99,102,241,0.6)' : accent === 'rose' ? 'rgba(244,63,94,0.6)' : 'rgba(255,170,34,0.6)'

          ctx.beginPath()
          const sliceWidth = w / (bufferLength - 1)
          let x = 0

          for (let i = 0; i < bufferLength; i++) {
            const v = waveData[i] / 128.0
            const y = (v * h) / 2

            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
            x += sliceWidth
          }
          ctx.stroke()
          ctx.shadowBlur = 0 // reset
        }

        // Render & update floating spark particles
        for (let pIdx = particlesRef.current.length - 1; pIdx >= 0; pIdx--) {
          const p = particlesRef.current[pIdx]
          p.x += p.vx
          p.y += p.vy
          p.alpha -= 0.02
          if (p.alpha <= 0) {
            particlesRef.current.splice(pIdx, 1)
            continue
          }
          ctx.fillStyle = `rgba(255, 170, 34, ${p.alpha.toFixed(2)})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        // Elegant Idle Wave (Gentle breathing sine wave)
        idlePhaseRef.current += 0.035
        const phase = idlePhaseRef.current

        ctx.lineWidth = 1.5 * dpr
        ctx.strokeStyle = 'rgba(239, 238, 233, 0.28)'
        ctx.beginPath()

        const points = 60
        for (let i = 0; i <= points; i++) {
          const x = (i / points) * w
          const normalY = Math.sin((i / points) * Math.PI * 3 + phase) * (h * 0.18)
          const harmonicY = Math.sin((i / points) * Math.PI * 6 - phase * 0.7) * (h * 0.08)
          const y = h / 2 + normalY + harmonicY
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        // Idle Ambient Guide
        ctx.fillStyle = 'rgba(239, 238, 233, 0.45)'
        ctx.font = `${Math.max(9, 10 * dpr)}px monospace`
        ctx.textAlign = 'center'
        ctx.fillText('• 97 BPM SYNTHESIZER READY — TAP TO PLAY •', w / 2, h / 2 + 18 * dpr)
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [isPlaying, mode, accent])

  return (
    <div className={`relative group select-none ${className}`}>
      <div
        onClick={handleCanvasClick}
        style={{ height: `${height}px` }}
        className="w-full relative rounded-xl overflow-hidden bg-black/60 border border-[#efeee9]/15 hover:border-[#ffaa22]/50 transition-all cursor-pointer backdrop-blur-md shadow-inner"
        title={isPlaying ? 'Pause All The Stars' : 'Play All The Stars Synthesizer'}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Status Pills */}
        <div className="absolute top-2 left-2.5 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/75 border border-[#efeee9]/20 text-[9px] font-mono uppercase tracking-wider text-[#efeee9]/80">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-[#efeee9]/40'
              }`}
            />
            <span>{isPlaying ? 'Live Web Audio API' : 'Synthesizer Paused'}</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono text-[#efeee9]/40">
            97 BPM &bull; Bb Major
          </span>
        </div>

        {/* Visualizer Mode Toggle & Controls */}
        {showControls && (
          <div className="absolute top-2 right-2.5 flex items-center gap-1.5">
            <button
              onClick={toggleMode}
              aria-label={`Switch to ${mode === 'bars' ? 'oscilloscope wave' : 'spectrum bars'} mode`}
              title={`Switch to ${mode === 'bars' ? 'Oscilloscope Wave' : 'Frequency Spectrum Bars'}`}
              className="p-1 px-2 rounded-full bg-black/80 hover:bg-[#efeee9] hover:text-black text-[#efeee9]/80 border border-[#efeee9]/20 text-[9px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              {mode === 'bars' ? <Activity size={10} /> : <BarChart3 size={10} />}
              <span>{mode === 'bars' ? 'Bars' : 'Wave'}</span>
            </button>
          </div>
        )}

        {/* Hover Click Hint */}
        <div className="absolute bottom-1.5 right-2.5 text-[9px] font-mono text-[#efeee9]/40 group-hover:text-[#efeee9]/80 transition-colors pointer-events-none">
          {isPlaying ? 'Click canvas to pause' : 'Click canvas to play'}
        </div>
      </div>
    </div>
  )
}
