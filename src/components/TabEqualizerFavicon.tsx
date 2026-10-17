import { useEffect, useRef } from 'react'
import { boutiqueSoundEngine } from '../audio/AllTheStarsSoundscape'

interface TabEqualizerFaviconProps {
  isPlaying: boolean
}

const DEFAULT_TITLE = "Alice — Mystica • The Creative Archive"
const DEFAULT_FAVICON = "/assets/alice_hero_red.png"

const TITLE_EQUALIZER_FRAMES = [
  "Alice — Mystica [ ılıll ]",
  "Alice — Mystica [ llıll ]",
  "Alice — Mystica [ ıllıl ]",
  "Alice — Mystica [ lılll ]",
  "Alice — Mystica [ ıllll ]",
  "Alice — Mystica [ lıllı ]",
  "Alice — Mystica [ ıllı| ]",
  "Alice — Mystica [ |lıll ]",
]

export function TabEqualizerFavicon({ isPlaying }: TabEqualizerFaviconProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const titleTimerRef = useRef<number | null>(null)
  const frameIndexRef = useRef(0)
  const lastDrawTimeRef = useRef(0)

  useEffect(() => {
    // Locate or create the <link rel="icon"> element
    let faviconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
    if (!faviconLink) {
      faviconLink = document.createElement('link')
      faviconLink.rel = 'shortcut icon'
      document.head.appendChild(faviconLink)
    }

    if (!isPlaying) {
      // Revert immediately to default metadata
      document.title = DEFAULT_TITLE
      faviconLink.href = DEFAULT_FAVICON
      return
    }

    // Initialize 32x32 offscreen canvas
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      canvasRef.current = canvas
    }
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 1. Dynamic Title Equalizer (~160ms cycle, ~6 FPS)
    titleTimerRef.current = window.setInterval(() => {
      frameIndexRef.current = (frameIndexRef.current + 1) % TITLE_EQUALIZER_FRAMES.length
      document.title = TITLE_EQUALIZER_FRAMES[frameIndexRef.current]
    }, 160)

    // 2. Dancing Favicon Visualizer (Throttled to ~14 FPS for max battery/CPU efficiency)
    const FPS = 14
    const interval = 1000 / FPS

    const drawFavicon = (timestamp: number) => {
      if (!lastDrawTimeRef.current) lastDrawTimeRef.current = timestamp
      const elapsed = timestamp - lastDrawTimeRef.current

      if (elapsed > interval) {
        lastDrawTimeRef.current = timestamp - (elapsed % interval)

        const levels = boutiqueSoundEngine.getEqualizerLevels()
        const barHeights = [levels.bar1, levels.bar2, levels.bar3, levels.bar4]

        // Clear canvas
        ctx.clearRect(0, 0, 32, 32)

        // Draw sleek dark background badge
        ctx.fillStyle = '#0d0d0d'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(0, 0, 32, 32, 8)
        } else {
          ctx.rect(0, 0, 32, 32)
        }
        ctx.fill()

        // Draw micro border
        ctx.strokeStyle = 'rgba(239, 238, 233, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Equalizer bar dimensions
        const barWidth = 4
        const gap = 3
        const startX = 3.5 // (32 - (4*4 + 3*3)) / 2 = 3.5
        const maxBarHeight = 20
        const bottomY = 26

        barHeights.forEach((lvl, i) => {
          const x = startX + i * (barWidth + gap)
          const h = Math.max(3, lvl * maxBarHeight)
          const y = bottomY - h

          // Gradient from amber #ffaa22 to cream #efeee9
          const grad = ctx.createLinearGradient(0, bottomY, 0, y)
          grad.addColorStop(0, '#ffaa22')
          grad.addColorStop(1, '#efeee9')

          ctx.fillStyle = grad
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(x, y, barWidth, h, 2)
          } else {
            ctx.rect(x, y, barWidth, h)
          }
          ctx.fill()
        })

        // Update favicon href
        faviconLink.href = canvas.toDataURL('image/png')
      }

      animFrameRef.current = requestAnimationFrame(drawFavicon)
    }

    animFrameRef.current = requestAnimationFrame(drawFavicon)

    return () => {
      if (titleTimerRef.current) clearInterval(titleTimerRef.current)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      document.title = DEFAULT_TITLE
      if (faviconLink) faviconLink.href = DEFAULT_FAVICON
    }
  }, [isPlaying])

  return null
}
