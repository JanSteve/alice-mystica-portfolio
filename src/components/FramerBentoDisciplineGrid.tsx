import React, { useState } from 'react'
import {
  Sparkles,
  Music,
  Camera,
  Video,
  BookOpen,
  Palette,
  Mic,
  Sliders,
  Play,
  Pause,
  ArrowUpRight,
  Eye,
  Disc3,
  Layers,
  HeartHandshake
} from 'lucide-react'
import { boutiqueSoundEngine } from '../audio/AllTheStarsSoundscape'

export interface CreativeInterest {
  number: string
  title: string
  category: string
  desc: string
  quote: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

interface FramerBentoDisciplineGridProps {
  interests: CreativeInterest[]
  isPlayingSound?: boolean
  onToggleSound?: () => void
  onLaunchVlog?: () => void
  onViewPhotoWall?: () => void
  onPlayTick?: () => void
}

type FilterCategory = 'all' | 'words' | 'sonic' | 'visual'

interface FilterOption {
  id: FilterCategory
  label: string
  count: number
}

export function FramerBentoDisciplineGrid({
  interests,
  isPlayingSound = false,
  onToggleSound,
  onLaunchVlog,
  onViewPhotoWall,
  onPlayTick,
}: FramerBentoDisciplineGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All Disciplines (8)', count: 8 },
    { id: 'words', label: 'Words & Leadership', count: 2 },
    { id: 'sonic', label: 'Sonic & Motion', count: 2 },
    { id: 'visual', label: 'Visual & Aesthetics', count: 4 },
  ]

  const isIncluded = (num: string): boolean => {
    switch (activeFilter) {
      case 'words':
        return num === '01' || num === '08'
      case 'sonic':
        return num === '02' || num === '07'
      case 'visual':
        return num === '03' || num === '04' || num === '05' || num === '06'
      case 'all':
      default:
        return true
    }
  }

  const handleFilterClick = (filterId: FilterCategory) => {
    if (filterId === activeFilter) return
    if (onPlayTick) onPlayTick()
    setActiveFilter(filterId)
  }

  const filteredInterests = interests.filter((item) => isIncluded(item.number))

  return (
    <div className="space-y-8">
      {/* Bento Showcase Header & Category Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#efeee9]/15">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#ffaa22] font-mono">
              Interactive Bento Catalog
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/10 text-[#efeee9]/70 border border-[#efeee9]/15">
              8 Dimensions
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-light text-[#efeee9] tracking-tight">
            Creative Disciplines &bull; Framer Grid
          </h3>
          <p className="text-sm text-[#efeee9]/65 max-w-xl mt-2 font-light leading-relaxed">
            Dynamic reconfigurable bento showcase with tactile category filtering, authentic media widgets, and spring transitions.
          </p>
        </div>

        {/* Filter Navigation Matrix */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-black/60 backdrop-blur-md rounded-full border border-[#efeee9]/15 shadow-inner">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleFilterClick(opt.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#efeee9] text-black font-semibold shadow-md scale-[1.02]'
                    : 'text-[#efeee9]/70 hover:text-[#efeee9] hover:bg-white/10'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Asymmetric 4-Column Responsive Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(190px,auto)]">
        {filteredInterests.map((interest) => {
          const Icon = interest.icon
          const num = interest.number

          // 1. Hero Bento Card: 02 Music & Discovery (Spans 2 columns)
          if (num === '02') {
            return (
              <div
                key={num}
                className="group lg:col-span-2 p-7 bg-gradient-to-br from-[#121210] to-[#1c180e] border border-[#ffaa22]/30 hover:border-[#ffaa22]/80 rounded-2xl shadow-xl hover:shadow-[0_0_35px_rgba(255,170,34,0.15)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Background Vinyl Groove Watermark */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border border-[#ffaa22]/10 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute -right-4 -bottom-4 w-36 h-36 rounded-full border border-[#ffaa22]/15 pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-[#ffaa22]/20 text-[#ffaa22] border border-[#ffaa22]/30 font-bold">
                        02 / HERO BENTO
                      </span>
                      <span className="text-[11px] font-mono text-[#efeee9]/50 uppercase tracking-widest">
                        {interest.category}
                      </span>
                    </div>
                    <Disc3 size={20} className={`text-[#ffaa22] ${isPlayingSound ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                  </div>

                  <h4 className="text-2xl font-light text-[#efeee9] group-hover:text-[#ffaa22] transition-colors">
                    {interest.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#efeee9]/75 font-light leading-relaxed">
                    {interest.desc}
                  </p>
                </div>

                {/* Live Mini Waveform Visualizer & Play Trigger */}
                <div className="pt-5 mt-4 border-t border-[#efeee9]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono tracking-widest text-[#ffaa22] mr-2">EQUALIZER</span>
                    {[0.6, 0.9, 0.4, 0.7, 1.0, 0.5, 0.8, 0.4].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full bg-[#ffaa22] transition-all duration-200 ${
                          isPlayingSound ? 'animate-pulse' : 'opacity-40'
                        }`}
                        style={{
                          height: isPlayingSound ? `${Math.max(6, h * 24)}px` : '8px',
                          animationDelay: `${i * 90}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {onToggleSound && (
                    <button
                      type="button"
                      data-cursor="play"
                      onClick={onToggleSound}
                      className="px-4 py-2 rounded-full bg-[#efeee9] hover:bg-[#ffaa22] text-black text-xs font-mono tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                    >
                      {isPlayingSound ? (
                        <>
                          <Pause size={12} className="fill-current" />
                          <span>PAUSE SOUNDSCAPE</span>
                        </>
                      ) : (
                        <>
                          <Play size={12} className="fill-current ml-0.5" />
                          <span>EXPERIENCE TRACK</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )
          }

          // 2. Tall Bento Card: 06 Archive Photography (Spans 1 col x 2 rows in 'all' mode)
          if (num === '06') {
            return (
              <div
                key={num}
                className={`group p-7 bg-[#111111] border border-[#efeee9]/20 hover:border-[#efeee9]/70 rounded-2xl shadow-xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden ${
                  activeFilter === 'all' ? 'lg:col-span-1 lg:row-span-2' : 'lg:col-span-2'
                }`}
              >
                {/* Viewfinder Target Markings */}
                <div className="absolute top-4 right-4 font-mono text-[9px] text-[#efeee9]/40 tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>VIEWFINDER</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-white/10 text-[#efeee9]/70 font-semibold">
                      06
                    </span>
                    <span className="text-[11px] font-mono text-[#efeee9]/50 uppercase tracking-widest">
                      {interest.category}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-light text-[#efeee9] group-hover:text-[#ffaa22] transition-colors">
                    {interest.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#efeee9]/75 font-light leading-relaxed">
                    {interest.desc}
                  </p>

                  {/* Optical Digicam Sensor Spec Box */}
                  <div className="p-3.5 bg-black/60 rounded-xl border border-[#efeee9]/10 font-mono text-[10px] space-y-1.5 text-[#efeee9]/70">
                    <div className="flex justify-between">
                      <span className="text-[#efeee9]/40">MEDIUM:</span>
                      <span className="text-[#efeee9]">CCD Digital Sensor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#efeee9]/40">COLOR:</span>
                      <span className="text-[#ffaa22]">2000s Amber Tone</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#efeee9]/40">FRAMES:</span>
                      <span className="text-emerald-400">5 Authentic Cuts</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#efeee9]/10 mt-4 space-y-3">
                  <div className="text-xs text-[#efeee9]/60 italic font-serif">
                    &ldquo;{interest.quote}&rdquo;
                  </div>
                  {onViewPhotoWall && (
                    <button
                      type="button"
                      data-cursor="zoom"
                      onClick={onViewPhotoWall}
                      className="w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/15 border border-[#efeee9]/15 text-[#efeee9] text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Eye size={12} className="text-[#ffaa22]" />
                      <span>INSPECT ARCHIVAL WALL</span>
                    </button>
                  )}
                </div>
              </div>
            )
          }

          // 3. Wide Bento Card: 07 Vlogging & Digital Storytelling (Spans 2 columns)
          if (num === '07') {
            return (
              <div
                key={num}
                className="group lg:col-span-2 p-7 bg-[#131313] border border-[#efeee9]/20 hover:border-[#efeee9]/60 rounded-2xl shadow-xl transition-all duration-500 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-white/10 text-[#efeee9]/70 font-semibold">
                        07
                      </span>
                      <span className="text-[11px] font-mono text-[#efeee9]/50 uppercase tracking-widest">
                        {interest.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      1080p 24FPS
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-light text-[#efeee9] group-hover:text-[#ffaa22] transition-colors">
                    {interest.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#efeee9]/75 font-light leading-relaxed">
                    {interest.desc}
                  </p>
                </div>

                {/* Cinematic Progress Bar & Link to Vlog Spotlight */}
                <div className="pt-4 mt-4 border-t border-[#efeee9]/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#efeee9]/50">
                    <span>TIMELINE: 02:44 / 03:52</span>
                  </div>
                  {onLaunchVlog && (
                    <button
                      type="button"
                      data-cursor="magnetic"
                      onClick={onLaunchVlog}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#efeee9] text-[#efeee9] hover:text-black text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>VLOG PLAYER</span>
                      <ArrowUpRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            )
          }

          // 4. Standard Curated Cards: 01, 03, 04, 05, 08
          return (
            <div
              key={num}
              className="group p-6 bg-black/45 border border-[#efeee9]/15 hover:border-[#efeee9]/50 hover:bg-black/70 rounded-2xl shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-white/5 text-[#efeee9]/60 font-semibold">
                      {num}
                    </span>
                    <span className="text-[10px] font-mono text-[#efeee9]/40 uppercase tracking-widest">
                      {interest.category}
                    </span>
                  </div>
                  <Icon size={16} className="text-[#efeee9]/40 group-hover:text-[#ffaa22] group-hover:scale-110 transition-all" />
                </div>

                <h4 className="text-lg font-normal text-[#efeee9] group-hover:text-[#efeee9] transition-colors">
                  {interest.title}
                </h4>

                <p className="text-xs sm:text-sm text-[#efeee9]/70 font-light leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                  {interest.desc}
                </p>
              </div>

              {/* Unique Accents per discipline */}
              <div className="pt-4 border-t border-[#efeee9]/10 mt-4">
                {num === '01' && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#efeee9]/45">
                    <BookOpen size={11} className="text-[#ffaa22]" />
                    <span>Ruled Moleskine Archives</span>
                  </div>
                )}
                {num === '03' && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#efeee9]" title="Cream 01" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffaa22]" title="Amber Quartz" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" title="Crimson Hero" />
                    <span className="text-[10px] font-mono text-[#efeee9]/40 ml-1">Color Theory</span>
                  </div>
                )}
                {num === '04' && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#efeee9]/45">
                    <Sparkles size={11} className="text-rose-400" />
                    <span>Editorial Luminance</span>
                  </div>
                )}
                {num === '05' && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#efeee9]/45">
                    <Layers size={11} className="text-sky-400" />
                    <span>Architectural Silhouette</span>
                  </div>
                )}
                {num === '08' && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#efeee9]/45">
                    <Mic size={11} className="text-amber-400" />
                    <span>Acoustic Projection &bull; Clarity</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
