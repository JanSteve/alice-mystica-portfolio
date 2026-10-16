import React, { useRef, useState, useEffect, useCallback } from 'react'

export interface Perspective3DCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  perspective?: number
  scale?: number
  glare?: boolean
  maxGlareOpacity?: number
  gyroEnabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onPointerEnter?: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerLeave?: (e: React.PointerEvent<HTMLDivElement>) => void
}

export function Perspective3DCard({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1000,
  scale = 1.015,
  glare = true,
  maxGlareOpacity = 0.28,
  gyroEnabled = true,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: Perspective3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const rafId = useRef<number | null>(null)

  // Check user's motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  // Gyroscope listener for mobile devices when supported
  useEffect(() => {
    if (!gyroEnabled || reducedMotion || typeof window === 'undefined') return

    let active = true
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!active || isHovered) return
      // beta: front-to-back tilt (-180 to 180), gamma: left-to-right tilt (-90 to 90)
      if (e.beta === null || e.gamma === null) return

      // Resting posture is roughly 45 degrees upright
      const tiltX = Math.max(-maxTilt, Math.min(maxTilt, (e.beta - 45) * 0.25))
      const tiltY = Math.max(-maxTilt, Math.min(maxTilt, e.gamma * 0.25))

      setRotateX(-tiltX)
      setRotateY(tiltY)
      setGlarePos({
        x: Math.max(0, Math.min(100, 50 + (e.gamma / 45) * 40)),
        y: Math.max(0, Math.min(100, 50 + ((e.beta - 45) / 45) * 40)),
      })
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    }

    return () => {
      active = false
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation)
      }
    }
  }, [gyroEnabled, reducedMotion, isHovered, maxTilt])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const clientX = e.clientX
      const clientY = e.clientY

      if (rafId.current) cancelAnimationFrame(rafId.current)

      rafId.current = requestAnimationFrame(() => {
        const x = clientX - rect.left
        const y = clientY - rect.top

        const normX = Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5))
        const normY = Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5))

        const rX = -(normY * maxTilt * 2)
        const rY = normX * maxTilt * 2

        setRotateX(rX)
        setRotateY(rY)
        setGlarePos({
          x: (normX + 0.5) * 100,
          y: (normY + 0.5) * 100,
        })
      })
    },
    [maxTilt, reducedMotion]
  )

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsHovered(true)
      onPointerEnter?.(e)
    },
    [onPointerEnter]
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsHovered(false)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      setRotateX(0)
      setRotateY(0)
      onPointerLeave?.(e)
    },
    [onPointerLeave]
  )

  const transformStyle = reducedMotion
    ? undefined
    : {
        transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${isHovered ? '8px' : '0px'}) scale3d(${isHovered ? scale : 1}, ${isHovered ? scale : 1}, 1)`,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1)'
          : 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d' as const,
      }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={transformStyle}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Specular Glass Glare Overlay */}
      {glare && !reducedMotion && (
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${
              isHovered ? maxGlareOpacity : 0
            }) 0%, rgba(255, 255, 255, 0) 65%)`,
            transition: isHovered ? 'opacity 0.15s ease-out' : 'opacity 0.45s ease-out',
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-20 mix-blend-overlay"
        />
      )}
    </div>
  )
}
