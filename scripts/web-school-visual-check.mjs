import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.env.WEB_SCHOOL_BASE_URL || 'http://localhost:3001';
const outputDir = process.env.WEB_SCHOOL_VISUAL_OUTPUT || 'C:/tmp/campus-one-web-school-visual';

const routes = [
  { path: '/', label: 'entry', minTextLength: 200 },
  { path: '/login', label: 'login', minTextLength: 120 },
  { path: '/admissions', label: 'admissions', minTextLength: 250 },
  { path: '/admissions/track', label: 'admissions-track', minTextLength: 120 },
  { path: '/alumni/register', label: 'alumni-register', minTextLength: 180 },
  { path: '/professor', label: 'professor', minTextLength: 40 },
  { path: '/dashboard', label: 'student-dashboard', minTextLength: 40 },
  { path: '/admin/campus-dashboard', label: 'admin-campus-dashboard', minTextLength: 200, mustNotContain: 'Loading dashboard' },
  { path: '/alumni/dashboard', label: 'alumni-dashboard', minTextLength: 40 },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

await fs.mkdir(outputDir, { recursive: true });

const launchOptions = {
  headless: true,
  args: ['--disable-extensions'],
};
const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
try {
  await fs.access(edgePath);
  launchOptions.executablePath = edgePath;
} catch {
  launchOptions.channel = 'msedge';
}

const browser = await chromium.launch(launchOptions);
const failures = [];
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });

  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const url = new URL(route.path, baseUrl).toString();
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const status = response?.status() ?? 0;
    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const controls = [...document.querySelectorAll('button, input, select, textarea, a[href]')]
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const style = window.getComputedStyle(node);
          return {
            tag: node.tagName.toLowerCase(),
            type: node.getAttribute('type') || '',
            role: node.getAttribute('role') || '',
            text: (node.textContent || node.getAttribute('aria-label') || node.getAttribute('placeholder') || '').trim().slice(0, 80),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            display: style.display,
            visibility: style.visibility,
          };
        })
        .filter((item) => item.display !== 'none' && item.visibility !== 'hidden' && item.width > 0 && item.height > 0);

      return {
        title: document.title,
        text: (body?.innerText || '').trim(),
        textLength: (body?.innerText || '').trim().length,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        scrollHeight: root.scrollHeight,
        clientHeight: root.clientHeight,
        tinyControls: controls
          .filter((item) => {
            if (item.tag === 'a' && item.role !== 'button') return false;
            if (item.tag === 'input' && ['checkbox', 'radio', 'hidden'].includes(item.type)) return false;
            return item.height < 28 || item.width < 28;
          })
          .slice(0, 8),
        h1: document.querySelector('h1')?.textContent?.trim() || '',
      };
    });

    const screenshotPath = path.join(outputDir, `${viewport.name}-${route.label}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const routeFailures = [];
    if (status < 200 || status >= 400) {
      routeFailures.push(`HTTP ${status}`);
    }
    if (metrics.textLength < route.minTextLength) {
      routeFailures.push(`text too short (${metrics.textLength})`);
    }
    if (route.mustNotContain && metrics.text.includes(route.mustNotContain)) {
      routeFailures.push(`contains blocked text "${route.mustNotContain}"`);
    }
    if (metrics.scrollWidth > metrics.clientWidth + 2) {
      routeFailures.push(`horizontal overflow ${metrics.scrollWidth}/${metrics.clientWidth}`);
    }
    if (metrics.tinyControls.length > 0) {
      routeFailures.push(`tiny controls ${JSON.stringify(metrics.tinyControls)}`);
    }
    const actionableConsoleErrors = consoleErrors.filter((text) => {
      if (text.includes('favicon')) return false;
      if (text.includes('status of 401')) return false;
      if (text.includes('status of 404') && text.includes('Failed to load resource')) return false;
      if (text.includes('hydration-mismatch') && text.includes('caret-color')) return false;
      return true;
    });
    if (actionableConsoleErrors.length > 0) {
      routeFailures.push(`console errors ${JSON.stringify(actionableConsoleErrors.slice(0, 3))}`);
    }
    if (pageErrors.length > 0) {
      routeFailures.push(`page errors ${JSON.stringify(pageErrors.slice(0, 3))}`);
    }

    const result = {
      viewport: viewport.name,
      route: route.path,
      status,
      h1: metrics.h1,
      textLength: metrics.textLength,
      overflow: metrics.scrollWidth - metrics.clientWidth,
      screenshotPath,
      failures: routeFailures,
    };
    results.push(result);
    if (routeFailures.length > 0) {
      failures.push(result);
      console.error(`FAIL ${viewport.name} ${route.path}: ${routeFailures.join('; ')}`);
    } else {
      console.log(`OK ${viewport.name} ${route.path} -> ${status} ${screenshotPath}`);
    }

    await page.close();
  }

  await context.close();
}

await browser.close();
await fs.writeFile(path.join(outputDir, 'results.json'), JSON.stringify(results, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
