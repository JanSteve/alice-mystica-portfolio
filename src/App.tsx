import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Menu,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Music,
  Palette,
  Camera,
  Video,
  Mic,
  Award,
  Check,
  Compass,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Clock,
  Battery,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  Info,
  ChevronDown,
  Disc3,
  Play,
  Pause,
  Search
} from 'lucide-react'

import { MagneticButton } from './components/MagneticButton'
import { ScrollStoppingInterests } from './components/ScrollStoppingInterests'
import { InteractiveArchivalDesk } from './components/InteractiveArchivalDesk'
import { CinematicVlogPlayer } from './components/CinematicVlogPlayer'
import { boutiqueSoundEngine } from './audio/AllTheStarsSoundscape'
import { BoutiqueAudioCapsule } from './components/BoutiqueAudioCapsule'
import { AwwwardsJuryAccolade } from './components/AwwwardsJuryAccolade'
import { ArchivalGuestbook } from './components/ArchivalGuestbook'
import { Perspective3DCard } from './components/Perspective3DCard'
import { CommandPaletteModal, downloadCuratedPressKit } from './components/CommandPaletteModal'
import { DigicamShutterFlash, copyArchivalMetadata } from './components/DigicamShutterFlash'
import { triggerHaptic } from './utils/haptics'

// =========================================================================
// R ALICE MYSTICA — THE CREATIVE ARCHIVE
// Exclusively utilizing the 5 verified user-provided archive photos
// =========================================================================

const ASSETS = {
  heroRed: "/assets/alice_hero_red.png",
  smilePortrait: "/assets/alice_smile_portrait.jpg",
  childhood2020: "/assets/alice_childhood_2020.jpg",
  schoolUniform: "/assets/alice_school_uniform.jpg",
  childhoodPlayful: "/assets/alice_childhood_playful.jpg",
}

interface CreativeInterest {
  number: string
  title: string
  category: string
  desc: string
  quote: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

const CREATIVE_INTERESTS: CreativeInterest[] = [
  {
    number: "01",
    title: "Journaling & Personal Writing",
    category: "Introspection & Words",
    desc: "Journaling is my way of documenting thoughts, emotions, ideas, memories, and everyday experiences. I appreciate the freedom of putting thoughts into words and turning ordinary moments into something worth remembering. Through journaling, I explore reflection, observation, and storytelling while creating a personal record of different phases of my life.",
    quote: "Turning ordinary moments into something worth remembering.",
    icon: BookOpen
  },
  {
    number: "02",
    title: "Music & Discovery",
    category: "Sonic Curation",
    desc: "Music is an important part of how I experience and interpret the world around me. I enjoy discovering songs, exploring different artists and genres, creating playlists, and finding music that connects with particular moods, memories, and moments. My musical interests reflect my curiosity and appreciation for creative expression in different forms.",
    quote: "Finding songs that connect with moods, memories, and moments.",
    icon: Music
  },
  {
    number: "03",
    title: "Art & Visual Creativity",
    category: "Aesthetics & Form",
    desc: "Art allows me to explore ideas visually and experiment with colour, composition, textures, and concepts. I enjoy the process of creating, observing details, and finding inspiration in everyday surroundings. For me, art is an opportunity to communicate ideas beyond words and to appreciate the individuality of different creative perspectives.",
    quote: "Communicating ideas beyond words through color and composition.",
    icon: Palette
  },
  {
    number: "04",
    title: "Makeup & Beauty",
    category: "Technique & Presentation",
    desc: "My interest in makeup comes from its ability to combine creativity, technique, experimentation, and personal expression. I enjoy exploring different looks, colour combinations, products, and beauty aesthetics. I see makeup as a creative practice that offers endless opportunities to experiment with presentation, mood, and visual storytelling.",
    quote: "A creative practice blending experimentation and visual storytelling.",
    icon: Sparkles
  },
  {
    number: "05",
    title: "Fashion & Personal Style",
    category: "Individual Identity",
    desc: "Fashion is another way I express creativity and individuality. I enjoy exploring outfit combinations, discovering different aesthetics, drawing inspiration from fashion imagery, and experimenting with styling. My interest extends beyond clothing to the way colours, accessories, textures, and details can communicate a mood or tell a story.",
    quote: "Colors, textures, and details communicating mood and presence.",
    icon: Compass
  },
  {
    number: "06",
    title: "Archive Photography",
    category: "Visual Preservation",
    desc: "Photography allows me to preserve moments that might otherwise disappear into the ordinary passage of time. I am drawn to candid photographs, everyday details, digicam aesthetics, visual imperfections, and the nostalgic quality of captured memories. Through photography, I enjoy documenting experiences as they unfold and building a visual archive of places, people, moments, and perspectives that matter to me.",
    quote: "Preserving moments that might otherwise disappear into ordinary time.",
    icon: Camera
  },
  {
    number: "07",
    title: "Vlogging & Digital Storytelling",
    category: "Narrative & Motion",
    desc: "Vlogging combines my interests in documentation, creativity, and storytelling. I enjoy the idea of capturing everyday experiences, college life, memorable occasions, spontaneous moments, and behind-the-scenes glimpses through video. It offers a way to transform ordinary experiences into personal narratives and to explore how editing, visuals, sound, and sequencing can communicate a story.",
    quote: "Transforming everyday experiences into intimate personal narratives.",
    icon: Video
  },
  {
    number: "08",
    title: "Public Speaking & Communication",
    category: "Leadership & Articulation",
    desc: "Public speaking is an important part of my personal and professional development. I value opportunities to express ideas, engage with audiences, participate in discussions, and communicate with confidence. Through seminars, presentations, college activities, and speaking opportunities, I aim to strengthen my ability to articulate thoughts clearly, connect with people, and approach new challenges with confidence. My interest in public speaking complements my academic journey in business administration, where communication, leadership, collaboration, and critical thinking play an important role.",
    quote: "Articulating ideas with confidence, curiosity, and leadership.",
    icon: Mic
  }
]

interface ArchivalPhoto {
  id: string
  title: string
  subtitle: string
  date: string
  tag: string
  caption: string
  image: string
  badge: string
  aspectRatio: string
  objectPosition: string
  spanClass?: string
  digicamStamp: string
  specs: {
    medium: string
    iso: string
    colorProfile: string
    archiveRef: string
  }
}

const ARCHIVAL_GALLERY: ArchivalPhoto[] = [
  {
    id: "hero-noir",
    title: "Creative Persona & Noir Expression",
    subtitle: "Dramatic Red Illumination Study",
    date: "Archive 2025",
    tag: "Becoming",
    badge: "01 / PORTRAIT STUDY",
    caption: "Dramatic red-light portrait study — exploring mood, presence, and visual storytelling as part of the creative archive.",
    image: ASSETS.heroRed,
    aspectRatio: "aspect-[2/1] sm:aspect-[21/9]",
    objectPosition: "object-center",
    spanClass: "md:col-span-2 lg:col-span-2",
    digicamStamp: "'25 10 15 21:40",
    specs: {
      medium: "35mm Portrait Study • Red Illumination",
      iso: "ISO 400 • f/1.8 • 1/125s",
      colorProfile: "Deep Crimson & Noir Shadow",
      archiveRef: "ALICE-ARC-01-RED",
    },
  },
  {
    id: "smile-candid",
    title: "Radiant Smile & Candid Warmth",
    subtitle: "(Can you kiss me more?)",
    date: "Archive / Candid Moment",
    tag: "Nostalgic Frames",
    badge: "02 / CANDID EXPRESSION",
    caption: "Unrehearsed warmth and open laughter — capturing the effortless joy, individuality, and candid charm behind the archive.",
    image: ASSETS.smilePortrait,
    aspectRatio: "aspect-[4/5]",
    objectPosition: "object-top",
    digicamStamp: "'25 04 12 18:24",
    specs: {
      medium: "Natural Daylight Portrait • Direct Sun",
      iso: "ISO 200 • f/2.4 • 1/250s",
      colorProfile: "Ivory Warmth & Radiant Glow",
      archiveRef: "ALICE-ARC-02-SMILE",
    },
  },
  {
    id: "childhood-2020",
    title: "Childhood Archives & Timeless Memory",
    subtitle: "27 November 2020 • 3:56 PM",
    date: "27 November 2020",
    tag: "Childhood Archives",
    badge: "03 / DIGICAM ARCHIVE",
    caption: "Digicam frame stamped 27 November 2020 at 3:56 PM — innocent smiles, big dreams, and an enduring curiosity about the world.",
    image: ASSETS.childhood2020,
    aspectRatio: "aspect-[4/3]",
    objectPosition: "object-top",
    digicamStamp: "'20 11 27 15:56",
    specs: {
      medium: "Vintage CCD Sensor • Amber Quartz",
      iso: "ISO 100 • 35mm Equiv • Flash",
      colorProfile: "Warm Vintage Grain & Amber Stamp",
      archiveRef: "ALICE-ARC-03-2020",
    },
  },
  {
    id: "school-days",
    title: "School Days & Foundations",
    subtitle: "School Uniform, Lunchbox & Beginnings",
    date: "Primary School Years",
    tag: "School Days",
    badge: "04 / ROOTS & EDUCATION",
    caption: "Neat uniform, lunchbox in hand, and eyes full of wonder — the early foundation of learning, discipline, and discovery.",
    image: ASSETS.schoolUniform,
    aspectRatio: "aspect-[4/3]",
    objectPosition: "object-center",
    digicamStamp: "'14 06 18 08:30",
    specs: {
      medium: "Primary School Archival Print Scan",
      iso: "ISO 100 • Daylight Exterior",
      colorProfile: "Saturated Navy, Tartan & Morning Light",
      archiveRef: "ALICE-ARC-04-SCHOOL",
    },
  },
  {
    id: "childhood-playful",
    title: "Playful Spirit & Spontaneity",
    subtitle: "Red Sweatshirt & Expressive Character",
    date: "Childhood Chronicles",
    tag: "Becoming",
    badge: "05 / UNFILTERED SPARK",
    caption: "Red sweatshirt, expressive gestures, and unapologetic character — preserving the spark of joy and authenticity through all stages of life.",
    image: ASSETS.childhoodPlayful,
    aspectRatio: "aspect-[4/5]",
    objectPosition: "object-top",
    digicamStamp: "'16 08 24 16:15",
    specs: {
      medium: "Archival Candid Snapshot • Indoor Ambient",
      iso: "ISO 200 • f/2.8 • 1/60s",
      colorProfile: "Vivid Scarlet & Candid Memory Grain",
      archiveRef: "ALICE-ARC-05-PLAYFUL",
    },
  },
]

interface SectionItem {
  id: string
  number: string
  title: string
  navLabel: string
}

const SECTIONS: SectionItem[] = [
  { id: 'hero', number: '00', title: 'Archive Index', navLabel: 'Top' },
  { id: 'about', number: '01', title: 'Identity & Origin', navLabel: 'About' },
  { id: 'interests', number: '02', title: 'Curation & Disciplines', navLabel: 'Interests' },
  { id: 'archive', number: '03', title: 'Visual Chronicle', navLabel: 'Archive' },
  { id: 'milestones', number: '04', title: 'Recognition & Honors', navLabel: 'Milestones' },
  { id: 'philosophy', number: '05', title: 'Perspective & Vision', navLabel: 'Philosophy' },
  { id: 'contact', number: '06', title: 'Inquiry & Dialogue', navLabel: 'Inquiry' },
  { id: 'guestbook', number: '07', title: 'Critique & Community', navLabel: 'Guestbook' },
]

// Dynamic Chapter Ambient Tinting: subtle lighting shifts smoothly as user traverses chapters
const AMBIENT_CHAPTER_GRADIENTS: Record<string, string> = {
  hero: 'radial-gradient(circle at 50% 25%, rgba(220, 38, 38, 0.22) 0%, rgba(220, 38, 38, 0.05) 45%, transparent 75%)',
  about: 'radial-gradient(circle at 35% 35%, rgba(217, 119, 6, 0.20) 0%, rgba(217, 119, 6, 0.04) 45%, transparent 72%)',
  interests: 'radial-gradient(circle at 65% 30%, rgba(99, 102, 241, 0.22) 0%, rgba(99, 102, 241, 0.05) 45%, transparent 75%)',
  archive: 'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.05) 45%, transparent 72%)',
  milestones: 'radial-gradient(circle at 40% 50%, rgba(234, 179, 8, 0.20) 0%, rgba(234, 179, 8, 0.04) 45%, transparent 72%)',
  philosophy: 'radial-gradient(circle at 60% 55%, rgba(168, 85, 247, 0.20) 0%, rgba(168, 85, 247, 0.04) 45%, transparent 72%)',
  contact: 'radial-gradient(circle at 50% 65%, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.05) 45%, transparent 72%)',
  guestbook: 'radial-gradient(circle at 50% 60%, rgba(245, 158, 11, 0.22) 0%, rgba(245, 158, 11, 0.05) 45%, transparent 72%)',
}

// =========================================================================
// BOUTIQUE AUDIO SYNTHESIS: "ALL THE STARS" (KENDRICK LAMAR & SZA)
// Web Audio API Synthesizer with luxury boutique acoustics (Aesop/Dover St)
// =========================================================================

const soundEngine = boutiqueSoundEngine

// =========================================================================
// LIVE TIME CLOCK (IST • UTC+5:30)
// Pentagram / Bas.dev / Swiss international studio time badge
// =========================================================================

function LiveTimeClock({ compact = false }: { compact?: boolean }) {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        setTimeStr(formatter.format(now))
      } catch {
        const d = new Date()
        const utc = d.getTime() + d.getTimezoneOffset() * 60000
        const ist = new Date(utc + 3600000 * 5.5)
        const hh = String(ist.getHours()).padStart(2, '0')
        const mm = String(ist.getMinutes()).padStart(2, '0')
        const ss = String(ist.getSeconds()).padStart(2, '0')
        setTimeStr(`${hh}:${mm}:${ss}`)
      }
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`flex items-center gap-2 font-mono uppercase tracking-widest text-[#efeee9]/70 select-none ${compact ? 'text-[10px]' : 'text-[11px]'}`}>
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span>IST &bull; {timeStr || '--:--:--'}{!compact && ' (UTC+5:30)'}</span>
    </div>
  )
}

// =========================================================================
// AUDIO TOGGLE & EQUALIZER VISUALIZER BUTTON
// =========================================================================

function AudioToggle({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause All The Stars theme audio' : 'Play All The Stars website theme'}
      title="Kendrick Lamar & SZA — All The Stars [Black Panther Website Theme]"
      className={`px-3 py-1.5 rounded-full border transition-all duration-300 flex items-center gap-2 cursor-pointer font-mono tracking-wider uppercase select-none min-h-[40px] ${
        isPlaying
          ? 'bg-[#efeee9] text-black border-[#efeee9] shadow-[0_0_18px_rgba(239,238,233,0.35)] font-medium scale-[1.02]'
          : 'bg-[#141414]/90 text-[#efeee9]/80 border-[#efeee9]/25 hover:border-[#ffaa22]/60 hover:text-[#efeee9]'
      }`}
    >
      {isPlaying ? (
        <div className="flex items-end gap-[2px] h-3.5 w-3.5 justify-center">
          <span className="w-[2px] bg-black rounded-full anim-bar-1" />
          <span className="w-[2px] bg-black rounded-full anim-bar-2" />
          <span className="w-[2px] bg-black rounded-full anim-bar-3" />
          <span className="w-[2px] bg-black rounded-full anim-bar-4" />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffaa22] animate-pulse" />
          <Volume2 size={13} className="opacity-70" />
        </div>
      )}
      <span className="text-[10px] hidden xs:inline-block sm:inline-block">
        {isPlaying ? 'All The Stars' : 'Play Theme'}
      </span>
    </button>
  )
}

// =========================================================================
// EDITORIAL ATMOSPHERE TOGGLE (Noir Midnight vs Editorial Linen Warmth)
// =========================================================================

function AtmosphereToggle({
  atmosphere,
  onToggle,
}: {
  atmosphere: 'noir' | 'linen'
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch atmosphere to ${atmosphere === 'noir' ? 'Editorial Newsprint Linen' : 'Noir Midnight'}`}
      title={atmosphere === 'noir' ? 'Switch to Editorial Linen Warmth' : 'Switch to Noir Midnight'}
      className="px-3 py-1.5 rounded-full border border-[#efeee9]/20 hover:border-[#efeee9]/50 bg-[#141414]/90 text-[#efeee9]/80 hover:text-[#efeee9] transition-all flex items-center gap-2 cursor-pointer min-h-[40px] font-mono text-[10px] uppercase tracking-wider select-none active:scale-95"
    >
      <span
        className={`w-2 h-2 rounded-full ${
          atmosphere === 'noir' ? 'bg-amber-400' : 'bg-indigo-400'
        }`}
      />
      <span className="hidden xs:inline">
        {atmosphere === 'noir' ? 'Linen' : 'Noir'}
      </span>
    </button>
  )
}

// =========================================================================
// TACTILE TOAST NOTIFICATION
// =========================================================================

function ToastNotification({ message, isVisible }: { message: string; isVisible: boolean }) {
  if (!isVisible) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-28 z-50 px-4 py-2 bg-[#efeee9] text-black rounded-full shadow-2xl flex items-center gap-2 text-xs font-mono uppercase tracking-wider anim-fade-in pointer-events-none border border-black/10"
    >
      <Check size={14} strokeWidth={2.5} />
      <span>{message}</span>
    </div>
  )
}

// =========================================================================
// MOBILE FLOATING BOTTOM BAR (sm:hidden)
// One-Handed Thumb Reach Navigation for Framer/Awwwards Mobile Excellence
// =========================================================================

function MobileBottomBar({
  activeSection,
  sections,
  onNavigate,
  onScrollToTop,
  scrollProgress,
  onOpenJuryDrawer,
  atmosphere,
  onToggleAtmosphere,
  onOpenCommandPalette,
}: {
  activeSection: string
  sections: SectionItem[]
  onNavigate: (id: string) => void
  onScrollToTop: () => void
  scrollProgress: number
  onOpenJuryDrawer: () => void
  atmosphere: 'noir' | 'linen'
  onToggleAtmosphere: () => void
  onOpenCommandPalette: () => void
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState<number>(0)

  const currentMeta = sections.find((s) => s.id === activeSection) || sections[0]
  const currentIndex = sections.findIndex((s) => s.id === activeSection)
  const nextSection = sections[(currentIndex + 1) % sections.length]

  return (
    <>
      {/* Mobile Chapter Switcher Bottom Sheet Modal with Drag-to-Dismiss */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md sm:hidden animate-fade-in flex flex-col justify-end"
          onClick={() => {
            setSheetOpen(false)
            setDragOffset(0)
          }}
        >
          <div
            style={{
              transform: `translateY(${Math.max(0, dragOffset)}px)`,
              transition: dragOffset === 0 ? 'transform 0.25s cubic-bezier(0.2, 0.8, 0.4, 1)' : 'none',
            }}
            onTouchStart={(e) => {
              setTouchStartY(e.touches[0].clientY)
            }}
            onTouchMove={(e) => {
              if (touchStartY !== null) {
                const delta = e.touches[0].clientY - touchStartY
                if (delta > 0) setDragOffset(delta)
              }
            }}
            onTouchEnd={() => {
              if (dragOffset > 75) {
                setSheetOpen(false)
                soundEngine.playTick()
                triggerHaptic('light')
              }
              setDragOffset(0)
              setTouchStartY(null)
            }}
            className="bg-[#121212] border-t border-[#efeee9]/20 rounded-t-2xl p-5 pb-8 space-y-4 max-h-[75vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1 bg-white/25 rounded-full mx-auto" />

            <div className="flex items-center justify-between pb-3 border-b border-[#efeee9]/15">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#efeee9]/60">
                Archive Chapters
              </span>
              <button
                onClick={() => {
                  setSheetOpen(false)
                  setDragOffset(0)
                }}
                className="p-1.5 text-[#efeee9]/60 hover:text-[#efeee9] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close chapter menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Atmosphere & Jury Quick Action Controls */}
            <div className="flex items-center gap-2 pt-1 pb-1">
              <button
                onClick={() => {
                  onToggleAtmosphere()
                  soundEngine.playTick()
                  triggerHaptic('light')
                }}
                className="flex-1 py-2 px-3 rounded-lg border border-[#efeee9]/15 bg-white/5 text-[#efeee9] font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] active:scale-95 transition-all cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full ${atmosphere === 'noir' ? 'bg-amber-400' : 'bg-indigo-400'}`} />
                <span>Mode: {atmosphere === 'noir' ? 'Linen Warmth' : 'Noir'}</span>
              </button>

              <button
                onClick={() => {
                  setSheetOpen(false)
                  onOpenJuryDrawer()
                  soundEngine.playTick()
                  triggerHaptic('medium')
                }}
                className="py-2 px-3 rounded-lg border border-[#ffaa22]/30 bg-[#ffaa22]/15 text-[#ffaa22] font-mono text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[44px] active:scale-95 transition-all cursor-pointer"
              >
                <span>★ SOTD 9.82</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {sections.map((sec) => {
                const isActive = activeSection === sec.id
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      onNavigate(sec.id)
                      setSheetOpen(false)
                      triggerHaptic('light')
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-[#efeee9] text-black border-[#efeee9] font-medium shadow-md'
                        : 'bg-white/5 border-[#efeee9]/10 text-[#efeee9]/80 hover:bg-white/10 hover:text-[#efeee9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs opacity-60">{sec.number}</span>
                      <span className="text-sm">{sec.title}</span>
                    </div>
                    {isActive ? (
                      <span className="text-[10px] font-mono uppercase tracking-widest bg-black text-[#efeee9] px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs font-mono opacity-40">{sec.navLabel}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Pill with Safe-Area Insets */}
      <aside
        aria-label="Mobile quick actions"
        className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] inset-x-3 z-40 sm:hidden pointer-events-auto"
      >
        <div className="bg-[#121212]/95 backdrop-blur-xl border border-[#efeee9]/25 rounded-full px-2.5 py-1.5 shadow-2xl flex items-center justify-between gap-1.5">
          {/* Chapter Quick Switcher Button */}
          <button
            onClick={() => {
              setSheetOpen(!sheetOpen)
              soundEngine.playTick()
              triggerHaptic('light')
            }}
            aria-label="Open chapter navigation switcher"
            className="flex items-center gap-1.5 text-[#efeee9] font-mono text-[11px] uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer min-h-[44px] px-2.5 bg-white/5 border border-[#efeee9]/15 rounded-full active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate max-w-[100px]">
              {currentMeta.number}. {currentMeta.navLabel}
            </span>
            <ChevronDown size={12} className="opacity-60 shrink-0" />
          </button>

          {/* Spotlight / Command Palette Button */}
          <button
            onClick={() => {
              onOpenCommandPalette()
              soundEngine.playTick()
              triggerHaptic('light')
            }}
            aria-label="Open Spotlight Command Palette (Cmd+K)"
            title="Spotlight Search"
            className="p-2 rounded-full bg-white/10 border border-[#efeee9]/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black active:scale-95 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <Search size={14} />
          </button>

          {/* Advance to Next Chapter Button */}
          <button
            onClick={() => {
              onNavigate(nextSection.id)
              soundEngine.playTick()
              triggerHaptic('light')
            }}
            aria-label={`Advance to next chapter: ${nextSection.title}`}
            title={`Next: ${nextSection.title}`}
            className="p-2 rounded-full bg-white/10 border border-[#efeee9]/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black active:scale-95 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <ArrowDown size={14} className="-rotate-90" />
          </button>

          {/* Quick Inquiry Jump */}
          <button
            onClick={() => {
              onNavigate('contact')
              soundEngine.playTick()
              triggerHaptic('light')
            }}
            className={`px-3 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer min-h-[44px] flex items-center justify-center active:scale-95 ${
              activeSection === 'contact'
                ? 'bg-[#efeee9] text-black font-medium'
                : 'bg-white/10 text-[#efeee9] hover:bg-[#efeee9] hover:text-black border border-[#efeee9]/20'
            }`}
          >
            Inquiry
          </button>

          {/* Top Progress Ring & Percentage */}
          <button
            onClick={() => {
              onScrollToTop()
              soundEngine.playTick()
              triggerHaptic('light')
            }}
            aria-label="Scroll back to top"
            className="px-2.5 py-2 rounded-full bg-white/10 border border-[#efeee9]/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black active:scale-95 transition-all flex items-center gap-1 min-h-[44px]"
          >
            <ArrowUp size={12} />
            <span className="text-[10px] font-mono">{Math.round(scrollProgress)}%</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// =========================================================================
// REVEAL ON SCROLL COMPONENT (IntersectionObserver + Compositor Transform)
// Cleans up GPU layer properties after animation completes for crisp rendering
// =========================================================================

interface RevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  duration?: number
}

function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 28,
  duration = 750,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      setAnimationDone(true)
      return
    }

    const el = ref.current
    if (!el) return

    let timer: ReturnType<typeof setTimeout> | null = null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
          timer = setTimeout(() => {
            setAnimationDone(true)
          }, duration + delay + 80)
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px',
      }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [delay, duration])

  const getTransform = () => {
    if (animationDone) return 'none'
    if (isVisible) return 'translate3d(0, 0, 0)'
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`
      case 'down':
        return `translate3d(0, -${distance}px, 0)`
      case 'left':
        return `translate3d(${distance}px, 0, 0)`
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`
      case 'none':
      default:
        return 'none'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: animationDone ? 'none' : 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        willChange: animationDone ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

// =========================================================================
// REVEAL RULE (Line expand on viewport enter)
// =========================================================================

function RevealRule({ className = '', delay = 100 }: { className?: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="h-[1px] w-full bg-[#efeee9]/20 transition-transform duration-1000 origin-left"
        style={{
          transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}

// =========================================================================
// AMBIENT CURSOR SPOTLIGHT (Smooth Lerp Physics, Zero React Re-renders)
// =========================================================================

function AmbientCursor() {
  const spotlightRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: -1000, y: -1000 })
  const currentPos = useRef({ x: -1000, y: -1000 })
  const rafId = useRef<number | null>(null)
  const isVisible = useRef(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const el = spotlightRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible.current) {
        isVisible.current = true
        el.style.opacity = '1'
        currentPos.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleMouseLeave = () => {
      isVisible.current = false
      if (el) el.style.opacity = '0'
    }

    const animate = () => {
      if (isVisible.current && el) {
        currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.14
        currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.14

        el.style.background = `radial-gradient(650px circle at ${currentPos.current.x}px ${currentPos.current.y}px, rgba(239, 238, 233, 0.045), transparent 65%)`
      }
      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-700 hidden sm:block will-change-[background]"
      aria-hidden="true"
    />
  )
}

// =========================================================================
// READING SCROLL PROGRESS BAR (Compositor Transform scaleX, Zero Reflow)
// =========================================================================

function ReadingProgressBar({ progress }: { progress: number }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#efeee9]/10 z-50 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full w-full bg-gradient-to-r from-[#efeee9]/40 via-[#efeee9] to-[#efeee9] shadow-[0_0_12px_rgba(239,238,233,0.85)] origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress / 100})`,
          transition: 'transform 0.08s ease-out',
        }}
      />
    </div>
  )
}

// =========================================================================
// FLOATING BACK-TO-TOP BUTTON (Circular SVG Progress Ring & Percentage)
// =========================================================================

function BackToTopButton({
  scrollY,
  scrollProgress,
  onScrollToTop,
}: {
  scrollY: number
  scrollProgress: number
  onScrollToTop: () => void
}) {
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <button
      onClick={onScrollToTop}
      aria-label="Scroll back to top of page"
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 p-2 sm:px-4 sm:py-2.5 rounded-full bg-[#121212]/90 backdrop-blur-md border border-[#efeee9]/25 text-[#efeee9] shadow-2xl transition-all duration-400 flex items-center gap-2.5 group hover:bg-[#efeee9] hover:text-black hover:border-[#efeee9] hover:scale-105 active:scale-95 cursor-pointer ${
        scrollY > 400
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="stroke-[#efeee9]/20"
            strokeWidth="3.5"
            fill="transparent"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="stroke-[#efeee9] group-hover:stroke-black transition-all duration-150"
            strokeWidth="3.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <ArrowUp
          size={11}
          className="absolute inset-0 m-auto group-hover:-translate-y-0.5 transition-transform duration-300"
        />
      </div>
      <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest font-medium">
        Top &bull; {Math.round(scrollProgress)}%
      </span>
    </button>
  )
}

// =========================================================================
// CHAPTER RAIL INDICATOR (Desktop Right Rail, visible from xl: 1280px+)
// =========================================================================

function ChapterRail({
  sections,
  activeSection,
  onNavigate,
}: {
  sections: SectionItem[]
  activeSection: string
  onNavigate: (id: string) => void
}) {
  return (
    <aside
      aria-label="Chapter scroll navigation"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-auto select-none"
    >
      {sections.map((sec) => {
        const isActive = activeSection === sec.id
        return (
          <button
            key={sec.id}
            onClick={() => onNavigate(sec.id)}
            aria-label={`Navigate to chapter ${sec.number}: ${sec.title}`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-3 py-1 text-right focus:outline-none cursor-pointer"
          >
            <span
              className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${
                isActive
                  ? 'opacity-100 text-[#efeee9] translate-x-0 font-medium'
                  : 'opacity-0 -translate-x-2 text-[#efeee9]/40 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {sec.number} &bull; {sec.navLabel}
            </span>
            <div
              className={`transition-all duration-400 rounded-full ${
                isActive
                  ? 'w-7 h-1.5 bg-[#efeee9] shadow-[0_0_8px_rgba(239,238,233,0.7)]'
                  : 'w-1.5 h-1.5 bg-[#efeee9]/30 group-hover:bg-[#efeee9]/70 group-hover:scale-150'
              }`}
            />
          </button>
        )
      })}
    </aside>
  )
}

// =========================================================================
// PARALLAX PHOTO CARD (Scroll-driven Translation on Archival Frames)
// =========================================================================

interface ParallaxPhotoCardProps {
  item: ArchivalPhoto
  index: number
  onOpen: () => void
  digicamEnabled: boolean
  onTriggerShutter: (photo: ArchivalPhoto) => void
}

function ParallaxPhotoCard({ item, index, onOpen, digicamEnabled, onTriggerShutter }: ParallaxPhotoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const el = containerRef.current
    const wrapper = imageWrapperRef.current
    if (!el || !wrapper) return

    let ticking = false

    const updateParallax = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.bottom > -80 && rect.top < vh + 80) {
        // progress: -1 (at bottom of screen) to +1 (at top of screen)
        const progress = (vh / 2 - (rect.top + rect.height / 2)) / (vh / 2)
        // Gentle parallax translation between -24px and +24px
        const y = Math.max(-24, Math.min(24, progress * 20))
        wrapper.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    updateParallax()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <Perspective3DCard
      maxTilt={5}
      scale={1.012}
      maxGlareOpacity={0.2}
      className="h-full rounded-none"
    >
      <div
        ref={containerRef}
        onClick={onOpen}
        className="group relative cursor-pointer bg-black/50 border border-[#efeee9]/15 hover:border-[#efeee9]/60 hover:shadow-[0_0_30px_rgba(239,238,233,0.08)] transition-all duration-500 overflow-hidden flex flex-col justify-between h-full"
      >
        {/* Image Container with Scroll-Driven Parallax Translation */}
        <div className={`relative overflow-hidden bg-black ${item.aspectRatio}`}>
          <div
            ref={imageWrapperRef}
            className="absolute -top-[12%] -bottom-[12%] inset-x-0 w-full h-[124%] will-change-transform"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className={`w-full h-full object-cover ${item.objectPosition} group-hover:scale-105 transition-transform duration-700 ease-editorial`}
            />
          </div>

          {/* Subtle Dark Vignette Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Badge Overlay */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase text-[#efeee9] border border-[#efeee9]/20 z-10">
            {item.badge}
          </div>

          {/* Vintage Digicam REC & Battery indicator */}
          {digicamEnabled && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase text-[#efeee9] border border-[#efeee9]/20 z-10 flex items-center gap-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-bold">REC</span>
              <span className="opacity-40">|</span>
              <Battery size={11} className="text-emerald-400" />
            </div>
          )}

          {/* Interactive Digicam Quartz Amber Timestamp & Tactile Shutter Action */}
          {digicamEnabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onTriggerShutter(item)
              }}
              title="Click for tactile digicam shutter flash & copy archival metadata"
              className="absolute bottom-3 left-3 bg-black/85 hover:bg-black px-2.5 py-1 rounded border border-[#ffaa22]/40 hover:border-[#ffaa22] z-20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 group/shutter shadow-lg pointer-events-auto"
            >
              <Camera size={11} className="text-[#ffaa22] group-hover/shutter:scale-110 transition-transform" />
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#ffaa22] digicam-glow">
                {item.digicamStamp}
              </span>
            </button>
          )}

          {/* Quick View Button */}
          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase text-[#efeee9]/80 border border-[#efeee9]/20 flex items-center gap-1.5 group-hover:bg-[#efeee9] group-hover:text-black group-hover:border-[#efeee9] transition-all duration-300 z-10">
            <span>{item.date}</span>
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Caption Details */}
        <div className="p-6 space-y-2 border-t border-[#efeee9]/10 bg-[#0f0f0f]/40">
          <div className="flex items-center justify-between text-xs text-[#efeee9]/50 font-mono uppercase tracking-widest">
            <span>{item.tag}</span>
            <span>Frame 0{index + 1} / 0{ARCHIVAL_GALLERY.length}</span>
          </div>
          <h4 className="text-xl font-normal text-[#efeee9] tracking-tight group-hover:text-[#efeee9] transition-colors">
            {item.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#efeee9]/70 font-light leading-relaxed">
            {item.caption}
          </p>
        </div>
      </div>
    </Perspective3DCard>
  )
}

// =========================================================================
// MAIN APP COMPONENT
// =========================================================================

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [messageForm, setMessageForm] = useState({ name: '', email: '', subject: 'Creative Collaboration', message: '' })
  const [messageSubmitted, setMessageSubmitted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState<string>('hero')

  // Award-Winning & Mobile Features State
  const [isPlayingSound, setIsPlayingSound] = useState(false)
  const [showThemeBanner, setShowThemeBanner] = useState(true)
  const hasUserPausedRef = useRef<boolean>(false)
  const [digicamEnabled, setDigicamEnabled] = useState(true)
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [juryDrawerOpen, setJuryDrawerOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [shutterFlashing, setShutterFlashing] = useState(false)
  const [atmosphere, setAtmosphere] = useState<'noir' | 'linen'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alice_archive_atmosphere')
        if (saved === 'noir' || saved === 'linen') return saved
      } catch {}
    }
    return 'noir'
  })

  // Global keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K and /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
        return
      }

      if (e.key === '/' && !commandPaletteOpen) {
        const target = e.target as HTMLElement | null
        const isInput =
          target?.tagName === 'INPUT' ||
          target?.tagName === 'TEXTAREA' ||
          target?.tagName === 'SELECT' ||
          target?.isContentEditable
        if (!isInput) {
          e.preventDefault()
          setCommandPaletteOpen(true)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen])

  const handleTriggerShutter = (photo?: ArchivalPhoto) => {
    setShutterFlashing(true)
    soundEngine.playShutterSound()
    triggerHaptic('shutter')
    if (photo) {
      copyArchivalMetadata({
        title: photo.title,
        archiveRef: photo.specs.archiveRef,
        date: photo.date,
        digicamStamp: photo.digicamStamp,
        medium: photo.specs.medium,
        colorProfile: photo.specs.colorProfile,
        iso: photo.specs.iso,
      })
      triggerToast(`📸 Digicam Frame Captured & Metadata Copied!`)
    } else {
      triggerToast('📸 Digicam Shutter Actuated!')
    }
  }

  // Global one-time interaction listener for modern browser autoplay policies (pointerdown/touchstart/click/keydown)
  useEffect(() => {
    const handleFirstGesture = (e: Event) => {
      if (hasUserPausedRef.current) return
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-no-auto-play="true"]')) return

      try {
        const ctx = soundEngine.getAudioContext()
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {})
        }
        if (!soundEngine.isPlaying && !hasUserPausedRef.current) {
          const ok = soundEngine.start()
          if (ok) {
            setIsPlayingSound(true)
            setShowThemeBanner(false)
            triggerToast('✦ Theme Playing: All The Stars [Black Panther OST]')
          }
        }
      } catch {}
    }

    const events = ['pointerdown', 'touchstart', 'click', 'keydown']
    const onGesture = (e: Event) => {
      handleFirstGesture(e)
      if (soundEngine.isPlaying) {
        events.forEach((evt) => window.removeEventListener(evt, onGesture))
      }
    }

    events.forEach((evt) => window.addEventListener(evt, onGesture, { passive: true }))

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, onGesture))
    }
  }, [])

  // Synchronize document theme attribute with state
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', atmosphere)
    }
  }, [atmosphere])

  const toggleAtmosphere = () => {
    const next = atmosphere === 'noir' ? 'linen' : 'noir'
    setAtmosphere(next)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next)
    }
    try {
      localStorage.setItem('alice_archive_atmosphere', next)
    } catch {}
    soundEngine.playTick()
    triggerToast(next === 'linen' ? 'Editorial Newsprint Linen Mode' : 'Noir Midnight Mode')
  }

  // Touch Swipe State for Lightbox Modal
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0)
  const [touchDeltaY, setTouchDeltaY] = useState<number>(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [zoomLevel, setZoomLevel] = useState<1 | 2>(1)
  const [showPhotoSpecs, setShowPhotoSpecs] = useState(false)
  const lastTapRef = useRef<number>(0)

  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 2400)
  }

  const toggleSound = () => {
    if (isPlayingSound) {
      soundEngine.stop()
      setIsPlayingSound(false)
      hasUserPausedRef.current = true
      triggerToast('All The Stars [Theme] paused')
    } else {
      hasUserPausedRef.current = false
      setShowThemeBanner(false)
      const ctx = soundEngine.getAudioContext()
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
      const started = soundEngine.start()
      if (started) {
        setIsPlayingSound(true)
        triggerToast('Playing: All The Stars [Black Panther Theme]')
      }
    }
  }

  const handleStartThemeBanner = () => {
    soundEngine.playTick()
    hasUserPausedRef.current = false
    setShowThemeBanner(false)
    const ctx = soundEngine.getAudioContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const started = soundEngine.start()
    if (started) {
      setIsPlayingSound(true)
      triggerToast('Playing: All The Stars [Black Panther Theme]')
    }
  }

  const handleDismissThemeBanner = (e: React.MouseEvent) => {
    e.stopPropagation()
    soundEngine.playTick()
    setShowThemeBanner(false)
    hasUserPausedRef.current = true
  }

  const copyArchiveLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      triggerToast('Archive link copied')
      soundEngine.playTick()
    }
  }

  const shareArchive = async () => {
    soundEngine.playTick()
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Alice Mystica — The Creative Archive',
          text: 'A collection of creativity, expression, memories, and becoming by R Alice Mystica.',
          url: window.location.href,
        })
        triggerToast('Shared successfully')
        return
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyArchiveLink()
        }
      }
    } else {
      copyArchiveLink()
    }
  }

  const lightboxPhoto = lightboxIndex !== null ? ARCHIVAL_GALLERY[lightboxIndex] : null

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setZoomLevel(1)
    setShowPhotoSpecs(false)
    setTouchDeltaX(0)
    setTouchDeltaY(0)
    soundEngine.playTick()
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    setTouchStartX(null)
    setTouchStartY(null)
    setTouchDeltaX(0)
    setTouchDeltaY(0)
    setIsSwiping(false)
    setZoomLevel(1)
    setShowPhotoSpecs(false)
  }

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % ARCHIVAL_GALLERY.length)
      setTouchDeltaX(0)
      setTouchDeltaY(0)
      setZoomLevel(1)
      soundEngine.playTick()
    }
  }

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + ARCHIVAL_GALLERY.length) % ARCHIVAL_GALLERY.length)
      setTouchDeltaX(0)
      setTouchDeltaY(0)
      setZoomLevel(1)
      soundEngine.playTick()
    }
  }

  const toggleZoom = () => {
    const nextZoom = zoomLevel === 1 ? 2 : 1
    setZoomLevel(nextZoom)
    soundEngine.playTick()
    triggerToast(nextZoom === 2 ? 'Zoom 1.8x Active' : 'Zoom 1.0x Normal')
  }

  const togglePhotoSpecs = () => {
    setShowPhotoSpecs((prev) => !prev)
    soundEngine.playTick()
  }

  const handlePhotoDoubleTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      toggleZoom()
    }
    lastTapRef.current = now
  }

  // Document Title
  useEffect(() => {
    document.title = "Alice \u2014 Mystica \u2022 The Creative Archive"
  }, [])

  // Optimized Scroll Tracking: Scrolled header state, reading progress, and robust active section
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY
          setScrollY(currentY)
          setScrolled(currentY > 40)

          // Scroll Progress percentage
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight
          if (totalHeight > 0) {
            const pct = (currentY / totalHeight) * 100
            setScrollProgress(Math.min(100, Math.max(0, pct)))
          }

          // Robust Active Section Calculation with clamp
          if (currentY < 120) {
            setActiveSection('hero')
          } else if (window.innerHeight + currentY >= document.documentElement.scrollHeight - 60) {
            setActiveSection(SECTIONS[SECTIONS.length - 1].id)
          } else {
            const scrollPosition = currentY + 220
            for (const section of [...SECTIONS].reverse()) {
              const el = document.getElementById(section.id)
              if (el) {
                const rect = el.getBoundingClientRect()
                const top = rect.top + currentY
                if (scrollPosition >= top) {
                  setActiveSection(section.id)
                  break
                }
              }
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll only when drawer, lightbox, or jury evaluation drawer is open
  useEffect(() => {
    if (drawerOpen || lightboxIndex !== null || juryDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, lightboxIndex, juryDrawerOpen])

  // Close lightbox/drawer on Escape key & arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox()
        setDrawerOpen(false)
      } else if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          nextLightbox()
        } else if (e.key === 'ArrowLeft') {
          prevLightbox()
        } else if (e.key.toLowerCase() === 'z') {
          toggleZoom()
        } else if (e.key.toLowerCase() === 'i') {
          togglePhotoSpecs()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, zoomLevel, showPhotoSpecs])

  // Initial load hash navigation
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200)
      }
    }
  }, [])

  const handleNavClick = (sectionId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    setDrawerOpen(false)
    document.body.style.overflow = ''
    soundEngine.playTick()

    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', `#${sectionId}`)
      }
    }, 40)
  }

  const scrollToTop = () => {
    soundEngine.playTick()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.history.pushState(null, '', '#hero')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessageSubmitted(true)
    soundEngine.playTick()
  }

  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0]

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-[#efeee9] font-hn selection:bg-[#efeee9] selection:text-black relative">

      {/* =========================================================================
          DYNAMIC CHAPTER AMBIENT TINTING (Smooth Ambient Lighting Shifts)
          GPU-accelerated cross-fading opacity layers between chapters
          ========================================================================= */}
      {SECTIONS.map((section) => (
        <div
          key={`ambient-${section.id}`}
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ease-out will-change-[opacity]"
          style={{
            background: AMBIENT_CHAPTER_GRADIENTS[section.id] || AMBIENT_CHAPTER_GRADIENTS.hero,
            opacity: activeSection === section.id ? 1 : 0,
          }}
          aria-hidden="true"
        />
      ))}

      {/* =========================================================================
          1. READING SCROLL PROGRESS BAR (Compositor ScaleX Transform)
          ========================================================================= */}
      <ReadingProgressBar progress={scrollProgress} />

      {/* =========================================================================
          2. AMBIENT CURSOR SPOTLIGHT (Lerp Physics, Zero State Re-renders)
          ========================================================================= */}
      <AmbientCursor />

      {/* =========================================================================
          3. DESKTOP CHAPTER RAIL INDICATOR (Visible from xl: 1280px+)
          ========================================================================= */}
      <ChapterRail
        sections={SECTIONS}
        activeSection={activeSection}
        onNavigate={handleNavClick}
      />

      {/* =========================================================================
          4. FLOATING BACK-TO-TOP BUTTON (Desktop / Tablet, with Progress Ring)
          ========================================================================= */}
      <div className="hidden sm:block">
        <BackToTopButton
          scrollY={scrollY}
          scrollProgress={scrollProgress}
          onScrollToTop={scrollToTop}
        />
      </div>

      {/* =========================================================================
          5. MOBILE FLOATING BOTTOM BAR (sm:hidden)
          Award-Winning Native Mobile App Feel with Thumb-Reach Chapter Advance
          ========================================================================= */}
      <MobileBottomBar
        activeSection={activeSection}
        sections={SECTIONS}
        onNavigate={handleNavClick}
        onScrollToTop={scrollToTop}
        scrollProgress={scrollProgress}
        onOpenJuryDrawer={() => setJuryDrawerOpen(true)}
        atmosphere={atmosphere}
        onToggleAtmosphere={toggleAtmosphere}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* =========================================================================
          6. TACTILE TOAST NOTIFICATION
          ========================================================================= */}
      <ToastNotification message={toastMsg} isVisible={toastVisible} />

      {/* =========================================================================
          6B. AUTHENTIC DIGICAM SHUTTER SCREEN FLASH ANIMATION OVERLAY
          ========================================================================= */}
      <DigicamShutterFlash
        isFlashing={shutterFlashing}
        onFlashEnd={() => setShutterFlashing(false)}
      />

      {/* =========================================================================
          6C. INTERACTIVE GLOBAL COMMAND PALETTE / SPOTLIGHT (Cmd+K / Ctrl+K / /)
          Framer-style quick launcher with fuzzy search and archival actions
          ========================================================================= */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(id) => handleNavClick(id)}
        isPlayingSound={isPlayingSound}
        onToggleSound={toggleSound}
        atmosphere={atmosphere}
        onToggleAtmosphere={toggleAtmosphere}
        onOpenJuryDrawer={() => setJuryDrawerOpen(true)}
        digicamEnabled={digicamEnabled}
        onToggleDigicam={() => {
          setDigicamEnabled(!digicamEnabled)
          triggerToast(digicamEnabled ? 'Digicam stamp: OFF' : 'Digicam stamp: ACTIVE')
        }}
        onTriggerShutterFlash={() => handleTriggerShutter(ARCHIVAL_GALLERY[0])}
        onOpenLightbox={(idx) => openLightbox(idx)}
        onTriggerToast={triggerToast}
      />

      {/* =========================================================================
          7. AWWWARDS OFFICIAL JURY EVALUATION & ACCOLADE BADGE
          ========================================================================= */}
      <AwwwardsJuryAccolade
        isOpen={juryDrawerOpen}
        onOpen={() => setJuryDrawerOpen(true)}
        onClose={() => setJuryDrawerOpen(false)}
        onNavigateToGuestbook={() => handleNavClick('guestbook')}
        onPlayTick={() => soundEngine.playTick()}
        onTriggerToast={triggerToast}
      />

      {/* =========================================================================
          8. INTERACTIVE BOUTIQUE AUDIO CAPSULE ("ALL THE STARS")
          Curated Black Panther OST boutique mix with volume & equalizer
          ========================================================================= */}
      <BoutiqueAudioCapsule
        isPlaying={isPlayingSound}
        onTogglePlay={toggleSound}
        onPlayTick={() => soundEngine.playTick()}
      />

      {/* =========================================================================
          9. FLOATING "SOUND ON / PLAY THEME" INVITATION BANNER
          Gentle pulsing invitation inviting visitor into the theme if not yet playing
          ========================================================================= */}
      {!isPlayingSound && showThemeBanner && (
        <div
          role="complementary"
          aria-label="Play website theme invitation"
          className="fixed top-20 right-3 sm:top-24 sm:right-6 z-40 max-w-[calc(100vw-1.5rem)] sm:max-w-sm anim-fade-down"
        >
          <div
            onClick={handleStartThemeBanner}
            className="group relative p-3 sm:px-4 sm:py-3 rounded-2xl bg-[#111111]/95 hover:bg-[#161616] border border-[#ffaa22]/40 hover:border-[#ffaa22] shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(255,170,34,0.25)] backdrop-blur-xl transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer"
          >
            {/* Left disc & badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-10 rounded-full bg-gradient-to-tr from-[#1a1a1a] via-[#2d2d2d] to-[#ffaa22]/30 border border-[#ffaa22]/60 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <Disc3 size={18} className="text-[#ffaa22] animate-spin" style={{ animationDuration: '8s' }} />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-2 border-[#111111]" />
              </div>

              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#ffaa22] font-semibold">
                    Website Theme
                  </span>
                  <span className="text-[8px] font-mono text-[#efeee9]/40 tracking-wider">
                    Bb Maj &bull; 97 BPM
                  </span>
                </div>
                <span className="text-xs font-normal text-[#efeee9] truncate">
                  All The Stars &bull; SZA &amp; Kendrick
                </span>
                <span className="text-[10px] text-[#efeee9]/60 font-light truncate">
                  Tap to play curated Black Panther mix
                </span>
              </div>
            </div>

            {/* Play Button + Close Dismiss */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleStartThemeBanner}
                aria-label="Play All The Stars theme"
                className="px-3 py-1.5 rounded-full bg-[#efeee9] hover:bg-white text-black font-mono text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 shadow-md hover:scale-105 transition-all cursor-pointer min-h-[36px]"
              >
                <Play size={11} fill="currentColor" />
                <span>Play</span>
              </button>
              <button
                type="button"
                data-no-auto-play="true"
                onClick={handleDismissThemeBanner}
                aria-label="Dismiss theme banner"
                title="Dismiss"
                className="p-1 text-[#efeee9]/40 hover:text-[#efeee9] hover:bg-white/10 rounded-full transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          GLOBAL STICKY HEADER & NAVIGATION
          ========================================================================= */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 px-4 sm:px-12 py-4 sm:py-6 flex items-center justify-between ${
          scrolled
            ? 'bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#efeee9]/10 shadow-2xl py-3.5 sm:py-4'
            : 'bg-transparent'
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('hero')
          }}
          className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-h-[44px]"
        >
          <div className="h-2 w-2 bg-[#efeee9] rounded-full group-hover:scale-150 transition-transform duration-300" />
          <span className="font-hn text-base sm:text-xl font-normal tracking-wide text-[#efeee9] group-hover:opacity-70 transition-opacity duration-300">
            R Alice Mystica
          </span>
          <span className="hidden xl:inline-block text-[11px] tracking-[0.25em] text-[#efeee9]/40 uppercase font-light pl-2 border-l border-[#efeee9]/20">
            The Creative Archive
          </span>
        </a>

        {/* Live IST Time Clock Badge (Visible on md+) */}
        <div className="hidden md:flex items-center px-3.5 py-1.5 rounded-full bg-[#141414]/90 border border-[#efeee9]/15 shadow-inner">
          <LiveTimeClock />
        </div>

        {/* Section Transition Badge / Chapter Counter in Header (Visible on lg+) */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414]/90 border border-[#efeee9]/15 text-[11px] font-mono uppercase tracking-widest text-[#efeee9]/80 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-[#efeee9] animate-pulse" />
          <span key={activeSection} className="anim-fade-in inline-block">
            {currentSectionMeta.number} &bull; {currentSectionMeta.title}
          </span>
        </div>

        {/* Actions & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          {/* Spotlight / Command Palette Quick Trigger Pill */}
          <MagneticButton strength={0.25}>
            <button
              onClick={() => {
                setCommandPaletteOpen(true)
                soundEngine.playTick()
                triggerHaptic('light')
              }}
              aria-label="Open Spotlight Command Palette (Cmd+K)"
              title="Spotlight Search & Actions (Cmd+K or /)"
              className="px-2.5 sm:px-3 py-1.5 rounded-full border border-[#efeee9]/20 bg-[#141414]/90 hover:bg-[#efeee9] text-[#efeee9]/80 hover:text-black hover:border-[#efeee9] transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 min-h-[40px] text-xs font-mono active:scale-95 group shadow-sm"
            >
              <Search size={13} className="opacity-70 group-hover:opacity-100" />
              <span className="hidden md:inline">Spotlight</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.2 rounded bg-white/10 group-hover:bg-black/10 border border-[#efeee9]/20 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>
          </MagneticButton>

          {/* Atmosphere Mode Switcher */}
          <MagneticButton strength={0.25}>
            <AtmosphereToggle atmosphere={atmosphere} onToggle={toggleAtmosphere} />
          </MagneticButton>

          {/* All The Stars Boutique Audio Toggle (Visible on all devices!) */}
          <MagneticButton strength={0.25}>
            <AudioToggle isPlaying={isPlayingSound} onToggle={toggleSound} />
          </MagneticButton>

          {/* Share Archive Button */}
          <MagneticButton strength={0.3}>
            <button
              onClick={shareArchive}
              aria-label="Share archive portfolio link"
              title="Share Archive"
              className="hidden sm:flex p-2 rounded-full border border-[#efeee9]/20 bg-[#141414]/90 text-[#efeee9]/70 hover:text-[#efeee9] hover:border-[#efeee9]/50 transition-all cursor-pointer min-h-[40px] min-w-[40px] items-center justify-center active:scale-95"
            >
              <Share2 size={15} />
            </button>
          </MagneticButton>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-light tracking-wide">
            {[
              { id: 'about', label: 'About' },
              { id: 'interests', label: 'Interests' },
              { id: 'archive', label: 'Archive' },
              { id: 'milestones', label: 'Milestones' },
              { id: 'philosophy', label: 'Philosophy' },
              { id: 'guestbook', label: 'Guestbook' },
            ].map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-[#efeee9] font-normal' : 'text-[#efeee9]/60 hover:text-[#efeee9]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#efeee9] rounded-full shadow-[0_0_6px_rgba(239,238,233,0.6)]" />
                  )}
                </a>
              )
            })}
            <MagneticButton strength={0.28}>
              <a
                href="#contact"
                onClick={(e) => handleNavClick('contact', e)}
                className={`px-4 py-2 border text-xs uppercase tracking-widest transition-all duration-300 block cursor-pointer ${
                  activeSection === 'contact'
                    ? 'bg-[#efeee9] text-black border-[#efeee9]'
                    : 'border-[#efeee9]/30 text-[#efeee9] hover:bg-[#efeee9] hover:text-black'
                }`}
              >
                Inquiry
              </a>
            </MagneticButton>
          </nav>

          {/* Mobile Hamburger Button with 44px tap target */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 text-[#efeee9] hover:opacity-70 transition-opacity focus:outline-none cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE SLIDE-IN DRAWER
          ========================================================================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-400 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-[#111111] border-l border-[#efeee9]/15 p-6 sm:p-8 flex flex-col justify-between transition-transform duration-500 shadow-2xl overflow-y-auto ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Close Button & Header */}
            <div className="flex items-center justify-between pb-5 border-b border-[#efeee9]/15">
              <span className="text-xs uppercase tracking-[0.25em] text-[#efeee9]/50 font-mono">
                Site Navigation
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-[#efeee9] p-2 hover:opacity-60 transition-opacity cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Live IST Time Clock in Mobile Drawer */}
            <div className="py-4 border-b border-[#efeee9]/10">
              <LiveTimeClock />
            </div>

            {/* Ambient Sound in Mobile Drawer */}
            <div className="py-4 border-b border-[#efeee9]/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Music size={16} className="text-[#efeee9]/60" />
                <span className="text-xs font-mono uppercase text-[#efeee9]/80">Ambience</span>
              </div>
              <AudioToggle isPlaying={isPlayingSound} onToggle={toggleSound} />
            </div>

            {/* Atmosphere Mode in Mobile Drawer */}
            <div className="py-3 border-b border-[#efeee9]/10 flex items-center justify-between gap-3">
              <span className="text-xs font-mono uppercase text-[#efeee9]/80">Atmosphere</span>
              <AtmosphereToggle atmosphere={atmosphere} onToggle={toggleAtmosphere} />
            </div>

            {/* Awwwards SOTD Trigger in Mobile Drawer */}
            <button
              onClick={() => {
                setDrawerOpen(false)
                setJuryDrawerOpen(true)
                soundEngine.playTick()
              }}
              className="mt-3 w-full py-2.5 px-3 border border-[#ffaa22]/30 bg-[#ffaa22]/10 rounded flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#ffaa22] hover:bg-[#ffaa22]/20 transition-all cursor-pointer min-h-[44px]"
            >
              <div className="flex items-center gap-2">
                <Award size={14} />
                <span>Awwwards Jury Verdict</span>
              </div>
              <span className="font-semibold">★ 9.82 / 10</span>
            </button>

            {/* Menu Links with Active Chapter Counter */}
            <nav className="mt-6 flex flex-col gap-3">
              {SECTIONS.map((link) => {
                const isActive = activeSection === link.id
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={(e) => handleNavClick(link.id, e)}
                    className={`text-left text-lg sm:text-2xl font-light py-2 px-1 transition-colors flex items-center justify-between cursor-pointer min-h-[44px] ${
                      isActive ? 'text-[#efeee9] font-normal' : 'text-[#efeee9]/60 hover:text-[#efeee9]'
                    }`}
                  >
                    <span>{link.number}. {link.navLabel}</span>
                    {isActive && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#efeee9] px-2 py-0.5 border border-[#efeee9]/30 rounded">
                        Current
                      </span>
                    )}
                  </a>
                )
              })}
            </nav>

            {/* Quick Share Link button */}
            <button
              onClick={() => {
                shareArchive()
                setDrawerOpen(false)
              }}
              className="mt-6 w-full py-3 px-4 border border-[#efeee9]/20 bg-white/5 rounded flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer min-h-[44px]"
            >
              <Share2 size={14} />
              <span>Share Archive Portfolio</span>
            </button>
          </div>

          <div className="pt-6 border-t border-[#efeee9]/15 text-xs text-[#efeee9]/50 space-y-2 font-light">
            <p className="tracking-widest uppercase text-[#efeee9]/70 font-mono">R Alice Mystica</p>
            <p>BBA Scholar &bull; Creative Archivist</p>
            <p className="pt-2 italic text-[#efeee9]/40 font-serif">
              &ldquo;A collection of creativity, expression, memories, and becoming.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HERO SECTION — ALICE — MYSTICA
          High-end full-viewport editorial screen with Parallax Depth & Bleed
          ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-12 px-4 sm:px-12"
      >
        {/* Layer 1: Alice's dramatic red noir photo with Parallax Bleed Translation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={ASSETS.heroRed}
            alt="Portrait of Alice Mystica in dramatic red noir lighting"
            style={{
              transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(${1 + Math.min(scrollY * 0.00025, 0.06)})`,
            }}
            className="absolute -top-[12%] left-0 w-full h-[124%] object-cover object-center anim-fade-in will-change-transform"
          />
        </div>

        {/* Ambient Dark Gradient Overlays for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/50 to-[#0d0d0d]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

        {/* Layer 2: Infinite Marquee Typography with Separated Entrance & Scroll Offset */}
        <div className="relative z-10 my-auto py-8 sm:py-12 overflow-hidden pointer-events-none anim-fade-up delay-marquee">
          <div
            style={{
              transform: `translate3d(${scrollY * -0.15}px, 0, 0)`,
            }}
            className="will-change-transform"
          >
            <div className={`marquee flex w-max whitespace-nowrap font-hn text-[10vh] sm:text-[15vh] md:text-[22vh] leading-none text-[#efeee9] tracking-tighter opacity-90 select-none transition-all duration-700 ${
              isPlayingSound ? 'drop-shadow-[0_0_35px_rgba(255,170,34,0.25)]' : ''
            }`}>
              <span className="pr-[5vw]">Alice &mdash; Mystica&nbsp;</span>
              <span className="pr-[5vw] text-[#efeee9]/60 font-light">The Creative Archive&nbsp;</span>
              <span className="pr-[5vw]">Alice &mdash; Mystica&nbsp;</span>
              <span className="pr-[5vw] text-[#efeee9]/60 font-light">The Creative Archive&nbsp;</span>
            </div>
          </div>
        </div>

        {/* Layer 2.5: Website Signature Theme Showcase */}
        <div className="relative z-10 my-4 sm:my-6 flex justify-center anim-fade-up">
          <div
            onClick={toggleSound}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleSound()
              }
            }}
            aria-label={isPlayingSound ? 'Pause website theme' : 'Play website theme'}
            className={`group inline-flex items-center gap-3.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-2xl select-none ${
              isPlayingSound
                ? 'bg-black/85 border-[#ffaa22]/60 shadow-[0_0_35px_rgba(255,170,34,0.25)] scale-[1.02]'
                : 'bg-black/60 border-[#efeee9]/25 hover:border-[#ffaa22]/50 hover:bg-black/80'
            }`}
          >
            {/* Spinning Gold Disc or Play Icon */}
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                isPlayingSound
                  ? 'bg-[#ffaa22] text-black shadow-md'
                  : 'bg-white/10 text-[#efeee9] group-hover:bg-[#ffaa22] group-hover:text-black group-hover:scale-105'
              }`}
            >
              {isPlayingSound ? (
                <Disc3 size={17} className="animate-spin" style={{ animationDuration: '4s' }} />
              ) : (
                <Play size={13} fill="currentColor" className="ml-0.5" />
              )}
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#ffaa22] font-semibold flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlayingSound ? 'bg-emerald-400 animate-pulse' : 'bg-[#ffaa22]'}`} />
                  Website Theme
                </span>
                <span className="font-mono text-[9px] text-[#efeee9]/50 tracking-wider hidden xs:inline">
                  Black Panther OST &bull; 97 BPM
                </span>
              </div>
              <span className="text-xs sm:text-sm font-normal text-[#efeee9] flex items-center gap-2">
                <span>All The Stars &bull; Kendrick Lamar &amp; SZA</span>
                <span className="text-[10px] font-mono text-[#ffaa22] bg-[#ffaa22]/10 px-1.5 py-0.2 rounded border border-[#ffaa22]/30">
                  Bb Maj
                </span>
              </span>
            </div>

            {/* Equalizer Visualizer Bars */}
            <div className="flex items-end gap-[3px] h-4 w-5 justify-center pl-2 border-l border-[#efeee9]/20">
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${isPlayingSound ? 'bg-[#ffaa22] anim-bar-1' : 'bg-[#efeee9]/30 h-1'}`}
              />
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${isPlayingSound ? 'bg-[#ffaa22] anim-bar-2' : 'bg-[#efeee9]/30 h-1'}`}
              />
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${isPlayingSound ? 'bg-[#ffaa22] anim-bar-3' : 'bg-[#efeee9]/30 h-1'}`}
              />
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${isPlayingSound ? 'bg-[#ffaa22] anim-bar-4' : 'bg-[#efeee9]/30 h-1'}`}
              />
            </div>
          </div>
        </div>

        {/* Layer 3: Editorial divider rule */}
        <div className="relative z-10 w-full mb-6">
          <div className="h-[1.5px] w-full bg-[#efeee9]/80 anim-line origin-left" />
        </div>

        {/* Layer 4: Hero Footer Meta & Scroll Prompt */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 text-xs sm:text-sm font-light text-[#efeee9]">
          <div className="anim-fade-up delay-footer-left flex flex-col gap-0.5">
            <span className="tracking-widest uppercase font-mono text-[11px] text-[#efeee9]/60">Archive Index</span>
            <span className="text-base font-normal">R Alice Mystica</span>
            <span className="text-[#efeee9]/70">Visual Storyteller &bull; BBA Scholar &bull; Observer</span>
          </div>

          {/* Centered Scroll Indicator & Share Button with Magnetic Physics */}
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <MagneticButton strength={0.25}>
              <a
                href="#about"
                onClick={(e) => handleNavClick('about', e)}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#efeee9]/30 rounded-full bg-black/40 backdrop-blur-md hover:bg-[#efeee9] hover:text-black transition-all duration-300 group cursor-pointer shadow-lg min-h-[44px]"
              >
                <span className="text-xs uppercase tracking-[0.2em]">Explore Below</span>
                <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform duration-300 animate-bounce" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.3}>
              <button
                onClick={shareArchive}
                title="Share Archive Link"
                className="p-2.5 rounded-full border border-[#efeee9]/20 bg-black/40 backdrop-blur-md hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center text-[#efeee9]"
                aria-label="Share Archive Link"
              >
                <Share2 size={14} />
              </button>
            </MagneticButton>
          </div>

          <div className="anim-fade-up delay-footer-right text-left sm:text-right flex flex-col gap-0.5">
            <span className="tracking-widest uppercase font-mono text-[11px] text-[#efeee9]/60">Philosophy</span>
            <span className="text-[#efeee9]/90 italic">A collection of creativity,</span>
            <span className="text-[#efeee9]/90 italic">expression &amp; becoming.</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 01: ABOUT ME & BBA ACADEMIC JOURNEY
          ========================================================================= */}
      <section
        id="about"
        className="relative py-28 px-4 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-transparent scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header with Animated Reveal Rule */}
          <div className="space-y-4">
            <Reveal delay={0}>
              <div className="pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
                    01 / Identity &amp; Origin
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                    ALICE &mdash; THE CREATIVE ARCHIVE
                  </h2>
                </div>
                <p className="text-[#efeee9]/70 text-lg md:text-xl font-light italic max-w-md font-serif">
                  &ldquo;A collection of creativity, expression, memories, and becoming.&rdquo;
                </p>
              </div>
            </Reveal>
            <RevealRule delay={150} />
          </div>

          {/* Editorial Content Grid with Viewport Reveals */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Portrait Showcase with Frame Hover Scale */}
            <Reveal delay={100} className="lg:col-span-5 space-y-5">
              <div className="relative group border border-[#efeee9]/20 overflow-hidden bg-black p-2 hover:border-[#efeee9]/60 hover:shadow-[0_0_30px_rgba(239,238,233,0.06)] transition-all duration-500">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={ASSETS.smilePortrait}
                    alt="Alice Mystica smiling portrait with (Can you kiss me more?)"
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-editorial"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-[#efeee9] border border-[#efeee9]/20 font-mono">
                    Archive Ref &bull; 02
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] italic text-[#efeee9]/90 border border-[#efeee9]/20 font-serif">
                    &ldquo;(Can you kiss me more?)&rdquo;
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-sm tracking-wide text-[#efeee9] font-medium uppercase font-mono">
                  R Alice Mystica
                </div>
                <div className="text-xs text-[#efeee9]/60 font-light">
                  BBA Academic Scholar &bull; Creative Archivist &bull; Observer
                </div>
              </div>
            </Reveal>

            {/* Right Column: Narrative Texts */}
            <Reveal delay={200} className="lg:col-span-7 space-y-8 text-[#efeee9]/90 font-light text-base sm:text-lg leading-relaxed">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-light text-[#efeee9] tracking-tight flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-[#efeee9]/60" />
                  About Me
                </h3>
                <p>
                  I am a <strong className="text-[#efeee9] font-normal">BBA student</strong> with a curious mind, a creative spirit, and a deep appreciation for the little things that make life meaningful. My interests lie at the intersection of creativity, self-expression, communication, and storytelling. I enjoy exploring different forms of expression, whether through words, visuals, music, personal style, or the experiences I collect along the way.
                </p>
                <p>
                  For me, creativity is not limited to a single medium. It is present in the way I document my thoughts, capture fleeting moments, experiment with aesthetics, discover music, express myself through fashion, and communicate ideas to others. I am drawn to experiences that allow me to observe, interpret, create, and share my perspective with the world.
                </p>
                <p>
                  This portfolio is a reflection of those interests. It is a personal archive of my creative pursuits, inspirations, experiences, and growth &mdash; a space where my personal and professional identities come together.
                </p>
              </div>

              {/* Three Pillar Cards with Staggered Delays & Hover Glow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#efeee9]/15">
                <div className="p-5 bg-black/40 border border-[#efeee9]/15 hover:border-[#efeee9]/50 hover:bg-[#141414] transition-all duration-300 space-y-2 group">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/50 block">01 / Focus</span>
                  <h4 className="text-sm font-medium text-[#efeee9] uppercase tracking-wider group-hover:text-[#efeee9]">BBA Academic</h4>
                  <p className="text-xs text-[#efeee9]/70 leading-relaxed font-light">
                    Business administration, strategic communication, organizational thinking, and turning concepts into real-world initiatives.
                  </p>
                </div>
                <div className="p-5 bg-black/40 border border-[#efeee9]/15 hover:border-[#efeee9]/50 hover:bg-[#141414] transition-all duration-300 space-y-2 group">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/50 block">02 / Expression</span>
                  <h4 className="text-sm font-medium text-[#efeee9] uppercase tracking-wider group-hover:text-[#efeee9]">Visual &amp; Style</h4>
                  <p className="text-xs text-[#efeee9]/70 leading-relaxed font-light">
                    Archival photography, nostalgic aesthetics, makeup experimentation, and personal style as visual communication.
                  </p>
                </div>
                <div className="p-5 bg-black/40 border border-[#efeee9]/15 hover:border-[#efeee9]/50 hover:bg-[#141414] transition-all duration-300 space-y-2 group">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/50 block">03 / Voice</span>
                  <h4 className="text-sm font-medium text-[#efeee9] uppercase tracking-wider group-hover:text-[#efeee9]">Public Speaking</h4>
                  <p className="text-xs text-[#efeee9]/70 leading-relaxed font-light">
                    Storytelling, articulate presentation, and engaging audiences with poise, clarity, and genuine empathy.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: THE 8 CREATIVE INTERESTS
          Featuring Framer-Style Scroll-Stopping Pinned Progression &
          Cinematic Digital Storytelling Video Frame (Discipline 07)
          ========================================================================= */}
      <section
        id="interests"
        className="relative border-b border-[#efeee9]/10 bg-transparent scroll-mt-24"
      >
        {/* 1. Scroll-Stopping Pinned Section: vertical scrolling scrubs horizontal card progression */}
        <ScrollStoppingInterests
          interests={CREATIVE_INTERESTS}
          isPlayingSound={isPlayingSound}
          onToggleSound={toggleSound}
          onLaunchVlog={() => {
            const el = document.getElementById('vlog-spotlight')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          onPlayTick={() => soundEngine.playTick()}
        />

        {/* 2. Cinematic Digital Storytelling Video Frame Spotlight (Interest 07) */}
        <div id="vlog-spotlight" className="py-24 px-4 sm:px-12 lg:px-20 border-t border-[#efeee9]/10 bg-transparent scroll-mt-24">
          <div className="max-w-6xl mx-auto space-y-12">
            <Reveal delay={0}>
              <CinematicVlogPlayer
                isPlayingSound={isPlayingSound}
                onToggleSound={toggleSound}
                onPlayTick={() => soundEngine.playTick()}
              />
            </Reveal>
          </div>
        </div>

        {/* 3. Complete Discipline Directory for Linear Reference */}
        <div className="py-20 px-4 sm:px-12 lg:px-20 border-t border-[#efeee9]/10 bg-transparent">
          <div className="max-w-6xl mx-auto space-y-8">
            <Reveal delay={0}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#efeee9]/15">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#efeee9]/50 block mb-1 font-mono">
                    Linear Directory
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light text-[#efeee9]">
                    All Eight Disciplines at a Glance
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#efeee9]/60 max-w-sm">
                  A reference catalog of Alice&apos;s creative pursuits, reflective practices, and avenues of expression.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CREATIVE_INTERESTS.map((interest, idx) => {
                const InterestIcon = interest.icon
                return (
                  <Reveal key={interest.number} delay={(idx % 2) * 120 + 100}>
                    <div className="p-6 bg-black/40 border border-[#efeee9]/15 hover:border-[#efeee9]/45 hover:bg-black/60 transition-all duration-300 space-y-4 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-[#efeee9]/60">{interest.number}</span>
                            <h4 className="text-lg font-normal text-[#efeee9]">{interest.title}</h4>
                          </div>
                          <InterestIcon size={18} className="text-[#efeee9]/40" />
                        </div>
                        <p className="text-sm text-[#efeee9]/75 font-light leading-relaxed">
                          {interest.desc}
                        </p>
                      </div>
                      <div className="pt-3 text-xs text-[#efeee9]/60 italic font-serif border-t border-[#efeee9]/10">
                        &ldquo;{interest.quote}&rdquo;
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          SECTION 03: ARCHIVAL PHOTOGRAPHY & MEMORIES
          Exclusively showcases the 5 uploaded photos with candid digicam captions,
          Digicam Timestamp toggle, and Scroll-driven Parallax Depth
          ========================================================================= */}
      <section
        id="archive"
        className="relative py-28 px-4 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-transparent scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header with Reveal Rule & Digicam Toggle */}
          <div className="space-y-4">
            <Reveal delay={0}>
              <div className="pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
                    03 / Visual Chronicle
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                    ARCHIVAL PHOTOGRAPHY &amp; MEMORIES
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <p className="text-[#efeee9]/70 text-sm md:text-base font-light max-w-sm">
                    Candid frames, digicam aesthetics, childhood archives, and nostalgic moments preserved through time.
                  </p>
                  {/* Digicam Quartz Stamp Toggle Button with Magnetic Physics */}
                  <MagneticButton strength={0.25}>
                    <button
                      onClick={() => {
                        setDigicamEnabled(!digicamEnabled)
                        soundEngine.playTick()
                        triggerToast(digicamEnabled ? 'Digicam stamp: OFF' : 'Digicam stamp: ACTIVE')
                      }}
                      aria-label="Toggle digicam timestamp overlay"
                      className={`px-3.5 py-2 rounded-full border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer min-h-[44px] shrink-0 select-none ${
                        digicamEnabled
                          ? 'bg-[#efeee9] text-black border-[#efeee9] shadow-md font-medium'
                          : 'bg-black/50 text-[#efeee9]/70 border-[#efeee9]/20 hover:border-[#efeee9]/50 hover:text-[#efeee9]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${digicamEnabled ? 'bg-red-500 animate-pulse' : 'bg-[#efeee9]/40'}`} />
                      <span>Digicam Quartz: {digicamEnabled ? 'Active' : 'Off'}</span>
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </Reveal>
            <RevealRule delay={150} />
          </div>

          {/* Interactive Draggable Archival Desk / Polaroid Moodboard Canvas */}
          <Reveal delay={100}>
            <InteractiveArchivalDesk
              onOpenLightbox={openLightbox}
              onPlayTick={() => soundEngine.playTick()}
              digicamEnabled={digicamEnabled}
            />
          </Reveal>

          {/* Archival Wall Header */}
          <div className="pt-6 border-t border-[#efeee9]/15">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#efeee9]/50 block mb-1">
              Curated Archival Wall
            </span>
            <h3 className="text-2xl sm:text-3xl font-light text-[#efeee9]">
              Five Primary Frames &bull; Parallax Depth
            </h3>
          </div>

          {/* Archival Photo Exhibition Grid with Viewport Reveals & Scroll-Driven Parallax Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARCHIVAL_GALLERY.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 120}
                className={item.spanClass || ''}
              >
                <ParallaxPhotoCard
                  item={item}
                  index={index}
                  onOpen={() => openLightbox(index)}
                  digicamEnabled={digicamEnabled}
                  onTriggerShutter={handleTriggerShutter}
                />
              </Reveal>
            ))}
          </div>

          {/* Digicam Manifesto Statement */}
          <Reveal delay={200}>
            <div className="p-8 bg-[#111111] border-l-2 border-[#efeee9]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#efeee9] transition-colors">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#efeee9]/50">
                  Visual Philosophy &bull; Digicam Aesthetics
                </span>
                <p className="text-base text-[#efeee9] font-light italic font-serif">
                  &ldquo;Photography allows me to preserve moments that might otherwise disappear into the ordinary passage of time.&rdquo;
                </p>
              </div>
              <div className="text-xs uppercase tracking-widest text-[#efeee9]/60 shrink-0 font-mono">
                5 Verified Primary Frames
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: ACHIEVEMENTS & MILESTONES
          ========================================================================= */}
      <section
        id="milestones"
        className="relative py-28 px-4 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-transparent scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header with Reveal Rule */}
          <div className="space-y-4">
            <Reveal delay={0}>
              <div className="pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
                    04 / Recognition &amp; Leadership
                  </span>
                  <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                    ACHIEVEMENTS &amp; MILESTONES
                  </h2>
                </div>
                <p className="text-[#efeee9]/70 text-sm md:text-base font-light max-w-md">
                  Foundational moments shaping my communication, leadership, and public engagement.
                </p>
              </div>
            </Reveal>
            <RevealRule delay={150} />
          </div>

          {/* Milestones Cards with Staggered Viewport Reveals & 3D Perspective Tilt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Milestone 01 */}
            <Reveal delay={100}>
              <Perspective3DCard
                maxTilt={6}
                scale={1.01}
                maxGlareOpacity={0.18}
                className="h-full rounded-none"
              >
                <div className="p-8 sm:p-10 bg-black/50 border border-[#efeee9]/20 hover:border-[#efeee9]/50 hover:shadow-[0_0_25px_rgba(239,238,233,0.05)] transition-all duration-300 flex flex-col justify-between space-y-6 h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#efeee9]/50">
                        Milestone 01
                      </span>
                      <Award size={20} className="text-[#efeee9]/60" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-light text-[#efeee9] tracking-tight">
                      An Interaction with the Hon’ble Finance Minister of India
                    </h3>
                    <h4 className="text-base font-normal text-[#efeee9]/80 tracking-wide pb-2 border-b border-[#efeee9]/10">
                      Smt. Nirmala Sitharaman
                    </h4>
                    <p className="text-sm sm:text-base text-[#efeee9]/80 font-light leading-relaxed">
                      Had the opportunity to meet and interact with the Hon’ble Finance Minister of India, Smt. Nirmala Sitharaman. This was a memorable milestone that strengthened my interest in communication, public engagement, leadership, and learning from distinguished personalities.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#efeee9]/10 flex flex-wrap gap-2 text-xs text-[#efeee9]/60 font-mono">
                    <span className="px-2.5 py-1 bg-white/5 border border-[#efeee9]/15">Leadership</span>
                    <span className="px-2.5 py-1 bg-white/5 border border-[#efeee9]/15">Public Engagement</span>
                    <span className="px-2.5 py-1 bg-white/5 border border-[#efeee9]/15">National Dialogue</span>
                  </div>
                </div>
              </Perspective3DCard>
            </Reveal>

            {/* Milestone 02 */}
            <Reveal delay={200}>
              <Perspective3DCard
                maxTilt={6}
                scale={1.01}
                maxGlareOpacity={0.18}
                className="h-full rounded-none"
              >
                <div className="p-8 sm:p-10 bg-black/50 border border-[#efeee9]/20 hover:border-[#efeee9]/50 hover:shadow-[0_0_25px_rgba(239,238,233,0.05)] transition-all duration-300 flex flex-col justify-between space-y-6 h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#efeee9]/50">
                        Milestone 02
                      </span>
                      <Award size={20} className="text-[#efeee9]/60" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-light text-[#efeee9] tracking-tight">
                      Second Prize &mdash; CBSE Storytelling Competition
                    </h3>
                    <h4 className="text-base font-normal text-[#efeee9]/80 tracking-wide pb-2 border-b border-[#efeee9]/10">
                      Creative Narration &amp; Expression
                    </h4>
                    <p className="text-sm sm:text-base text-[#efeee9]/80 font-light leading-relaxed">
                      Received Second Prize in a CBSE Storytelling Competition, recognising my interest in storytelling, creative expression, and effective communication. This achievement reflects my enthusiasm for presenting ideas, engaging an audience, and expressing narratives with confidence.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#efeee9]/10 flex flex-wrap gap-2 text-xs text-[#efeee9]/60 font-mono">
                    <span className="px-2.5 py-1 bg-white/5 border border-[#efeee9]/15">Storytelling</span>
                    <span className="px-2.5 py-1 bg-white/5 border border-[#efeee9]/15">Public Speaking</span>
                    <span className="px-2.5 py-1 bg-white/5 border border-[#efeee9]/15">CBSE Honors</span>
                  </div>
                </div>
              </Perspective3DCard>
            </Reveal>
          </div>

          {/* Reflection: What These Experiences Mean to Me */}
          <Reveal delay={250}>
            <Perspective3DCard
              maxTilt={4}
              scale={1.008}
              maxGlareOpacity={0.14}
              className="rounded-none"
            >
              <div className="p-8 sm:p-12 bg-[#121212] border border-[#efeee9]/20 space-y-4 hover:border-[#efeee9]/40 transition-colors">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#efeee9]/50 block">
                  Reflections &bull; Impact
                </span>
                <h4 className="text-xl sm:text-2xl font-normal text-[#efeee9]">
                  What These Experiences Mean to Me
                </h4>
                <p className="text-sm sm:text-base text-[#efeee9]/85 font-light leading-relaxed">
                  These milestones represent two important aspects of my journey: the confidence to express myself and the curiosity to learn from others. They continue to inspire me to explore public speaking, develop my communication skills, and pursue opportunities that challenge me to grow personally and professionally.
                </p>
              </div>
            </Perspective3DCard>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: BEYOND MY HOBBIES & PHILOSOPHY
          ========================================================================= */}
      <section
        id="philosophy"
        className="relative py-28 px-4 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-transparent scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header with Reveal Rule */}
          <div className="space-y-4">
            <Reveal delay={0}>
              <div className="pb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
                  05 / Perspective &amp; Vision
                </span>
                <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                  BEYOND MY HOBBIES &amp; PHILOSOPHY
                </h2>
              </div>
            </Reveal>
            <RevealRule delay={150} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Beyond My Hobbies */}
            <Reveal delay={100} className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl font-light tracking-tight text-[#efeee9]">
                Beyond My Hobbies
              </h3>
              <p className="text-base text-[#efeee9]/85 font-light leading-relaxed">
                As a BBA student, I am interested in developing a broader understanding of business, management, communication, and the way ideas become meaningful projects. I believe that creativity and professional skills can complement each other. Creative thinking encourages fresh perspectives, while communication helps transform those perspectives into ideas that others can understand and engage with.
              </p>
              <p className="text-base text-[#efeee9]/85 font-light leading-relaxed">
                I value opportunities that allow me to learn, participate, collaborate, explore new experiences, and challenge myself. Whether I am working on a college project, preparing a presentation, documenting an experience, or experimenting with a new creative idea, I see every experience as an opportunity to develop a new skill or perspective.
              </p>
            </Reveal>

            {/* Right Column: Core Philosophy Statement */}
            <Reveal delay={250} className="lg:col-span-6">
              <div className="p-8 sm:p-10 bg-[#141414] border border-[#efeee9]/20 hover:border-[#efeee9]/50 space-y-6 shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-light tracking-tight text-[#efeee9]">
                  My Core Philosophy
                </h3>
                <blockquote className="space-y-4 text-base sm:text-lg text-[#efeee9]/90 font-light italic leading-relaxed font-serif">
                  <p>
                    &ldquo;I believe that a person can have many interests without needing to fit into a single category. I want to keep exploring different creative outlets, learning new things, documenting experiences, and discovering new dimensions of myself.
                  </p>
                  <p>
                    I see this portfolio not simply as a collection of hobbies, but as a record of curiosity, experimentation, personal growth, and ambition. Every photograph, page, creative experiment, speech, and memory represents a small part of a much larger journey.
                  </p>
                  <p className="font-normal not-italic text-[#efeee9] border-t border-[#efeee9]/15 pt-4 font-hn">
                    I am still learning, still exploring, and still discovering what I can create. This is my archive &mdash; a reflection of who I am, what inspires me, and who I am becoming.&rdquo;
                  </p>
                </blockquote>
                <div className="text-xs uppercase tracking-widest text-[#efeee9]/50 font-mono">
                  &mdash; R Alice Mystica &bull; BBA Creative Archive
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: INQUIRY & DIALOGUE / MESSAGE
          ========================================================================= */}
      <section
        id="contact"
        className="relative py-28 px-4 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-transparent scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header with Reveal Rule */}
          <div className="space-y-4">
            <Reveal delay={0}>
              <div className="text-center space-y-4 pb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block font-mono">
                  06 / Inquiry &amp; Dialogue
                </span>
                <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                  START A CONVERSATION
                </h2>
                <p className="text-[#efeee9]/70 text-sm sm:text-base font-light max-w-xl mx-auto">
                  Whether discussing business collaborations, creative projects, public speaking, or simply saying hello.
                </p>
              </div>
            </Reveal>
            <RevealRule delay={150} />
          </div>

          {/* Form or Confirmation wrapped in Reveal */}
          <Reveal delay={150}>
            {messageSubmitted ? (
              <div className="p-12 bg-black/60 border border-[#efeee9]/30 text-center space-y-4 animate-fade-in shadow-2xl">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#efeee9]/40 flex items-center justify-center text-[#efeee9]">
                  <Check size={24} />
                </div>
                <h3 className="text-2xl font-light text-[#efeee9]">Note Received into the Archive</h3>
                <p className="text-sm text-[#efeee9]/70 font-light max-w-md mx-auto">
                  Thank you for reaching out. Your note has been safely logged. I will respond to your message promptly.
                </p>
                <button
                  onClick={() => {
                    setMessageSubmitted(false)
                    setMessageForm({ name: '', email: '', subject: 'Creative Collaboration', message: '' })
                  }}
                  className="mt-6 text-xs uppercase tracking-widest text-[#efeee9] underline underline-offset-4 hover:opacity-70 transition-opacity cursor-pointer font-mono"
                >
                  Send Another Note &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs uppercase tracking-widest text-[#efeee9]/60 mb-2 font-mono">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={messageForm.name}
                      onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-black/50 border border-[#efeee9]/20 px-4 py-3.5 text-[#efeee9] focus:border-[#efeee9] focus:ring-1 focus:ring-[#efeee9]/40 focus:outline-none text-sm placeholder:text-[#efeee9]/30 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs uppercase tracking-widest text-[#efeee9]/60 mb-2 font-mono">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={messageForm.email}
                      onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-black/50 border border-[#efeee9]/20 px-4 py-3.5 text-[#efeee9] focus:border-[#efeee9] focus:ring-1 focus:ring-[#efeee9]/40 focus:outline-none text-sm placeholder:text-[#efeee9]/30 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs uppercase tracking-widest text-[#efeee9]/60 mb-2 font-mono">
                    Topic of Dialogue
                  </label>
                  <select
                    id="contact-topic"
                    name="subject"
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                    className="w-full bg-black/50 border border-[#efeee9]/20 px-4 py-3.5 text-[#efeee9] focus:border-[#efeee9] focus:outline-none text-sm transition-colors cursor-pointer"
                  >
                    <option value="Creative Collaboration" className="bg-[#111111] text-[#efeee9]">Creative Collaboration</option>
                    <option value="Academic & Business Project" className="bg-[#111111] text-[#efeee9]">Academic &amp; Business Project</option>
                    <option value="Public Speaking & Events" className="bg-[#111111] text-[#efeee9]">Public Speaking &amp; Events</option>
                    <option value="General Note" className="bg-[#111111] text-[#efeee9]">General Note / Hello</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs uppercase tracking-widest text-[#efeee9]/60 mb-2 font-mono">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                    placeholder="Write your note, idea, or collaboration proposal here..."
                    className="w-full bg-black/50 border border-[#efeee9]/20 px-4 py-3.5 text-[#efeee9] focus:border-[#efeee9] focus:ring-1 focus:ring-[#efeee9]/40 focus:outline-none text-sm placeholder:text-[#efeee9]/30 resize-none transition-all duration-300"
                  />
                </div>

                <MagneticButton strength={0.2} className="w-full">
                  <button
                    type="submit"
                    className="w-full bg-[#efeee9] text-black py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#efeee9]/90 hover:tracking-[0.3em] transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    Dispatch Note Into Archive &rarr;
                  </button>
                </MagneticButton>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07: ARCHIVAL GUESTBOOK & ENDORSEMENTS
          A luxury guestbook section allowing visitors and judges to leave signature
          notes/endorsements that appear live in the archive.
          ========================================================================= */}
      <ArchivalGuestbook
        onPlayTick={() => soundEngine.playTick()}
        onTriggerToast={triggerToast}
      />

      {/* =========================================================================
          GLOBAL EDITORIAL FOOTER
          ========================================================================= */}
      <footer className="py-20 pb-28 sm:pb-20 px-4 sm:px-12 lg:px-20 bg-[#080808]/90 backdrop-blur-md text-[#efeee9] border-t border-[#efeee9]/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[#efeee9]/15">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#efeee9]/50 block">
                The Creative Archive
              </span>
              <h3 className="text-3xl sm:text-5xl font-light text-[#efeee9] tracking-tight">
                R Alice Mystica
              </h3>
              <p className="text-sm text-[#efeee9]/70 font-light">
                BBA Scholar &bull; Creative Archivist &bull; Visual Storyteller &bull; Public Speaker
              </p>
              <div className="pt-2">
                <LiveTimeClock />
              </div>
            </div>

            {/* Footer Navigation Columns */}
            <div className="flex flex-wrap gap-8 text-xs uppercase tracking-wider font-mono text-[#efeee9]/70">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#efeee9]/40 tracking-widest">Index</span>
                <a href="#hero" onClick={(e) => handleNavClick('hero', e)} className="text-left hover:text-[#efeee9] transition-colors cursor-pointer">Top</a>
                <a href="#about" onClick={(e) => handleNavClick('about', e)} className="text-left hover:text-[#efeee9] transition-colors cursor-pointer">About</a>
                <a href="#interests" onClick={(e) => handleNavClick('interests', e)} className="text-left hover:text-[#efeee9] transition-colors cursor-pointer">Interests</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#efeee9]/40 tracking-widest">Chapters</span>
                <a href="#archive" onClick={(e) => handleNavClick('archive', e)} className="text-left hover:text-[#efeee9] transition-colors cursor-pointer">Archival</a>
                <a href="#milestones" onClick={(e) => handleNavClick('milestones', e)} className="text-left hover:text-[#efeee9] transition-colors cursor-pointer">Milestones</a>
                <a href="#philosophy" onClick={(e) => handleNavClick('philosophy', e)} className="text-left hover:text-[#efeee9] transition-colors cursor-pointer">Philosophy</a>
                <a href="#guestbook" onClick={(e) => handleNavClick('guestbook', e)} className="text-left hover:text-[#efeee9] transition-colors cursor-pointer">Guestbook</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-[#efeee9]/40 tracking-widest">Connect</span>
                <a href="#contact" onClick={(e) => handleNavClick('contact', e)} className="hover:text-[#efeee9] transition-colors cursor-pointer">Inquiry</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#efeee9] transition-colors">Instagram</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#efeee9] transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-[#efeee9]/50">
            <p>&copy; {new Date().getFullYear()} R Alice Mystica. All rights reserved.</p>
            <p className="italic text-[#efeee9]/40 font-serif">
              Curated with intentionality, minimalism &amp; grace.
            </p>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          LIGHTBOX MODAL FOR ARCHIVAL PHOTOGRAPHY
          Enhanced with thumbnail strip, keyboard navigation, and counter
          ========================================================================= */}
      {/* =========================================================================
          LIGHTBOX MODAL FOR ARCHIVAL PHOTOGRAPHY
          Enhanced with touch swipe gestures, real-time pull-to-dismiss,
          double-tap zoom, archival specs panel, and in-viewer digicam toggle
          ========================================================================= */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.title}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-8 animate-fade-in"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full max-h-[96vh] bg-[#111111] border border-[#efeee9]/20 p-3.5 sm:p-7 flex flex-col justify-between shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Controls, Toggles, and Close Button */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#efeee9]/15">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-widest text-[#efeee9]/70">
                  Frame 0{lightboxIndex !== null ? lightboxIndex + 1 : 1} / 0{ARCHIVAL_GALLERY.length}
                </span>

                {/* In-Lightbox Digicam Toggle */}
                <button
                  onClick={() => {
                    setDigicamEnabled(!digicamEnabled)
                    soundEngine.playTick()
                    triggerToast(digicamEnabled ? 'Digicam stamp: OFF' : 'Digicam stamp: ACTIVE')
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer min-h-[36px] ${
                    digicamEnabled
                      ? 'bg-[#efeee9] text-black border-[#efeee9] font-medium'
                      : 'bg-white/5 text-[#efeee9]/70 border-[#efeee9]/20 hover:border-[#efeee9]/50'
                  }`}
                  aria-label="Toggle digicam timestamp overlay in lightbox"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${digicamEnabled ? 'bg-red-500 animate-pulse' : 'bg-[#efeee9]/40'}`} />
                  <span>Digicam: {digicamEnabled ? 'ON' : 'OFF'}</span>
                </button>

                {/* Zoom Toggle Button */}
                <button
                  onClick={toggleZoom}
                  aria-label={zoomLevel === 2 ? 'Zoom out to standard view' : 'Zoom in to inspect details'}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer min-h-[36px] ${
                    zoomLevel === 2
                      ? 'bg-[#efeee9] text-black border-[#efeee9] font-medium'
                      : 'bg-white/5 text-[#efeee9]/70 border-[#efeee9]/20 hover:border-[#efeee9]/50'
                  }`}
                >
                  {zoomLevel === 2 ? <ZoomOut size={13} /> : <ZoomIn size={13} />}
                  <span>{zoomLevel === 2 ? '1.8x' : '1.0x'}</span>
                </button>

                {/* Specs / EXIF Panel Toggle Button */}
                <button
                  onClick={togglePhotoSpecs}
                  aria-label="Toggle photo specs and archival details"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer min-h-[36px] ${
                    showPhotoSpecs
                      ? 'bg-[#efeee9] text-black border-[#efeee9] font-medium'
                      : 'bg-white/5 text-[#efeee9]/70 border-[#efeee9]/20 hover:border-[#efeee9]/50'
                  }`}
                >
                  <SlidersHorizontal size={13} />
                  <span className="hidden xs:inline">Specs</span>
                </button>

                {/* Tactile Shutter Snapshot & Copy Button */}
                <button
                  onClick={() => {
                    if (lightboxPhoto) handleTriggerShutter(lightboxPhoto)
                  }}
                  aria-label="Actuate digicam shutter and copy metadata"
                  title="Shutter Snapshot & Copy Metadata"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer min-h-[36px] bg-white/5 text-[#ffaa22] border-[#ffaa22]/30 hover:bg-[#ffaa22] hover:text-black active:scale-95 shadow-sm"
                >
                  <Camera size={13} />
                  <span>Snapshot</span>
                </button>
              </div>

              <button
                onClick={closeLightbox}
                aria-label="Close photo preview"
                className="text-[#efeee9]/70 hover:text-[#efeee9] p-2 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Image with Real-Time Pull-to-Dismiss & Horizontal Swipe Gestures */}
            <div
              onTouchStart={(e) => {
                if (e.targetTouches.length === 1) {
                  setTouchStartX(e.targetTouches[0].clientX)
                  setTouchStartY(e.targetTouches[0].clientY)
                  setTouchDeltaX(0)
                  setTouchDeltaY(0)
                  setIsSwiping(true)
                }
              }}
              onTouchMove={(e) => {
                if (touchStartX === null || touchStartY === null) return
                const currentX = e.targetTouches[0].clientX
                const currentY = e.targetTouches[0].clientY
                const deltaX = currentX - touchStartX
                const deltaY = currentY - touchStartY

                if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) && zoomLevel === 1) {
                  setTouchDeltaY(Math.min(160, deltaY))
                  setTouchDeltaX(0)
                } else if (zoomLevel === 1) {
                  setTouchDeltaX(Math.max(-130, Math.min(130, deltaX)))
                  setTouchDeltaY(0)
                }
              }}
              onTouchEnd={(e) => {
                if (touchStartX !== null && touchStartY !== null) {
                  const currentX = e.changedTouches[0].clientX
                  const currentY = e.changedTouches[0].clientY
                  const deltaX = currentX - touchStartX
                  const deltaY = currentY - touchStartY

                  if (deltaY > 75 && Math.abs(deltaX) < 60 && zoomLevel === 1) {
                    closeLightbox()
                  } else if (deltaX < -45 && zoomLevel === 1) {
                    nextLightbox()
                  } else if (deltaX > 45 && zoomLevel === 1) {
                    prevLightbox()
                  }
                }
                setTouchStartX(null)
                setTouchStartY(null)
                setTouchDeltaX(0)
                setTouchDeltaY(0)
                setIsSwiping(false)
              }}
              className="relative w-full max-h-[58vh] overflow-hidden bg-black flex items-center justify-center my-3 group touch-pan-y select-none cursor-pointer"
              onClick={handlePhotoDoubleTap}
            >
              <div
                style={{
                  transform: `translate3d(${touchDeltaX}px, ${touchDeltaY > 0 ? touchDeltaY : 0}px, 0) scale(${
                    zoomLevel === 2 ? 1.75 : touchDeltaY > 0 ? Math.max(0.78, 1 - touchDeltaY / 500) : 1
                  })`,
                  opacity: touchDeltaY > 0 ? Math.max(0.4, 1 - touchDeltaY / 320) : 1,
                  transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease-out',
                }}
                className="relative w-full h-full flex items-center justify-center will-change-transform"
              >
                <img
                  src={lightboxPhoto.image}
                  alt={lightboxPhoto.title}
                  className={`max-h-[58vh] max-w-full object-contain pointer-events-none transition-transform duration-300 ${
                    zoomLevel === 2 ? 'scale-100 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                />

                {/* Digicam REC & Battery Overlay in Lightbox */}
                {digicamEnabled && (
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase text-[#efeee9] border border-[#efeee9]/20 z-10 flex items-center gap-2 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-red-400 font-bold">REC ◉</span>
                    <span className="opacity-40">|</span>
                    <Battery size={13} className="text-emerald-400" />
                  </div>
                )}

                {/* Digicam Vintage Quartz Amber Timestamp & Shutter Action */}
                {digicamEnabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTriggerShutter(lightboxPhoto)
                    }}
                    title="Click for tactile shutter flash & copy archival metadata"
                    className="absolute bottom-3 right-3 bg-black/85 hover:bg-black px-3 py-1 rounded border border-[#ffaa22]/40 hover:border-[#ffaa22] z-20 cursor-pointer transition-all flex items-center gap-1.5 active:scale-95 group/shutter shadow-xl pointer-events-auto"
                  >
                    <Camera size={12} className="text-[#ffaa22] group-hover/shutter:scale-110 transition-transform" />
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#ffaa22] digicam-glow">
                      {lightboxPhoto.digicamStamp}
                    </span>
                  </button>
                )}

                {/* Archival Specs Drawer Overlay */}
                {showPhotoSpecs && (
                  <div
                    className="absolute inset-x-3 bottom-3 sm:inset-auto sm:top-3 sm:right-3 sm:max-w-xs bg-black/90 backdrop-blur-md border border-[#efeee9]/25 p-4 space-y-2 text-left z-20 shadow-2xl anim-fade-in"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#efeee9]/20 text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/60">
                      <span>Archival Specs</span>
                      <span>{lightboxPhoto.specs.archiveRef}</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div>
                        <span className="text-[#efeee9]/50 block text-[9px] uppercase">Medium:</span>
                        <span className="text-[#efeee9] font-light">{lightboxPhoto.specs.medium}</span>
                      </div>
                      <div>
                        <span className="text-[#efeee9]/50 block text-[9px] uppercase">Setting:</span>
                        <span className="text-[#efeee9] font-light">{lightboxPhoto.subtitle}</span>
                      </div>
                      <div>
                        <span className="text-[#efeee9]/50 block text-[9px] uppercase">Exposure & Tone:</span>
                        <span className="text-[#efeee9] font-light">{lightboxPhoto.specs.iso}</span>
                      </div>
                      <div>
                        <span className="text-[#efeee9]/50 block text-[9px] uppercase">Color Profile:</span>
                        <span className="text-[#efeee9] font-light">{lightboxPhoto.specs.colorProfile}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Prev Button with 44px tap target */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevLightbox()
                }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 border border-[#efeee9]/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer opacity-80 hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 z-20"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>

              {/* Next Button with 44px tap target */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextLightbox()
                }}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 border border-[#efeee9]/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer opacity-80 hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 z-20"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Touch Gestures Hint */}
            <div className="sm:hidden flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/50 py-1 px-1 select-none">
              <span>&larr; Swipe photos &rarr;</span>
              <span>&bull; Pull down / double-tap zoom &bull;</span>
            </div>

            {/* Thumbnail Navigation Strip with Smooth Snap */}
            <div className="flex items-center justify-center gap-2 pb-3 pt-1 overflow-x-auto no-scrollbar snap-x snap-mandatory">
              {ARCHIVAL_GALLERY.map((thumb, idx) => (
                <button
                  key={thumb.id}
                  onClick={() => openLightbox(idx)}
                  className={`h-12 w-16 shrink-0 snap-center overflow-hidden border transition-all cursor-pointer min-h-[44px] ${
                    lightboxIndex === idx
                      ? 'border-[#efeee9] opacity-100 scale-105 shadow-md'
                      : 'border-[#efeee9]/20 opacity-50 hover:opacity-85'
                  }`}
                  aria-label={`Switch to frame 0${idx + 1}`}
                >
                  <img src={thumb.image} alt={thumb.title} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Metadata Footer */}
            <div className="pt-3 border-t border-[#efeee9]/15 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#efeee9]/50">
                <span>{lightboxPhoto.badge}</span>
                <span>{lightboxPhoto.date}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-light text-[#efeee9]">{lightboxPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-[#efeee9]/80 font-light leading-relaxed">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
