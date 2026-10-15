import React, { useState, useEffect } from 'react'
import {
  X,
  Menu,
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Music,
  Palette,
  Camera,
  Video,
  Mic,
  Award,
  MessageSquare,
  Check,
  Compass,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

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
    spanClass: "md:col-span-2 lg:col-span-2"
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
    objectPosition: "object-top"
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
    objectPosition: "object-top"
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
    objectPosition: "object-center"
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
    objectPosition: "object-top"
  }
]

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedInterest, setSelectedInterest] = useState<number>(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [messageForm, setMessageForm] = useState({ name: '', email: '', subject: 'Creative Collaboration', message: '' })
  const [messageSubmitted, setMessageSubmitted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const lightboxPhoto = lightboxIndex !== null ? ARCHIVAL_GALLERY[lightboxIndex] : null

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % ARCHIVAL_GALLERY.length)
    }
  }

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + ARCHIVAL_GALLERY.length) % ARCHIVAL_GALLERY.length)
    }
  }

  // Document Title
  useEffect(() => {
    document.title = "Alice \u2014 Mystica"
  }, [])

  // Header scroll appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock scroll only when drawer or lightbox is open
  useEffect(() => {
    if (drawerOpen || lightboxIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, lightboxIndex])

  // Close lightbox/drawer on Escape key & arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null)
        setDrawerOpen(false)
      } else if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev !== null ? (prev + 1) % ARCHIVAL_GALLERY.length : null))
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev !== null ? (prev - 1 + ARCHIVAL_GALLERY.length) % ARCHIVAL_GALLERY.length : null))
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

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

    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', `#${sectionId}`)
      }
    }, 40)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessageSubmitted(true)
  }

  return (
    <div className="min-h-screen w-full bg-[#0d0d0d] text-[#efeee9] font-hn selection:bg-[#efeee9] selection:text-black">

      {/* =========================================================================
          GLOBAL STICKY HEADER & NAVIGATION
          ========================================================================= */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 px-6 sm:px-12 py-5 sm:py-6 flex items-center justify-between ${
          scrolled
            ? 'bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#efeee9]/10 shadow-2xl py-4 sm:py-4'
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
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="h-2 w-2 bg-[#efeee9] rounded-full group-hover:scale-150 transition-transform duration-300" />
          <span className="font-hn text-lg sm:text-xl font-normal tracking-wide text-[#efeee9] group-hover:opacity-70 transition-opacity duration-300">
            R Alice Mystica
          </span>
          <span className="hidden md:inline-block text-[11px] tracking-[0.25em] text-[#efeee9]/40 uppercase font-light pl-2 border-l border-[#efeee9]/20">
            The Creative Archive
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-light tracking-wide text-[#efeee9]/80">
          <a
            href="#about"
            onClick={(e) => handleNavClick('about', e)}
            className="hover:text-[#efeee9] hover:underline underline-offset-8 transition-colors duration-200 cursor-pointer"
          >
            About
          </a>
          <a
            href="#interests"
            onClick={(e) => handleNavClick('interests', e)}
            className="hover:text-[#efeee9] hover:underline underline-offset-8 transition-colors duration-200 cursor-pointer"
          >
            Interests
          </a>
          <a
            href="#archive"
            onClick={(e) => handleNavClick('archive', e)}
            className="hover:text-[#efeee9] hover:underline underline-offset-8 transition-colors duration-200 cursor-pointer"
          >
            Archive
          </a>
          <a
            href="#milestones"
            onClick={(e) => handleNavClick('milestones', e)}
            className="hover:text-[#efeee9] hover:underline underline-offset-8 transition-colors duration-200 cursor-pointer"
          >
            Milestones
          </a>
          <a
            href="#philosophy"
            onClick={(e) => handleNavClick('philosophy', e)}
            className="hover:text-[#efeee9] hover:underline underline-offset-8 transition-colors duration-200 cursor-pointer"
          >
            Philosophy
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick('contact', e)}
            className="px-4 py-2 border border-[#efeee9]/30 text-xs uppercase tracking-widest hover:bg-[#efeee9] hover:text-black transition-all duration-300 cursor-pointer"
          >
            Inquiry
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 text-[#efeee9] hover:opacity-70 transition-opacity focus:outline-none cursor-pointer"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[#111111] border-l border-[#efeee9]/15 p-8 flex flex-col justify-between transition-transform duration-500 shadow-2xl ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-[#efeee9]/15">
              <span className="text-xs uppercase tracking-[0.25em] text-[#efeee9]/50">Site Navigation</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-[#efeee9] p-1 hover:opacity-60 transition-opacity"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="mt-8 flex flex-col gap-6">
              {[
                { label: "01. Hero Top", id: "hero" },
                { label: "02. About Me", id: "about" },
                { label: "03. 8 Creative Interests", id: "interests" },
                { label: "04. Archival Photography", id: "archive" },
                { label: "05. Milestones & Honors", id: "milestones" },
                { label: "06. Philosophy & Beyond", id: "philosophy" },
                { label: "07. Contact & Dialogue", id: "contact" },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(link.id, e)}
                  className="text-left text-2xl font-light text-[#efeee9] hover:text-[#efeee9]/60 transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#efeee9]/15 text-xs text-[#efeee9]/50 space-y-2">
            <p className="tracking-widest uppercase text-[#efeee9]/70">R Alice Mystica</p>
            <p>BBA Scholar &bull; Creative Archivist</p>
            <p className="pt-2 italic text-[#efeee9]/40">&ldquo;A collection of creativity, expression, memories, and becoming.&rdquo;</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          HERO SECTION — ALICE — MYSTICA
          High-end full-viewport editorial screen, smoothly scrollable to sections below
          ========================================================================= */}
      <section
        id="hero"
        className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-12 px-6 sm:px-12"
      >
        {/* Layer 1: Alice's dramatic red noir photo (Hero background) */}
        <img
          src={ASSETS.heroRed}
          alt="Portrait of Alice Mystica in dramatic red noir lighting"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none anim-fade-in"
        />

        {/* Ambient Dark Gradient Overlays for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/50 to-[#0d0d0d]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

        {/* Layer 2: Infinite Marquee Typography */}
        <div className="relative z-10 my-auto py-12 overflow-hidden pointer-events-none anim-fade-up delay-marquee">
          <div className="marquee flex w-max whitespace-nowrap font-hn text-[14vh] sm:text-[23vh] leading-none text-[#efeee9] tracking-tighter opacity-90 select-none">
            <span className="pr-[5vw]">Alice &mdash; Mystica&nbsp;</span>
            <span className="pr-[5vw] text-[#efeee9]/60 font-light">The Creative Archive&nbsp;</span>
            <span className="pr-[5vw]">Alice &mdash; Mystica&nbsp;</span>
            <span className="pr-[5vw] text-[#efeee9]/60 font-light">The Creative Archive&nbsp;</span>
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

          {/* Centered Scroll Indicator */}
          <a
            href="#about"
            onClick={(e) => handleNavClick('about', e)}
            className="mx-auto sm:mx-0 flex items-center gap-2 px-5 py-2.5 border border-[#efeee9]/30 rounded-full bg-black/40 backdrop-blur-md hover:bg-[#efeee9] hover:text-black transition-all duration-300 group cursor-pointer"
          >
            <span className="text-xs uppercase tracking-[0.2em]">Explore Below</span>
            <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform duration-300" />
          </a>

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
        className="relative py-28 px-6 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-[#0d0d0d] scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="border-b border-[#efeee9]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
                01 / Identity &amp; Origin
              </span>
              <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                ALICE &mdash; THE CREATIVE ARCHIVE
              </h2>
            </div>
            <p className="text-[#efeee9]/70 text-lg md:text-xl font-light italic max-w-md">
              &ldquo;A collection of creativity, expression, memories, and becoming.&rdquo;
            </p>
          </div>

          {/* Editorial Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Portrait Showcase */}
            <div className="lg:col-span-5 space-y-5">
              <div className="relative group border border-[#efeee9]/20 overflow-hidden bg-black p-2">
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={ASSETS.smilePortrait}
                    alt="Alice Mystica smiling portrait with (Can you kiss me more?)"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-editorial"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-[#efeee9] border border-[#efeee9]/20 font-mono">
                    Archive Ref &bull; 02
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-[10px] italic text-[#efeee9]/90 border border-[#efeee9]/20">
                    &ldquo;(Can you kiss me more?)&rdquo;
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-sm tracking-wide text-[#efeee9] font-medium uppercase">
                  R Alice Mystica
                </div>
                <div className="text-xs text-[#efeee9]/60 font-light">
                  BBA Academic Scholar &bull; Creative Archivist &bull; Observer
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Texts */}
            <div className="lg:col-span-7 space-y-8 text-[#efeee9]/90 font-light text-base sm:text-lg leading-relaxed">
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

              {/* Three Pillar Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#efeee9]/15">
                <div className="p-5 bg-black/40 border border-[#efeee9]/15 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/50 block">01 / Focus</span>
                  <h4 className="text-sm font-medium text-[#efeee9] uppercase tracking-wider">BBA Academic</h4>
                  <p className="text-xs text-[#efeee9]/70 leading-relaxed font-light">
                    Business administration, strategic communication, organizational thinking, and turning concepts into real-world initiatives.
                  </p>
                </div>
                <div className="p-5 bg-black/40 border border-[#efeee9]/15 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/50 block">02 / Expression</span>
                  <h4 className="text-sm font-medium text-[#efeee9] uppercase tracking-wider">Visual &amp; Style</h4>
                  <p className="text-xs text-[#efeee9]/70 leading-relaxed font-light">
                    Archival photography, nostalgic aesthetics, makeup experimentation, and personal style as visual communication.
                  </p>
                </div>
                <div className="p-5 bg-black/40 border border-[#efeee9]/15 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#efeee9]/50 block">03 / Voice</span>
                  <h4 className="text-sm font-medium text-[#efeee9] uppercase tracking-wider">Public Speaking</h4>
                  <p className="text-xs text-[#efeee9]/70 leading-relaxed font-light">
                    Storytelling, articulate presentation, and engaging audiences with poise, clarity, and genuine empathy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: THE 8 CREATIVE INTERESTS
          ========================================================================= */}
      <section
        id="interests"
        className="relative py-28 px-6 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-[#0e0e0e] scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="border-b border-[#efeee9]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
                02 / Curation &amp; Disciplines
              </span>
              <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                THE EIGHT CREATIVE INTERESTS
              </h2>
            </div>
            <p className="text-[#efeee9]/70 text-sm md:text-base font-light max-w-md">
              Eight distinct avenues of exploration, aesthetics, and expression through which I document and interpret life.
            </p>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {CREATIVE_INTERESTS.map((item, index) => {
              const IconComponent = item.icon
              const isSelected = selectedInterest === index
              return (
                <button
                  key={item.number}
                  onClick={() => setSelectedInterest(index)}
                  className={`p-3 text-left border transition-all duration-300 flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'bg-[#efeee9] text-black border-[#efeee9] shadow-lg scale-[1.02]'
                      : 'bg-black/40 text-[#efeee9]/80 border-[#efeee9]/15 hover:border-[#efeee9]/40 hover:text-[#efeee9]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">{item.number}</span>
                    <IconComponent size={14} className={isSelected ? 'text-black' : 'text-[#efeee9]/50'} />
                  </div>
                  <div>
                    <span className="text-[10px] block opacity-60 uppercase tracking-widest">{item.category.split('&')[0]}</span>
                    <span className="text-xs font-normal line-clamp-2 leading-tight">{item.title}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Featured Deep-Dive on Active Category */}
          <div className="p-8 sm:p-12 bg-black/60 border border-[#efeee9]/20 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-[#efeee9]/10 text-xs font-mono uppercase tracking-[0.25em] text-[#efeee9]/70 border border-[#efeee9]/20">
                    Category {CREATIVE_INTERESTS[selectedInterest].number} / 08
                  </span>
                  <span className="text-xs text-[#efeee9]/40 uppercase tracking-widest">
                    {CREATIVE_INTERESTS[selectedInterest].category}
                  </span>
                </div>

                <h3 className="text-3xl sm:text-5xl font-light text-[#efeee9] tracking-tight">
                  {CREATIVE_INTERESTS[selectedInterest].title}
                </h3>

                <p className="text-base sm:text-lg text-[#efeee9]/85 font-light leading-relaxed">
                  {CREATIVE_INTERESTS[selectedInterest].desc}
                </p>

                <div className="pl-6 border-l-2 border-[#efeee9]/50 italic text-base sm:text-lg text-[#efeee9] py-1 font-serif">
                  &ldquo;{CREATIVE_INTERESTS[selectedInterest].quote}&rdquo;
                </div>
              </div>

              {/* Editorial Icon & Visual Card */}
              <div className="lg:col-span-4 flex flex-col justify-center items-center p-8 bg-[#141414] border border-[#efeee9]/15 text-center space-y-4">
                {(() => {
                  const CurrentIcon = CREATIVE_INTERESTS[selectedInterest].icon
                  return (
                    <div className="w-16 h-16 rounded-full border border-[#efeee9]/30 flex items-center justify-center bg-black/50 text-[#efeee9]">
                      <CurrentIcon size={28} strokeWidth={1.5} />
                    </div>
                  )
                })()}
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#efeee9]/50 block">Archive Discipline</span>
                  <h4 className="text-sm font-medium text-[#efeee9] uppercase tracking-wider">
                    {CREATIVE_INTERESTS[selectedInterest].title}
                  </h4>
                </div>
                <p className="text-xs text-[#efeee9]/60 italic">
                  Documenting life, creative intuition, and self-expression.
                </p>
              </div>
            </div>
          </div>

          {/* Full Grid of All 8 Interests for Comprehensive Reading */}
          <div className="space-y-4 pt-6">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#efeee9]/50 font-mono">
              Complete Discipline Directory
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CREATIVE_INTERESTS.map((interest, idx) => {
                const InterestIcon = interest.icon
                return (
                  <div
                    key={interest.number}
                    className="p-6 bg-black/40 border border-[#efeee9]/15 hover:border-[#efeee9]/40 transition-colors duration-300 space-y-4"
                  >
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
                    <div className="pt-2 text-xs text-[#efeee9]/60 italic font-serif border-t border-[#efeee9]/10">
                      &ldquo;{interest.quote}&rdquo;
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: ARCHIVAL PHOTOGRAPHY & MEMORIES
          Exclusively showcases the 5 uploaded photos with candid digicam captions
          ========================================================================= */}
      <section
        id="archive"
        className="relative py-28 px-6 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-[#0d0d0d] scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="border-b border-[#efeee9]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
                03 / Visual Chronicle
              </span>
              <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
                ARCHIVAL PHOTOGRAPHY &amp; MEMORIES
              </h2>
            </div>
            <p className="text-[#efeee9]/70 text-sm md:text-base font-light max-w-md">
              Candid frames, digicam aesthetics, childhood archives, and nostalgic moments preserved through time.
            </p>
          </div>

          {/* Archival Photo Exhibition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARCHIVAL_GALLERY.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className={`group cursor-pointer bg-black/50 border border-[#efeee9]/15 hover:border-[#efeee9]/50 transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                  item.spanClass || ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden bg-black ${item.aspectRatio}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover ${item.objectPosition} group-hover:scale-105 transition-transform duration-700 ease-editorial`}
                  />
                  {/* Subtle Badge Overlay */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase text-[#efeee9] border border-[#efeee9]/20">
                    {item.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase text-[#efeee9]/70 border border-[#efeee9]/20 flex items-center gap-1.5">
                    <span>{item.date}</span>
                    <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                {/* Caption Details */}
                <div className="p-6 space-y-2 border-t border-[#efeee9]/10">
                  <div className="flex items-center justify-between text-xs text-[#efeee9]/50 font-mono uppercase tracking-widest">
                    <span>{item.tag}</span>
                    <span>Frame 0{index + 1}</span>
                  </div>
                  <h4 className="text-xl font-normal text-[#efeee9] tracking-tight group-hover:opacity-80 transition-opacity">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#efeee9]/70 font-light leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Digicam Manifesto Statement */}
          <div className="p-8 bg-[#111111] border-l-2 border-[#efeee9]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#efeee9]/50">
                Visual Philosophy &bull; Digicam Aesthetics
              </span>
              <p className="text-base text-[#efeee9] font-light italic">
                &ldquo;Photography allows me to preserve moments that might otherwise disappear into the ordinary passage of time.&rdquo;
              </p>
            </div>
            <div className="text-xs uppercase tracking-widest text-[#efeee9]/60 shrink-0">
              5 Verified Primary Frames
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: ACHIEVEMENTS & MILESTONES
          ========================================================================= */}
      <section
        id="milestones"
        className="relative py-28 px-6 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-[#0e0e0e] scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="border-b border-[#efeee9]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
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

          {/* Milestones Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Milestone 01 */}
            <div className="p-8 sm:p-10 bg-black/50 border border-[#efeee9]/20 hover:border-[#efeee9]/50 transition-colors duration-300 flex flex-col justify-between space-y-6">
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

            {/* Milestone 02 */}
            <div className="p-8 sm:p-10 bg-black/50 border border-[#efeee9]/20 hover:border-[#efeee9]/50 transition-colors duration-300 flex flex-col justify-between space-y-6">
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
          </div>

          {/* Reflection: What These Experiences Mean to Me */}
          <div className="p-8 sm:p-12 bg-[#121212] border border-[#efeee9]/20 space-y-4">
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
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: BEYOND MY HOBBIES & PHILOSOPHY
          ========================================================================= */}
      <section
        id="philosophy"
        className="relative py-28 px-6 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-[#0d0d0d] scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="border-b border-[#efeee9]/20 pb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-[#efeee9]/50 block mb-2 font-mono">
              05 / Perspective &amp; Vision
            </span>
            <h2 className="text-4xl sm:text-6xl font-light tracking-tight text-[#efeee9]">
              BEYOND MY HOBBIES &amp; PHILOSOPHY
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Beyond My Hobbies */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-2xl font-light tracking-tight text-[#efeee9]">
                Beyond My Hobbies
              </h3>
              <p className="text-base text-[#efeee9]/85 font-light leading-relaxed">
                As a BBA student, I am interested in developing a broader understanding of business, management, communication, and the way ideas become meaningful projects. I believe that creativity and professional skills can complement each other. Creative thinking encourages fresh perspectives, while communication helps transform those perspectives into ideas that others can understand and engage with.
              </p>
              <p className="text-base text-[#efeee9]/85 font-light leading-relaxed">
                I value opportunities that allow me to learn, participate, collaborate, explore new experiences, and challenge myself. Whether I am working on a college project, preparing a presentation, documenting an experience, or experimenting with a new creative idea, I see every experience as an opportunity to develop a new skill or perspective.
              </p>
            </div>

            {/* Right Column: Core Philosophy Statement */}
            <div className="lg:col-span-6 p-8 sm:p-10 bg-[#141414] border border-[#efeee9]/20 space-y-6 shadow-xl">
              <h3 className="text-2xl font-light tracking-tight text-[#efeee9]">
                My Core Philosophy
              </h3>
              <blockquote className="space-y-4 text-base sm:text-lg text-[#efeee9]/90 font-light italic leading-relaxed">
                <p>
                  &ldquo;I believe that a person can have many interests without needing to fit into a single category. I want to keep exploring different creative outlets, learning new things, documenting experiences, and discovering new dimensions of myself.
                </p>
                <p>
                  I see this portfolio not simply as a collection of hobbies, but as a record of curiosity, experimentation, personal growth, and ambition. Every photograph, page, creative experiment, speech, and memory represents a small part of a much larger journey.
                </p>
                <p className="font-normal not-italic text-[#efeee9] border-t border-[#efeee9]/15 pt-4">
                  I am still learning, still exploring, and still discovering what I can create. This is my archive &mdash; a reflection of who I am, what inspires me, and who I am becoming.&rdquo;
                </p>
              </blockquote>
              <div className="text-xs uppercase tracking-widest text-[#efeee9]/50 font-mono">
                &mdash; R Alice Mystica &bull; BBA Creative Archive
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: INQUIRY & DIALOGUE / MESSAGE
          ========================================================================= */}
      <section
        id="contact"
        className="relative py-28 px-6 sm:px-12 lg:px-20 border-b border-[#efeee9]/10 bg-[#0e0e0e] scroll-mt-24"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4 border-b border-[#efeee9]/20 pb-8">
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

          {/* Form or Confirmation */}
          {messageSubmitted ? (
            <div className="p-12 bg-black/60 border border-[#efeee9]/30 text-center space-y-4 animate-fade-in">
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
                className="mt-6 text-xs uppercase tracking-widest text-[#efeee9] underline underline-offset-4 hover:opacity-70 transition-opacity cursor-pointer"
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
                    className="w-full bg-black/50 border border-[#efeee9]/20 px-4 py-3.5 text-[#efeee9] focus:border-[#efeee9] focus:outline-none text-sm placeholder:text-[#efeee9]/30 transition-colors"
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
                    className="w-full bg-black/50 border border-[#efeee9]/20 px-4 py-3.5 text-[#efeee9] focus:border-[#efeee9] focus:outline-none text-sm placeholder:text-[#efeee9]/30 transition-colors"
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
                  className="w-full bg-black/50 border border-[#efeee9]/20 px-4 py-3.5 text-[#efeee9] focus:border-[#efeee9] focus:outline-none text-sm placeholder:text-[#efeee9]/30 resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#efeee9] text-black py-4 text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#efeee9]/90 transition-all duration-300 shadow-xl cursor-pointer"
              >
                Dispatch Note Into Archive &rarr;
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================================
          GLOBAL EDITORIAL FOOTER
          ========================================================================= */}
      <footer className="py-20 px-6 sm:px-12 lg:px-20 bg-[#080808] text-[#efeee9] border-t border-[#efeee9]/10">
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
            <p className="italic text-[#efeee9]/40">
              Curated with intentionality, minimalism &amp; grace.
            </p>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          LIGHTBOX MODAL FOR ARCHIVAL PHOTOGRAPHY
          ========================================================================= */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.title}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 animate-fade-in"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] bg-[#111111] border border-[#efeee9]/20 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Counter and Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-[#efeee9]/15">
              <span className="text-xs font-mono uppercase tracking-widest text-[#efeee9]/60">
                Frame {lightboxIndex !== null ? `0${lightboxIndex + 1} / 0${ARCHIVAL_GALLERY.length}` : ''} &bull; {lightboxPhoto.tag}
              </span>
              <button
                onClick={closeLightbox}
                aria-label="Close photo preview"
                className="text-[#efeee9]/70 hover:text-[#efeee9] p-1.5 transition-colors cursor-pointer"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Modal Image with Navigation Arrows */}
            <div className="relative w-full max-h-[62vh] overflow-hidden bg-black flex items-center justify-center my-4 group">
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.title}
                className="max-h-[62vh] max-w-full object-contain"
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevLightbox()
                }}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-[#efeee9]/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer opacity-80 hover:opacity-100"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextLightbox()
                }}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 border border-[#efeee9]/20 text-[#efeee9] hover:bg-[#efeee9] hover:text-black transition-all cursor-pointer opacity-80 hover:opacity-100"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </div>

            {/* Metadata Footer */}
            <div className="pt-4 border-t border-[#efeee9]/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#efeee9]/50">
                <span>{lightboxPhoto.badge}</span>
                <span>{lightboxPhoto.date}</span>
              </div>
              <h3 className="text-2xl font-light text-[#efeee9]">{lightboxPhoto.title}</h3>
              <p className="text-sm text-[#efeee9]/80 font-light leading-relaxed">
                {lightboxPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
