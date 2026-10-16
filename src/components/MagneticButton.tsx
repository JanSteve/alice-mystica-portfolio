import React, { useRef, useState } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  ariaLabel?: string
  role?: string
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.28,
  onClick,
  ariaLabel,
  role = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply physics on devices with fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    setOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseEnter = () => {
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      role={role}
      aria-label={ariaLabel}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
        }
      }}
      style={{
        transform: `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
          : 'transform 0.6s cubic-bezier(0.2, 1, 0.3, 1)',
      }}
      className={`inline-block will-change-transform cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#efeee9] ${className}`}
    >
      {children}
    </div>
  )
}

export default MagneticButton
