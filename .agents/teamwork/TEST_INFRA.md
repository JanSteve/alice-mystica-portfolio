# E2E Test Infra: Alice Mystica Portfolio

## Test Philosophy
- Opaque-box, requirement-driven testing derived from `ORIGINAL_REQUEST.md`.
- No dependency on internal implementation structures.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial + Real-World Workload Testing.

## Feature Inventory & Test Mapping
| # | Feature | Requirement Source | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) |
|---|---------|-------------------|:-----------------:|:-----------------:|:----------------------:|
| 1 | Audio File Asset (`all_the_stars_interlude.mp3`) | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | Web Audio Engine & Seamless Looping | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 3 | Live Canvas Equalizer & Analyser | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 4 | Volume Memory & Persistence | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 5 | Autoplay Gesture Synchronization | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 6 | Liquid Magnetic Spring Cursor | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 7 | Interactive Digicam Sensor Filter Switcher | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 8 | Live Animated Tab Favicon & Title Equalizer | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 9 | Framer Bento Discipline Grid | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 10 | Floating Ambient Starlight Dust | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 11 | Authentic Photos Preservation | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 12 | Persona Integrity (Zero Marcus Bennet) | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 13 | Mobile Ergonomics & Safe-Area Insets | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |

## Test Architecture
- **Runner**: Node.js automated test runner / Playwright / Puppeteer script or TypeScript verification harness (`tests/e2e/runner.ts` or `tests/e2e/test_suite.mjs`).
- **Pass/Fail Semantics**: Exit code 0 on complete pass, non-zero with failure report.
- **Directory Layout**:
  ```
  tests/
    e2e/
      tier1_features.test.ts
      tier2_boundaries.test.ts
      tier3_combinations.test.ts
      tier4_scenarios.test.ts
      runner.ts
  ```

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | First-time visitor lands on mobile viewport, triggers audio, browses archival desk, checks safe-area dock | F1, F2, F4, F5, F11, F13 | High |
| 2 | Desktop visitor interacts with magnetic cursor, switches digicam filters in photo gallery, verifies 0 CLS | F6, F7, F10, F11 | High |
| 3 | Audio playback active: tab title animates, favicon dances, audio spectrum canvas reflects real frequencies | F1, F3, F5, F8 | High |
| 4 | Bento grid interaction: filter by category, check spring transitions and micro-interaction states | F9, F6 | Medium |
| 5 | Volume persistence & state resilience: adjust volume, refresh page, verify hydration, test audio mute/unmute | F4, F5, F2 | Medium |
| 6 | Complete visual & identity audit: verify 5 authentic photos, verify 0 AI images, verify 0 Marcus Bennet remnants | F11, F12 | Medium |

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥5 test cases per feature (13 × 5 = 65 tests).
- **Tier 2 (Boundary & Corner)**: ≥5 test cases per feature (13 × 5 = 65 tests).
- **Tier 3 (Cross-Feature Combinations)**: ≥13 tests covering critical pairwise interactions.
- **Tier 4 (Real-World Application Scenarios)**: ≥6 realistic end-to-end user journeys.
- **Total Minimum Target**: ≥ 149 test assertions across Tiers 1-4.
