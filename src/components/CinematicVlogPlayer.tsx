import React, { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Tv,
  Film,
  Sparkles,
  ChevronRight,
  Battery,
  SlidersHorizontal,
  X
} from 'lucide-react'

export interface VlogScene {
  id: string
  title: string
  location: string
  durationSec: number
  photoUrl: string
  caption: string
  tags: string[]
}

const VLOG_SCENES: VlogScene[] = [
  {
    id: 'scene-01',
    title: 'Episode 01: Noir Illumination & Studio Presence',
    location: 'Bangalore Studio & Creative Workspace',
    durationSec: 42,
    photoUrl: '/assets/alice_hero_red.png',
    caption: 'Exploring dramatic red illumination, camera presence, and visual storytelling as creative expression.',
    tags: ['Noir Lighting', 'Creative Persona', 'Studio Reel'],
  },
  {
    id: 'scene-02',
    title: 'Episode 02: Coffee, Laughter & Daily Reflection',
    location: 'Bengaluru Café & Urban Walk',
    durationSec: 36,
    photoUrl: '/assets/alice_smile_portrait.jpg',
    caption: 'Unrehearsed joy and spontaneous conversation — the candid rhythm of everyday life.',
    tags: ['Candid Expression', 'Joy', 'Digital Diary'],
  },
  {
    id: 'scene-03',
    title: 'Episode 03: Childhood Archives & 2020 Flashback',
    location: 'Home Archive • 27 Nov 2020',
    durationSec: 48,
    photoUrl: '/assets/alice_childhood_2020.jpg',
    caption: 'Digicam quartz memories — retracing innocent curiosity and the roots of creative observation.',
    tags: ['Digicam Sensor', 'Nostalgia', 'Roots'],
  },
  {
    id: 'scene-04',
    title: 'Episode 04: School Foundations & Academic Beginnings',
    location: 'School Assembly & Early Learning',
    durationSec: 38,
    photoUrl: '/assets/alice_school_uniform.jpg',
    caption: 'Neat uniform, lunchbox, and eyes full of wonder — discipline and curiosity shaping the journey.',
    tags: ['Foundations', 'Curiosity', 'School Days'],
  },
  {
    id: 'scene-05',
    title: 'Episode 05: Unfiltered Spark & Spontaneous Character',
    location: 'Childhood Chronicles & Family Living',
    durationSec: 45,
    photoUrl: '/assets/alice_childhood_playful.jpg',
    caption: 'Red sweatshirt, expressive laughter, and unapologetic character — staying playful through all stages of life.',
    tags: ['Spontaneity', 'Character', 'Authenticity'],
  },
]

interface CinematicVlogPlayerProps {
  isPlayingSound: boolean
  onToggleSound: () => void
  onPlayTick: () => void
}

export function CinematicVlogPlayer({
  isPlayingSound,
  onToggleSound,
  onPlayTick,
}: CinematicVlogPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0)
  const [currentTimeSec, setCurrentTimeSec] = useState(14)
  const [scanlinesActive, setScanlinesActive] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSpecs, setShowSpecs] = useState(false)

  const activeScene = VLOG_SCENES[currentSceneIdx]
  const totalDuration = VLOG_SCENES.reduce((acc, s) => acc + s.durationSec, 0)

  // Running playback clock
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        if (prev >= activeScene.durationSec) {
          // Advance to next scene automatically
          setCurrentSceneIdx((cur) => (cur + 1) % VLOG_SCENES.length)
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, activeScene.durationSec])

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mm = String(Math.floor(secs / 60)).padStart(2, '0')
    const ss = String(secs % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  // Format timecode HH:MM:SS:FF
  const formatTimecode = (secs: number) => {
    const hh = '00'
    const mm = String(Math.floor(secs / 60)).padStart(2, '0')
    const ss = String(secs % 60).padStart(2, '0')
    const frame = String((secs * 24) % 24).padStart(2, '0')
    return `${hh}:${mm}:${ss}:${frame}`
  }

  const togglePlay = () => {
    onPlayTick()
    setIsPlaying((prev) => !prev)
  }

  const selectScene = (idx: number) => {
    onPlayTick()
    setCurrentSceneIdx(idx)
    setCurrentTimeSec(0)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Editorial Section Subhead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#efeee9]/60">
                Discipline 07 Spotlight &bull; Cinematic Video Storytelling
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-light tracking-tight text-[#efeee9]">
              THE VLOGGING &amp; DIGITAL DOCUMENTATION FRAME
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#efeee9]/70 font-light max-w-md">
            Transforming ordinary college days, reflections, and behind-the-scenes moments into personal cinema.
          </p>
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-black rounded-2xl border border-[#efeee9]/20 overflow-hidden shadow-2xl select-none group">
          {/* Active Scene Media with Ken-Burns pan/zoom */}
          <div className="absolute inset-0 overflow-hidden bg-black">
            <img
              key={activeScene.id}
              src={activeScene.photoUrl}
              alt={activeScene.title}
              className={`w-full h-full object-cover object-center ${
                isPlaying ? 'anim-ken-burns' : ''
              }`}
            />
          </div>

          {/* Vignette & Contrast Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient opacity-50 pointer-events-none" />

          {/* CRT Retro Scanline Texture Overlay */}
          {scanlinesActive && (
            <div className="absolute inset-0 scanlines pointer-events-none z-10 opacity-70" />
          )}

          {/* Camcorder HUD — Top Bar */}
          <div className="absolute top-3 inset-x-3 sm:top-5 sm:inset-x-5 z-20 flex items-center justify-between text-[11px] font-mono text-[#efeee9]">
            {/* Blinking REC & Battery */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10">
              <span
                className={`w-2.5 h-2.5 rounded-full bg-red-500 ${
                  isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
              />
              <span className="font-bold text-red-400 tracking-wider">
                {isPlaying ? 'REC ●' : 'PAUSED'}
              </span>
              <span className="opacity-40">|</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <Battery size={13} />
                <span>86%</span>
              </div>
            </div>

            {/* Timecode Readout */}
            <div className="px-3 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 font-bold tracking-widest text-[#efeee9]">
              TC {formatTimecode(currentTimeSec)}
            </div>

            {/* Camera Technical Specs HUD */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-[#efeee9]/70 uppercase tracking-widest">
              <span>4K 24FPS</span>
              <span>&bull;</span>
              <span>PRORES 422 HQ</span>
              <span>&bull;</span>
              <span>ISO 320</span>
            </div>
          </div>

          {/* Center Play/Pause Watermark Button on Hover */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/70 backdrop-blur-md border border-[#efeee9]/30 text-[#efeee9] hover:bg-[#efeee9] hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer z-20 shadow-2xl"
          >
            {isPlaying ? (
              <Pause size={24} strokeWidth={2} />
            ) : (
              <Play size={24} strokeWidth={2} className="translate-x-0.5" />
            )}
          </button>

          {/* Camcorder HUD — Bottom Controls & Scrubber */}
          <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-5 z-20 space-y-2">
            {/* Scrubber Progress Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const pct = (e.clientX - rect.left) / rect.width
                setCurrentTimeSec(Math.round(pct * activeScene.durationSec))
              }}
              className="w-full h-1.5 bg-white/20 hover:h-2 transition-all rounded-full overflow-hidden cursor-pointer"
            >
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-[#efeee9]"
                style={{
                  width: `${(currentTimeSec / activeScene.durationSec) * 100}%`,
                }}
              />
            </div>

            {/* Bottom Bar: Scene Info, Audio Waveform & Player Buttons */}
            <div className="flex items-center justify-between gap-3 text-xs font-mono text-[#efeee9]">
              {/* Scene Caption & Time */}
              <div className="flex items-center gap-3">
                <span className="font-bold text-red-400">
                  {formatTime(currentTimeSec)} / {formatTime(activeScene.durationSec)}
                </span>
                <span className="hidden sm:inline-block opacity-40">|</span>
                <span className="hidden sm:inline-block truncate max-w-[280px] text-[#efeee9]/90 font-sans">
                  {activeScene.title}
                </span>
              </div>

              {/* Audio Waveform Equalizer */}
              <div className="flex items-end gap-[3px] h-4">
                <span className={`w-[2px] bg-emerald-400 rounded-full ${isPlaying ? 'anim-bar-1' : 'h-1'}`} />
                <span className={`w-[2px] bg-emerald-400 rounded-full ${isPlaying ? 'anim-bar-2' : 'h-2'}`} />
                <span className={`w-[2px] bg-emerald-400 rounded-full ${isPlaying ? 'anim-bar-3' : 'h-1'}`} />
                <span className={`w-[2px] bg-emerald-400 rounded-full ${isPlaying ? 'anim-bar-4' : 'h-3'}`} />
              </div>

              {/* Action Toggles */}
              <div className="flex items-center gap-1.5">
                {/* CRT Scanline Toggle */}
                <button
                  onClick={() => {
                    onPlayTick()
                    setScanlinesActive(!scanlinesActive)
                  }}
                  title="Toggle CRT Scanline Overlay"
                  className={`p-1.5 rounded border text-[10px] uppercase transition-all cursor-pointer ${
                    scanlinesActive
                      ? 'bg-[#efeee9] text-black border-[#efeee9]'
                      : 'bg-black/60 text-[#efeee9]/70 border-white/20 hover:border-white/50'
                  }`}
                >
                  <Tv size={13} />
                </button>

                {/* Ambient Sound Sync */}
                <button
                  onClick={() => {
                    onPlayTick()
                    onToggleSound()
                  }}
                  title="Toggle Ambient Audio Soundtrack"
                  className={`p-1.5 rounded border text-[10px] uppercase transition-all cursor-pointer ${
                    isPlayingSound
                      ? 'bg-[#efeee9] text-black border-[#efeee9]'
                      : 'bg-black/60 text-[#efeee9]/70 border-white/20 hover:border-white/50'
                  }`}
                >
                  {isPlayingSound ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>

                {/* Fullscreen Expand */}
                <button
                  onClick={() => {
                    onPlayTick()
                    setIsFullscreen(true)
                  }}
                  title="Expand to Fullscreen Cinema Mode"
                  className="p-1.5 rounded border bg-black/60 text-[#efeee9]/80 border-white/20 hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer"
                >
                  <Maximize2 size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scene Playlist Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
          {VLOG_SCENES.map((scene, idx) => {
            const isSelected = currentSceneIdx === idx
            return (
              <button
                key={scene.id}
                onClick={() => selectScene(idx)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#efeee9] text-black border-[#efeee9] shadow-lg scale-[1.02]'
                    : 'bg-[#121212] text-[#efeee9]/70 border-[#efeee9]/15 hover:border-[#efeee9]/40 hover:text-[#efeee9]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold">SCENE 0{idx + 1}</span>
                  <span>{scene.durationSec}s</span>
                </div>
                <div className="text-xs font-medium leading-snug line-clamp-2">
                  {scene.title.split(': ')[1] || scene.title}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Fullscreen Cinema Modal */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#efeee9]/15 text-[#efeee9]">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="uppercase tracking-widest">
                Alice Mystica &bull; Cinema Mode &bull; {activeScene.title}
              </span>
            </div>

            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full border border-white/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Fullscreen Cinema View */}
          <div className="relative my-auto w-full max-w-5xl mx-auto aspect-video rounded-xl overflow-hidden border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.08)]">
            <img
              src={activeScene.photoUrl}
              alt={activeScene.title}
              className={`w-full h-full object-cover ${isPlaying ? 'anim-ken-burns' : ''}`}
            />
            {scanlinesActive && <div className="absolute inset-0 scanlines opacity-75" />}
            <div className="absolute top-4 left-4 font-mono text-xs text-red-400 bg-black/60 px-2.5 py-1 rounded">
              REC ● {formatTimecode(currentTimeSec)}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[#efeee9]/15 text-xs font-mono text-[#efeee9]">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-full bg-[#efeee9] text-black font-semibold hover:opacity-90"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <span>{activeScene.location}</span>
            </div>
            <p className="hidden sm:inline-block text-[#efeee9]/70 italic font-serif">
              &ldquo;{activeScene.caption}&rdquo;
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default CinematicVlogPlayer
