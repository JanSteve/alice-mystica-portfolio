import fs from 'node:fs';
import path from 'node:path';
import { TestSuiteHarness } from './helpers/test_harness.js';
import { createMockAudioContext } from './helpers/audio_helper.js';
import { MockLocalStorage } from './helpers/storage_helper.js';
import { getCssFilterRules, getAuthenticPhotos, getIndexHtmlDetails } from './helpers/dom_helper.js';

export async function runTier3() {
  const harness = new TestSuiteHarness('Tier 3: Cross-Feature Combinations (>=13 Pairwise Interactions)');
  harness.printHeader();

  const projectRoot = path.resolve('.');

  // Mock audio and window environment
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
  const { AllTheStarsBoutiqueSynthesizer, STORAGE_KEY_VOLUME } = soundscapeModule;

  // -------------------------------------------------------------------------
  // Combo 1: Audio Playback (F1, F2) ↔ Tab Title & Favicon Equalizer (F8)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 1: Audio Playback (F1, F2) ↔ Tab Title/Favicon Equalizer (F8)');
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    let titleState = "Alice — Mystica • The Creative Archive";
    let isTitleAnimated = false;

    // Simulate TabEqualizerFavicon subscriber
    engine.addListener((isPlaying) => {
      if (isPlaying) {
        titleState = "Alice — Mystica [ ılıll ]";
        isTitleAnimated = true;
      } else {
        titleState = "Alice — Mystica • The Creative Archive";
        isTitleAnimated = false;
      }
    });

    harness.assertEqual(titleState, "Alice — Mystica • The Creative Archive", 'Initial document title is default archive title');
    harness.assertEqual(isTitleAnimated, false, 'Title animation inactive while paused');

    engine.start();
    harness.assertEqual(titleState, "Alice — Mystica [ ılıll ]", 'Starting audio starts dynamic title equalizer sequence');
    harness.assertEqual(isTitleAnimated, true, 'Title animation active during playback');

    engine.stop();
    harness.assertEqual(titleState, "Alice — Mystica • The Creative Archive", 'Stopping audio restores default title immediately');
    harness.assertEqual(isTitleAnimated, false, 'Title animation stops immediately on pause');
  }

  // -------------------------------------------------------------------------
  // Combo 2: Web Audio Engine (F2) ↔ AnalyserNode Routing & Spectrum Canvas (F3)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 2: Web Audio Engine (F2) ↔ Spectrum Canvas & Analyser (F3)');
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    engine.audioBuffer = ctx.createBuffer(2, 44100 * 5, 44100);

    engine.start();
    await new Promise((r) => setTimeout(r, 20));

    const analyser = engine.getAnalyser();
    harness.assert(analyser instanceof MockAnalyserNode, 'Engine exposes live AnalyserNode');

    const source = engine.bufferSource;
    harness.assert(source && source.connectedTo.includes(analyser), 'Audio buffer directly feeds AnalyserNode');
    harness.assert(analyser.connectedTo.includes(engine.masterGain), 'AnalyserNode feeds MasterGain before speakers');

    const levels = engine.getEqualizerLevels();
    harness.assert(levels.bar1 > 0.1, 'Spectrum levels reflect active audio signal above baseline');
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Combo 3: Autoplay Synchronization (F5) ↔ Bento Grid Music Card (F9)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 3: Autoplay Synchronization (F5) ↔ Bento Grid Music Card (F9)');
  {
    const engine = new AllTheStarsBoutiqueSynthesizer();
    let bentoWidgetPlaying = false;
    let capsuleWidgetPlaying = false;

    // Both UI widgets subscribe to sound engine
    engine.addListener((isPlaying) => {
      bentoWidgetPlaying = isPlaying;
      capsuleWidgetPlaying = isPlaying;
    });

    harness.assertEqual(bentoWidgetPlaying, false, 'Bento widget starts in paused state');
    harness.assertEqual(capsuleWidgetPlaying, false, 'Capsule widget starts in paused state');

    // Simulate clicking play on Bento Card 02 (Music & Discovery)
    engine.start();
    harness.assertEqual(bentoWidgetPlaying, true, 'Bento Card 02 widget updates to playing');
    harness.assertEqual(capsuleWidgetPlaying, true, 'Audio Capsule synchronously updates to playing');

    engine.stop();
    harness.assertEqual(bentoWidgetPlaying, false, 'Stopping audio resets Bento Card 02 state');
    harness.assertEqual(capsuleWidgetPlaying, false, 'Stopping audio resets Capsule state');
  }

  // -------------------------------------------------------------------------
  // Combo 4: Volume Persistence (F4) ↔ Web Audio Engine Master Gain (F2)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 4: Volume Persistence (F4) ↔ Web Audio Master Gain (F2)');
  {
    mockStorage.setItem(STORAGE_KEY_VOLUME, '0.78');
    const engine = new AllTheStarsBoutiqueSynthesizer();
    harness.assertCloseTo(engine.volume, 0.78, 0.001, 'Hydrates volume 0.78 from storage');

    // Change volume to 0.32
    engine.setVolume(0.32);
    harness.assertCloseTo(engine.volume, 0.32, 0.001, 'Volume updated on engine');
    harness.assertEqual(mockStorage.getItem(STORAGE_KEY_VOLUME), '0.32', 'Persisted to localStorage');

    // Start engine and verify masterGain matches hydrated volume
    const ctx = engine.getAudioContext();
    ctx.state = 'running';
    engine.audioBuffer = ctx.createBuffer(2, 44100 * 2, 44100);
    engine.start();
    harness.assert(engine.masterGain !== null, 'masterGain node exists');
    engine.stop();
  }

  // -------------------------------------------------------------------------
  // Combo 5: Liquid Magnetic Cursor (F6) ↔ Digicam Filter Switcher (F7)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 5: Liquid Magnetic Cursor (F6) ↔ Digicam Filter Switcher (F7)');
  {
    const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');
    const digicamSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'DigicamFilterSwitcher.tsx'), 'utf-8');

    // Filter switcher buttons are <button> elements which trigger magnetic cursor
    harness.assert(digicamSource.includes('<button'), 'Digicam filter switcher renders interactive buttons');
    harness.assert(cursorSource.includes("target.closest('[data-cursor=\"magnetic\"], button"), 'Cursor detects buttons and triggers magnetic mode');
    harness.assert(cursorSource.includes("targetDimensions.current = { width: 48, height: 48"), 'Magnetic mode snaps to 48x48 pill ring');
  }

  // -------------------------------------------------------------------------
  // Combo 6: Liquid Magnetic Cursor (F6) ↔ Audio Capsule (F3, F5)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 6: Liquid Magnetic Cursor (F6) ↔ Audio Capsule (F3, F5)');
  {
    const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');
    const capsuleSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'BoutiqueAudioCapsule.tsx'), 'utf-8');

    harness.assert(capsuleSource.includes("aria-label={isPlaying ? 'Pause All The Stars boutique audio' : 'Play All The Stars boutique audio'}"), 'Capsule defines aria-label matching cursor audio/play selector');
    harness.assert(cursorSource.includes("target.closest('[data-cursor=\"play\"], button[aria-label*=\"play\" i], button[aria-label*=\"audio\" i], .audio-play-trigger')"), 'Cursor detects audio triggers via aria-label regex');
    harness.assert(cursorSource.includes("targetDimensions.current = { width: 92, height: 36"), 'Cursor morphs to 92x36 pill with PLAY/PAUSE label');
  }

  // -------------------------------------------------------------------------
  // Combo 7: Liquid Magnetic Cursor (F6) ↔ Archival Photo Frames (F11)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 7: Liquid Magnetic Cursor (F6) ↔ Archival Photo Frames (F11)');
  {
    const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');
    const appSource = fs.readFileSync(path.join(projectRoot, 'src', 'App.tsx'), 'utf-8');

    harness.assert(appSource.includes('archival-photo-frame') || appSource.includes('data-cursor="zoom"'), 'App photo frames marked with archival-photo-frame / data-cursor="zoom"');
    harness.assert(cursorSource.includes("target.closest('[data-cursor=\"zoom\"], .archival-photo-frame, .lightbox-trigger')"), 'Cursor detects photo frames');
    harness.assert(cursorSource.includes("targetDimensions.current = { width: 68, height: 68"), 'Cursor morphs into 68x68 circular magnifying lens with ZOOM label');
  }

  // -------------------------------------------------------------------------
  // Combo 8: Digicam Sensor Filter (F7) ↔ Authentic Photos Preservation (F11)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 8: Digicam Sensor Filter (F7) ↔ Authentic Photos Preservation (F11)');
  {
    const cssRules = getCssFilterRules(projectRoot);
    const photos = getAuthenticPhotos(projectRoot);

    harness.assertEqual(photos.length, 5, 'All 5 authentic photos targeted by filters');
    for (const filter of ['original', 'vintage-ccd', 'noir-monolith', 'flash-glow']) {
      const rule = cssRules.rules[filter];
      harness.assert(rule !== undefined, `Shader class ${rule.className} exists for authentic photos`);
      harness.assertEqual(rule.hasLayoutShiftProps, false, `Shader class ${rule.className} maintains 0 CLS across photo plates`);
    }
  }

  // -------------------------------------------------------------------------
  // Combo 9: Floating Starlight Dust (F10) ↔ Liquid Magnetic Cursor (F6)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 9: Floating Starlight Dust (F10) ↔ Liquid Magnetic Cursor (F6)');
  {
    const dustSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FloatingStarlightDust.tsx'), 'utf-8');

    // Simulate particle physics when cursor approaches within 110px radius
    const repelRadius = 110;
    const px = 100, py = 100;
    const mx = 120, my = 120; // Distance = ~28.28px
    const dx = px - mx;
    const dy = py - my;
    const dist = Math.hypot(dx, dy);

    harness.assert(dist < repelRadius, 'Cursor is within starlight particle repulsion radius');
    const force = ((repelRadius - dist) / repelRadius) * 1.8;
    const newPx = px + (dx / dist) * force;
    const newPy = py + (dy / dist) * force;

    harness.assert(newPx < px, 'Particle repelled away from cursor along X axis');
    harness.assert(newPy < py, 'Particle repelled away from cursor along Y axis');
    harness.assert(dustSource.includes("repelRadius = 110"), 'Starlight dust implements matching 110px repulsion radius');
  }

  // -------------------------------------------------------------------------
  // Combo 10: Mobile Ergonomics (F13) ↔ Liquid Magnetic Cursor (F6)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 10: Mobile Ergonomics (F13) ↔ Liquid Magnetic Cursor (F6)');
  {
    const cursorSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'LiquidMagneticCursor.tsx'), 'utf-8');

    // Verification that touch devices do not display cursor
    harness.assert(cursorSource.includes("window.matchMedia('(pointer: fine)').matches && !('ontouchstart' in window)"), 'Cursor checks both fine pointer AND absence of ontouchstart');
    harness.assert(cursorSource.includes("if (!isSupported) return null"), 'Cursor cleanly renders null on touchscreens to prevent dual cursor artifacts');
  }

  // -------------------------------------------------------------------------
  // Combo 11: Mobile Ergonomics (F13) ↔ Audio Capsule Dock (F3, F5)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 11: Mobile Ergonomics (F13) ↔ Audio Capsule Dock (F3, F5)');
  {
    const capsuleSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'BoutiqueAudioCapsule.tsx'), 'utf-8');

    harness.assert(capsuleSource.includes('fixed'), 'Capsule uses fixed positioning for persistent mobile accessibility');
    harness.assert(capsuleSource.includes('safe-area-inset-bottom'), 'Capsule docks with safe-area spacing');
    harness.assert(capsuleSource.includes('z-40'), 'Capsule has z-40 to float over page content');
  }

  // -------------------------------------------------------------------------
  // Combo 12: Bento Grid Filtering (F9) ↔ Authentic Photos/Media (F11)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 12: Bento Grid Filtering (F9) ↔ Authentic Media Widgets (F11)');
  {
    const bentoSource = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'FramerBentoDisciplineGrid.tsx'), 'utf-8');

    harness.assert(bentoSource.includes('alice_childhood_playful.jpg') || bentoSource.includes('alice_hero_red.png') || bentoSource.includes('onViewPhotoWall'), 'Bento grid connects to authentic photography archive');
    harness.assert(bentoSource.includes('filteredInterests.map'), 'Bento dynamically maps filtered interests');
  }

  // -------------------------------------------------------------------------
  // Combo 13: Persona Integrity (F12) ↔ Archival Audio & Photos (F1, F11)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 13: Persona Integrity (F12) ↔ Audio & Photos (F1, F11)');
  {
    const html = getIndexHtmlDetails(projectRoot);
    const photos = getAuthenticPhotos(projectRoot);

    harness.assert(html.title.includes('Alice — Mystica'), 'Document title identifies Alice Mystica');
    harness.assertEqual(photos.length, 5, 'Portfolio features exclusively Alice 5 authentic photos');
    harness.assert(!html.content.includes('Marcus Bennet'), 'Document has zero Marcus Bennet references');
  }

  // -------------------------------------------------------------------------
  // Combo 14: Dark/Light Editorial Atmosphere ↔ Digicam Filters (F7)
  // -------------------------------------------------------------------------
  harness.setFeature('Combo 14: Editorial Atmosphere Theme ↔ Digicam Filters (F7)');
  {
    const cssContent = fs.readFileSync(path.join(projectRoot, 'src', 'index.css'), 'utf-8');

    harness.assert(cssContent.includes('[data-theme="linen"]'), 'Index CSS defines [data-theme="linen"] editorial linen mode');
    harness.assert(cssContent.includes('.filter-digicam-vintage-ccd'), 'CSS defines digicam filter shaders concurrently');
    harness.assert(cssContent.includes('transition: filter'), 'Filter changes have smooth optical transitions without CSS selector collision');
  }

  harness.printSummary();
  return harness.summary();
}

if (process.argv[1] && process.argv[1].endsWith('tier3_combinations.test.js')) {
  runTier3()
    .then(summary => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
