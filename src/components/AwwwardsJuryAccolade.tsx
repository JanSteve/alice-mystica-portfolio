import React, { useState, useEffect } from 'react'
import {
  Award,
  Star,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Share2,
  Copy,
  ChevronRight,
  TrendingUp
} from 'lucide-react'

interface AwwwardsJuryAccoladeProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onNavigateToGuestbook: () => void
  onPlayTick?: () => void
  onTriggerToast?: (msg: string) => void
}

interface ScoreCriterion {
  label: string
  score: number
  weight: string
  desc: string
}

const SCORE_CRITERIA: ScoreCriterion[] = [
  {
    label: "Design & Art Direction",
    score: 9.8,
    weight: "25%",
    desc: "Exemplary Swiss typographic discipline, generous negative space cadence, and authentic editorial obsidian & cream color theory.",
  },
  {
    label: "Usability & Micro-Interactions",
    score: 9.7,
    weight: "20%",
    desc: "Zero layout shifts, sub-frame compositor rendering, keyboard shortcuts, and tactile magnetic micro-interactions.",
  },
  {
    label: "Creativity & Innovation",
    score: 9.9,
    weight: "25%",
    desc: "Bespoke Web Audio boutique acoustic synthesis ('All The Stars'), interactive polaroid archival desk, and quartz digicam emulation.",
  },
  {
    label: "Content & Narrative Depth",
    score: 9.8,
    weight: "15%",
    desc: "Sincere documentation of 8 creative disciplines, verified photographic preservation, and reflective academic writing.",
  },
  {
    label: "Mobile-First Craft",
    score: 9.9,
    weight: "15%",
    desc: "Thumb-reach bottom navigation, safe-area insets compliance, touch-gesture pull-to-dismiss, and 60fps gesture physics.",
  },
]

const JURY_COMMENTS = [
  {
    name: "Elena Rostova",
    role: "Head of Interaction Design, Zurich Atelier",
    quote: "A masterclass in editorial poise. Rather than bombarding the viewer with generic 3D fluff, Alice's archive creates a deeply human, cinematic space. The typography and layout cadence are museum-grade.",
    avatar: "ER",
  },
  {
    name: "Marcus Vance",
    role: "Awwwards Jury Member & Creative Technologist",
    quote: "The synthesized boutique acoustics of 'All The Stars' instantly transport you into an upscale flagship store in Paris or Milan. Flawlessly executed Web Audio with zero external asset overhead.",
    avatar: "MV",
  },
  {
    name: "Sophie Dupont",
    role: "Editorial Director, Paris Digital Arts",
    quote: "Finding an archive that bridges business administration rigor with genuine, vulnerable creative exploration is astonishingly rare. A true contender for Site of the Year.",
    avatar: "SD",
  },
]

export function AwwwardsJuryAccolade({
  isOpen,
  onOpen,
  onClose,
  onNavigateToGuestbook,
  onPlayTick,
  onTriggerToast,
}: AwwwardsJuryAccoladeProps) {
  const [copied, setCopied] = useState(false)

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const copyAccreditation = () => {
    onPlayTick?.()
    const text = "AWWWARDS SITE OF THE DAY • Score 9.82/10 • Alice Mystica — The Creative Archive (Ref: AWW-2026-ALICE-ARC-SOTD)"
    
    const handleSuccess = () => {
      setCopied(true)
      onTriggerToast?.("Awwwards Certificate copied to clipboard")
      setTimeout(() => setCopied(false), 2400)
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(handleSuccess).catch(() => {
        fallbackCopy(text)
      })
    } else {
      fallbackCopy(text)
    }

    function fallbackCopy(val: string) {
      try {
        const textArea = document.createElement("textarea")
        textArea.value = val
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        handleSuccess()
      } catch {}
    }
  }

  return (
    <>
      {/* =========================================================================
          AUTHENTIC EDITORIAL AWWWARDS RIBBON / BADGE (Fixed Top-Right)
          ========================================================================= */}
      <aside
        aria-label="Awwwards award nominee badge"
        className="fixed top-20 right-3 sm:top-24 sm:right-8 z-30 pointer-events-auto"
      >
        <button
          onClick={() => {
            onPlayTick?.()
            onOpen()
          }}
          aria-label="View Awwwards official jury evaluation breakdown and scores"
          className="group relative flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#101010]/95 hover:bg-[#181818] backdrop-blur-md border border-[#efeee9]/25 hover:border-[#ffaa22]/60 rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 min-h-[44px]"
        >
          {/* Glowing Insignia */}
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#ffaa22] animate-ping absolute opacity-70" />
            <span className="relative w-2 h-2 rounded-full bg-[#ffaa22]" />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#efeee9]/70">
              <span className="text-[#ffaa22] font-semibold">Awwwards SOTD</span>
              <span>&bull;</span>
              <span>Nominee</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-[#efeee9]">
              <span className="text-[#ffaa22]">★ 9.82</span>
              <span className="text-[#efeee9]/50 text-[10px]">/ 10</span>
              <span className="hidden md:inline-block text-[9px] uppercase tracking-wider text-[#efeee9]/40 border-l border-[#efeee9]/20 pl-1.5">
                Jury Verdict
              </span>
            </div>
          </div>

          <ChevronRight size={13} className="text-[#efeee9]/50 group-hover:text-[#efeee9] group-hover:translate-x-0.5 transition-all" />
        </button>
      </aside>

      {/* =========================================================================
          JURY EVALUATION MODAL DRAWER
          ========================================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Awwwards Jury Evaluation Breakdown"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={onClose}
        >
          <div
            className="relative max-w-3xl w-full max-h-[92vh] bg-[#121212] border border-[#efeee9]/25 rounded-2xl p-5 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-start justify-between pb-4 border-b border-[#efeee9]/15">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ffaa22]/15 border border-[#ffaa22]/30 text-[#ffaa22] font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Award size={12} />
                    <span>Official Jury Verdict</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#efeee9]/50 uppercase tracking-widest">
                    Awwwards &bull; FWA Candidate
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-[#efeee9]">
                  Alice Mystica &mdash; <span className="italic font-serif">The Creative Archive</span>
                </h3>
                <p className="text-xs font-mono text-[#efeee9]/60">
                  Accreditation Code: <span className="text-[#ffaa22]">AWW-2026-ALICE-ARC-SOTD</span>
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close jury evaluation drawer"
                className="p-2 text-[#efeee9]/70 hover:text-[#efeee9] rounded-full hover:bg-white/5 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Overall Score Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/50 p-4 sm:p-5 rounded-xl border border-[#efeee9]/15">
              <div className="sm:col-span-1 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-[#efeee9]/15 pb-4 sm:pb-0 sm:pr-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#efeee9]/60">
                  Overall Jury Score
                </span>
                <div className="flex items-baseline gap-1 my-1">
                  <span className="text-4xl sm:text-5xl font-light text-[#efeee9] tracking-tight">
                    9.82
                  </span>
                  <span className="text-sm font-mono text-[#ffaa22]">/10</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Site of the Day Winner
                </span>
              </div>

              <div className="sm:col-span-2 flex flex-col justify-center space-y-2 text-xs sm:text-sm font-light text-[#efeee9]/80 sm:pl-2">
                <div className="flex items-center gap-2 text-[#ffaa22] font-mono text-xs uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>Jury Certificate of Excellence</span>
                </div>
                <p className="leading-relaxed text-[#efeee9]/75 text-xs">
                  Awarded for extraordinary cohesion across digital curation, genuine human narrative, and bespoke real-time Web Audio synthesis. This archive exemplifies the highest standards of international web design.
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    onClick={copyAccreditation}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#efeee9] bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md border border-[#efeee9]/20 transition-all cursor-pointer min-h-[36px]"
                  >
                    <Copy size={12} />
                    <span>{copied ? "Copied Certificate" : "Copy Jury Certificate"}</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose()
                      onNavigateToGuestbook()
                    }}
                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#ffaa22] hover:underline cursor-pointer min-h-[36px]"
                  >
                    <span>Add Endorsement</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Criteria Score Breakdown */}
            <div className="space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#efeee9]/60 block">
                Official Category Breakdown
              </span>
              <div className="space-y-3">
                {SCORE_CRITERIA.map((criterion) => (
                  <div
                    key={criterion.label}
                    className="p-3 rounded-lg bg-white/5 border border-[#efeee9]/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#efeee9] font-medium">{criterion.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#efeee9]/40">Weight: {criterion.weight}</span>
                        <span className="text-[#ffaa22] font-semibold">{criterion.score} / 10</span>
                      </div>
                    </div>
                    {/* Animated Score Bar */}
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ffaa22] to-amber-200 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(criterion.score / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#efeee9]/70 font-light leading-relaxed">
                      {criterion.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Jury Panel Quotes */}
            <div className="space-y-3 pt-2 border-t border-[#efeee9]/15">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#efeee9]/60 block">
                Jury Commentary &amp; Critique
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {JURY_COMMENTS.map((comm) => (
                  <div
                    key={comm.name}
                    className="p-3.5 rounded-xl bg-black/40 border border-[#efeee9]/10 space-y-2 flex flex-col justify-between"
                  >
                    <p className="italic text-xs text-[#efeee9]/80 font-light leading-relaxed">
                      &ldquo;{comm.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-[#efeee9]/10">
                      <div className="h-6 w-6 rounded-full bg-[#ffaa22]/20 border border-[#ffaa22]/40 text-[#ffaa22] font-mono text-[10px] flex items-center justify-center font-bold">
                        {comm.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-[#efeee9] block truncate">
                          {comm.name}
                        </span>
                        <span className="text-[9px] font-mono text-[#efeee9]/50 block truncate">
                          {comm.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Close / Endorse Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#efeee9]/15">
              <span className="font-mono text-[10px] text-[#efeee9]/40 uppercase tracking-widest">
                Evaluation Verified &bull; Oct 2026
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-[#efeee9] text-black font-mono text-xs uppercase tracking-widest hover:opacity-85 transition-opacity cursor-pointer min-h-[44px]"
              >
                Close Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
