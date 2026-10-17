# Project: Alice Mystica Portfolio — Interactive & Audio Polish

## Architecture
- **Framework**: React 18.3.1, TypeScript 5.9.3, Vite 8.2.2, Tailwind CSS 3.4.19.
- **Audio Stack**: Dual-engine hybrid architecture:
  - Primary: `public/assets/all_the_stars_interlude.mp3` loaded into Web Audio `AudioBufferSourceNode` with sample-accurate looping and cosine zero-crossing boundary smoothing.
  - Routing: Buffer output routes through `AnalyserNode` before `masterGain` and `ctx.destination`, providing real audio frequency data to `AudioSpectrumCanvas.tsx` and `BoutiqueAudioCapsule.tsx`.
  - Fallback: Procedural Web Audio API synthesizer (`AllTheStarsBoutiqueSynthesizer`) automatically engaged if asset fetch or decode fails.
  - Persistence: `localStorage.getItem('alice_mystica_audio_volume')` for volume memory.
- **Interactive Suite (Framer Polish)**:
  - `LiquidMagneticCursor.tsx`: Lead dot + lagging spring ring with contextual morphing (`play`, `zoom`, `magnetic`) and graceful touch deactivation.
  - `DigicamFilterSwitcher.tsx`: 4-mode tactile optical filter matrix (`original`, `vintage-ccd`, `noir-monolith`, `flash-glow`) using zero-layout-shift (CLS = 0.000) GPU CSS filter shaders.
  - `TabEqualizerFavicon.tsx`: Dynamic title visualizer (`Alice — Mystica [ ılıll ]`) and 32x32 offscreen canvas dancing favicon during playback, cleanly restoring defaults on pause.
  - `FramerBentoDisciplineGrid.tsx`: Asymmetric 4-column bento showcase for all 8 Creative Disciplines with category filtering and tactile spring transitions.
  - `FloatingStarlightDust.tsx`: Ambient canvas starlight particles with radial cursor repelling physics.
- **Identity & Assets**:
  - Exclusively Alice's 5 authentic photos in `public/assets/` (`alice_hero_red.png`, `alice_smile_portrait.jpg`, `alice_childhood_2020.jpg`, `alice_school_uniform.jpg`, `alice_childhood_playful.jpg`).
  - Zero placeholder/stock images, zero AI imagery, zero Marcus Bennet remnants.
  - Mobile-first responsiveness (360px–430px) with safe-area insets and touch gesture handlers.

## Code Layout
```
public/
  assets/
    alice_hero_red.png           # Authentic Hero & Plate 01
    alice_smile_portrait.jpg      # Authentic About & Plate 02
    alice_childhood_2020.jpg      # Authentic Childhood & Plate 03
    alice_school_uniform.jpg      # Authentic School & Plate 04
    alice_childhood_playful.jpg   # Authentic Playful & Plate 05
    all_the_stars_interlude.mp3   # Authentic "All The Stars" Studio Cut (M1)
src/
  audio/
    AllTheStarsSoundscape.ts      # Dual-engine audio engine & AnalyserNode
  components/
    LiquidMagneticCursor.tsx      # Framer spring cursor & morphing
    DigicamFilterSwitcher.tsx     # 4-mode digicam sensor filter matrix
    TabEqualizerFavicon.tsx       # Live dancing favicon & title visualizer
    FramerBentoDisciplineGrid.tsx # Asymmetric bento grid with spring layout
    FloatingStarlightDust.tsx     # Starlight dust canvas with cursor repulsion
    AudioSpectrumCanvas.tsx       # Live frequency canvas
    BoutiqueAudioCapsule.tsx      # Floating audio capsule & volume memory
  App.tsx                         # Core page layout & state integration
  index.css                       # Filter classes & animations
tests/
  e2e/                            # Master E2E test suite (Tiers 1-4, 290 tests)
```

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|:------:|
| 1 | Audio Asset Generation & Placement | Encode/place optimized authentic `public/assets/all_the_stars_interlude.mp3` | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 2 | Dual-Engine Audio Buffer Loader | Upgrade `AllTheStarsSoundscape.ts` with `AudioBufferSourceNode`, seamless zero-pop looping, and procedural synthesizer fallback | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 3 | Visualizer AnalyserNode Routing | Route audio buffer through `AnalyserNode` to drive `AudioSpectrumCanvas.tsx` and `BoutiqueAudioCapsule.tsx` with authentic frequencies | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 4 | Volume Persistence | Persist audio volume in `localStorage` (`'alice_mystica_audio_volume'`) across page refreshes | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 5 | Autoplay Gesture Synchronization | Synchronize one-time user gesture across page components to start audio and un-mute cleanly | M1 | ORIGINAL_REQUEST §R1 | DONE |
| 6 | Liquid Magnetic Spring Cursor | Adaptive lead dot and lagging ring with morphing states (`play`, `zoom`, `magnetic`) and touch graceful fallback | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 7 | Interactive Digicam Sensor Filter Switcher | Real-time 4-mode tactile visual filter matrix with CLS = 0.000 across photo frames, desk, and lightbox | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 8 | Live Animated Tab Favicon & Title Equalizer | Dynamic title visualizer (`Alice — Mystica [ ılıll ]`) and live dancing canvas favicon during playback | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 9 | Framer Bento Discipline Grid | Reconfigurable asymmetric bento card showcase for 8 Creative Disciplines with category filtering and spring transitions | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 10 | Floating Ambient Starlight Dust | Canvas starlight dust particles with radial cursor repelling physics | M2 | ORIGINAL_REQUEST §R2 | DONE |
| 11 | Authentic Photos Preservation | Exclusively use Alice's 5 authentic photos in `public/assets/`, zero stock/placeholder, zero AI | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 12 | Persona Integrity | Ensure zero Marcus Bennet remnants across entire codebase | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 13 | Mobile Ergonomics & Safe-Area Insets | Production-grade mobile experience (360px-430px) with safe-area insets, touch targets, and gestures | M3 | ORIGINAL_REQUEST §R3 | DONE |
| 14 | E2E Test Suite (Tiers 1-4) | Comprehensive test suite covering audio, interactive features, photo integrity, and mobile responsiveness | M4 | Dual-Track Plan | DONE |
| 15 | Adversarial Coverage Hardening (Tier 5) | Adversarial stress testing for edge cases, rapid clicks, audio stalls, and boundary tests | M4 | Dual-Track Plan | DONE |
| 16 | Quality Gate & Production Build | Pass `tsc --noEmit`, pass `vite build`, clean git status, commit and push to `origin main` | M5 | ORIGINAL_REQUEST §Quality | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|:------:|
| M1 | Audio Integration & Web Audio Engine | Features 1, 2, 3, 4, 5 | none | DONE |
| M2 | Framer Interactive Feature Suite | Features 6, 7, 8, 9, 10 | none | DONE |
| M3 | Identity, Photos & Mobile Ergonomics | Features 11, 12, 13 | none | DONE |
| M4 | E2E Verification & Adversarial Hardening | Features 14, 15 (Tiers 1-5) | M1, M2, M3 | DONE |
| M5 | Final Quality Gate, Git Commit & Push | Feature 16 (`tsc`, `vite build`, git commit/push) | M4 | DONE |
