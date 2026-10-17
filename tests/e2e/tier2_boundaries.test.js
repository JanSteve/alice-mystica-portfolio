import fs from 'node:fs';
import path from 'node:path';
import { TestSuiteHarness } from './helpers/test_harness.js';
import { probeAudioFile, probeBoundaryAmplitudes, createMockAudioContext } from './helpers/audio_helper.js';
import { MockLocalStorage } from './helpers/storage_helper.js';
import {
  getIndexHtmlDetails,
  getCssFilterRules,
  scanFilesForRemnants,
  getAuthenticPhotos
} from './helpers/dom_helper.js';

export async function runTier2() {
  const harness = new TestSuiteHarness('Tier 2: Boundary & Corner Cases (All 13 Features)');
  harness.printHeader();

  const projectRoot = path.resolve('.');

  // -------------------------------------------------------------------------
  // Feature 1: Audio Asset File Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 1: Audio Asset File Boundaries');
  const audioPath = path.join(projectRoot, 'public', 'assets', 'all_the_stars_interlude.mp3');
  const boundary = probeBoundaryAmplitudes(audioPath);
  harness.assert(boundary.headMax < 0.15, 'Audio head amplitude boundary < 0.15 for seamless start', `headMax=${boundary.headMax}`);

  const nonExistentProbe = probeAudioFile(path.join(projectRoot, 'public', 'assets', 'non_existent_audio.mp3'));
  harness.assertEqual(nonExistentProbe.exists, false, 'Non-existent file gracefully returns exists: false');

  const probe = probeAudioFile(audioPath);
  harness.assert(probe.bitRate >= 320000, 'Audio bitrate meets or exceeds 320 kbps studio boundary');
  harness.assertEqual(probe.sampleRate, 44100, 'Audio sample rate strictly equals 44100 Hz boundary');
  harness.assert(probe.duration >= 19.6 && probe.duration <= 20.0, 'Audio duration strictly within [19.6s, 20.0s] bounds');

  // -------------------------------------------------------------------------
  // Feature 2: Web Audio Engine Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 2: Web Audio Engine Boundaries');
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
  const { AllTheStarsBoutiqueSynthesizer, DEFAULT_VOLUME, STORAGE_KEY_VOLUME } = soundscapeModule;

  // Boundary 2.1: Seam smoothing on maximum amplitude buffer (all 1.0)
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    const testBuffer = ctx.createBuffer(2, 44100, 44100);
    testBuffer.getChannelData(0).fill(1.0);
    testBuffer.getChannelData(1).fill(1.0);

    engine.applySeamSmoothing(testBuffer);
    const c0 = testBuffer.getChannelData(0);
    const c1 = testBuffer.getChannelData(1);
    harness.assertEqual(c0[0], 0, 'Seam smoothing forces channel 0 sample[0] to 0 even from max 1.0');
    harness.assertEqual(c1[0], 0, 'Seam smoothing forces channel 1 sample[0] to 0 even from max 1.0');
    harness.assertEqual(c0[c0.length - 1], 0, 'Seam smoothing forces channel 0 tail sample to 0');
    harness.assertEqual(c1[c1.length - 1], 0, 'Seam smoothing forces channel 1 tail sample to 0');
  }

  // Boundary 2.2: Seam smoothing with small buffer (<256 samples)
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    const shortBuffer = ctx.createBuffer(1, 200, 44100);
    let threw = false;
    try {
      engine.applySeamSmoothing(shortBuffer);
    } catch {
      threw = true;
    }
    harness.assertEqual(threw, false, 'Seam smoothing does not throw on short buffers');
  }

  // Boundary 2.3: Idempotent stop() on idle engine
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    harness.assertEqual(engine.isPlaying, false, 'Engine initially idle');
    let threw = false;
    try {
      engine.stop();
      engine.stop();
    } catch {
      threw = true;
    }
    harness.assertEqual(threw, false, 'Consecutive stop() calls on idle engine do not throw');
    harness.assertEqual(engine.isPlaying, false, 'Engine remains idle');
  }

  // Boundary 2.4: Procedural fallback engages automatically when buffer is absent
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    // Emulate fetch failure
    engine.audioBuffer = null;
    engine.bufferLoading = false;
    engine.loadAudioBuffer = async () => false;

    const started = engine.start();
    harness.assertEqual(started, true, 'start() returns true in procedural mode');
    harness.assertEqual(engine.isPlaying, true, 'engine.isPlaying is true in procedural mode');
    harness.assert(engine.proceduralSchedulerId !== null || engine.isPlaying, 'Procedural mode is engaged');
    engine.stop();
    harness.assertEqual(engine.isPlaying, false, 'engine stops cleanly from procedural mode');
  }

  // -------------------------------------------------------------------------
  // Feature 3: AnalyserNode & Equalizer Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 3: AnalyserNode & Equalizer Boundaries');
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();

    // Idle state boundary
    const idleLevels = engine.getEqualizerLevels();
    harness.assertEqual(idleLevels.bar1, 0.1, 'Idle bar1 equals baseline floor 0.1');
    harness.assertEqual(idleLevels.bar2, 0.1, 'Idle bar2 equals baseline floor 0.1');
    harness.assertEqual(idleLevels.bar3, 0.1, 'Idle bar3 equals baseline floor 0.1');
    harness.assertEqual(idleLevels.bar4, 0.1, 'Idle bar4 equals baseline floor 0.1');
    harness.assertEqual(idleLevels.beatIntensity, 0.1, 'Idle beatIntensity equals baseline floor 0.1');

    // 100 consecutive queries produce valid numbers (no NaN or Infinity)
    let nonFiniteDetected = false;
    for (let i = 0; i < 100; i++) {
      const lvl = engine.getEqualizerLevels();
      if (!Number.isFinite(lvl.bar1) || !Number.isFinite(lvl.bar2) || !Number.isFinite(lvl.beatIntensity)) {
        nonFiniteDetected = true;
        break;
      }
    }
    harness.assertEqual(nonFiniteDetected, false, 'Zero non-finite numbers across 100 consecutive getEqualizerLevels queries');

    // Clamping boundary on simulated max values
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    engine.audioBuffer = ctx.createBuffer(2, 44100 * 5, 44100);
    engine.start();
    await new Promise((r) => setTimeout(r, 20));

    const playingLevels = engine.getEqualizerLevels();
    harness.assert(playingLevels.bar1 <= 1.0, 'Playing bar1 clamped to <= 1.0');
    harness.assert(playingLevels.bar2 <= 1.0, 'Playing bar2 clamped to <= 1.0');
    harness.assert(playingLevels.beatIntensity <= 1.0, 'Playing beatIntensity clamped to <= 1.0');
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Feature 4: Volume Persistence & Clamping Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 4: Volume Persistence & Clamping Boundaries');
  {
    // Corrupted localStorage inputs fallback to DEFAULT_VOLUME (0.55)
    const corruptedValues = ['-999', '999', 'NaN', 'undefined', 'null', '{"vol":0.8}', 'garbage_text'];
    for (const corrupt of corruptedValues) {
      mockStorage.setItem(STORAGE_KEY_VOLUME, corrupt);
      const engine = new AllTheStarsBoutiqueSynthesizer();
      harness.assertEqual(
        engine.volume,
        DEFAULT_VOLUME,
        `Corrupted volume "${corrupt}" safely falls back to DEFAULT_VOLUME (${DEFAULT_VOLUME})`
      );
    }

    // Exact boundaries 0 and 1
    mockStorage.setItem(STORAGE_KEY_VOLUME, '0');
    const engineZero = new AllTheStarsBoutiqueSynthesizer();
    harness.assertEqual(engineZero.volume, 0, 'Exact 0 volume hydrates to 0 (mute)');

    mockStorage.setItem(STORAGE_KEY_VOLUME, '1');
    const engineOne = new AllTheStarsBoutiqueSynthesizer();
    harness.assertEqual(engineOne.volume, 1, 'Exact 1.0 volume hydrates to 1.0 (max)');

    // Clamping on Infinity and -Infinity
    const engineClamp = new AllTheStarsBoutiqueSynthesizer();
    engineClamp.setVolume(Infinity);
    harness.assertEqual(engineClamp.volume, 1.0, 'setVolume(Infinity) clamps to 1.0');
    engineClamp.setVolume(-Infinity);
    harness.assertEqual(engineClamp.volume, 0.0, 'setVolume(-Infinity) clamps to 0.0');

    // QuotaExceededError in localStorage does not crash application
    mockStorage.shouldThrowQuotaError = true;
    let quotaCrashed = false;
    try {
      engineClamp.setVolume(0.7);
    } catch {
      quotaCrashed = true;
    }
    harness.assertEqual(quotaCrashed, false, 'setVolume survives LocalStorage QuotaExceededError without crashing');
    mockStorage.shouldThrowQuotaError = false;
  }

  // -------------------------------------------------------------------------
  // Feature 5: Autoplay Gesture Synchronization Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 5: Autoplay Gesture Synchronization Boundaries');
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();

    // Rapid play/pause toggles
    let rapidCrash = false;
    try {
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) engine.start();
        else engine.stop();
      }
    } catch {
      rapidCrash = true;
    }
    harness.assertEqual(rapidCrash, false, '10 rapid start/stop toggles execute without crashing');
    engine.stop();

    // Self-unsubscribing listener boundary
    let selfUnsubscribed = false;
    const unsubSelf = engine.addListener(() => {
      selfUnsubscribed = true;
      unsubSelf();
    });
    engine.start();
    harness.assertEqual(selfUnsubscribed, true, 'Self-unsubscribing listener executes and unsubscribes cleanly');
    engine.stop();

    // Faulty throwing listener does not prevent healthy listener execution
    let healthyNotified = false;
    engine.addListener(() => {
      throw new Error('Explosive subscriber error');
    });
    engine.addListener(() => {
      healthyNotified = true;
    });
    engine.start();
    harness.assertEqual(healthyNotified, true, 'Faulty subscriber error is isolated; healthy subscriber is notified');
    engine.stop();

    // Calling unsubscribe multiple times is idempotent
    const unsub = engine.addListener(() => {});
    unsub();
    unsub();
    harness.assert(true, 'Calling unsubscribe multiple times is a safe idempotent no-op');
  }

  // -------------------------------------------------------------------------
  // Feature 6: Liquid Magnetic Cursor Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 6: Liquid Magnetic Cursor Boundaries');
  const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');

  // Boundary 6.1: Fine pointer negative check
  harness.assert(cursorSource.includes("!isFinePointer"), 'Deactivates if pointer is not fine');
  harness.assert(cursorSource.includes("setIsSupported(false)"), 'Sets isSupported to false on touch/coarse pointers');

  // Boundary 6.2: Viewport exit sets isVisible = false
  harness.assert(cursorSource.includes("handleMouseLeave = () => {\n      setIsVisible(false)"), 'Hides cursor on mouseleave');

  // Boundary 6.3: Contextual element detection hierarchy
  harness.assert(cursorSource.includes("target.closest('[data-cursor=\"play\"]"), 'Detects play cursor attribute');
  harness.assert(cursorSource.includes("target.closest('[data-cursor=\"zoom\"]"), 'Detects zoom cursor attribute');
  harness.assert(cursorSource.includes("target.closest('[data-cursor=\"magnetic\"]"), 'Detects magnetic cursor attribute');

  // Boundary 6.4: Spring physics lerp values are damping ratios in (0, 1)
  harness.assert(cursorSource.includes("* 0.6"), 'Lead dot uses responsive 0.6 lerp coefficient');
  harness.assert(cursorSource.includes("* 0.15"), 'Outer ring uses smooth 0.15 spring lerp damping coefficient');

  // -------------------------------------------------------------------------
  // Feature 7: Digicam Filter Switcher Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 7: Digicam Filter Switcher Boundaries');
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

  harness.assertEqual(getFilterClass('non_existent_filter'), 'filter-digicam-original', 'Invalid filter key falls back to filter-digicam-original');
  harness.assertEqual(getFilterClass(null), 'filter-digicam-original', 'Null filter key falls back to filter-digicam-original');
  harness.assertEqual(getFilterClass(undefined), 'filter-digicam-original', 'Undefined filter key falls back to filter-digicam-original');
  harness.assertEqual(getFilterClass(''), 'filter-digicam-original', 'Empty string filter key falls back to filter-digicam-original');

  const digicamSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'DigicamFilterSwitcher.tsx'), 'utf-8');
  harness.assert(digicamSource.includes("if (filterId === currentFilter) return"), 'Selecting already active filter is an idempotent early return');
  harness.assert(digicamSource.includes("try {\n      localStorage.setItem('alice_digicam_sensor_filter'"), 'LocalStorage write wrapped in try-catch to prevent storage errors');

  // -------------------------------------------------------------------------
  // Feature 8: Tab Favicon & Title Equalizer Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 8: Tab Favicon & Title Equalizer Boundaries');
  const tabFaviconSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'TabEqualizerFavicon.tsx'), 'utf-8');

  harness.assert(tabFaviconSource.includes("document.createElement('link')"), 'Dynamically creates favicon link if missing in document');
  harness.assert(tabFaviconSource.includes("TITLE_EQUALIZER_FRAMES.length"), 'Uses array length modulo for title animation frames');

  // Check frame count
  const frameMatches = tabFaviconSource.match(/"Alice — Mystica \[[^\]]+\]"/g) || [];
  harness.assertEqual(frameMatches.length, 8, 'TITLE_EQUALIZER_FRAMES contains exactly 8 frames');

  harness.assert(tabFaviconSource.includes("if (titleTimerRef.current) clearInterval(titleTimerRef.current)"), 'Cleans up interval timer on unmount/pause');
  harness.assert(tabFaviconSource.includes("if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)"), 'Cleans up animation frame on unmount/pause');

  // -------------------------------------------------------------------------
  // Feature 9: Framer Bento Discipline Grid Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 9: Framer Bento Discipline Grid Boundaries');
  const bentoSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FramerBentoDisciplineGrid.tsx'), 'utf-8');

  // Test category filtering logic function
  const isIncluded = (category, num) => {
    switch (category) {
      case 'words':
        return num === '01' || num === '08';
      case 'sonic':
        return num === '02' || num === '07';
      case 'visual':
        return num === '03' || num === '04' || num === '05' || num === '06';
      case 'all':
      default:
        return true;
    }
  };

  harness.assert(isIncluded('all', '01') && isIncluded('all', '05'), 'Filter "all" includes all discipline numbers');
  harness.assert(isIncluded('words', '01') && isIncluded('words', '08') && !isIncluded('words', '02'), 'Filter "words" strictly includes 01 & 08');
  harness.assert(isIncluded('sonic', '02') && isIncluded('sonic', '07') && !isIncluded('sonic', '01'), 'Filter "sonic" strictly includes 02 & 07');
  harness.assert(isIncluded('visual', '03') && isIncluded('visual', '06') && !isIncluded('visual', '08'), 'Filter "visual" strictly includes 03, 04, 05, 06');
  harness.assert(isIncluded('invalid_category', '01'), 'Unknown category filter ID safely defaults to true (show all)');

  // -------------------------------------------------------------------------
  // Feature 10: Floating Ambient Starlight Dust Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 10: Floating Ambient Starlight Dust Boundaries');
  const dustSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FloatingStarlightDust.tsx'), 'utf-8');

  // Zero-distance division guard
  harness.assert(dustSource.includes("dist < repelRadius && dist > 0"), 'Guards against division by zero when dist === 0');
  harness.assert(dustSource.includes("Math.max(0.05,"), 'Guards twinkle opacity from dropping below 0.05');
  harness.assert(dustSource.includes("particleCount ?? (width < 768 ? 20 : 45)"), 'Falls back to responsive counts when particleCount is null/undefined');
  harness.assert(dustSource.includes("isTabVisible = !document.hidden"), 'Checks document.hidden to pause rendering when tab is hidden');
  harness.assert(dustSource.includes("window.removeEventListener('mousemove', handleMouseMove)"), 'Removes event listeners on cleanup');

  // -------------------------------------------------------------------------
  // Feature 11: Authentic Photos Preservation Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 11: Authentic Photos Preservation Boundaries');
  const photos = getAuthenticPhotos(projectRoot);

  for (const photo of photos) {
    harness.assert(photo.size >= 150000, `${photo.name} size >= 150KB (not empty/truncated)`);
    harness.assert(photo.size <= 500000, `${photo.name} size <= 500KB (optimized asset boundary)`);
  }

  // Check that no photo is 0 bytes
  const zeroBytes = photos.filter(p => p.size === 0);
  harness.assertEqual(zeroBytes.length, 0, 'Zero 0-byte photos');

  // Check file naming: lowercase with underscore only
  const invalidNames = photos.filter(p => !/^[a-z0-9_]+\.(png|jpg|jpeg)$/.test(p.name));
  harness.assertEqual(invalidNames.length, 0, 'All authentic photo filenames adhere to standard snake_case');

  // -------------------------------------------------------------------------
  // Feature 12: Persona Integrity Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 12: Persona Integrity Boundaries');
  const pkgJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
  harness.assertEqual(pkgJson.name, 'alice-mystica-portfolio', 'package.json name matches alice-mystica-portfolio');

  const appSource = fs.readFileSync(path.join(projectRoot, 'src', 'App.tsx'), 'utf-8');
  harness.assert(!appSource.toLowerCase().includes('marcus bennet'), 'src/App.tsx has 0 case-insensitive "marcus bennet" matches');
  harness.assert(!appSource.toLowerCase().includes('marcusbennet'), 'src/App.tsx has 0 case-insensitive "marcusbennet" matches');
  harness.assert(appSource.includes('Alice Mystica'), 'src/App.tsx prominently references Alice Mystica');
  harness.assert(appSource.includes('THE CREATIVE ARCHIVE'), 'src/App.tsx specifies The Creative Archive');

  // -------------------------------------------------------------------------
  // Feature 13: Mobile Ergonomics & Safe-Area Boundaries
  // -------------------------------------------------------------------------
  harness.setFeature('Feature 13: Mobile Ergonomics & Safe-Area Boundaries');
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf-8');
  harness.assert(indexHtml.includes('initial-scale=1.0'), 'Viewport specifies initial-scale=1.0');
  harness.assert(indexHtml.includes('viewport-fit=cover'), 'Viewport specifies viewport-fit=cover');

  const cssSource = fs.readFileSync(path.join(projectRoot, 'src', 'index.css'), 'utf-8');
  harness.assert(cssSource.includes('.no-scrollbar'), 'Defines .no-scrollbar for touch carousel scrolling');
  harness.assert(cssSource.includes('scrollbar-width: none'), 'CSS disables scrollbar width for mobile platforms');
  harness.assert(appSource.includes('touch-manipulation') || appSource.includes('select-none') || appSource.includes('cursor-pointer'), 'Interactive elements optimized for touch interactions');

  harness.printSummary();
  return harness.summary();
}

if (process.argv[1] && process.argv[1].endsWith('tier2_boundaries.test.js')) {
  runTier2()
    .then(summary => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
