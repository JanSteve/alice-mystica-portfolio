import React, { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Video,
  Volume2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'
import { AudioSpectrumCanvas } from './AudioSpectrumCanvas'
import { triggerHaptic } from '../utils/haptics'

export interface CreativeInterest {
  number: string
  title: string
  category: string
  desc: string
  quote: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

interface ScrollStoppingInterestsProps {
  interests: CreativeInterest[]
  isPlayingSound: boolean
  onToggleSound: () => void
  onLaunchVlog: () => void
  onPlayTick: () => void
}

export function ScrollStoppingInterests({
  interests,
  isPlayingSound,
  onToggleSound,
  onLaunchVlog,
  onPlayTick,
}: ScrollStoppingInterestsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [maxTranslate, setMaxTranslate] = useState(0)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)

  // Measure max horizontal translate distance
  const updateMetrics = () => {
    const track = trackRef.current
    if (track) {
      const scrollDist = track.scrollWidth - window.innerWidth + 80
      setMaxTranslate(Math.max(0, scrollDist))
    }
  }

  // Vertical scroll driven horizontal progression
  useEffect(() => {
    updateMetrics()
    window.addEventListener('resize', updateMetrics)

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => updateMetrics())
      : null

    if (trackRef.current && resizeObserver) resizeObserver.observe(trackRef.current)
    if (containerRef.current && resizeObserver) resizeObserver.observe(containerRef.current)

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const container = containerRef.current
          if (container) {
            const rect = container.getBoundingClientRect()
            const totalScrollable = rect.height - window.innerHeight
            if (totalScrollable > 0) {
              const currentProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable))
              setProgress(currentProgress)

              // Determine which card is currently active (0 to 7)
              const cardIdx = Math.min(
                interests.length - 1,
                Math.floor(currentProgress * interests.length)
              )
              setActiveCardIndex(cardIdx)
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('resize', updateMetrics)
      window.removeEventListener('scroll', handleScroll)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [interests.length])

  // Click card pill to jump scroll position to that exact card
  const jumpToCard = (index: number) => {
    onPlayTick()
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const containerTop = window.scrollY + containerRect.top
    const totalScrollable = container.offsetHeight - window.innerHeight
    const targetProgress = index / (interests.length - 1)
    const targetScrollY = containerTop + targetProgress * totalScrollable
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    })
  }

  const stepCard = (delta: number) => {
    const nextIdx = Math.max(0, Math.min(interests.length - 1, activeCardIndex + delta))
    jumpToCard(nextIdx)
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[360vh] sm:h-[420vh] bg-transparent border-b border-[#efeee9]/10"
    >
      {/* Sticky Viewport-Locked Frame */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-between py-5 sm:py-7 px-4 sm:px-10 lg:px-16 bg-[#0c0c0c]/85 backdrop-blur-xs">
        {/* Top Header: Badge, Title, Real-time Card Counter & Progress Scrub Bar */}
        <div className="space-y-3 z-10 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#efeee9]/60">
                  02 / Curation &amp; Disciplines &bull; Pinned Storyline
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#efeee9]">
                THE EIGHT CREATIVE INTERESTS
              </h2>
            </div>

            {/* Active Card Indicator */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-[#efeee9]/20 text-xs font-mono uppercase tracking-widest text-[#efeee9] flex items-center gap-2">
                <span className="text-indigo-400 font-bold">{interests[activeCardIndex].number}</span>
                <span className="opacity-40">|</span>
                <span className="truncate max-w-[170px] sm:max-w-[220px]">
                  {interests[activeCardIndex].title}
                </span>
                <span className="opacity-40">|</span>
                <span className="text-[#efeee9]/50">08</span>
              </div>

              {/* Prev / Next Stepper buttons */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => stepCard(-1)}
                  disabled={activeCardIndex === 0}
                  aria-label="Previous discipline card"
                  className="p-2 rounded-full border border-[#efeee9]/20 bg-white/5 hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => stepCard(1)}
                  disabled={activeCardIndex === interests.length - 1}
                  aria-label="Next discipline card"
                  className="p-2 rounded-full border border-[#efeee9]/20 bg-white/5 hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Dual Scrub Bar + Interactive Index Navigation Pills */}
          <div className="space-y-2 pt-1">
            {/* Visual Scrub Track */}
            <div className="h-[2px] w-full bg-[#efeee9]/15 overflow-hidden rounded-full">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-[#efeee9] to-indigo-300 origin-left shadow-[0_0_8px_rgba(99,102,241,0.8)] will-change-transform"
                style={{
                  transform: `scaleX(${progress})`,
                  transition: 'transform 0.05s ease-out',
                }}
              />
            </div>

            {/* Quick-Jump Discipline Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {interests.map((item, idx) => {
                const isActive = activeCardIndex === idx
                return (
                  <button
                    key={item.number}
                    onClick={() => jumpToCard(idx)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#efeee9] text-black font-semibold shadow-md scale-105'
                        : 'bg-white/5 text-[#efeee9]/60 hover:text-[#efeee9] hover:bg-white/10 border border-[#efeee9]/10'
                    }`}
                  >
                    {item.number} {item.title.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle: Horizontal Pinned Cards Track */}
        <div
          className="relative w-full overflow-visible my-auto py-2"
          onTouchStart={(e) => {
            touchStartPos.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
            }
          }}
          onTouchEnd={(e) => {
            if (touchStartPos.current !== null) {
              const deltaX = e.changedTouches[0].clientX - touchStartPos.current.x
              const deltaY = e.changedTouches[0].clientY - touchStartPos.current.y
              if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
                if (deltaX < 0) stepCard(1)
                else stepCard(-1)
              }
            }
            touchStartPos.current = null
          }}
        >
          <div
            ref={trackRef}
            style={{
              transform: `translate3d(-${(progress * maxTranslate).toFixed(1)}px, 0, 0)`,
              transition: 'transform 0.08s ease-out',
            }}
            className="flex items-stretch gap-6 sm:gap-8 will-change-transform pr-12 select-none"
          >
            {interests.map((item, index) => {
              const IconComponent = item.icon
              const isCurrent = activeCardIndex === index

              return (
                <div
                  key={item.number}
                  className={`w-[85vw] sm:w-[500px] lg:w-[540px] shrink-0 p-6 sm:p-9 rounded-2xl border transition-all duration-500 flex flex-col justify-between h-[52vh] sm:h-[54vh] relative overflow-hidden backdrop-blur-xl ${
                    isCurrent
                      ? 'bg-[#151515]/95 border-[#efeee9]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(99,102,241,0.15)] scale-[1.01]'
                      : 'bg-[#111111]/80 border-[#efeee9]/15 hover:border-[#efeee9]/40 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Subtle Background Watermark Number */}
                  <span className="absolute -bottom-6 -right-3 text-[110px] sm:text-[140px] font-mono font-bold text-white/[0.03] select-none pointer-events-none leading-none">
                    {item.number}
                  </span>

                  {/* Card Top: Number, Category, and Icon */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#efeee9]/15">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold px-2.5 py-0.5 rounded bg-white/10 text-[#efeee9]">
                          {item.number}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#efeee9]/60">
                          {item.category}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-full border transition-transform duration-300 ${
                        isCurrent
                          ? 'bg-[#efeee9] text-black border-[#efeee9] scale-110 shadow-md'
                          : 'bg-white/5 text-[#efeee9]/70 border-[#efeee9]/20'
                      }`}>
                        <IconComponent size={20} strokeWidth={1.75} />
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-[#efeee9]">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#efeee9]/80 font-light leading-relaxed line-clamp-4 sm:line-clamp-5">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Bottom: Quote & Special Action buttons */}
                  <div className="pt-4 border-t border-[#efeee9]/15 space-y-3 z-10">
                    <div className="text-xs sm:text-sm italic font-serif text-[#efeee9]/90 pl-3 border-l-2 border-indigo-400">
                      &ldquo;{item.quote}&rdquo;
                    </div>

                    {/* Special Feature Integration for Interest 02 (Music & Soundscape) */}
                    {item.number === '02' && (
                      <div className="space-y-2.5">
                        <AudioSpectrumCanvas
                          height={68}
                          accent="indigo"
                          isPlaying={isPlayingSound}
                          onTogglePlay={onToggleSound}
                          showControls={true}
                        />
                        <button
                          onClick={() => {
                            triggerHaptic('medium')
                            onToggleSound()
                          }}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-400/40 bg-indigo-500/10 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider active:scale-95"
                        >
                          <Volume2 size={13} className="text-indigo-400" />
                          <span>{isPlayingSound ? 'Pause All The Stars [Boutique Mix]' : 'Play All The Stars [Boutique Mix]'}</span>
                        </button>
                      </div>
                    )}

                    {/* Special Feature Integration for Interest 07 (Vlogging & Digital Storytelling) */}
                    {item.number === '07' && (
                      <button
                        onClick={onLaunchVlog}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-red-500/40 bg-red-500/10 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider animate-pulse"
                      >
                        <Video size={13} className="text-red-400" />
                        <span>Launch Cinematic Vlog Frame &rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Bar: Pinned Scroll-Stop Indicator & Affordance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 z-10 shrink-0 text-xs font-mono text-[#efeee9]/50 select-none pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SCROLL-STOPPING PINNED TRACK: Vertical scroll scrubs horizontal story</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block">Progress: {Math.round(progress * 100)}%</span>
            <span className="opacity-40 hidden sm:inline-block">&bull;</span>
            <span>&larr; Drag or swipe cards &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollStoppingInterests
