import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// Alice Mystica Official Assets
const ALICE_BG_URL = "/assets/alice_editorial_bg.jpg"
const ALICE_CUTOUT_URL = "/assets/alice_cutout.png"

interface CreativeInterest {
  number: string
  title: string
  desc: string
  image: string
  quote: string
}

const CREATIVE_INTERESTS: CreativeInterest[] = [
  {
    number: "01",
    title: "Journaling & Personal Writing",
    desc: "Journaling is my way of documenting thoughts, emotions, ideas, memories, and everyday experiences. I appreciate the freedom of putting thoughts into words and turning ordinary moments into something worth remembering. Through journaling, I explore reflection, observation, and storytelling while creating a personal record of different phases of my life.",
    image: "/assets/alice_creative.jpg",
    quote: "Turning ordinary moments into something worth remembering."
  },
  {
    number: "02",
    title: "Music & Discovery",
    desc: "Music is an important part of how I experience and interpret the world around me. I enjoy discovering songs, exploring different artists and genres, creating playlists, and finding music that connects with particular moods, memories, and moments. My musical interests reflect my curiosity and appreciation for creative expression in different forms.",
    image: "/assets/alice_night.jpg",
    quote: "Finding songs that connect with moods, memories, and moments."
  },
  {
    number: "03",
    title: "Art & Visual Creativity",
    desc: "Art allows me to explore ideas visually and experiment with colour, composition, textures, and concepts. I enjoy the process of creating, observing details, and finding inspiration in everyday surroundings. For me, art is an opportunity to communicate ideas beyond words and to appreciate the individuality of different creative perspectives.",
    image: "/assets/alice_style.jpg",
    quote: "Communicating ideas beyond words through color and composition."
  },
  {
    number: "04",
    title: "Makeup & Beauty",
    desc: "My interest in makeup comes from its ability to combine creativity, technique, experimentation, and personal expression. I enjoy exploring different looks, colour combinations, products, and beauty aesthetics. I see makeup as a creative practice that offers endless opportunities to experiment with presentation, mood, and visual storytelling.",
    image: "/assets/alice_hero_portrait.jpg",
    quote: "A creative practice blending experimentation and visual storytelling."
  },
  {
    number: "05",
    title: "Fashion & Personal Style",
    desc: "Fashion is another way I express creativity and individuality. I enjoy exploring outfit combinations, discovering different aesthetics, drawing inspiration from fashion imagery, and experimenting with styling. My interest extends beyond clothing to the way colours, accessories, textures, and details can communicate a mood or tell a story.",
    image: "/assets/alice_fashion_1.jpg",
    quote: "Colors, textures, and details communicating mood and presence."
  },
  {
    number: "06",
    title: "Archive Photography",
    desc: "Photography allows me to preserve moments that might otherwise disappear into the ordinary passage of time. I am drawn to candid photographs, everyday details, digicam aesthetics, visual imperfections, and the nostalgic quality of captured memories. Through photography, I enjoy documenting experiences as they unfold and building a visual archive of places, people, moments, and perspectives that matter to me.",
    image: "/assets/alice_fashion_2.jpg",
    quote: "Preserving moments that might otherwise disappear into ordinary time."
  },
  {
    number: "07",
    title: "Vlogging & Digital Storytelling",
    desc: "Vlogging combines my interests in documentation, creativity, and storytelling. I enjoy the idea of capturing everyday experiences, college life, memorable occasions, spontaneous moments, and behind-the-scenes glimpses through video. It offers a way to transform ordinary experiences into personal narratives and to explore how editing, visuals, sound, and sequencing can communicate a story.",
    image: "/assets/alice_creative.jpg",
    quote: "Transforming everyday experiences into intimate personal narratives."
  },
  {
    number: "08",
    title: "Public Speaking & Communication",
    desc: "Public speaking is an important part of my personal and professional development. I value opportunities to express ideas, engage with audiences, participate in discussions, and communicate with confidence. Through seminars, presentations, college activities, and speaking opportunities, I aim to strengthen my ability to articulate thoughts clearly, connect with people, and approach new challenges with confidence. My interest in public speaking complements my academic journey in business administration, where communication, leadership, collaboration, and critical thinking play an important role.",
    image: "/assets/alice_hero_portrait.jpg",
    quote: "Articulating ideas with confidence, curiosity, and leadership."
  }
]

type ActiveSpreadType = 'archive' | 'interests' | 'milestones' | 'message' | null

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeSpread, setActiveSpread] = useState<ActiveSpreadType>(null)
  const [selectedInterest, setSelectedInterest] = useState<number>(0)
  const [messageSent, setMessageSent] = useState(false)

  // Ensure document title matches exact specification: Alice — Mystica (em dash)
  useEffect(() => {
    document.title = "Alice \u2014 Mystica"
  }, [])

  // Lock body scroll when mobile drawer or editorial spread is open
  useEffect(() => {
    if (drawerOpen || activeSpread) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, activeSpread])

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev)
  }

  const handleNavClick = (target: ActiveSpreadType) => {
    setDrawerOpen(false)
    setActiveSpread(target)
  }

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-[#0d0d0d] text-cream font-hn select-none">
      
      {/* =========================================================================
          LAYER ORDER (Z-INDEX) — exact Marcus — Bennet editorial recreation
          1. BG image: default z (full-bleed background, anim-fade-in)
          2. Marquee name: z-10 (scrolling “Alice — Mystica”, anim-fade-up delay 500ms)
          3. Horizontal cream rule: z-10 (scaleX 0->1, anim-line delay 1200ms)
          4. Desktop footer: sm:z-10 (bottom copy, anim-fade-up delay 1400ms & 1550ms)
          5. Front portrait: z-20 (cutout overlay over marquee, pointer-events none, anim-rise-in delay 300ms)
          6. Header + mobile footer: z-30 (chrome, anim-fade-up delays)
          7. Mobile drawer: z-40 (overlay + panel)
          8. Hamburger / close: z-50 (always on top)
          ========================================================================= */}

      {/* LAYER 1: Background image (default z, full-bleed, anim-fade-in, alt empty) */}
      <img
        src={ALICE_BG_URL}
        alt=""
        className="absolute inset-0 h-full w-full object-cover pointer-events-none anim-fade-in"
      />

      {/* LAYER 2: Marquee name (z-10, top-[16vh] sm:top-[14vh], anim-fade-up delay-marquee) */}
      <div className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden pointer-events-none anim-fade-up delay-marquee">
        <div className="marquee flex w-max whitespace-nowrap font-hn text-[16vh] sm:text-[26vh] leading-none text-cream">
          {/* Half 1 */}
          <span className="pr-[6vw]">
            Alice &mdash; Mystica&nbsp;
          </span>
          {/* Half 2 for seamless infinite scroll */}
          <span className="pr-[6vw]">
            Alice &mdash; Mystica&nbsp;
          </span>
        </div>
      </div>

      {/* LAYER 3: Horizontal cream rule (z-10, scaleX 0->1, origin left, delay 1200ms) */}
      <div className="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream anim-line" />

      {/* LAYER 4: Desktop footer (sm:z-10) / Mobile footer (z-30) */}
      <footer className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn pointer-events-auto">
        {/* Footer left: three lines (delay 1400ms) */}
        <div className="anim-fade-up delay-footer-left flex flex-col text-cream font-light">
          <span>Creative Archive</span>
          <span>Visual Storyteller</span>
          <span>BBA Student &amp; Observer</span>
        </div>

        {/* Footer right: right-aligned (delay 1550ms) */}
        <div className="anim-fade-up delay-footer-right text-right flex flex-col text-cream font-light">
          <span>A collection of</span>
          <span>creativity, expression &amp; becoming</span>
        </div>
      </footer>

      {/* LAYER 5: Front portrait cutout overlay (z-20, above marquee, pointer-events none, anim-rise-in delay 300ms) */}
      <img
        src={ALICE_CUTOUT_URL}
        alt="Portrait of Alice Mystica"
        className="absolute inset-0 z-20 h-full w-full object-cover pointer-events-none anim-rise-in"
      />

      {/* LAYER 6: Header Chrome (z-30, absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8) */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8 pointer-events-none">
        {/* Brand / logo link (top-left): font-hn text-lg tracking-wide */}
        <div className="pointer-events-auto flex items-center gap-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setActiveSpread(null)
            }}
            className="font-hn text-lg tracking-wide text-cream hover:opacity-60 transition-opacity duration-300 block anim-fade-up delay-brand"
          >
            Alice
          </a>
        </div>

        {/* Right cluster (desktop only: hidden sm:flex items-start gap-16 lg:gap-24) */}
        <div className="hidden sm:flex items-start gap-16 lg:gap-24 text-cream pointer-events-auto">
          {/* Year text-sm (delay 900ms) */}
          <div className="text-sm font-light anim-fade-up delay-year">
            2025
          </div>

          {/* Nav: vertical stack flex-col gap-0.5 text-sm, hover opacity-60 over 300ms */}
          <nav className="flex flex-col gap-0.5 text-sm font-light">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavClick('archive') }}
              className="hover:opacity-60 transition-opacity duration-300 anim-fade-up delay-nav-0 tracking-wide text-left cursor-pointer"
            >
              Archive
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavClick('interests') }}
              className="hover:opacity-60 transition-opacity duration-300 anim-fade-up delay-nav-1 tracking-wide text-left cursor-pointer"
            >
              Interests
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavClick('milestones') }}
              className="hover:opacity-60 transition-opacity duration-300 anim-fade-up delay-nav-2 tracking-wide text-left cursor-pointer"
            >
              Milestones
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavClick('message') }}
              className="hover:opacity-60 transition-opacity duration-300 anim-fade-up delay-nav-3 tracking-wide text-left cursor-pointer"
            >
              Message
            </a>
          </nav>

          {/* Social: same stack/hover (delays 1150ms, 1230ms, 1310ms) */}
          <div className="flex flex-col gap-0.5 text-sm font-light">
            <a
              href="#"
              className="hover:opacity-60 transition-opacity duration-300 anim-fade-up delay-social-0 tracking-wide"
            >
              Instagram
            </a>
            <a
              href="#"
              className="hover:opacity-60 transition-opacity duration-300 anim-fade-up delay-social-1 tracking-wide"
            >
              TikTok
            </a>
            <a
              href="#"
              className="hover:opacity-60 transition-opacity duration-300 anim-fade-up delay-social-2 tracking-wide"
            >
              YouTube
            </a>
          </div>
        </div>
      </header>

      {/* LAYER 8: Hamburger Button (z-50, sm:hidden, 3 cream bars in h-10 w-10, bars in h-4 w-6, delay 900ms) */}
      <button
        onClick={toggleDrawer}
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
        className="sm:hidden fixed right-6 top-6 z-50 h-10 w-10 flex items-center justify-center anim-fade-up delay-hamburger focus:outline-none"
      >
        <div className="relative h-4 w-6 flex flex-col justify-between items-center pointer-events-none">
          <span
            className={`block h-0.5 w-6 bg-cream rounded-full transition-transform duration-500 origin-center ${
              drawerOpen ? 'translate-y-[7px] rotate-45 opacity-0' : ''
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
          />
          <span
            className={`block h-0.5 w-6 bg-cream rounded-full transition-opacity duration-300 ${
              drawerOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-cream rounded-full transition-transform duration-500 origin-center ${
              drawerOpen ? '-translate-y-[7px] -rotate-45 opacity-0' : ''
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
          />
        </div>
      </button>

      {/* LAYER 7: MOBILE DRAWER (sm:hidden, z-40) */}
      <div
        className={`sm:hidden fixed inset-0 z-40 transition-opacity duration-500 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop: fixed inset-0 z-40, bg-black/40 backdrop-blur-sm, opacity 0<->100 over 500ms; click closes */}
        <div
          onClick={toggleDrawer}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Panel: right slide-in, w-[80%] max-w-sm, bg-[#141414], px-8 py-10, translate-x-full <-> translate-x-0, 600ms ease cubic-bezier(0.76, 0, 0.24, 1) */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[#141414] px-8 py-10 flex flex-col justify-between transition-transform duration-600 shadow-2xl border-l border-cream/10 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
        >
          {/* Close button: Lucide X (size 26, strokeWidth 1.5), absolute right-6 top-6; open: rotate 0 / opacity 1 (delay 300ms); closed: rotate 90 / opacity 0 */}
          <button
            onClick={toggleDrawer}
            aria-label="Close drawer"
            className={`absolute right-6 top-6 text-cream transition-all duration-300 focus:outline-none ${
              drawerOpen ? 'opacity-100 rotate-0 delay-300 pointer-events-auto' : 'opacity-0 rotate-90 pointer-events-none'
            }`}
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          {/* Top content: Site Index */}
          <div className="mt-12 flex flex-col">
            <span
              className={`text-xs uppercase tracking-[0.2em] text-cream/50 mb-6 transition-all duration-500 ${
                drawerOpen ? 'opacity-100 translate-y-0 delay-[250ms]' : 'opacity-0 translate-y-4'
              }`}
            >
              Site Index
            </span>

            <nav className="flex flex-col gap-5">
              {[
                { label: "Archive", action: () => handleNavClick('archive') },
                { label: "Interests", action: () => handleNavClick('interests') },
                { label: "Milestones", action: () => handleNavClick('milestones') },
                { label: "Message", action: () => handleNavClick('message') },
              ].map((item, idx) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`text-left text-4xl font-normal text-cream hover:text-cream/70 transition-all duration-500 ${
                    drawerOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6'
                  }`}
                  style={{
                    transitionDelay: drawerOpen ? `${300 + idx * 80}ms` : '0ms'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom content: Find Me */}
          <div className="mt-auto pt-8 border-t border-cream/10 flex flex-col gap-4">
            <span
              className={`text-xs uppercase tracking-[0.2em] text-cream/50 mb-1 transition-all duration-500 ${
                drawerOpen ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-3'
              }`}
            >
              Find Me
            </span>

            <div className="flex flex-wrap gap-4">
              {['Instagram', 'TikTok', 'YouTube'].map((social, idx) => (
                <a
                  key={social}
                  href="#"
                  className={`text-sm text-cream/90 hover:text-cream transition-all duration-400 ${
                    drawerOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: drawerOpen ? `${550 + idx * 60}ms` : '0ms'
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAGAZINE-GRADE EDITORIAL SPREADS: ALICE — THE CREATIVE ARCHIVE
          Pure black/cream typography, no cards, no pills, no purple, no Inter/Roboto
          ========================================================================= */}
      {activeSpread && (
        <div className="fixed inset-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10 animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#111111] border border-cream/20 overflow-y-auto text-cream p-6 sm:p-14 shadow-2xl">
            
            {/* Spread Close Button using Lucide X */}
            <button
              onClick={() => setActiveSpread(null)}
              aria-label="Close spread"
              className="absolute top-6 right-6 text-cream/60 hover:text-cream transition-colors p-2 focus:outline-none"
            >
              <X size={26} strokeWidth={1.5} />
            </button>

            {/* SPREAD 1: ARCHIVE / MANIFESTO */}
            {activeSpread === 'archive' && (
              <div className="space-y-12">
                <div className="border-b border-cream/20 pb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-cream/50 block mb-2">Manifesto &amp; Origin</span>
                  <h2 className="text-3xl sm:text-5xl font-light tracking-tight">ALICE &mdash; THE CREATIVE ARCHIVE</h2>
                  <p className="text-cream/70 text-lg mt-2 font-light italic">
                    A collection of creativity, expression, memories, and becoming.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                  <div className="md:col-span-5 space-y-4">
                    <img
                      src="/assets/alice_bba.png"
                      alt="Alice Mystica — BBA Scholar"
                      className="w-full h-[420px] object-cover grayscale hover:grayscale-0 transition-all duration-700 border border-cream/15"
                    />
                    <div className="text-xs text-cream/50 uppercase tracking-widest text-center">
                      R Alice Mystica &bull; BBA Academic &amp; Creative Archivist
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-6 text-cream/90 text-sm sm:text-base leading-relaxed font-light">
                    <h3 className="text-xl font-normal tracking-wide text-cream">About Me</h3>
                    <p>
                      I am a BBA student with a curious mind, a creative spirit, and a deep appreciation for the little things that make life meaningful. My interests lie at the intersection of creativity, self-expression, communication, and storytelling. I enjoy exploring different forms of expression, whether through words, visuals, music, personal style, or the experiences I collect along the way.
                    </p>
                    <p>
                      For me, creativity is not limited to a single medium. It is present in the way I document my thoughts, capture fleeting moments, experiment with aesthetics, discover music, express myself through fashion, and communicate ideas to others. I am drawn to experiences that allow me to observe, interpret, create, and share my perspective with the world.
                    </p>
                    <p>
                      This portfolio is a reflection of those interests. It is a personal archive of my creative pursuits, inspirations, experiences, and growth &mdash; a space where my personal and professional identities come together.
                    </p>

                    <div className="pt-6 border-t border-cream/15 space-y-3">
                      <h4 className="text-lg font-normal text-cream">Beyond My Hobbies</h4>
                      <p className="text-sm text-cream/80 leading-relaxed">
                        As a BBA student, I am interested in developing a broader understanding of business, management, communication, and the way ideas become meaningful projects. I believe that creativity and professional skills can complement each other. Creative thinking encourages fresh perspectives, while communication helps transform those perspectives into ideas that others can understand and engage with.
                      </p>
                      <p className="text-sm text-cream/80 leading-relaxed">
                        I value opportunities that allow me to learn, participate, collaborate, explore new experiences, and challenge myself. Whether I am working on a college project, preparing a presentation, documenting an experience, or experimenting with a new creative idea, I see every experience as an opportunity to develop a new skill or perspective.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-cream/15 space-y-3">
                      <h4 className="text-lg font-normal text-cream">My Philosophy</h4>
                      <p className="text-sm text-cream/80 leading-relaxed italic">
                        &ldquo;I believe that a person can have many interests without needing to fit into a single category. I want to keep exploring different creative outlets, learning new things, documenting experiences, and discovering new dimensions of myself.
                      </p>
                      <p className="text-sm text-cream/80 leading-relaxed italic">
                        I see this portfolio not simply as a collection of hobbies, but as a record of curiosity, experimentation, personal growth, and ambition. Every photograph, page, creative experiment, speech, and memory represents a small part of a much larger journey.
                      </p>
                      <p className="text-sm text-cream font-medium">
                        I am still learning, still exploring, and still discovering what I can create. This is my archive &mdash; a reflection of who I am, what inspires me, and who I am becoming.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SPREAD 2: THE 8 CREATIVE INTERESTS */}
            {activeSpread === 'interests' && (
              <div className="space-y-10">
                <div className="border-b border-cream/20 pb-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-cream/50 block mb-1">Curation &amp; Disciplines</span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight">MY CREATIVE INTERESTS</h2>
                  <p className="text-cream/60 text-sm mt-1">Eight distinct avenues of exploration, aesthetics, and expression.</p>
                </div>

                {/* 8 Categories Navigation */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-cream/15 pb-4">
                  {CREATIVE_INTERESTS.map((item, index) => (
                    <button
                      key={item.number}
                      onClick={() => setSelectedInterest(index)}
                      className={`text-left p-3 text-xs uppercase tracking-wider transition-all duration-300 border ${
                        selectedInterest === index
                          ? 'bg-cream text-black border-cream font-medium'
                          : 'bg-black/30 text-cream/70 border-cream/10 hover:border-cream/30 hover:text-cream'
                      }`}
                    >
                      <span className="block text-[10px] opacity-60 mb-0.5">{item.number}</span>
                      <span className="truncate block font-normal">{item.title.split('&')[0]}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Category Feature */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-black/40 p-6 sm:p-8 border border-cream/15">
                  <div className="md:col-span-6 space-y-4">
                    <span className="text-xs uppercase tracking-[0.25em] text-cream/50 block font-mono">
                      Category {CREATIVE_INTERESTS[selectedInterest].number} / 08
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light text-cream tracking-tight">
                      {CREATIVE_INTERESTS[selectedInterest].title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-cream/80 font-light">
                      {CREATIVE_INTERESTS[selectedInterest].desc}
                    </p>
                    {CREATIVE_INTERESTS[selectedInterest].quote && (
                      <div className="pl-4 border-l-2 border-cream/40 italic text-sm text-cream/70 py-1 font-serif">
                        &ldquo;{CREATIVE_INTERESTS[selectedInterest].quote}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-6">
                    <div className="relative overflow-hidden h-[360px] border border-cream/15 shadow-xl">
                      <img
                        src={CREATIVE_INTERESTS[selectedInterest].image}
                        alt={CREATIVE_INTERESTS[selectedInterest].title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                        <span className="text-xs uppercase tracking-widest text-cream/80">
                          The Archive &bull; {CREATIVE_INTERESTS[selectedInterest].title}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Archival Photography Gallery */}
                <div className="pt-6 border-t border-cream/15">
                  <h4 className="text-xs uppercase tracking-[0.25em] text-cream/50 mb-4">Visual Documentation Index</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { src: "/assets/alice_style.jpg", caption: "Style & Aesthetics" },
                      { src: "/assets/alice_night.jpg", caption: "Balcony Moods" },
                      { src: "/assets/alice_creative.jpg", caption: "Creative Documentation" },
                      { src: "/assets/alice_fashion_2.jpg", caption: "Archival Photography" },
                    ].map((img, i) => (
                      <div key={i} className="group relative h-40 overflow-hidden border border-cream/10 bg-black">
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                          <span className="text-[11px] text-cream uppercase tracking-wider">{img.caption}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SPREAD 3: ACHIEVEMENTS & MILESTONES */}
            {activeSpread === 'milestones' && (
              <div className="space-y-10">
                <div className="border-b border-cream/20 pb-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-cream/50 block mb-1">Recognition &amp; Leadership</span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight">ACHIEVEMENTS &amp; MILESTONES</h2>
                  <p className="text-cream/60 text-sm mt-1">Foundational moments shaping my communication, leadership, and public engagement.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Milestone 1 */}
                  <div className="p-6 bg-black/40 border border-cream/15 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-mono text-cream/40 uppercase tracking-widest block mb-1">Milestone 01</span>
                      <h3 className="text-xl font-normal text-cream tracking-tight mb-2">
                        An Interaction with the Hon’ble Finance Minister of India
                      </h3>
                      <h4 className="text-sm font-medium text-cream/70 mb-3 tracking-wide">
                        Smt. Nirmala Sitharaman
                      </h4>
                      <p className="text-sm text-cream/80 leading-relaxed font-light">
                        Had the opportunity to meet and interact with the Hon’ble Finance Minister of India, Smt. Nirmala Sitharaman. This was a memorable milestone that strengthened my interest in communication, public engagement, leadership, and learning from distinguished personalities.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-cream/10 text-xs text-cream/50 flex items-center justify-between">
                      <span>Public Engagement &bull; Leadership</span>
                      <span className="text-cream/60 uppercase tracking-wider">&bull; Milestone</span>
                    </div>
                  </div>

                  {/* Milestone 2 */}
                  <div className="p-6 bg-black/40 border border-cream/15 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-mono text-cream/40 uppercase tracking-widest block mb-1">Milestone 02</span>
                      <h3 className="text-xl font-normal text-cream tracking-tight mb-2">
                        Second Prize &mdash; CBSE Storytelling Competition
                      </h3>
                      <h4 className="text-sm font-medium text-cream/70 mb-3 tracking-wide">
                        Creative Narration &amp; Expression
                      </h4>
                      <p className="text-sm text-cream/80 leading-relaxed font-light">
                        Received Second Prize in a CBSE Storytelling Competition, recognising my interest in storytelling, creative expression, and effective communication. This achievement reflects my enthusiasm for presenting ideas, engaging an audience, and expressing narratives with confidence.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-cream/10 text-xs text-cream/50 flex items-center justify-between">
                      <span>Narrative Expression &bull; Public Speaking</span>
                      <span className="text-cream/60 uppercase tracking-wider">&bull; Milestone</span>
                    </div>
                  </div>
                </div>

                {/* What these mean */}
                <div className="p-6 bg-[#161616] border-l-2 border-cream/60 space-y-2">
                  <h4 className="text-sm uppercase tracking-[0.2em] text-cream font-medium">What These Experiences Mean to Me</h4>
                  <p className="text-sm text-cream/80 leading-relaxed font-light">
                    These milestones represent two important aspects of my journey: the confidence to express myself and the curiosity to learn from others. They continue to inspire me to explore public speaking, develop my communication skills, and pursue opportunities that challenge me to grow personally and professionally.
                  </p>
                </div>
              </div>
            )}

            {/* SPREAD 4: MESSAGE & DIALOGUE */}
            {activeSpread === 'message' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="border-b border-cream/20 pb-4 text-center">
                  <span className="text-xs uppercase tracking-[0.3em] text-cream/50 block mb-1">Inquiry &amp; Dialogue</span>
                  <h2 className="text-3xl sm:text-4xl font-light tracking-tight">START A CONVERSATION</h2>
                  <p className="text-cream/60 text-sm mt-1">Whether discussing business collaborations, creative projects, or simply saying hello.</p>
                </div>

                {messageSent ? (
                  <div className="p-8 bg-black/60 border border-cream/30 text-center space-y-3">
                    <span className="text-2xl text-cream block">&bull; &bull; &bull;</span>
                    <h3 className="text-xl font-light text-cream">Message Received</h3>
                    <p className="text-sm text-cream/70 font-light">
                      Thank you for reaching out. Your note has been dispatched into the archive.
                    </p>
                    <button
                      onClick={() => setMessageSent(false)}
                      className="mt-4 text-xs uppercase tracking-widest text-cream underline underline-offset-4"
                    >
                      Send another note
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setMessageSent(true)
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-cream/60 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-black/50 border border-cream/20 px-4 py-3 text-cream focus:border-cream focus:outline-none text-sm placeholder:text-cream/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-cream/60 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        className="w-full bg-black/50 border border-cream/20 px-4 py-3 text-cream focus:border-cream focus:outline-none text-sm placeholder:text-cream/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-cream/60 mb-1">Message</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Write your note or collaboration thought here..."
                        className="w-full bg-black/50 border border-cream/20 px-4 py-3 text-cream focus:border-cream focus:outline-none text-sm placeholder:text-cream/30 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-cream text-black py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-cream/90 transition-colors duration-200 mt-2"
                    >
                      Dispatch Note &rarr;
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  )
}
