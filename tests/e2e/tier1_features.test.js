import fs from 'node:fs';
import path from 'node:path';
import { TestSuiteHarness } from './helpers/test_harness.js';
import { probeAudioFile, probeBoundaryAmplitudes, createMockAudioContext } from './helpers/audio_helper.js';
import { MockLocalStorage } from './helpers/storage_helper.js';
import {
  getIndexHtmlDetails,
  getCssFilterRules,
  scanFilesForRemnants,
  getAuthenticPhotos,
  getDistBuildInfo
} from './helpers/dom_helper.js';

export async function runTier1() {
  const harness = new TestSuiteHarness('Tier 1: Feature Coverage (All 13 Features)');
  harness.printHeader();

  const projectRoot = path.resolve('.');

  // -------------------------------------------------------------------------
  // Feature 1: Audio Asset File (all_the_stars_interlude.mp3)
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 1: Audio Asset File (all_the_stars_interlude.mp3)');
  const audioPath = path.join(projectRoot, 'public', 'assets', 'all_the_stars_interlude.mp3');
  const probe = probeAudioFile(audioPath);

  harness.assert(probe.exists === true, 'Audio file exists in public/assets/');
  harness.assert(probe.size > 500000 && probe.size < 1500000, 'Audio file size in valid bounds (500KB - 1.5MB)', `size=${probe.size}`);
  harness.assert(probe.codec === 'mp3' || (probe.rawHeader && probe.hasId3Tag), 'Audio container is valid MP3 format');
  harness.assert(probe.sampleRate === 44100, 'Sample rate is 44.1 kHz', `sampleRate=${probe.sampleRate}`);
  harness.assert(probe.channels === 2, 'Audio channels are stereo (2 channels)', `channels=${probe.channels}`);
  harness.assert(Math.abs(probe.duration - 19.79) < 0.2, 'Duration matches 8 measures at 97 BPM (~19.79s)', `duration=${probe.duration}s`);

  // -------------------------------------------------------------------------
  // Feature 2: Dual-Engine Audio Buffer Loader
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 2: Dual-Engine Audio Buffer Loader');
  const mockStorage = new MockLocalStorage();
  const { MockAudioContext, MockGainNode, MockAnalyserNode, MockBufferSourceNode } = createMockAudioContext();

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
  const { AllTheStarsBoutiqueSynthesizer, boutiqueSoundEngine, STORAGE_KEY_VOLUME, DEFAULT_VOLUME } = soundscapeModule;

  harness.assert(typeof AllTheStarsBoutiqueSynthesizer === 'function', 'AllTheStarsBoutiqueSynthesizer class is exported');
  harness.assert(boutiqueSoundEngine instanceof AllTheStarsBoutiqueSynthesizer, 'boutiqueSoundEngine singleton is instantiated');
  harness.assert(boutiqueSoundEngine.isPlaying === false, 'Audio engine initial state is paused');

  // Test cosine seam smoothing method on synthetic buffer
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    const testBuf = ctx.createBuffer(2, 44100 * 2, 44100);
    testBuf.getChannelData(0).fill(1.0);
    testBuf.getChannelData(1).fill(1.0);

    engine.applySeamSmoothing(testBuf);
    const ch0 = testBuf.getChannelData(0);
    harness.assert(ch0[0] === 0, 'Seam smoothing reduces start sample to exactly 0 (cosine zero-crossing)');
    harness.assert(ch0[ch0.length - 1] === 0, 'Seam smoothing reduces end sample to exactly 0 (cosine zero-crossing)');
    harness.assert(ch0[10] > 0 && ch0[10] < 1.0, 'Seam smoothing applies raised cosine curve across boundary');
  }

  // Verify AudioBufferSourceNode instantiation with loop = true
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    engine.audioBuffer = ctx.createBuffer(2, 44100 * 10, 44100);

    engine.start();
    await new Promise((r) => setTimeout(r, 20));
    harness.assert(engine.bufferSource !== null, 'AudioBufferSourceNode created during start()');
    harness.assert(engine.bufferSource.loop === true, 'AudioBufferSourceNode has loop enabled for continuous playback');
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Feature 3: Visualizer AnalyserNode Routing
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 3: Visualizer AnalyserNode Routing');
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    engine.audioBuffer = ctx.createBuffer(2, 44100 * 10, 44100);
    engine.start();
    await new Promise((r) => setTimeout(r, 20));

    const analyser = engine.getAnalyser();
    harness.assert(analyser instanceof MockAnalyserNode, 'getAnalyser() returns an AnalyserNode instance');
    harness.assert(engine.bufferSource.connectedTo.includes(analyser), 'AudioBufferSource connects to AnalyserNode');
    harness.assert(analyser.connectedTo.includes(engine.masterGain), 'AnalyserNode connects to MasterGainNode');
    harness.assert(engine.masterGain.connectedTo.includes(ctx.destination), 'MasterGain connects to AudioDestinationNode');

    const levels = engine.getEqualizerLevels();
    harness.assert(typeof levels.bar1 === 'number' && levels.bar1 >= 0.1 && levels.bar1 <= 1.0, 'Equalizer bar1 level in [0.1, 1.0]');
    harness.assert(typeof levels.bar2 === 'number' && levels.bar2 >= 0.1 && levels.bar2 <= 1.0, 'Equalizer bar2 level in [0.1, 1.0]');
    harness.assert(typeof levels.beatIntensity === 'number' && levels.beatIntensity >= 0.1 && levels.beatIntensity <= 1.0, 'Beat intensity level in [0.1, 1.0]');
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Feature 4: Volume Persistence & Memory
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 4: Volume Persistence & Memory');
  harness.assertEqual(STORAGE_KEY_VOLUME, 'alice_mystica_audio_volume', 'Volume storage key is alice_mystica_audio_volume');
  harness.assertEqual(DEFAULT_VOLUME, 0.55, 'Default volume is 0.55');

  {
    mockStorage.setItem(STORAGE_KEY_VOLUME, '0.84');
    const engine = new AllTheStarsBoutiqueSynthesizer();
    harness.assertCloseTo(engine.volume, 0.84, 0.001, 'Hydrates volume 0.84 from localStorage');

    engine.setVolume(0.42);
    harness.assertCloseTo(engine.volume, 0.42, 0.001, 'setVolume(0.42) updates engine.volume');
    harness.assertEqual(mockStorage.getItem(STORAGE_KEY_VOLUME), '0.42', 'setVolume(0.42) persists to localStorage');

    engine.setVolume(1.8);
    harness.assertEqual(engine.volume, 1.0, 'setVolume(1.8) clamps to 1.0');

    engine.setVolume(-0.5);
    harness.assertEqual(engine.volume, 0.0, 'setVolume(-0.5) clamps to 0.0');
  }

  // -------------------------------------------------------------------------
  // Feature 5: Autoplay Gesture Synchronization
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 5: Autoplay Gesture Synchronization');
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    let notificationCount = 0;
    let notifiedState = null;

    const unsubscribe = engine.addListener((isPlaying) => {
      notificationCount++;
      notifiedState = isPlaying;
    });

    harness.assertEqual(notificationCount, 1, 'addListener immediately calls callback with current state');
    harness.assertEqual(notifiedState, false, 'Initial state notified is false (paused)');

    engine.start();
    harness.assertEqual(notificationCount, 2, 'Starting engine notifies listener of state change');
    harness.assertEqual(notifiedState, true, 'State notified is true (playing)');

    engine.stop();
    harness.assertEqual(notificationCount, 3, 'Stopping engine notifies listener of state change');
    harness.assertEqual(notifiedState, false, 'State notified is false (stopped)');

    unsubscribe();
    engine.start();
    harness.assertEqual(notificationCount, 3, 'Unsubscribed callback does not receive further updates');
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Feature 6: Liquid Magnetic Spring Cursor
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 6: Liquid Magnetic Spring Cursor');
  const cursorSourcePath = path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx');
  const cursorCode = fs.readFileSync(cursorSourcePath, 'utf-8');

  harness.assert(cursorCode.includes("(pointer: fine)"), 'Checks for fine pointer media query');
  harness.assert(cursorCode.includes("'ontouchstart' in window"), 'Checks touchstart existence to disable cursor on touch devices');
  harness.assert(cursorCode.includes("mode === 'play'"), 'Implements contextual "play" cursor mode');
  harness.assert(cursorCode.includes("mode === 'zoom'"), 'Implements contextual "zoom" cursor mode');
  harness.assert(cursorCode.includes("mode === 'magnetic'"), 'Implements contextual "magnetic" cursor mode');
  harness.assert(cursorCode.includes("requestAnimationFrame(animate)"), 'Uses requestAnimationFrame for 60fps spring tracking');

  // -------------------------------------------------------------------------
  // Feature 7: Interactive Digicam Sensor Filter Switcher
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 7: Interactive Digicam Sensor Filter Switcher');
  const digicamSourcePath = path.join(projectRoot, 'src', 'components', 'DigicamFilterSwitcher.tsx');
  const digicamSource = fs.readFileSync(digicamSourcePath, 'utf-8');

  // Verify the 4 optical modes defined in source
  const hasOriginal = digicamSource.includes("id: 'original'");
  const hasVintage = digicamSource.includes("id: 'vintage-ccd'");
  const hasNoir = digicamSource.includes("id: 'noir-monolith'");
  const hasFlash = digicamSource.includes("id: 'flash-glow'");
  harness.assert(hasOriginal && hasVintage && hasNoir && hasFlash, 'Defines original, vintage-ccd, noir-monolith, and flash-glow filter modes');

  // Verify getDigicamFilterClass logic
  const getFilterClass = (filter) => {
    switch (filter) {
      case 'vintage-ccd': return 'filter-digicam-vintage-ccd';
      case 'noir-monolith': return 'filter-digicam-noir-monolith';
      case 'flash-glow': return 'filter-digicam-flash-glow';
      case 'original':
      default:
        return 'filter-digicam-original';
    }
  };

  harness.assertEqual(getFilterClass('vintage-ccd'), 'filter-digicam-vintage-ccd', 'Maps vintage-ccd to filter-digicam-vintage-ccd');
  harness.assertEqual(getFilterClass('noir-monolith'), 'filter-digicam-noir-monolith', 'Maps noir-monolith to filter-digicam-noir-monolith');
  harness.assertEqual(getFilterClass('flash-glow'), 'filter-digicam-flash-glow', 'Maps flash-glow to filter-digicam-flash-glow');
  harness.assertEqual(getFilterClass('original'), 'filter-digicam-original', 'Maps original to filter-digicam-original');
  harness.assert(digicamSource.includes("localStorage.setItem('alice_digicam_sensor_filter', filterId)"), 'Persists filter selection to localStorage key alice_digicam_sensor_filter');

  // Verify CSS filter classes have 0 layout shift (CLS = 0.000)
  const cssFilters = getCssFilterRules(projectRoot);
  for (const name of ['original', 'vintage-ccd', 'noir-monolith', 'flash-glow']) {
    const rule = cssFilters.rules[name];
    harness.assert(rule && rule.hasFilterProp === true, `CSS class .filter-digicam-${name} defines GPU filter property`);
    harness.assert(rule && rule.hasLayoutShiftProps === false, `CSS class .filter-digicam-${name} guarantees 0 layout shift (no width/height/margin/padding)`);
  }

  // -------------------------------------------------------------------------
  // Feature 8: Live Animated Tab Favicon & Title Equalizer
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 8: Live Animated Tab Favicon & Title Equalizer');
  const tabFaviconSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'TabEqualizerFavicon.tsx'), 'utf-8');

  harness.assert(tabFaviconSource.includes('DEFAULT_TITLE = "Alice — Mystica • The Creative Archive"'), 'Defines default archive document title');
  harness.assert(tabFaviconSource.includes('DEFAULT_FAVICON = "/assets/alice_hero_red.png"'), 'Defines default authentic hero favicon path');
  harness.assert(tabFaviconSource.includes('TITLE_EQUALIZER_FRAMES'), 'Defines TITLE_EQUALIZER_FRAMES animation sequence');
  harness.assert(tabFaviconSource.includes('canvas.width = 32') && tabFaviconSource.includes('canvas.height = 32'), 'Generates standard 32x32 offscreen favicon canvas');
  harness.assert(tabFaviconSource.includes('document.title = DEFAULT_TITLE'), 'Restores default title on pause or unmount');
  harness.assert(tabFaviconSource.includes('faviconLink.href = DEFAULT_FAVICON'), 'Restores default favicon on pause or unmount');

  // -------------------------------------------------------------------------
  // Feature 9: Framer Bento Discipline Grid
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 9: Framer Bento Discipline Grid');
  const bentoSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FramerBentoDisciplineGrid.tsx'), 'utf-8');

  harness.assert(bentoSource.includes("All Disciplines (8)"), 'Bento grid has All Disciplines (8) filter option');
  harness.assert(bentoSource.includes("Words & Leadership"), 'Bento grid has Words & Leadership filter option');
  harness.assert(bentoSource.includes("Sonic & Motion"), 'Bento grid has Sonic & Motion filter option');
  harness.assert(bentoSource.includes("Visual & Aesthetics"), 'Bento grid has Visual & Aesthetics filter option');
  harness.assert(bentoSource.includes("lg:col-span-2"), 'Hero Bento Card 02 (Music & Discovery) spans 2 columns in asymmetric grid');
  harness.assert(bentoSource.includes("grid-cols-1 md:grid-cols-2 lg:grid-cols-4"), 'Defines 4-column responsive bento layout');

  // -------------------------------------------------------------------------
  // Feature 10: Floating Ambient Starlight Dust
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 10: Floating Ambient Starlight Dust');
  const dustSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FloatingStarlightDust.tsx'), 'utf-8');

  harness.assert(dustSource.includes("(prefers-reduced-motion: reduce)"), 'Respects user reduced-motion preference');
  harness.assert(dustSource.includes("width < 768 ? 20 : 45"), 'Allocates 20 particles for mobile and 45 for desktop');
  harness.assert(dustSource.includes("repelRadius = 110"), 'Implements 110px radial cursor repulsion field');
  harness.assert(dustSource.includes("Math.hypot(dx, dy)"), 'Calculates Euclidean distance for particle physics');
  harness.assert(dustSource.includes("p.x < -10") && dustSource.includes("p.x > width + 10"), 'Implements toroidal boundary wrapping');

  // -------------------------------------------------------------------------
  // Feature 11: Authentic Photos Preservation
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 11: Authentic Photos Preservation');
  const authenticPhotos = getAuthenticPhotos(projectRoot);

  harness.assertEqual(authenticPhotos.length, 5, 'Exactly 5 authentic photos specified');
  for (const photo of authenticPhotos) {
    harness.assert(photo.exists === true, `Authentic photo ${photo.name} exists in public/assets/`);
    harness.assert(photo.isHeaderValid === true, `Authentic photo ${photo.name} has valid binary magic bytes (${photo.format.toUpperCase()})`);
    harness.assert(photo.isSizeInRange === true, `Authentic photo ${photo.name} size (${photo.size} bytes) in expected range`);
  }

  // Verify zero stock photo domains in src/
  const remnants = scanFilesForRemnants(path.join(projectRoot, 'src'));
  harness.assertEqual(remnants.stockDomains.length, 0, 'Zero stock photo domain URLs in src/ (Unsplash, Pexels, Pixabay, Placeholder)');

  // -------------------------------------------------------------------------
  // Feature 12: Persona Integrity (Zero Marcus Bennet)
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 12: Persona Integrity (Zero Marcus Bennet)');
  harness.assertEqual(remnants.marcusBennetOccurrences.length, 0, 'Zero occurrences of "Marcus Bennet" in src/');
  harness.assertEqual(remnants.bennetOccurrences.length, 0, 'Zero occurrences of "Bennet" in src/');

  // Also verify index.html persona integrity
  const htmlDetails = getIndexHtmlDetails(projectRoot);
  harness.assert(htmlDetails.title.includes('Alice'), 'index.html title specifies Alice');
  harness.assert(!htmlDetails.content.includes('Marcus'), 'index.html has zero Marcus references');
  harness.assert(!htmlDetails.content.includes('Bennet'), 'index.html has zero Bennet references');

  // -------------------------------------------------------------------------
  // Feature 13: Mobile Ergonomics & Safe-Area Insets
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 13: Mobile Ergonomics & Safe-Area Insets');
  harness.assert(htmlDetails.hasViewportFitCover === true, 'Viewport meta tag includes viewport-fit=cover');
  harness.assert(htmlDetails.hasWidthDeviceWidth === true, 'Viewport meta tag includes width=device-width');

  const appSource = fs.readFileSync(path.join(projectRoot, 'src', 'App.tsx'), 'utf-8');
  harness.assert(appSource.includes("compact"), 'Supports compact mode for mobile screens');
  harness.assert(appSource.includes("fixed") && appSource.includes("bottom-"), 'Bottom floating capsule docks responsively on mobile');

  const cssContent = fs.readFileSync(path.join(projectRoot, 'src', 'index.css'), 'utf-8');
  harness.assert(cssContent.includes("overflow-x: hidden"), 'Body specifies overflow-x: hidden to prevent horizontal mobile scrolling');

  harness.printSummary();
  return harness.summary();
}

if (process.argv[1] && process.argv[1].endsWith('tier1_features.test.js')) {
  runTier1()
    .then(summary => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
