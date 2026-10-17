import React from 'react'
import { Sparkles, Sun, Moon, Zap, Camera, Check } from 'lucide-react'

export type DigicamFilter = 'original' | 'vintage-ccd' | 'noir-monolith' | 'flash-glow'

export interface DigicamFilterOption {
  id: DigicamFilter
  name: string
  shortLabel: string
  tag: string
  description: string
  filterClass: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export const DIGICAM_FILTERS: DigicamFilterOption[] = [
  {
    id: 'original',
    name: 'Original Digicam',
    shortLabel: 'Original',
    tag: 'CCD RAW',
    description: 'Pristine digital capture baseline with neutral white balance',
    filterClass: 'filter-digicam-original',
    icon: Camera,
  },
  {
    id: 'vintage-ccd',
    name: 'Vintage CCD Warmth',
    shortLabel: 'CCD Warm',
    tag: '2000s WARM',
    description: 'Rich amber/golden bias with nostalgic nostalgic skin tones',
    filterClass: 'filter-digicam-vintage-ccd',
    icon: Sun,
  },
  {
    id: 'noir-monolith',
    name: 'High-Contrast Noir',
    shortLabel: 'Noir B&W',
    tag: 'SILVER GELATIN',
    description: 'Deep archival monochrome with crushed shadows and crisp editorial contrast',
    filterClass: 'filter-digicam-noir-monolith',
    icon: Moon,
  },
  {
    id: 'flash-glow',
    name: '2000s Flash Glow',
    shortLabel: 'Flash Glow',
    tag: 'XENON BLOOM',
    description: 'Direct xenon flash bloom with radiant highlight halation',
    filterClass: 'filter-digicam-flash-glow',
    icon: Zap,
  },
]

export function getDigicamFilterClass(filter: DigicamFilter): string {
  switch (filter) {
    case 'vintage-ccd':
      return 'filter-digicam-vintage-ccd'
    case 'noir-monolith':
      return 'filter-digicam-noir-monolith'
    case 'flash-glow':
      return 'filter-digicam-flash-glow'
    case 'original':
    default:
      return 'filter-digicam-original'
  }
}

interface DigicamFilterSwitcherProps {
  currentFilter: DigicamFilter
  onFilterChange: (filter: DigicamFilter) => void
  onPlayTick?: () => void
  compact?: boolean
  className?: string
}

export function DigicamFilterSwitcher({
  currentFilter,
  onFilterChange,
  onPlayTick,
  compact = false,
  className = '',
}: DigicamFilterSwitcherProps) {
  const handleSelect = (filterId: DigicamFilter) => {
    if (filterId === currentFilter) return
    if (onPlayTick) onPlayTick()
    onFilterChange(filterId)
    try {
      localStorage.setItem('alice_digicam_sensor_filter', filterId)
    } catch {
      // Ignore localStorage issues
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-full border border-[#efeee9]/20 shadow-lg ${className}`}>
        {DIGICAM_FILTERS.map((f) => {
          const Icon = f.icon
          const isActive = currentFilter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => handleSelect(f.id)}
              title={`${f.name} — ${f.description}`}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#efeee9] text-black font-semibold shadow-xs'
                  : 'text-[#efeee9]/70 hover:text-[#efeee9] hover:bg-white/10'
              }`}
            >
              <Icon size={11} className={isActive ? 'text-black' : 'text-[#ffaa22]'} />
              <span>{f.shortLabel}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Switcher Header Label */}
      <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-[#efeee9]/60 px-1">
        <span className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#ffaa22]" />
          <span>Digicam Sensor Shaders</span>
        </span>
        <span className="text-[10px] text-[#ffaa22]">0.000 CLS &bull; GPU CSS</span>
      </div>

      {/* 4-Mode Tactile Matrix Pill Group */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-[#efeee9]/15 shadow-xl">
        {DIGICAM_FILTERS.map((f) => {
          const Icon = f.icon
          const isActive = currentFilter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => handleSelect(f.id)}
              className={`group relative text-left p-2.5 rounded-lg border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#efeee9] text-black border-[#efeee9] shadow-md scale-[1.01]'
                  : 'bg-white/[0.03] text-[#efeee9]/80 border-transparent hover:border-[#efeee9]/25 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-xs ${
                  isActive ? 'bg-black text-[#efeee9]' : 'bg-white/10 text-[#efeee9]/60'
                }`}>
                  {f.tag}
                </span>
                <Icon size={13} className={isActive ? 'text-black' : 'text-[#ffaa22] group-hover:scale-110 transition-transform'} />
              </div>
              <div>
                <div className="text-xs font-medium tracking-tight flex items-center justify-between">
                  <span>{f.shortLabel}</span>
                  {isActive && <Check size={11} className="text-black" />}
                </div>
                <p className={`text-[10px] leading-tight mt-0.5 font-light line-clamp-1 ${
                  isActive ? 'text-black/75' : 'text-[#efeee9]/50'
                }`}>
                  {f.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
