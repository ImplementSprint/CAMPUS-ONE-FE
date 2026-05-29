import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const config = {
  lmsBaseUrl: process.env.CAMPUS_ONE_LMS_BASE_URL ?? 'https://itsandbox.site',
  outputDir: process.env.CAMPUS_ONE_SMOKE_OUTPUT_DIR ?? path.join(os.tmpdir(), 'campus-one-registration-smoke'),
};

export function buildRegistrationPayload({ suffix = timestampSuffix() } = {}) {
  return {
    name: `Campus One Smoke School ${suffix}`,
    representative: 'Campus One QA',
    email: `owner.${suffix}@campus-one-smoke.test`,
    contactNumber: '+63 917 000 0000',
    schoolType: 'College',
    targetSubdomain: `smoke-${suffix}`,
  };
}

export function summarizeSubmittedRegistration({ payload, finalUrl, screenshot, consoleEvents }) {
  return {
    name: 'platform-school-registration',
    status: 'passed',
    finalUrl,
    requestedSubdomain: payload.targetSubdomain,
    evidence: [
      'School registration is under review',
      `Requested subdomain: ${payload.targetSubdomain}`,
    ],
    screenshot,
    consoleEvents,
  };
}

function timestampSuffix() {
  return new Date()
    .toISOString()
    .replace(/\D/g, '')
    .slice(0, 14);
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

async function runRegistrationFlow(browser) {
  const payload = buildRegistrationPayload();
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();
  const consoleEvents = collectConsole(page);

  try {
    const response = await page.goto(`${config.lmsBaseUrl}/schools/register`, {
      waitUntil: 'networkidle',
      timeout: 30_000,
    });

    await page.getByRole('heading', { name: 'Register a school portal' }).waitFor({
      state: 'visible',
      timeout: 20_000,
    });
    await page.getByLabel('School name').fill(payload.name);
    await page.getByLabel('School type').selectOption(payload.schoolType);
    await page.getByLabel('Representative').fill(payload.representative);
    await page.getByLabel('Email').fill(payload.email);
    await page.getByLabel('Contact number').fill(payload.contactNumber);
    await page.getByLabel('Preferred subdomain').fill(payload.targetSubdomain);
    await page.getByRole('button', { name: 'Submit for review' }).click();

    await page.waitForURL(`**/schools/register/submitted?school=${payload.targetSubdomain}`, {
      timeout: 30_000,
    });
    await page.getByRole('heading', { name: 'School registration is under review' }).waitFor({
      state: 'visible',
      timeout: 20_000,
    });
    await page.getByText(`Requested subdomain: ${payload.targetSubdomain}`, { exact: false }).waitFor({
      state: 'visible',
      timeout: 20_000,
    });

    const screenshot = path.join(config.outputDir, 'school-registration-submitted.png');
    await page.screenshot({ path: screenshot, fullPage: false });
    return {
      ...summarizeSubmittedRegistration({
        payload,
        finalUrl: page.url(),
        screenshot,
        consoleEvents,
      }),
      initialStatus: response?.status() ?? null,
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
    const result = await runRegistrationFlow(browser);
    const pageErrors = result.consoleEvents
      .filter((event) => event.type === 'pageerror')
      .map((event) => ({ flow: result.name, ...event }));
    const summary = {
      startedAt,
      browser: 'Playwright chromium',
      browserPluginFallback: 'Codex in-app browser was unavailable: iab',
      lmsBaseUrl: config.lmsBaseUrl,
      outputDir: config.outputDir,
      results: [result],
      pageErrors,
    };

    console.log(JSON.stringify(summary, null, 2));
    if (pageErrors.length > 0) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const modulePath = fileURLToPath(import.meta.url);

if (invokedPath === modulePath) {
  main().catch((error) => {
    console.error(JSON.stringify({ status: 'failed', message: error.message }, null, 2));
    process.exit(1);
  });
}
