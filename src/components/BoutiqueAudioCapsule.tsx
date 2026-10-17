import React, { useState, useEffect, useRef } from 'react'
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Disc3,
  Sliders,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { boutiqueSoundEngine, EqualizerLevels, STORAGE_KEY_VOLUME } from '../audio/AllTheStarsSoundscape'
import { AudioSpectrumCanvas } from './AudioSpectrumCanvas'
import { triggerHaptic } from '../utils/haptics'

interface BoutiqueAudioCapsuleProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onPlayTick?: () => void
}

const getHydratedVolume = (): number => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VOLUME)
      if (stored !== null) {
        const parsed = parseFloat(stored)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          return Math.round(parsed * 100)
        }
      }
    } catch {}
  }
  return Math.round((boutiqueSoundEngine.volume ?? 0.55) * 100)
}

export function BoutiqueAudioCapsule({
  isPlaying,
  onTogglePlay,
  onPlayTick,
}: BoutiqueAudioCapsuleProps) {
  const [volume, setVolume] = useState<number>(getHydratedVolume)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(() => getHydratedVolume() === 0)
  const [prevVolume, setPrevVolume] = useState<number>(() => {
    const init = getHydratedVolume()
    return init > 0 ? init : 55
  })
  const [eqLevels, setEqLevels] = useState<EqualizerLevels>({
    bar1: 0.18,
    bar2: 0.28,
    bar3: 0.22,
    bar4: 0.18,
    beatIntensity: 0.2,
  })

  // Poll real-time equalizer levels when playing
  useEffect(() => {
    if (!isPlaying) return
    let animId: number
    const update = () => {
      const levels = boutiqueSoundEngine.getEqualizerLevels()
      setEqLevels(levels)
      animId = requestAnimationFrame(update)
    }
    animId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animId)
  }, [isPlaying])

  // Close expanded capsule on Escape key
  useEffect(() => {
    if (!isExpanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isExpanded])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    setVolume(val)
    if (val > 0 && isMuted) {
      setIsMuted(false)
    }
    boutiqueSoundEngine.setVolume(val / 100)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPlayTick?.()
    if (isMuted) {
      setIsMuted(false)
      const restored = prevVolume > 0 ? prevVolume : 55
      setVolume(restored)
      boutiqueSoundEngine.setVolume(restored / 100)
    } else {
      setPrevVolume(volume > 0 ? volume : (prevVolume > 0 ? prevVolume : 55))
      setIsMuted(true)
      setVolume(0)
      boutiqueSoundEngine.setVolume(0)
    }
  }

  return (
    <div
      role="region"
      aria-label="Boutique background music player"
      className="fixed bottom-[calc(5.2rem+env(safe-area-inset-bottom,0px))] right-3 sm:bottom-6 sm:right-6 z-40 select-none font-hn"
    >
      <div
        className={`transition-all duration-400 ease-out border backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden ${
          isExpanded
            ? 'w-[calc(100vw-1.5rem)] sm:w-[360px] max-h-[85vh] overflow-y-auto bg-[#0f0f0f]/95 border-[#efeee9]/25 p-4'
            : 'w-auto bg-[#111111]/90 hover:bg-[#141414]/95 border-[#efeee9]/20 hover:border-[#efeee9]/40 p-2 sm:px-3 sm:py-2.5 rounded-full'
        }`}
      >
        {/* COLLAPSED PILL VIEW */}
        {!isExpanded && (
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Play/Pause Disc Trigger */}
            <button
              onClick={() => {
                onPlayTick?.()
                onTogglePlay()
              }}
              aria-label={isPlaying ? 'Pause All The Stars boutique audio' : 'Play All The Stars boutique audio'}
              className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all cursor-pointer min-h-[40px] min-w-[40px] ${
                isPlaying
                  ? 'bg-[#efeee9] text-black shadow-[0_0_20px_rgba(239,238,233,0.35)] scale-105'
                  : 'bg-white/10 text-[#efeee9] hover:bg-white/20'
              }`}
            >
              <Disc3
                size={18}
                className={`${isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '6s' }}
              />
              {isPlaying && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-[#111111]" />
              )}
            </button>

            {/* Track Info & Equalizer */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              onClick={() => {
                onPlayTick?.()
                setIsExpanded(true)
              }}
            >
              <div className="flex flex-col text-left max-w-[150px] sm:max-w-[190px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#efeee9]/60">
                    Boutique Audio
                  </span>
                  <span className="text-[9px] font-mono text-[#ffaa22] px-1 py-0.2 rounded bg-[#ffaa22]/10 border border-[#ffaa22]/20">
                    Bb Maj
                  </span>
                </div>
                <span className="text-xs text-[#efeee9] font-normal truncate">
                  All The Stars &bull; Kendrick &amp; SZA
                </span>
              </div>

              {/* 4-Bar Equalizer Visualizer */}
              <div className="flex items-end gap-[2.5px] h-4 w-4 justify-center">
                <span
                  className="w-[2.5px] bg-[#efeee9] rounded-full transition-all duration-75"
                  style={{
                    height: isPlaying ? `${Math.round(eqLevels.bar1 * 16)}px` : '3px',
                    opacity: isPlaying ? 0.95 : 0.4,
                  }}
                />
                <span
                  className="w-[2.5px] bg-[#efeee9] rounded-full transition-all duration-75"
                  style={{
                    height: isPlaying ? `${Math.round(eqLevels.bar2 * 16)}px` : '3px',
                    opacity: isPlaying ? 0.95 : 0.4,
                  }}
                />
                <span
                  className="w-[2.5px] bg-[#efeee9] rounded-full transition-all duration-75"
                  style={{
                    height: isPlaying ? `${Math.round(eqLevels.bar3 * 16)}px` : '3px',
                    opacity: isPlaying ? 0.95 : 0.4,
                  }}
                />
                <span
                  className="w-[2.5px] bg-[#efeee9] rounded-full transition-all duration-75"
                  style={{
                    height: isPlaying ? `${Math.round(eqLevels.bar4 * 16)}px` : '3px',
                    opacity: isPlaying ? 0.95 : 0.4,
                  }}
                />
              </div>

              {/* Expand Chevron */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPlayTick?.()
                  setIsExpanded(true)
                }}
                aria-label="Expand boutique audio controls"
                className="p-1 text-[#efeee9]/60 hover:text-[#efeee9] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              >
                <ChevronUp size={15} />
              </button>
            </div>
          </div>
        )}

        {/* EXPANDED FULL BOUTIQUE CAPSULE */}
        {isExpanded && (
          <div className="space-y-3.5">
            {/* Header with Title and Minimize */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#efeee9]/15">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#efeee9]/70">
                  Curated Boutique Soundscape
                </span>
              </div>
              <button
                onClick={() => {
                  onPlayTick?.()
                  setIsExpanded(false)
                }}
                aria-label="Collapse audio capsule"
                className="p-1 text-[#efeee9]/60 hover:text-[#efeee9] rounded-full hover:bg-white/5 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Song Meta & Cover Vinyl Graphic */}
            <div className="flex items-center gap-3.5 bg-black/40 p-3 rounded-xl border border-[#efeee9]/10">
              {/* Spinning Gold Disc */}
              <div
                className={`relative h-12 w-12 rounded-full bg-gradient-to-tr from-[#1a1a1a] via-[#2d2d2d] to-[#141414] border border-[#ffaa22]/40 shadow-inner flex items-center justify-center shrink-0 ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '7s' }}
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-1.5 rounded-full border border-white/5" />
                <div className="absolute inset-3 rounded-full border border-white/10" />
                <div className="h-4 w-4 rounded-full bg-[#ffaa22] flex items-center justify-center shadow-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-black" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#ffaa22] tracking-wider uppercase font-semibold">
                    Black Panther OST
                  </span>
                  <span className="text-[9px] font-mono text-[#efeee9]/40 tracking-widest">
                    97 BPM
                  </span>
                </div>
                <h4 className="text-sm font-normal text-[#efeee9] truncate">
                  All The Stars
                </h4>
                <p className="text-[11px] text-[#efeee9]/70 font-light truncate">
                  Kendrick Lamar &amp; SZA &bull; Boutique Acoustic Mix
                </p>
              </div>
            </div>

            {/* Acoustic Room Setting Note */}
            <div className="bg-white/5 px-3 py-2 rounded-lg border border-[#efeee9]/10 flex items-center justify-between text-[11px] font-mono text-[#efeee9]/70">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#ffaa22]" />
                <span>Upscale Boutique Filter &bull; 3.4kHz</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Warm &bull; Minimal</span>
            </div>

            {/* Live Web Audio Real-Time Spectrum Canvas */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/60 px-0.5">
                <span>Real-Time Spectrum</span>
                <span className="text-[#ffaa22]">Web Audio API</span>
              </div>
              <AudioSpectrumCanvas
                height={74}
                accent="amber"
                isPlaying={isPlaying}
                onTogglePlay={onTogglePlay}
                showControls={true}
              />
            </div>

            {/* Volume Slider & Controls */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono text-[#efeee9]/70">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                  className="flex items-center gap-1.5 hover:text-[#efeee9] transition-colors cursor-pointer min-h-[36px]"
                >
                  {isMuted || volume === 0 ? (
                    <>
                      <VolumeX size={15} className="text-red-400" />
                      <span className="text-[11px] uppercase tracking-wider text-red-400">Muted</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={15} />
                      <span className="text-[11px] uppercase tracking-wider">Volume</span>
                    </>
                  )}
                </button>
                <span className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded text-[#efeee9]">
                  {isMuted ? '0%' : `${volume}%`}
                </span>
              </div>

              {/* Native Accessible Range Slider */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Master volume percentage"
                  className="w-full h-1.5 bg-[#efeee9]/20 rounded-lg appearance-none cursor-pointer accent-[#efeee9]"
                />
              </div>
            </div>

            {/* Action Bar (Play/Pause Toggle & Live Equalizer) */}
            <div className="flex items-center justify-between pt-2 border-t border-[#efeee9]/15">
              <button
                onClick={() => {
                  onPlayTick?.()
                  onTogglePlay()
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                  isPlaying
                    ? 'bg-[#efeee9] text-black font-medium shadow-md'
                    : 'bg-white/10 text-[#efeee9] hover:bg-white/20'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause size={14} fill="currentColor" />
                    <span>Pause Soundscape</span>
                  </>
                ) : (
                  <>
                    <Play size={14} fill="currentColor" />
                    <span>Play Boutique Mix</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
