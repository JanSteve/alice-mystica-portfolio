import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseAlpha: number
  phase: number
  twinkleSpeed: number
  color: string
}

interface FloatingStarlightDustProps {
  particleCount?: number
  className?: string
}

export function FloatingStarlightDust({
  particleCount,
  className = '',
}: FloatingStarlightDustProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const mousePos = useRef({ x: -1000, y: -1000 })
  const particles = useRef<Particle[]>([])

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Adjust particle count based on viewport width
    const count = particleCount ?? (width < 768 ? 20 : 45)

    // Palette of delicate cosmic/starlight tones matching Alice's aesthetic:
    // Cream (#efeee9), warm gold (#ffaa22), subtle rose (#e11d48)
    const colors = [
      'rgba(239, 238, 233,', // Cream
      'rgba(255, 170, 34,',  // Amber/Gold
      'rgba(239, 238, 233,', // Cream
      'rgba(225, 29, 72,',   // Crimson rose tint
    ]

    // Initialize particle pool
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.15 - Math.random() * 0.3, // Gentle upward celestial drift
      radius: 0.75 + Math.random() * 1.5,
      baseAlpha: 0.15 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.015 + Math.random() * 0.025,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 }
    }

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    let isTabVisible = !document.hidden
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', handleResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const repelRadius = 110

    const render = () => {
      if (!isTabVisible) {
        animFrameRef.current = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)

      const mx = mousePos.current.x
      const my = mousePos.current.y

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i]

        // Update gentle natural drift
        p.x += p.vx
        p.y += p.vy
        p.phase += p.twinkleSpeed

        // Radial cursor repelling physics within 110px radius
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.hypot(dx, dy)

        if (dist < repelRadius && dist > 0) {
          const force = ((repelRadius - dist) / repelRadius) * 1.8
          p.x += (dx / dist) * force
          p.y += (dy / dist) * force
        }

        // Screen boundary wrapping
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        // Twinkle calculation
        const alpha = Math.max(0.05, p.baseAlpha + Math.sin(p.phase) * 0.25)

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color} ${alpha.toFixed(3)})`
        ctx.shadowBlur = 4
        ctx.shadowColor = `${p.color} 0.5)`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [particleCount])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[12] ${className}`}
      aria-hidden="true"
    />
  )
}
