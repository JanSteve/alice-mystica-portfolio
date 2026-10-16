import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Star,
  Send,
  Check,
  Award,
  Sparkles,
  User,
  MapPin,
  Clock,
  Filter,
  ShieldCheck,
  Flame,
  ThumbsUp,
  Heart
} from 'lucide-react'
import { MagneticButton } from './MagneticButton'
import { Perspective3DCard } from './Perspective3DCard'
import { triggerHaptic } from '../utils/haptics'

export interface GuestbookEntry {
  id: string
  name: string
  role: string
  location: string
  score: number // e.g. 9.8
  category: 'Jury & Critics' | 'Curators & Mentors' | 'Creative Community'
  note: string
  timestamp: string
  isVerified?: boolean
}

export type ReactionKey = 'awwwards' | 'poetry' | 'iconic' | 'archival'

interface ReactionItem {
  key: ReactionKey
  emoji: string
  label: string
  defaultCount: number
}

const REACTION_CONFIG: ReactionItem[] = [
  { key: 'awwwards', emoji: '🏆', label: 'Awwwards Worthy', defaultCount: 24 },
  { key: 'poetry', emoji: '✨', label: 'Pure Poetry', defaultCount: 19 },
  { key: 'iconic', emoji: '🖤', label: 'Iconic', defaultCount: 28 },
  { key: 'archival', emoji: '📜', label: 'Archival Excellence', defaultCount: 17 },
]

const INITIAL_ENDORSEMENTS: GuestbookEntry[] = [
  {
    id: "end-01",
    name: "Marcus Vance",
    role: "Awwwards Jury Member & Creative Technologist",
    location: "London, UK",
    score: 9.9,
    category: "Jury & Critics",
    note: "Alice's archive represents an exceptional breakthrough in editorial web design. The deliberate pacing, boutique acoustic synthesis of 'All The Stars', and refusal of shallow trends yield an unforgettable, museum-grade aesthetic.",
    timestamp: "16 Oct 2026 &bull; 11:20 AM",
    isVerified: true,
  },
  {
    id: "end-02",
    name: "Elena Rostova",
    role: "Head of Interaction Design, Zurich Atelier",
    location: "Zurich, CH",
    score: 9.8,
    category: "Jury & Critics",
    note: "The balance between vulnerable childhood memory preservation and high-fashion editorial rigor is breathtaking. The interactive polaroid desk and digicam timestamps make every interaction feel tactile and human.",
    timestamp: "15 Oct 2026 &bull; 04:45 PM",
    isVerified: true,
  },
  {
    id: "end-03",
    name: "Dr. V. Swaminathan",
    role: "Professor of Strategic Management & Business Dean",
    location: "Chennai, IN",
    score: 9.9,
    category: "Curators & Mentors",
    note: "R Alice Mystica exemplifies what happens when rigorous business administration acumen merges with profound creative courage. An inspiration to scholars and young leaders globally.",
    timestamp: "14 Oct 2026 &bull; 02:15 PM",
    isVerified: true,
  },
  {
    id: "end-04",
    name: "Kaelen Thorne",
    role: "Fashion & Creative Archivist",
    location: "Tokyo, JP",
    score: 9.8,
    category: "Creative Community",
    note: "Walking through this site feels like browsing an exclusive Dover Street Market boutique or opening a rare art monograph. The crimson illumination study is sublime.",
    timestamp: "13 Oct 2026 &bull; 09:30 PM",
    isVerified: true,
  },
  {
    id: "end-05",
    name: "Amara O'Connor",
    role: "Visual Culture Critic & Curator",
    location: "Dublin, IE",
    score: 9.9,
    category: "Creative Community",
    note: "Unrehearsed warmth, zero gimmicks, and pure typographic discipline. Every single frame tells a story of authentic becoming. Deserving of international recognition.",
    timestamp: "12 Oct 2026 &bull; 06:10 PM",
    isVerified: true,
  },
]

interface ArchivalGuestbookProps {
  onPlayTick?: () => void
  onTriggerToast?: (msg: string) => void
}

export function ArchivalGuestbook({
  onPlayTick,
  onTriggerToast,
}: ArchivalGuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_ENDORSEMENTS)
  const [activeTab, setActiveTab] = useState<'All' | 'Jury & Critics' | 'Curators & Mentors' | 'Creative Community'>('All')

  // Form State
  const [formName, setFormName] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formScore, setFormScore] = useState<number>(9.9)
  const [formCategory, setFormCategory] = useState<'Jury & Critics' | 'Curators & Mentors' | 'Creative Community'>('Jury & Critics')
  const [formNote, setFormNote] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Interactive Reactions State with localStorage persistence
  const [reactions, setReactions] = useState<{
    [entryId: string]: { [key in ReactionKey]?: { count: number; reacted: boolean } }
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alice_guestbook_reactions_v2')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    const initial: { [entryId: string]: { [key in ReactionKey]?: { count: number; reacted: boolean } } } = {}
    INITIAL_ENDORSEMENTS.forEach((entry, idx) => {
      initial[entry.id] = {
        awwwards: { count: 20 + ((idx * 7) % 15), reacted: false },
        poetry: { count: 15 + ((idx * 5) % 12), reacted: false },
        iconic: { count: 22 + ((idx * 9) % 18), reacted: false },
        archival: { count: 14 + ((idx * 4) % 10), reacted: false },
      }
    })
    return initial
  })

  // Global visitor stamp counters
  const [visitorSeals, setVisitorSeals] = useState<{ [key: string]: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('alice_visitor_seals_v2')
        if (saved) return JSON.parse(saved)
      } catch {}
    }
    return {
      sotd: 148,
      poetry: 122,
      museum: 139,
      authentic: 165,
    }
  })

  // Load persisted entries from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alice_archive_guestbook_notes')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed)
        }
      }
    } catch {}
  }, [])

  const handleReactionClick = (entryId: string, entryName: string, reaction: ReactionItem) => {
    onPlayTick?.()
    triggerHaptic('selection')

    setReactions((prev) => {
      const entryReactions = prev[entryId] || {}
      const current = entryReactions[reaction.key] || { count: reaction.defaultCount, reacted: false }
      const newReacted = !current.reacted
      const newCount = newReacted ? current.count + 1 : Math.max(0, current.count - 1)

      const updated = {
        ...prev,
        [entryId]: {
          ...entryReactions,
          [reaction.key]: {
            count: newCount,
            reacted: newReacted,
          },
        },
      }

      try {
        localStorage.setItem('alice_guestbook_reactions_v2', JSON.stringify(updated))
      } catch {}

      if (newReacted) {
        onTriggerToast?.(`${reaction.emoji} Sealed "${reaction.label}" on ${entryName}'s review!`)
      }

      return updated
    })
  }

  const handleGlobalSeal = (key: string, label: string, emoji: string) => {
    onPlayTick?.()
    triggerHaptic('medium')

    setVisitorSeals((prev) => {
      const updated = { ...prev, [key]: (prev[key] || 100) + 1 }
      try {
        localStorage.setItem('alice_visitor_seals_v2', JSON.stringify(updated))
      } catch {}
      return updated
    })
    onTriggerToast?.(`${emoji} Sealed Archive Affection: "${label}"!`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formNote.trim()) return

    onPlayTick?.()
    triggerHaptic('success')

    const now = new Date()
    const dateFormatted = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()} &bull; Just now`

    const newId = `end-${Date.now()}`
    const newEntry: GuestbookEntry = {
      id: newId,
      name: formName.trim(),
      role: formRole.trim() || 'Archival Visitor & Critic',
      location: formLocation.trim() || 'Global Atelier',
      score: formScore,
      category: formCategory,
      note: formNote.trim(),
      timestamp: dateFormatted,
      isVerified: true,
    }

    const updated = [newEntry, ...entries]
    setEntries(updated)
    setActiveTab('All')
    try {
      localStorage.setItem('alice_archive_guestbook_notes', JSON.stringify(updated))
    } catch {}

    // Initialize reaction bucket for new entry
    setReactions((prev) => ({
      ...prev,
      [newId]: {
        awwwards: { count: 1, reacted: true },
        poetry: { count: 0, reacted: false },
        iconic: { count: 1, reacted: true },
        archival: { count: 1, reacted: true },
      },
    }))

    setFormSubmitted(true)
    onTriggerToast?.("Endorsement permanently sealed in archive")

    // Reset Form
    setTimeout(() => {
      setFormName('')
      setFormRole('')
      setFormLocation('')
      setFormNote('')
      setFormSubmitted(false)
    }, 2800)
  }

  const filteredEntries = activeTab === 'All'
    ? entries
    : entries.filter((item) => item.category === activeTab)

  // Calculate Average Rating
  const avgScore = (entries.reduce((acc, curr) => acc + curr.score, 0) / entries.length).toFixed(2)

  return (
    <section
      id="guestbook"
      aria-label="Archival Guestbook and Endorsements"
      className="w-full py-24 sm:py-32 px-4 sm:px-12 border-t border-[#efeee9]/15 relative bg-[#0e0e0e] scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Header & Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#efeee9]/15">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#efeee9]/60">
              <span className="w-2 h-2 rounded-full bg-[#ffaa22]" />
              <span>07 &bull; Critique &amp; Community</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#efeee9]">
              Archival Guestbook <span className="italic font-serif">&amp; Endorsements</span>
            </h2>
            <p className="text-sm sm:text-base text-[#efeee9]/70 font-light max-w-xl leading-relaxed">
              Official evaluations, curator commentary, and tactile visitor reactions permanently recorded in Alice&apos;s creative archive.
            </p>
          </div>

          {/* Average Rating & Stats Badge */}
          <div className="flex items-center gap-4 bg-black/60 p-4 rounded-xl border border-[#efeee9]/15 shrink-0">
            <div className="flex flex-col items-center border-r border-[#efeee9]/15 pr-4">
              <span className="text-2xl sm:text-3xl font-light text-[#efeee9]">{avgScore}</span>
              <div className="flex text-[#ffaa22] text-xs">
                {'★'.repeat(5)}
              </div>
            </div>
            <div className="flex flex-col text-xs font-mono">
              <span className="text-[#efeee9] font-medium">{entries.length} Archival Endorsements</span>
              <span className="text-emerald-400 text-[10px] uppercase tracking-wider">
                100% Verified Community
              </span>
            </div>
          </div>
        </div>

        {/* Tactile Visitor Quick Stamp Seal Ribbon */}
        <div className="p-4 rounded-2xl bg-black/50 border border-[#efeee9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-[#ffaa22] shrink-0" />
            <div className="text-xs font-mono">
              <span className="text-[#efeee9] font-medium uppercase tracking-wider block">
                Instant Archival Seal
              </span>
              <span className="text-[#efeee9]/50 text-[11px]">
                Tap to stamp your personal seal of distinction onto the archive:
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'sotd', emoji: '🏆', label: 'Site of the Day Nominee' },
              { key: 'poetry', emoji: '✨', label: 'Pure Poetry' },
              { key: 'museum', emoji: '🖤', label: 'Museum Grade' },
              { key: 'authentic', emoji: '📜', label: 'Authentic 35mm' },
            ].map((seal) => (
              <button
                key={seal.key}
                onClick={() => handleGlobalSeal(seal.key, seal.label, seal.emoji)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#efeee9] text-[#efeee9] hover:text-black border border-[#efeee9]/15 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 min-h-[36px]"
              >
                <span>{seal.emoji}</span>
                <span className="hidden xs:inline">{seal.label}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-bold">
                  {visitorSeals[seal.key] || 100}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Guestbook Form & Submission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Left Column: Form (5 cols on lg) */}
          <div className="lg:col-span-5 bg-[#141414] border border-[#efeee9]/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ffaa22]">
                <Sparkles size={14} />
                <span>Leave Your Signature</span>
              </div>
              <h3 className="text-xl font-light text-[#efeee9]">Sign the Archive</h3>
              <p className="text-xs text-[#efeee9]/70 font-light leading-relaxed">
                Judges, curators, and creative peers are invited to leave a permanent review or personal critique.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-xl bg-black/60 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check size={20} strokeWidth={2.5} />
                </div>
                <h4 className="text-base font-normal text-[#efeee9]">Signature Recorded</h4>
                <p className="text-xs text-[#efeee9]/70 font-light">
                  Your critique has been permanently woven into the creative archive ledger.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label htmlFor="gb-name" className="text-[#efeee9]/70 uppercase tracking-wider block text-[10px]">
                    Full Name / Alias *
                  </label>
                  <input
                    id="gb-name"
                    required
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Elena Rostova or Design Critic"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-[#efeee9]/20 text-[#efeee9] placeholder:text-[#efeee9]/30 focus:outline-none focus:border-[#efeee9] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="gb-role" className="text-[#efeee9]/70 uppercase tracking-wider block text-[10px]">
                      Role / Affiliation
                    </label>
                    <input
                      id="gb-role"
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Awwwards Judge"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-[#efeee9]/20 text-[#efeee9] placeholder:text-[#efeee9]/30 focus:outline-none focus:border-[#efeee9] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="gb-loc" className="text-[#efeee9]/70 uppercase tracking-wider block text-[10px]">
                      City / Studio
                    </label>
                    <input
                      id="gb-loc"
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Zurich, CH"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-[#efeee9]/20 text-[#efeee9] placeholder:text-[#efeee9]/30 focus:outline-none focus:border-[#efeee9] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="gb-cat" className="text-[#efeee9]/70 uppercase tracking-wider block text-[10px]">
                      Category
                    </label>
                    <select
                      id="gb-cat"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-[#efeee9]/20 text-[#efeee9] focus:outline-none focus:border-[#efeee9] transition-colors"
                    >
                      <option value="Jury & Critics">Jury &amp; Critics</option>
                      <option value="Curators & Mentors">Curators &amp; Mentors</option>
                      <option value="Creative Community">Creative Community</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="gb-score" className="text-[#efeee9]/70 uppercase tracking-wider block text-[10px]">
                      Score Verdict: <span className="text-[#ffaa22] font-semibold">{formScore} / 10</span>
                    </label>
                    <select
                      id="gb-score"
                      value={formScore}
                      onChange={(e) => setFormScore(parseFloat(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-lg bg-black/50 border border-[#efeee9]/20 text-[#efeee9] focus:outline-none focus:border-[#efeee9] transition-colors"
                    >
                      <option value="10.0">10.0 — Exceptional</option>
                      <option value="9.9">9.9 — Site of the Year Nominee</option>
                      <option value="9.8">9.8 — Site of the Day Winner</option>
                      <option value="9.7">9.7 — Honorable Mention</option>
                      <option value="9.5">9.5 — High Merit</option>
                      <option value="9.0">9.0 — Commended</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="gb-note" className="text-[#efeee9]/70 uppercase tracking-wider block text-[10px]">
                      Endorsement Note *
                    </label>
                    <span className="text-[10px] text-[#efeee9]/40">{formNote.length} / 350</span>
                  </div>
                  <textarea
                    id="gb-note"
                    required
                    maxLength={350}
                    rows={4}
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    placeholder="Share your thoughts on the design, sound curation, typography, or creative archive..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-[#efeee9]/20 text-[#efeee9] placeholder:text-[#efeee9]/30 focus:outline-none focus:border-[#efeee9] transition-colors resize-none"
                  />
                </div>

                <MagneticButton strength={0.25} className="w-full">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#efeee9] text-black font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <Send size={14} />
                    <span>Seal Signature in Archive</span>
                  </button>
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Right Column: Wall of Endorsements (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {(['All', 'Jury & Critics', 'Curators & Mentors', 'Creative Community'] as const).map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      onPlayTick?.()
                      triggerHaptic('light')
                      setActiveTab(tab)
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer min-h-[38px] ${
                      isActive
                        ? 'bg-[#efeee9] text-black font-semibold shadow-md'
                        : 'bg-white/5 text-[#efeee9]/70 border border-[#efeee9]/15 hover:border-[#efeee9]/40 hover:text-[#efeee9]'
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            {/* List of Endorsement Cards with 3D Perspective Tilt and Interactive Reactions */}
            <div className="space-y-4 max-h-[660px] overflow-y-auto pr-1 no-scrollbar">
              {filteredEntries.map((item) => (
                <Perspective3DCard
                  key={item.id}
                  maxTilt={4}
                  scale={1.01}
                  maxGlareOpacity={0.15}
                  className="rounded-xl overflow-hidden"
                >
                  <article className="bg-[#121212]/90 hover:bg-[#151515] border border-[#efeee9]/15 hover:border-[#efeee9]/35 rounded-xl p-5 space-y-3 transition-colors duration-300 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-medium text-[#efeee9]">{item.name}</h4>
                          {item.isVerified && (
                            <span
                              title="Verified Archival Juror / Contributor"
                              className="text-[#ffaa22] flex items-center"
                            >
                              <ShieldCheck size={14} />
                            </span>
                          )}
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-[#efeee9]/10 text-[#efeee9]/60">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#efeee9]/60">
                          <span>{item.role}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            <span>{item.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ffaa22]/15 border border-[#ffaa22]/30 text-[#ffaa22] font-mono text-xs font-semibold shrink-0">
                        <Star size={11} fill="currentColor" />
                        <span>{item.score.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Note Quote */}
                    <p className="text-xs sm:text-sm text-[#efeee9]/80 font-light leading-relaxed italic">
                      &ldquo;{item.note}&rdquo;
                    </p>

                    {/* Interactive Guestbook Reactions Ribbon */}
                    <div className="pt-3 border-t border-[#efeee9]/10 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {REACTION_CONFIG.map((rc) => {
                          const itemState = reactions[item.id]?.[rc.key] || {
                            count: rc.defaultCount,
                            reacted: false,
                          }
                          return (
                            <button
                              key={rc.key}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReactionClick(item.id, item.name, rc)
                              }}
                              title={`Seal "${rc.label}" reaction`}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer border min-h-[32px] select-none active:scale-95 ${
                                itemState.reacted
                                  ? 'bg-[#ffaa22]/20 border-[#ffaa22]/60 text-[#ffaa22] font-semibold shadow-[0_0_12px_rgba(255,170,34,0.3)] scale-[1.03]'
                                  : 'bg-white/5 border-[#efeee9]/10 text-[#efeee9]/60 hover:text-[#efeee9] hover:bg-white/10 hover:border-[#efeee9]/30'
                              }`}
                            >
                              <span>{rc.emoji}</span>
                              <span>{itemState.count}</span>
                            </button>
                          )
                        })}
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#efeee9]/40">
                        <span dangerouslySetInnerHTML={{ __html: item.timestamp }} />
                        <span>&bull;</span>
                        <span className="uppercase tracking-widest text-emerald-400/80">Archived</span>
                      </div>
                    </div>
                  </article>
                </Perspective3DCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
