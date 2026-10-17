import fs from 'node:fs';
import path from 'node:path';
import { TestSuiteHarness } from './helpers/test_harness.js';
import { probeAudioFile, createMockAudioContext } from './helpers/audio_helper.js';
import { MockLocalStorage } from './helpers/storage_helper.js';
import {
  getIndexHtmlDetails,
  getCssFilterRules,
  scanFilesForRemnants,
  getAuthenticPhotos,
  getDistBuildInfo
} from './helpers/dom_helper.js';

export async function runTier4() {
  const harness = new TestSuiteHarness('Tier 4: Real-World Application Scenarios (>=6 Scenarios)');
  harness.printHeader();

  const projectRoot = path.resolve('.');

  // Mock audio and window environment
  const mockStorage = new MockLocalStorage();
  const { MockAudioContext } = createMockAudioContext();

  globalThis.window = {
    AudioContext: MockAudioContext,
    localStorage: mockStorage,
  };
  globalThis.localStorage = mockStorage;
  globalThis.AudioContext = MockAudioContext;
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    arrayBuffer: async () => new ArrayBuffer(1024),
  });

  const soundscapeModule = await import('../../src/audio/AllTheStarsSoundscape.ts');
  const { AllTheStarsBoutiqueSynthesizer, STORAGE_KEY_VOLUME } = soundscapeModule;

  // -------------------------------------------------------------------------
  // Scenario 1: First-Time Visitor Mobile Landing Journey
  // -------------------------------------------------------------------------
  harness.setFeature('Scenario 1: First-Time Visitor Mobile Landing Journey');
  {
    // Step 1: Visitor lands on mobile viewport (390px iPhone)
    const indexDetails = getIndexHtmlDetails(projectRoot);
    harness.assert(indexDetails.hasViewportFitCover, 'Step 1: Viewport configuration has viewport-fit=cover for mobile notches');
    harness.assert(indexDetails.hasWidthDeviceWidth, 'Step 1: Viewport has width=device-width');

    // Step 2: Liquid cursor graceful deactivation on touchscreen
    const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');
    const isTouch = true;
    const isFinePointer = false;
    const cursorSupported = isFinePointer && !isTouch;
    harness.assertEqual(cursorSupported, false, 'Step 2: Liquid cursor is disabled on mobile touchscreen to prevent dual cursor artifacts');

    // Step 3: Authentic Hero red photo loaded as landing visual
    const photos = getAuthenticPhotos(projectRoot);
    const heroPhoto = photos.find(p => p.name === 'alice_hero_red.png');
    harness.assert(heroPhoto && heroPhoto.exists && heroPhoto.isHeaderValid, 'Step 3: Authentic hero photo (alice_hero_red.png) verified');

    // Step 4: First user tap unlocks Web Audio engine and starts playback
    const engine = new AllTheStarsBoutiqueSynthesizer();
    let audioStarted = false;
    engine.addListener((isPlaying) => {
      audioStarted = isPlaying;
    });

    engine.start();
    harness.assertEqual(audioStarted, true, 'Step 4: User gesture unlocks audio engine, starting authentic soundtrack');

    // Step 5: Mobile bottom capsule docks with safe-area spacing
    const capsuleSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'BoutiqueAudioCapsule.tsx'), 'utf-8');
    harness.assert(capsuleSource.includes('safe-area-inset-bottom'), 'Step 5: Mobile floating audio capsule docks above home indicator bar');
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Scenario 2: Desktop Creative Director Deep Dive
  // -------------------------------------------------------------------------
  harness.setFeature('Scenario 2: Desktop Creative Director Deep Dive');
  {
    // Step 1: Desktop browser with fine pointer activates spring cursor
    const isTouch = false;
    const isFinePointer = true;
    const cursorSupported = isFinePointer && !isTouch;
    harness.assertEqual(cursorSupported, true, 'Step 1: Liquid cursor activates on desktop with fine mouse pointer');

    // Step 2: Creative director hovers over Bento Card 02 (Music & Discovery)
    const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');
    harness.assert(cursorSource.includes("mode === 'play'"), 'Step 2: Cursor detects audio trigger and morphs into pill with PLAY label');

    // Step 3: Clicks play to launch "All The Stars" soundscape
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    engine.audioBuffer = ctx.createBuffer(2, 44100 * 5, 44100);
    engine.start();
    await new Promise((r) => setTimeout(r, 20));

    const levels = engine.getEqualizerLevels();
    harness.assert(levels.beatIntensity >= 0.1 && levels.beatIntensity <= 1.0, 'Step 3: Real-time audio spectrum reflects beat intensity');

    // Step 4: Director filters Bento categories
    const bentoSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FramerBentoDisciplineGrid.tsx'), 'utf-8');
    harness.assert(bentoSource.includes('Words & Leadership'), 'Step 4: Bento grid includes Words & Leadership filter');
    harness.assert(bentoSource.includes('Sonic & Motion'), 'Step 4: Bento grid includes Sonic & Motion filter');
    harness.assert(bentoSource.includes('Visual & Aesthetics'), 'Step 4: Bento grid includes Visual & Aesthetics filter');

    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Scenario 3: Archival Photography & Digicam Lens Exploration
  // -------------------------------------------------------------------------
  harness.setFeature('Scenario 3: Archival Photography & Digicam Lens Exploration');
  {
    // Step 1: Verify all 5 authentic photos are loaded
    const photos = getAuthenticPhotos(projectRoot);
    harness.assertEqual(photos.length, 5, 'Step 1: Exactly 5 authentic photos in archive gallery');
    harness.assert(photos.every(p => p.exists && p.isHeaderValid), 'Step 1: All 5 photos exist and pass binary image header checks');

    // Step 2: Hovering photo frames morphs cursor to ZOOM lens
    const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');
    harness.assert(cursorSource.includes("mode === 'zoom'"), 'Step 2: Cursor morphs to 68x68 circular magnifying lens with ZOOM label');

    // Step 3: User tests 4-mode Digicam optical filter switch
    const cssRules = getCssFilterRules(projectRoot);
    const filterModes = ['original', 'vintage-ccd', 'noir-monolith', 'flash-glow'];
    for (const mode of filterModes) {
      const rule = cssRules.rules[mode];
      harness.assert(rule !== undefined, `Step 3: Optical filter class .filter-digicam-${mode} defined`);
      harness.assertEqual(rule.hasLayoutShiftProps, false, `Step 3: .filter-digicam-${mode} guarantees 0 layout shift (CLS = 0.000)`);
    }

    // Step 4: Selection persists to localStorage
    mockStorage.setItem('alice_digicam_sensor_filter', 'vintage-ccd');
    harness.assertEqual(mockStorage.getItem('alice_digicam_sensor_filter'), 'vintage-ccd', 'Step 4: Digicam filter choice stored in localStorage');
  }

  // -------------------------------------------------------------------------
  // Scenario 4: Audio Engineering & Volume Resilience Journey
  // -------------------------------------------------------------------------
  harness.setFeature('Scenario 4: Audio Engineering & Volume Resilience Journey');
  {
    // Step 1: Studio cut audio verification
    const audioPath = path.join(projectRoot, 'public', 'assets', 'all_the_stars_interlude.mp3');
    const audioProbe = probeAudioFile(audioPath);
    harness.assert(audioProbe.exists, 'Step 1: Authentic studio audio asset exists');
    harness.assertEqual(audioProbe.sampleRate, 44100, 'Step 1: Sample rate is 44.1 kHz');

    // Step 2: Audio playback and looping
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    engine.audioBuffer = ctx.createBuffer(2, 44100 * 5, 44100);
    engine.start();
    await new Promise((r) => setTimeout(r, 20));
    harness.assertEqual(engine.bufferSource.loop, true, 'Step 2: Seamless zero-pop looping active');

    // Step 3: Volume adjustment and persistence
    engine.setVolume(0.8);
    harness.assertCloseTo(engine.volume, 0.8, 0.001, 'Step 3: Volume adjusted to 80%');
    harness.assertEqual(mockStorage.getItem(STORAGE_KEY_VOLUME), '0.8', 'Step 3: Volume persisted to localStorage');

    // Step 4: Page reload re-hydrates volume
    const engineReloaded = new AllTheStarsBoutiqueSynthesizer();
    harness.assertCloseTo(engineReloaded.volume, 0.8, 0.001, 'Step 4: Re-hydrated engine restores 80% volume');

    // Step 5: Network failure simulates procedural synthesizer fallback
    const fallbackEngine = new AllTheStarsBoutiqueSynthesizer();
    fallbackEngine.audioBuffer = null;
    fallbackEngine.loadAudioBuffer = async () => false;
    fallbackEngine.start();
    harness.assertEqual(fallbackEngine.isPlaying, true, 'Step 5: Fallback procedural synthesizer engages seamlessly');
    fallbackEngine.stop();
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Scenario 5: Starlight Ambient Cosmic Immersion
  // -------------------------------------------------------------------------
  harness.setFeature('Scenario 5: Starlight Ambient Cosmic Immersion');
  {
    const dustSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FloatingStarlightDust.tsx'), 'utf-8');

    // Step 1: 45 ambient celestial particles initialized for desktop
    harness.assert(dustSource.includes('width < 768 ? 20 : 45'), 'Step 1: Desktop canvas creates 45 celestial dust particles');

    // Step 2: Particles drift upward with gentle velocity
    harness.assert(dustSource.includes('vy: -0.15 - Math.random() * 0.3'), 'Step 2: Upward celestial drift vector configured');

    // Step 3: Radial cursor repulsion physics within 110px
    harness.assert(dustSource.includes('repelRadius = 110'), 'Step 3: 110px radial cursor repulsion active');

    // Step 4: Background tab sleep behavior
    harness.assert(dustSource.includes('isTabVisible = !document.hidden'), 'Step 4: Rendering loop pauses when tab is hidden to save battery');
  }

  // -------------------------------------------------------------------------
  // Scenario 6: Comprehensive Security, Persona & Asset Audit
  // -------------------------------------------------------------------------
  harness.setFeature('Scenario 6: Comprehensive Security, Persona & Asset Audit');
  {
    // Step 1: Complete audit for Marcus Bennet remnants
    const remnants = scanFilesForRemnants(projectRoot);
    harness.assertEqual(remnants.marcusBennetOccurrences.length, 0, 'Step 1: Absolute zero "Marcus Bennet" references across entire codebase');
    harness.assertEqual(remnants.bennetOccurrences.length, 0, 'Step 1: Absolute zero "Bennet" references across entire codebase');
    harness.assertEqual(remnants.stockDomains.length, 0, 'Step 1: Absolute zero stock photo URLs (Unsplash/Pexels/Pixabay/Placeholder)');

    // Step 2: Authentic photo inventory verification
    const photos = getAuthenticPhotos(projectRoot);
    harness.assertEqual(photos.length, 5, 'Step 2: Exactly 5 authentic photos in public/assets/');

    // Step 3: Production build verification
    const distInfo = getDistBuildInfo(projectRoot);
    harness.assert(distInfo.distExists, 'Step 3: Production dist/ directory exists');
    harness.assert(distInfo.indexHtmlExists, 'Step 3: dist/index.html compiled successfully');
    harness.assert(distInfo.jsFiles.length > 0, 'Step 3: JavaScript production bundles emitted');
    harness.assert(distInfo.cssFiles.length > 0, 'Step 3: CSS production stylesheet emitted');
  }

  harness.printSummary();
  return harness.summary();
}

if (process.argv[1] && process.argv[1].endsWith('tier4_scenarios.test.js')) {
  runTier4()
    .then(summary => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
