import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Search,
  X,
  Compass,
  Music,
  BookOpen,
  Palette,
  Sparkles,
  Camera,
  Video,
  Mic,
  Award,
  Layers,
  Moon,
  Sun,
  Star,
  Copy,
  Download,
  Share2,
  CornerDownLeft,
  Volume2,
  VolumeX,
  Sliders,
  Calendar,
  Flame,
  Check
} from 'lucide-react'
import { boutiqueSoundEngine } from '../audio/AllTheStarsSoundscape'
import { triggerHaptic } from '../utils/haptics'

export interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'Chapters & Index' | 'Quick Actions' | 'Creative Disciplines' | 'Archival Imagery'
  keywords?: string[]
  icon: React.ComponentType<{ size?: number; className?: string }>
  shortcut?: string
  action: () => void
}

export interface CommandPaletteModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (sectionId: string) => void
  isPlayingSound: boolean
  onToggleSound: () => void
  atmosphere: 'noir' | 'linen'
  onToggleAtmosphere: () => void
  onOpenJuryDrawer: () => void
  digicamEnabled: boolean
  onToggleDigicam: () => void
  onTriggerShutterFlash: () => void
  onOpenLightbox: (index: number) => void
  onTriggerToast: (msg: string) => void
}

export function downloadCuratedPressKit(onToast?: (msg: string) => void) {
  const content = `================================================================================
R ALICE MYSTICA — THE CREATIVE ARCHIVE
Official Press Kit & Executive Curriculum Vitae
================================================================================

IDENTITY & SCHOLARSHIP
Name: R Alice Mystica
Academic Degree: Bachelor of Business Administration (BBA Scholar)
Designation: Creative Archivist, Visual Storyteller, Public Speaker
Archive Location: Tamil Nadu, India (IST • UTC+5:30)
Official Repository: https://github.com/JanSteve/alice-mystica-portfolio
Design Honors: Nominated Site of the Day / Awwwards Accolade (Score: 9.82)

FOUNDATIONAL MILESTONES & HONORS
1. An Interaction with the Hon’ble Finance Minister of India, Smt. Nirmala Sitharaman
   - High-level meeting and dialogue strengthening public engagement, governance,
     communication, and leadership vision.
2. Second Prize Winner — CBSE Storytelling Competition
   - Recognised for narrative excellence, poised public speaking, and articulation.

EIGHT CREATIVE DISCIPLINES
01. Journaling & Personal Writing:
    Turning ordinary moments into something worth remembering through introspective daily records.
02. Music & Discovery:
    Curated sonic expression, featuring the custom Web Audio API luxury acoustic synthesizer of "All The Stars".
03. Art & Visual Creativity:
    Exploring composition, textures, color theory, and visual communication beyond words.
04. Makeup & Beauty:
    Experimental aesthetic technique, mood exploration, and creative visual presentation.
05. Fashion & Personal Style:
    Silhouette, palette, and textural curation telling an authentic personal narrative.
06. Archive Photography:
    Preserving moments through authentic 35mm and quartz digicam timestamps (Strict Zero AI Policy).
07. Vlogging & Digital Storytelling:
    Transforming ordinary college experiences into intimate cinematic vignettes.
08. Public Speaking & Leadership:
    Articulating ideas with confidence, curiosity, and academic leadership in business.

AUTHENTIC VISUAL ARCHIVE ASSETS
- Frame 01: Creative Persona & Noir Expression (Dramatic Red Illumination Study)
- Frame 02: Radiant Smile & Candid Warmth (Natural Daylight Portrait)
- Frame 03: Childhood Archives & Timeless Memory (27 Nov 2020 Quartz Digicam Stamp)
- Frame 04: School Days & Foundations (Primary School Archival Print Scan)
- Frame 05: Playful Spirit & Spontaneity (Red Sweatshirt Expressive Study)

CURATORIAL & BUSINESS INQUIRY
Collaboration: creative.archive@alicemystica.archive
Curated with intentionality, minimalism & grace.
================================================================================`

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'R_ALICE_MYSTICA_CURATED_PRESS_KIT.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  onToast?.('Archival Press Kit Downloaded (.md)')
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  isPlayingSound,
  onToggleSound,
  atmosphere,
  onToggleAtmosphere,
  onOpenJuryDrawer,
  digicamEnabled,
  onToggleDigicam,
  onTriggerShutterFlash,
  onOpenLightbox,
  onTriggerToast,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef<number | null>(null)

  // Focus input on open & play tactile tick
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      boutiqueSoundEngine.playTick()
      triggerHaptic('selection')
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])

  // All actionable commands
  const allCommands = useMemo<CommandItem[]>(() => [
    // 1. Chapters & Index
    {
      id: 'chapter-hero',
      title: '00. Archive Index & Cover',
      subtitle: 'Top of archive, portrait marquee & live clock',
      category: 'Chapters & Index',
      keywords: ['home', 'top', 'start', 'cover', 'hero'],
      icon: Compass,
      shortcut: '0',
      action: () => {
        onNavigate('hero')
        onClose()
      },
    },
    {
      id: 'chapter-about',
      title: '01. Identity & Origin',
      subtitle: 'BBA scholar, creative philosophy & authentic biography',
      category: 'Chapters & Index',
      keywords: ['about', 'bio', 'story', 'scholar', 'bba'],
      icon: BookOpen,
      shortcut: '1',
      action: () => {
        onNavigate('about')
        onClose()
      },
    },
    {
      id: 'chapter-interests',
      title: '02. Curation & Disciplines',
      subtitle: 'Eight creative disciplines horizontal interactive showcase',
      category: 'Chapters & Index',
      keywords: ['interests', 'disciplines', 'creativity', 'music', 'art', 'journaling'],
      icon: Layers,
      shortcut: '2',
      action: () => {
        onNavigate('interests')
        onClose()
      },
    },
    {
      id: 'chapter-archive',
      title: '03. Visual Chronicle & Gallery',
      subtitle: 'Five authentic archival photographs with digicam quartz stamps',
      category: 'Chapters & Index',
      keywords: ['archive', 'gallery', 'photos', 'frames', 'red portrait', 'childhood'],
      icon: Camera,
      shortcut: '3',
      action: () => {
        onNavigate('archive')
        onClose()
      },
    },
    {
      id: 'chapter-milestones',
      title: '04. Recognition & Honors',
      subtitle: 'Hon’ble FM Nirmala Sitharaman meeting & CBSE 2nd prize',
      category: 'Chapters & Index',
      keywords: ['milestones', 'achievements', 'nirmala', 'sitharaman', 'cbse', 'honors'],
      icon: Award,
      shortcut: '4',
      action: () => {
        onNavigate('milestones')
        onClose()
      },
    },
    {
      id: 'chapter-philosophy',
      title: '05. Perspective & Vision',
      subtitle: 'Core beliefs on intentionality, discipline & documentation',
      category: 'Chapters & Index',
      keywords: ['philosophy', 'perspective', 'vision', 'values'],
      icon: Sparkles,
      shortcut: '5',
      action: () => {
        onNavigate('philosophy')
        onClose()
      },
    },
    {
      id: 'chapter-contact',
      title: '06. Inquiry & Dialogue',
      subtitle: 'Connect for curatorial and business collaboration',
      category: 'Chapters & Index',
      keywords: ['contact', 'inquiry', 'message', 'email', 'collaborate'],
      icon: SendIcon,
      shortcut: '6',
      action: () => {
        onNavigate('contact')
        onClose()
      },
    },
    {
      id: 'chapter-guestbook',
      title: '07. Critique & Guestbook',
      subtitle: 'Awwwards jury endorsements, stamps and community reactions',
      category: 'Chapters & Index',
      keywords: ['guestbook', 'critique', 'reviews', 'reactions', 'endorsements'],
      icon: Star,
      shortcut: '7',
      action: () => {
        onNavigate('guestbook')
        onClose()
      },
    },

    // 2. Quick Actions
    {
      id: 'action-toggle-sound',
      title: isPlayingSound ? 'Pause "All The Stars" Synthesizer' : 'Play "All The Stars" Synthesizer',
      subtitle: 'Curated Kendrick Lamar & SZA boutique acoustic mix (97 BPM)',
      category: 'Quick Actions',
      keywords: ['music', 'sound', 'all the stars', 'audio', 'song', 'kendrick', 'sza'],
      icon: isPlayingSound ? VolumeX : Volume2,
      shortcut: 'M',
      action: () => {
        onToggleSound()
        onClose()
      },
    },
    {
      id: 'action-toggle-atmosphere',
      title: atmosphere === 'noir' ? 'Switch Atmosphere: Editorial Linen Warmth' : 'Switch Atmosphere: Noir Midnight',
      subtitle: 'Toggle between deep cinematic noir and tactile museum linen',
      category: 'Quick Actions',
      keywords: ['theme', 'dark', 'light', 'linen', 'noir', 'mode', 'atmosphere'],
      icon: atmosphere === 'noir' ? Sun : Moon,
      shortcut: 'T',
      action: () => {
        onToggleAtmosphere()
        onClose()
      },
    },
    {
      id: 'action-open-jury',
      title: 'Open Awwwards Jury Accolade Panel',
      subtitle: 'View official Site of the Day evaluation metrics (Score: 9.82)',
      category: 'Quick Actions',
      keywords: ['awwwards', 'jury', 'sotd', 'accolade', 'score', 'verdict'],
      icon: Award,
      shortcut: 'J',
      action: () => {
        onOpenJuryDrawer()
        onClose()
      },
    },
    {
      id: 'action-press-kit',
      title: 'Download Curated Press Kit / One-Sheet Summary',
      subtitle: 'Format & download executive archive curriculum vitae (.md)',
      category: 'Quick Actions',
      keywords: ['press kit', 'download', 'cv', 'resume', 'one-sheet', 'summary', 'pdf'],
      icon: Download,
      shortcut: 'D',
      action: () => {
        downloadCuratedPressKit(onTriggerToast)
        onClose()
      },
    },
    {
      id: 'action-shutter-flash',
      title: 'Trigger Digicam Shutter Flash',
      subtitle: 'Tactile mechanical camera shutter sound & authentic screen flash',
      category: 'Quick Actions',
      keywords: ['shutter', 'flash', 'camera', 'photo', 'snap', 'haptic'],
      icon: Camera,
      shortcut: 'S',
      action: () => {
        onTriggerShutterFlash()
        onClose()
      },
    },
    {
      id: 'action-toggle-digicam',
      title: digicamEnabled ? 'Turn Digicam Quartz Timestamps OFF' : 'Turn Digicam Quartz Timestamps ON',
      subtitle: 'Toggle vintage amber CCD timestamp overlay across photography',
      category: 'Quick Actions',
      keywords: ['digicam', 'timestamp', 'quartz', 'amber', 'vintage', 'date'],
      icon: Sliders,
      shortcut: 'Q',
      action: () => {
        onToggleDigicam()
        onClose()
      },
    },
    {
      id: 'action-copy-link',
      title: 'Copy Archive Portfolio Link',
      subtitle: 'Copy clean URL with clipboard confirmation toast',
      category: 'Quick Actions',
      keywords: ['copy', 'share', 'link', 'url'],
      icon: Copy,
      shortcut: 'C',
      action: () => {
        if (typeof window !== 'undefined') {
          navigator.clipboard?.writeText(window.location.origin)
          onTriggerToast('Archive link copied to clipboard!')
        }
        onClose()
      },
    },

    // 3. Creative Disciplines Deep Dive
    {
      id: 'discipline-01',
      title: 'Discipline 01: Journaling & Personal Writing',
      subtitle: '"Turning ordinary moments into something worth remembering"',
      category: 'Creative Disciplines',
      keywords: ['journaling', 'writing', 'reflection', 'words', 'diary'],
      icon: BookOpen,
      action: () => {
        onNavigate('interests')
        onClose()
      },
    },
    {
      id: 'discipline-02',
      title: 'Discipline 02: Music & Discovery',
      subtitle: 'Sonic curation, mood playlists and boutique synthesizer',
      category: 'Creative Disciplines',
      keywords: ['music', 'playlist', 'discovery', 'all the stars'],
      icon: Music,
      action: () => {
        onNavigate('interests')
        onClose()
      },
    },
    {
      id: 'discipline-03',
      title: 'Discipline 03: Art & Visual Creativity',
      subtitle: 'Exploring color, composition, and visual textures',
      category: 'Creative Disciplines',
      keywords: ['art', 'visual', 'painting', 'sketch', 'palette'],
      icon: Palette,
      action: () => {
        onNavigate('interests')
        onClose()
      },
    },
    {
      id: 'discipline-04',
      title: 'Discipline 04: Makeup & Beauty',
      subtitle: 'Aesthetic technique, presentation, and experimental looks',
      category: 'Creative Disciplines',
      keywords: ['makeup', 'beauty', 'cosmetics', 'aesthetic'],
      icon: Sparkles,
      action: () => {
        onNavigate('interests')
        onClose()
      },
    },
    {
      id: 'discipline-05',
      title: 'Discipline 05: Fashion & Personal Style',
      subtitle: 'Expressive silhouettes, styling, and textural storytelling',
      category: 'Creative Disciplines',
      keywords: ['fashion', 'style', 'clothing', 'outfits', 'aesthetic'],
      icon: Compass,
      action: () => {
        onNavigate('interests')
        onClose()
      },
    },
    {
      id: 'discipline-06',
      title: 'Discipline 06: Archive Photography',
      subtitle: 'Preserving raw candid moments & digicam nostalgia',
      category: 'Creative Disciplines',
      keywords: ['photography', 'camera', 'digicam', '35mm', 'shots'],
      icon: Camera,
      action: () => {
        onNavigate('archive')
        onClose()
      },
    },
    {
      id: 'discipline-07',
      title: 'Discipline 07: Vlogging & Digital Storytelling',
      subtitle: 'Everyday college life captured through narrative motion',
      category: 'Creative Disciplines',
      keywords: ['vlog', 'vlogging', 'video', 'youtube', 'cinematic'],
      icon: Video,
      action: () => {
        onNavigate('interests')
        onClose()
      },
    },
    {
      id: 'discipline-08',
      title: 'Discipline 08: Public Speaking & Leadership',
      subtitle: 'Curiosity, articulation, and presence in business administration',
      category: 'Creative Disciplines',
      keywords: ['public speaking', 'leadership', 'communication', 'bba', 'speaking'],
      icon: Mic,
      action: () => {
        onNavigate('milestones')
        onClose()
      },
    },

    // 4. Archival Imagery
    {
      id: 'photo-01',
      title: 'Frame 01: Creative Persona & Noir Expression',
      subtitle: 'Dramatic red illumination portrait study (Archive 2025)',
      category: 'Archival Imagery',
      keywords: ['hero', 'red', 'portrait', 'noir', 'frame 1'],
      icon: Camera,
      action: () => {
        onOpenLightbox(0)
        onClose()
      },
    },
    {
      id: 'photo-02',
      title: 'Frame 02: Radiant Smile & Candid Warmth',
      subtitle: 'Natural daylight portrait study (Candid Joy)',
      category: 'Archival Imagery',
      keywords: ['smile', 'candid', 'joy', 'sunlight', 'frame 2'],
      icon: Camera,
      action: () => {
        onOpenLightbox(1)
        onClose()
      },
    },
    {
      id: 'photo-03',
      title: 'Frame 03: Childhood Archives (27 Nov 2020)',
      subtitle: 'Vintage quartz digicam stamped frame at 3:56 PM',
      category: 'Archival Imagery',
      keywords: ['childhood', '2020', 'digicam', 'vintage', 'frame 3'],
      icon: Camera,
      action: () => {
        onOpenLightbox(2)
        onClose()
      },
    },
    {
      id: 'photo-04',
      title: 'Frame 04: School Days & Foundations',
      subtitle: 'Primary school uniform, lunchbox & early beginnings',
      category: 'Archival Imagery',
      keywords: ['school', 'uniform', 'primary', 'roots', 'frame 4'],
      icon: Camera,
      action: () => {
        onOpenLightbox(3)
        onClose()
      },
    },
    {
      id: 'photo-05',
      title: 'Frame 05: Playful Spirit & Spontaneity',
      subtitle: 'Red sweatshirt candid memory grain & expressive spark',
      category: 'Archival Imagery',
      keywords: ['playful', 'red sweatshirt', 'candid', 'frame 5'],
      icon: Camera,
      action: () => {
        onOpenLightbox(4)
        onClose()
      },
    },
  ], [
    isPlayingSound,
    atmosphere,
    digicamEnabled,
    onNavigate,
    onClose,
    onToggleSound,
    onToggleAtmosphere,
    onOpenJuryDrawer,
    onToggleDigicam,
    onTriggerShutterFlash,
    onOpenLightbox,
    onTriggerToast,
  ])

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands
    const q = query.toLowerCase().trim()
    return allCommands.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(q)
      const matchSub = cmd.subtitle?.toLowerCase().includes(q)
      const matchCat = cmd.category.toLowerCase().includes(q)
      const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(q))
      return matchTitle || matchSub || matchCat || matchKeywords
    })
  }, [allCommands, query])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: { [cat: string]: CommandItem[] } = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Reset selected index if out of bounds
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        boutiqueSoundEngine.playTick()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const next = prev < filteredCommands.length - 1 ? prev + 1 : 0
          boutiqueSoundEngine.playTick()
          triggerHaptic('light')
          return next
        })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : filteredCommands.length - 1
          boutiqueSoundEngine.playTick()
          triggerHaptic('light')
          return next
        })
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          triggerHaptic('medium')
          filteredCommands[selectedIndex].action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  if (!isOpen) return null

  let runningIndex = -1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette Quick Launcher"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-start justify-center p-3 sm:p-6 pt-[10vh] sm:pt-[12vh] animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0f0f0f]/95 border border-[#efeee9]/25 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(255,255,255,0.06)] overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartY.current = e.touches[0].clientY
        }}
        onTouchEnd={(e) => {
          if (touchStartY.current !== null) {
            const deltaY = e.changedTouches[0].clientY - touchStartY.current
            // Swipe down to dismiss
            if (deltaY > 80) {
              onClose()
              boutiqueSoundEngine.playTick()
            }
          }
          touchStartY.current = null
        }}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-[#efeee9]/15 bg-white/[0.02]">
          <Search size={18} className="text-[#efeee9]/50 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a chapter, command, photo or keyword... (e.g. music, press kit, nirmala)"
            className="w-full bg-transparent text-sm sm:text-base text-[#efeee9] placeholder:text-[#efeee9]/35 focus:outline-none font-light"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#efeee9]/50 hover:text-[#efeee9] text-xs font-mono uppercase tracking-wider"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 border border-[#efeee9]/15 text-[10px] font-mono text-[#efeee9]/60">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="overflow-y-auto p-2 sm:p-3 space-y-4 no-scrollbar divide-y divide-[#efeee9]/5"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm text-[#efeee9]/60 font-light">
                No matching archival records found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-[#efeee9]/40 font-mono">
                Try searching for &quot;music&quot;, &quot;nirmala&quot;, &quot;press kit&quot;, or &quot;photos&quot;
              </p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="pt-2 first:pt-0 space-y-1">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/40">
                  {category}
                </div>
                <div className="space-y-1">
                  {items.map((cmd) => {
                    runningIndex++
                    const isSelected = runningIndex === selectedIndex
                    const IconComp = cmd.icon

                    return (
                      <div
                        key={cmd.id}
                        onClick={() => {
                          triggerHaptic('medium')
                          cmd.action()
                        }}
                        onMouseEnter={() => setSelectedIndex(runningIndex)}
                        className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[#efeee9] text-black shadow-md scale-[1.008]'
                            : 'text-[#efeee9]/80 hover:bg-white/5 hover:text-[#efeee9]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg border shrink-0 ${
                              isSelected
                                ? 'bg-black text-[#efeee9] border-black/20'
                                : 'bg-white/5 text-[#efeee9]/70 border-[#efeee9]/15'
                            }`}
                          >
                            <IconComp size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-medium tracking-tight truncate">
                              {cmd.title}
                            </div>
                            {cmd.subtitle && (
                              <div
                                className={`text-[11px] font-light truncate ${
                                  isSelected ? 'text-black/70' : 'text-[#efeee9]/50'
                                }`}
                              >
                                {cmd.subtitle}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {cmd.shortcut && (
                            <kbd
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                                isSelected
                                  ? 'bg-black/10 border-black/20 text-black'
                                  : 'bg-white/5 border-[#efeee9]/15 text-[#efeee9]/50'
                              }`}
                            >
                              {cmd.shortcut}
                            </kbd>
                          )}
                          {isSelected && (
                            <CornerDownLeft size={13} className="text-black shrink-0" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 border-t border-[#efeee9]/15 bg-black/40 flex items-center justify-between text-[11px] font-mono text-[#efeee9]/50 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-[#efeee9]/15 rounded text-[10px]">
                &uarr; &darr;
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-[#efeee9]/15 rounded text-[10px]">
                &crarr;
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>R Alice Mystica Spotlight</span>
            <span>&bull;</span>
            <span className="text-[#ffaa22]">Awwwards Edition</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SendIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}
