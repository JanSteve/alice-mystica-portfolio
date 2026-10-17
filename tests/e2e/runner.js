#!/usr/bin/env node

/**
 * MASTER E2E TEST RUNNER — ALICE MYSTICA PORTFOLIO
 * Executes all 4 E2E Test Tiers:
 *   - Tier 1: Feature Coverage (13 Features)
 *   - Tier 2: Boundary & Corner Cases (13 Features)
 *   - Tier 3: Cross-Feature Combinations (>=13 Pairwise Interactions)
 *   - Tier 4: Real-World Application Scenarios (>=6 Scenarios)
 */

import { runTier1 } from './tier1_features.test.js';
import { runTier2 } from './tier2_boundaries.test.js';
import { runTier3 } from './tier3_combinations.test.js';
import { runTier4 } from './tier4_scenarios.test.js';
import { GREEN, RED, CYAN, MAGENTA, YELLOW, RESET, BOLD } from './helpers/test_harness.js';

async function main() {
  const startTime = Date.now();

  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${BOLD}${CYAN}║     ALICE MYSTICA PORTFOLIO — MASTER 4-TIER E2E TEST SUITE RUNNER    ║${RESET}`);
  console.log(`${BOLD}${CYAN}╚══════════════════════════════════════════════════════════════════════╝${RESET}\n`);

  const tierSummaries = [];

  try {
    // Execute Tier 1
    const t1 = await runTier1();
    tierSummaries.push(t1);

    // Execute Tier 2
    const t2 = await runTier2();
    tierSummaries.push(t2);

    // Execute Tier 3
    const t3 = await runTier3();
    tierSummaries.push(t3);

    // Execute Tier 4
    const t4 = await runTier4();
    tierSummaries.push(t4);
  } catch (err) {
    console.error(`\n${RED}Fatal execution error in test runner:${RESET}`, err);
    process.exit(1);
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalPassed = tierSummaries.reduce((acc, t) => acc + t.passed, 0);
  const totalFailed = tierSummaries.reduce((acc, t) => acc + t.failed, 0);
  const totalTests = totalPassed + totalFailed;

  console.log(`\n${BOLD}${MAGENTA}========================================================================${RESET}`);
  console.log(`${BOLD}${MAGENTA}                    MASTER E2E SUITE EXECUTION SUMMARY                  ${RESET}`);
  console.log(`${BOLD}${MAGENTA}========================================================================${RESET}`);

  tierSummaries.forEach((s, idx) => {
    const statusColor = s.failed === 0 ? GREEN : RED;
    const mark = s.failed === 0 ? '✓ PASS' : '✗ FAIL';
    console.log(
      `  Tier ${idx + 1}: ${s.suite.padEnd(52)} ${statusColor}[${mark}: ${s.passed}/${s.total}]${RESET}`
    );
  });

  console.log(`${BOLD}${MAGENTA}------------------------------------------------------------------------${RESET}`);
  console.log(`  Total Test Assertions : ${BOLD}${totalTests}${RESET}`);
  console.log(`  Passed Assertions     : ${GREEN}${BOLD}${totalPassed}${RESET}`);
  console.log(`  Failed Assertions     : ${totalFailed > 0 ? RED : GREEN}${BOLD}${totalFailed}${RESET}`);
  console.log(`  Duration              : ${durationSec}s`);
  console.log(`${BOLD}${MAGENTA}========================================================================${RESET}\n`);

  if (totalFailed > 0) {
    console.log(`${RED}${BOLD}❌ MASTER E2E TEST SUITE FAILED WITH ${totalFailed} FAILURES.${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}✨ ALL 4 TIERS PASSED WITH 100% SUCCESS RATE (${totalPassed}/${totalTests} TESTS PASSING).${RESET}\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
