export const GREEN = '\x1b[32m';
export const RED = '\x1b[31m';
export const YELLOW = '\x1b[33m';
export const CYAN = '\x1b[36m';
export const MAGENTA = '\x1b[35m';
export const RESET = '\x1b[0m';
export const BOLD = '\x1b[1m';
export const DIM = '\x1b[2m';

export class TestSuiteHarness {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.currentFeature = '';
  }

  setFeature(featureName) {
    this.currentFeature = featureName;
    console.log(`\n${BOLD}${CYAN}  ► [Feature] ${featureName}${RESET}`);
  }

  assert(condition, testName, details = '') {
    const fullTestName = this.currentFeature ? `${this.currentFeature}: ${testName}` : testName;
    if (condition) {
      this.passed++;
      console.log(`    ${GREEN}✓ PASS${RESET} — ${testName}`);
      this.tests.push({ name: fullTestName, status: 'PASS', details });
    } else {
      this.failed++;
      console.log(`    ${RED}✗ FAIL${RESET} — ${testName} ${details ? `(${details})` : ''}`);
      this.tests.push({ name: fullTestName, status: 'FAIL', details });
    }
  }

  assertEqual(actual, expected, testName) {
    const passed = actual === expected;
    this.assert(
      passed,
      testName,
      passed ? '' : `expected: ${JSON.stringify(expected)}, got: ${JSON.stringify(actual)}`
    );
  }

  assertCloseTo(actual, expected, delta, testName) {
    const passed = Math.abs(actual - expected) <= delta;
    this.assert(
      passed,
      testName,
      passed ? '' : `expected ~${expected} (±${delta}), got: ${actual}`
    );
  }

  assertRange(actual, min, max, testName) {
    const passed = actual >= min && actual <= max;
    this.assert(
      passed,
      testName,
      passed ? '' : `expected within [${min}, ${max}], got: ${actual}`
    );
  }

  assertMatches(actual, regex, testName) {
    const passed = regex.test(actual);
    this.assert(
      passed,
      testName,
      passed ? '' : `expected to match ${regex}, got: ${JSON.stringify(actual)}`
    );
  }

  summary() {
    return {
      suite: this.name,
      passed: this.passed,
      failed: this.failed,
      total: this.passed + this.failed,
      tests: this.tests,
    };
  }

  printHeader() {
    console.log(`${BOLD}${MAGENTA}========================================================================${RESET}`);
    console.log(`${BOLD}${MAGENTA}  ${this.name.toUpperCase()}  ${RESET}`);
    console.log(`${BOLD}${MAGENTA}========================================================================${RESET}`);
  }

  printSummary() {
    const total = this.passed + this.failed;
    console.log(`\n${BOLD}------------------------------------------------------------------------${RESET}`);
    console.log(`${BOLD}${this.name} SUMMARY: ${this.passed}/${total} PASSED (${this.failed} FAILED)${RESET}`);
    console.log(`${BOLD}------------------------------------------------------------------------${RESET}\n`);
  }
}
