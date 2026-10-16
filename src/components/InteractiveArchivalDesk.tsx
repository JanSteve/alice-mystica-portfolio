import React, { useRef, useState, useEffect } from 'react'
import {
  Shuffle,
  RotateCcw,
  LayoutGrid,
  Maximize2,
  Move,
  Info,
  Sparkles,
  Camera
} from 'lucide-react'

export interface ArchivalDeskCard {
  id: string
  photoIndex: number
  title: string
  subtitle: string
  date: string
  digicamStamp: string
  note: string
  image: string
  x: number
  y: number
  rotation: number
  zIndex: number
}

interface InteractiveArchivalDeskProps {
  onOpenLightbox: (index: number) => void
  onPlayTick: () => void
  digicamEnabled: boolean
}

const INITIAL_CARDS: ArchivalDeskCard[] = [
  {
    id: 'desk-hero-red',
    photoIndex: 0,
    title: 'Noir Illumination',
    subtitle: 'Dramatic Red Light Study',
    date: 'Archive 2025',
    digicamStamp: "'25 10 15 21:40",
    note: 'Dramatic red presence & creative becoming.',
    image: '/assets/alice_hero_red.png',
    x: 40,
    y: 40,
    rotation: -4,
    zIndex: 1,
  },
  {
    id: 'desk-smile',
    photoIndex: 1,
    title: 'Candid Warmth',
    subtitle: '(Can you kiss me more?)',
    date: 'Archive Candid',
    digicamStamp: "'25 04 12 18:24",
    note: 'Effortless joy and unposed laughter.',
    image: '/assets/alice_smile_portrait.jpg',
    x: 290,
    y: 70,
    rotation: 5,
    zIndex: 2,
  },
  {
    id: 'desk-childhood-2020',
    photoIndex: 2,
    title: '27 November 2020',
    subtitle: 'Childhood CCD Sensor Frame',
    date: '27 Nov 2020 • 3:56 PM',
    digicamStamp: "'20 11 27 15:56",
    note: 'Amber digicam memories & innocent curiosity.',
    image: '/assets/alice_childhood_2020.jpg',
    x: 540,
    y: 35,
    rotation: -3,
    zIndex: 3,
  },
  {
    id: 'desk-school',
    photoIndex: 3,
    title: 'School Days & Roots',
    subtitle: 'Uniform & First Foundations',
    date: 'Primary School Years',
    digicamStamp: "'14 06 18 08:30",
    note: 'Early learning, discipline, and discovery.',
    image: '/assets/alice_school_uniform.jpg',
    x: 140,
    y: 280,
    rotation: 6,
    zIndex: 4,
  },
  {
    id: 'desk-playful',
    photoIndex: 4,
    title: 'Playful Spirit',
    subtitle: 'Unfiltered Authenticity',
    date: 'Childhood Chronicles',
    digicamStamp: "'16 08 24 16:15",
    note: 'Red sweatshirt, spontaneity & character.',
    image: '/assets/alice_childhood_playful.jpg',
    x: 420,
    y: 270,
    rotation: -5,
    zIndex: 5,
  },
]

export function InteractiveArchivalDesk({
  onOpenLightbox,
  onPlayTick,
  digicamEnabled,
}: InteractiveArchivalDeskProps) {
  const deskRef = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<ArchivalDeskCard[]>(INITIAL_CARDS)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [highestZ, setHighestZ] = useState<number>(10)
  const [deskWidth, setDeskWidth] = useState<number>(900)

  // Track initial drag coords
  const dragStateRef = useRef<{
    pointerStartX: number
    pointerStartY: number
    cardStartX: number
    cardStartY: number
  }>({
    pointerStartX: 0,
    pointerStartY: 0,
    cardStartX: 0,
    cardStartY: 0,
  })

  // Measure desk width for responsive boundaries
  useEffect(() => {
    const handleResize = () => {
      if (deskRef.current) {
        setDeskWidth(deskRef.current.clientWidth)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Pointer Down: grab card & elevate z-index
  const handlePointerDown = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.stopPropagation()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}

    onPlayTick()
    const nextZ = highestZ + 1
    setHighestZ(nextZ)
    setActiveDragId(id)

    const card = cards.find((c) => c.id === id)
    if (card) {
      dragStateRef.current = {
        pointerStartX: e.clientX,
        pointerStartY: e.clientY,
        cardStartX: card.x,
        cardStartY: card.y,
      }
      // Update card z-index immediately
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, zIndex: nextZ } : c))
      )
    }
  }

  // Pointer Move: translate card within bounds
  const handlePointerMove = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDragId !== id) return
    const deltaX = e.clientX - dragStateRef.current.pointerStartX
    const deltaY = e.clientY - dragStateRef.current.pointerStartY

    const desk = deskRef.current
    const deskW = desk ? desk.clientWidth : 900
    const deskH = desk ? desk.clientHeight : 600

    const cardW = window.innerWidth < 640 ? 180 : 230
    const cardH = window.innerWidth < 640 ? 250 : 310

    const maxX = Math.max(10, deskW - cardW - 10)
    const maxY = Math.max(10, deskH - cardH - 10)

    const newX = Math.max(10, Math.min(maxX, dragStateRef.current.cardStartX + deltaX))
    const newY = Math.max(10, Math.min(maxY, dragStateRef.current.cardStartY + deltaY))

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x: newX, y: newY } : c))
    )
  }

  // Pointer Up: release capture
  const handlePointerUp = (id: string, e: React.PointerEvent<HTMLDivElement>) => {
    if (activeDragId === id) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {}
      setActiveDragId(null)
      onPlayTick()
    }
  }

  // Scatter randomly across desk
  const scatterCards = () => {
    onPlayTick()
    const desk = deskRef.current
    const deskW = desk ? desk.clientWidth : 900
    const deskH = desk ? desk.clientHeight : 600
    const cardW = window.innerWidth < 640 ? 170 : 220
    const cardH = window.innerWidth < 640 ? 240 : 300

    setCards((prev) =>
      prev.map((card, idx) => {
        const maxX = Math.max(20, deskW - cardW - 30)
        const maxY = Math.max(20, deskH - cardH - 30)
        const randX = 20 + Math.random() * (maxX - 20)
        const randY = 20 + Math.random() * (maxY - 20)
        const randRot = -10 + Math.random() * 20
        return {
          ...card,
          x: Math.round(randX),
          y: Math.round(randY),
          rotation: Math.round(randRot),
          zIndex: idx + 1,
        }
      })
    )
  }

  // Arrange in clean grid lineup
  const gridCards = () => {
    onPlayTick()
    const isMobile = window.innerWidth < 640
    const cardW = isMobile ? 150 : 210
    const gap = isMobile ? 14 : 24

    setCards((prev) =>
      prev.map((card, idx) => {
        let x = 0
        let y = 0
        if (isMobile) {
          // 2 columns
          const col = idx % 2
          const row = Math.floor(idx / 2)
          x = 16 + col * (cardW + gap)
          y = 20 + row * 230
        } else {
          // 3 in row 1, 2 in row 2 centered
          if (idx < 3) {
            x = 40 + idx * (cardW + gap + 30)
            y = 30
          } else {
            x = 140 + (idx - 3) * (cardW + gap + 40)
            y = 290
          }
        }
        return {
          ...card,
          x,
          y,
          rotation: 0,
          zIndex: idx + 1,
        }
      })
    )
  }

  // Reset to initial curated layout
  const resetCards = () => {
    onPlayTick()
    setCards(INITIAL_CARDS)
  }

  return (
    <div className="space-y-4">
      {/* Desk Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#121212] border border-[#efeee9]/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#efeee9]/70">
              Interactive Archival Desk &bull; Moodboard
            </span>
          </div>
          <p className="text-xs text-[#efeee9]/60 font-light">
            Freely drag, stack, rotate, and inspect Alice&apos;s 5 authentic memory prints.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={scatterCards}
            aria-label="Scatter memory cards across desk"
            className="px-3 py-1.5 rounded-full border border-[#efeee9]/20 bg-white/5 hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
          >
            <Shuffle size={13} />
            <span>Scatter</span>
          </button>
          <button
            onClick={gridCards}
            aria-label="Organize into clean editorial grid"
            className="px-3 py-1.5 rounded-full border border-[#efeee9]/20 bg-white/5 hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
          >
            <LayoutGrid size={13} />
            <span>Lineup</span>
          </button>
          <button
            onClick={resetCards}
            aria-label="Reset desk to default arrangement"
            className="px-3 py-1.5 rounded-full border border-[#efeee9]/20 bg-white/5 hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tactile Archival Desk Canvas */}
      <div
        ref={deskRef}
        className="relative w-full h-[620px] sm:h-[660px] bg-[#0a0a0a] rounded-2xl border border-[#efeee9]/20 overflow-hidden shadow-2xl select-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(239, 238, 233, 0.03) 1px, transparent 1px),
            linear-gradient(to right, rgba(239, 238, 233, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(239, 238, 233, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px, 32px 32px, 32px 32px',
        }}
      >
        {/* Desk Watermark & Corner Tape Badges */}
        <div className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-[0.25em] text-[#efeee9]/30 pointer-events-none">
          TABLE NO. 01 &bull; CURATOR&apos;S DESK &bull; 5 ARCHIVAL FRAMES
        </div>

        <div className="absolute bottom-4 right-4 text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/30 pointer-events-none flex items-center gap-2">
          <Move size={12} />
          <span>DRAG CARDS TO STACK OR DOUBLE-TAP TO EXPAND</span>
        </div>

        {/* 5 Draggable Archival Polaroid Prints */}
        {cards.map((card) => {
          const isDragging = activeDragId === card.id

          return (
            <div
              key={card.id}
              onPointerDown={(e) => handlePointerDown(card.id, e)}
              onPointerMove={(e) => handlePointerMove(card.id, e)}
              onPointerUp={(e) => handlePointerUp(card.id, e)}
              onPointerCancel={(e) => handlePointerUp(card.id, e)}
              style={{
                transform: `translate3d(${card.x}px, ${card.y}px, 0) rotate(${
                  isDragging ? card.rotation + 2 : card.rotation
                }deg) scale(${isDragging ? 1.05 : 1})`,
                zIndex: card.zIndex,
                touchAction: 'none',
                transition: isDragging
                  ? 'none'
                  : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease',
              }}
              className={`absolute top-0 left-0 w-[180px] sm:w-[220px] bg-[#f4f3ee] text-[#111111] p-3 pb-4 rounded-sm transition-shadow cursor-grab active:cursor-grabbing will-change-transform ${
                isDragging ? 'polaroid-active shadow-2xl' : 'polaroid-idle'
              }`}
            >
              {/* Semi-Transparent Washi Tape Strip on Top */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-100/50 backdrop-blur-xs border border-black/10 rounded-xs shadow-xs pointer-events-none rotate-[-1deg]"
                aria-hidden="true"
              />

              {/* Polaroid Image Frame */}
              <div className="relative aspect-[4/5] bg-black overflow-hidden rounded-xs border border-black/10 mb-2.5">
                <img
                  src={card.image}
                  alt={card.title}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />

                {/* Digicam Quartz Amber Timestamp on Polaroid */}
                {digicamEnabled && (
                  <div className="absolute bottom-2 left-2 bg-black/75 px-1.5 py-0.5 rounded border border-[#ffaa22]/30 pointer-events-none">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-[#ffaa22] digicam-glow">
                      {card.digicamStamp}
                    </span>
                  </div>
                )}

                {/* Inspect Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenLightbox(card.photoIndex)
                  }}
                  title="Expand to Fullscreen Lightbox"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer opacity-80 hover:opacity-100 shadow-md"
                >
                  <Maximize2 size={12} />
                </button>
              </div>

              {/* Handwritten Style Caption Area */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-black/60">
                  <span className="font-bold">{card.date}</span>
                  <span>Frame 0{card.photoIndex + 1}</span>
                </div>
                <h4 className="text-xs font-semibold text-black tracking-tight leading-snug">
                  {card.title}
                </h4>
                <p className="text-[10px] text-black/75 italic font-serif leading-tight">
                  &ldquo;{card.note}&rdquo;
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InteractiveArchivalDesk
