import React, { useEffect, useRef, useState } from 'react'
import { Play, Pause, Search } from 'lucide-react'

interface LiquidMagneticCursorProps {
  isPlayingSound?: boolean
}

type CursorMode = 'default' | 'play' | 'zoom' | 'magnetic'

export function LiquidMagneticCursor({ isPlayingSound = false }: LiquidMagneticCursorProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [mode, setMode] = useState<CursorMode>('default')
  const [isVisible, setIsVisible] = useState(false)

  // Direct DOM refs for zero-rerender rAF tracking
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  // Position references
  const targetPos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const dotPos = useRef({ x: -100, y: -100 })
  const ringDimensions = useRef({ width: 34, height: 34, borderRadius: 9999 })
  const targetDimensions = useRef({ width: 34, height: 34, borderRadius: 9999 })

  const rafId = useRef<number | null>(null)
  const modeRef = useRef<CursorMode>('default')
  const isPlayingRef = useRef(isPlayingSound)

  useEffect(() => {
    isPlayingRef.current = isPlayingSound
  }, [isPlayingSound])

  useEffect(() => {
    // Graceful touch check: only desktop with fine pointer
    const isFinePointer = window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window)
    if (!isFinePointer) {
      setIsSupported(false)
      return
    }
    setIsSupported(true)

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      // Contextual element detection
      const target = e.target as HTMLElement | null
      if (!target) return

      const playEl = target.closest('[data-cursor="play"], button[aria-label*="play" i], button[aria-label*="audio" i], .audio-play-trigger')
      const zoomEl = target.closest('[data-cursor="zoom"], .archival-photo-frame, .lightbox-trigger')
      const magneticEl = target.closest('[data-cursor="magnetic"], button, a, [role="button"], input[type="range"]')

      if (playEl) {
        if (modeRef.current !== 'play') {
          modeRef.current = 'play'
          setMode('play')
          targetDimensions.current = { width: 92, height: 36, borderRadius: 9999 }
        }
      } else if (zoomEl) {
        if (modeRef.current !== 'zoom') {
          modeRef.current = 'zoom'
          setMode('zoom')
          targetDimensions.current = { width: 68, height: 68, borderRadius: 9999 }
        }
      } else if (magneticEl) {
        if (modeRef.current !== 'magnetic') {
          modeRef.current = 'magnetic'
          setMode('magnetic')
          targetDimensions.current = { width: 48, height: 48, borderRadius: 9999 }
        }
      } else {
        if (modeRef.current !== 'default') {
          modeRef.current = 'default'
          setMode('default')
          targetDimensions.current = { width: 34, height: 34, borderRadius: 9999 }
        }
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    // Animation loop with spring physics (lerp ~0.15)
    const animate = () => {
      // Dot follows with high responsiveness (lerp 0.6)
      dotPos.current.x += (targetPos.current.x - dotPos.current.x) * 0.6
      dotPos.current.y += (targetPos.current.y - dotPos.current.y) * 0.6

      // Outer ring follows with smooth spring damping (lerp 0.15)
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * 0.15
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * 0.15

      // Smooth dimension morphing
      ringDimensions.current.width += (targetDimensions.current.width - ringDimensions.current.width) * 0.2
      ringDimensions.current.height += (targetDimensions.current.height - ringDimensions.current.height) * 0.2

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`
        ringRef.current.style.width = `${ringDimensions.current.width}px`
        ringRef.current.style.height = `${ringDimensions.current.height}px`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [isVisible])

  if (!isSupported) return null

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Lagging Spring Ring with Contextual Morphing */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center transition-colors duration-200 pointer-events-none will-change-transform ${
          mode === 'play'
            ? 'bg-[#efeee9] text-black shadow-[0_0_20px_rgba(239,238,233,0.35)] rounded-full'
            : mode === 'zoom'
            ? 'border border-[#efeee9] bg-[#efeee9]/10 backdrop-blur-xs text-[#efeee9] shadow-[0_0_24px_rgba(239,238,233,0.2)] rounded-full'
            : mode === 'magnetic'
            ? 'border-2 border-[#ffaa22]/80 bg-[#ffaa22]/10 backdrop-blur-2xs rounded-full shadow-[0_0_15px_rgba(255,170,34,0.25)]'
            : 'border border-[#efeee9]/65 bg-transparent rounded-full shadow-[0_0_10px_rgba(239,238,233,0.1)]'
        }`}
        style={{
          width: '34px',
          height: '34px',
        }}
      >
        {/* Dynamic Label inside morphed ring */}
        {mode === 'play' && (
          <div className="flex items-center gap-1.5 px-3 select-none text-[10px] font-mono font-bold tracking-widest uppercase">
            {isPlayingSound ? (
              <>
                <Pause size={10} className="fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play size={10} className="fill-current ml-0.5" />
                <span>PLAY</span>
              </>
            )}
          </div>
        )}

        {mode === 'zoom' && (
          <div className="flex flex-col items-center justify-center select-none text-[#efeee9]">
            <Search size={14} className="mb-0.5 opacity-90" />
            <span className="text-[9px] font-mono tracking-widest font-semibold uppercase">ZOOM</span>
          </div>
        )}
      </div>

      {/* Adaptive Lead Dot (6px) */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none will-change-transform transition-all duration-150 ${
          mode === 'play'
            ? 'opacity-0 scale-0'
            : mode === 'zoom'
            ? 'opacity-0 scale-0'
            : mode === 'magnetic'
            ? 'bg-[#ffaa22] scale-125'
            : 'bg-[#efeee9] opacity-90'
        }`}
      />
    </div>
  )
}
