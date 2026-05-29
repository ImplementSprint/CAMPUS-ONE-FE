import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const DEFAULT_CREDENTIALS_FILE = 'C:/Users/anton/.codex/secrets/campus-one/beta-demo-20260525.md';

const config = {
  lmsBaseUrl: process.env.CAMPUS_ONE_LMS_BASE_URL ?? 'https://itsandbox.site',
  schoolBaseUrl: process.env.CAMPUS_ONE_SCHOOL_BASE_URL ?? 'https://demo.itsandbox.site',
  credentialsFile: process.env.CAMPUS_ONE_BETA_CREDENTIALS_FILE ?? DEFAULT_CREDENTIALS_FILE,
  outputDir: process.env.CAMPUS_ONE_SMOKE_OUTPUT_DIR ?? path.join(os.tmpdir(), 'campus-one-role-smoke'),
};

function parseCredentialTable(text) {
  const credentials = new Map();
  for (const line of text.split(/\r?\n/)) {
    const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
    if (cells.length >= 3 && cells[0] !== 'Role' && cells[1]?.includes('@')) {
      credentials.set(cells[0], { email: cells[1], password: cells[2] });
    }
  }
  return credentials;
}

async function loadCredentials(role) {
  const table = parseCredentialTable(await readFile(config.credentialsFile, 'utf8'));
  const credentials = table.get(role);
  if (!credentials) throw new Error(`Missing beta credentials for ${role}.`);
  return credentials;
}

function collectConsole(page) {
  const events = [];
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      events.push({ type: message.type(), text: message.text().slice(0, 240) });
    }
  });
  page.on('pageerror', (error) => {
    events.push({ type: 'pageerror', text: String(error?.message ?? error).slice(0, 240) });
  });
  return events;
}

async function runPlatformReviewFlow(browser) {
  const credentials = await loadCredentials('super_admin');
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();
  const consoleEvents = collectConsole(page);

  try {
    const response = await page.goto(`${config.lmsBaseUrl}/login?next=/platform/schools`, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    });
    await page.getByText('Login', { exact: true }).waitFor({ state: 'visible', timeout: 15_000 });
    await page.waitForTimeout(1_000);
    await page.locator('input[type="email"]').fill(credentials.email);
    await page.locator('input[type="password"]').fill(credentials.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/platform/schools', { timeout: 30_000 });
    await page.getByText('School review queue', { exact: false }).waitFor({ state: 'visible', timeout: 20_000 });
    await page.getByText('Platform Review', { exact: false }).waitFor({ state: 'visible', timeout: 20_000 });

    const screenshot = path.join(config.outputDir, 'platform-review-dashboard.png');
    await page.screenshot({ path: screenshot, fullPage: false });
    return {
      name: 'platform-super-admin-review-dashboard',
      status: 'passed',
      initialStatus: response?.status() ?? null,
      finalUrl: page.url(),
      evidence: ['School review queue', 'Platform Review'],
      screenshot,
      consoleEvents,
    };
  } finally {
    await context.close();
  }
}

async function runStudentPortalFlow(browser) {
  const credentials = await loadCredentials('student');
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();
  const consoleEvents = collectConsole(page);

  try {
    const response = await page.goto(`${config.schoolBaseUrl}/login`, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    });
    await page.getByText('Login', { exact: true }).waitFor({ state: 'visible', timeout: 15_000 });
    await page.waitForTimeout(1_000);
    await page.locator('input[type="email"]').fill(credentials.email);
    await page.locator('input[type="password"]').fill(credentials.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard', { timeout: 30_000 });
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor({ state: 'visible', timeout: 20_000 });

    const screenshot = path.join(config.outputDir, 'demo-student-dashboard.png');
    await page.screenshot({ path: screenshot, fullPage: false });
    return {
      name: 'demo-student-dashboard',
      status: 'passed',
      initialStatus: response?.status() ?? null,
      finalUrl: page.url(),
      evidence: ['Dashboard'],
      screenshot,
      consoleEvents,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(config.outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const startedAt = new Date().toISOString();

  try {
    const results = [await runPlatformReviewFlow(browser), await runStudentPortalFlow(browser)];
    const failed = results.filter((result) => result.status !== 'passed');
    const pageErrors = results.flatMap((result) =>
      result.consoleEvents.filter((event) => event.type === 'pageerror').map((event) => ({
        flow: result.name,
        ...event,
      })),
    );

    const summary = {
      startedAt,
      browser: 'Playwright chromium',
      browserPluginFallback: 'Codex in-app browser was unavailable: iab',
      lmsBaseUrl: config.lmsBaseUrl,
      schoolBaseUrl: config.schoolBaseUrl,
      outputDir: config.outputDir,
      results,
      pageErrors,
    };

    console.log(JSON.stringify(summary, null, 2));
    if (failed.length > 0 || pageErrors.length > 0) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ status: 'failed', message: error.message }, null, 2));
  process.exit(1);
});
