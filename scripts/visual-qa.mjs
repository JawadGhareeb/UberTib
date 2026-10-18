import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.VISUAL_QA_BASE_URL ?? 'http://127.0.0.1:8081';
const outDir = process.env.VISUAL_QA_OUT_DIR ?? 'artifacts/visual-qa';

const routes = [
  '/',
  '/auth/phone',
  '/auth/code',
  '/auth/profile-setup',
  '/home',
  '/assessment/start',
  '/assessment/complaint',
  '/assessment/location',
  '/assessment/media',
  '/assessment/result',
  '/discover',
  '/discover/providers/results',
  '/discover/providers/compare?providerIds=provider-layan,provider-omar,provider-rima&serviceCode=root-canal',
  '/discover/provider/provider-layan',
  '/booking',
  '/booking/booking-001',
  '/care',
  '/care/case-001/plan',
  '/care/case-001/follow-ups',
  '/care/case-001/financial/timeline',
  '/care/case-001/claims',
  '/profile',
  '/profile/family',
  '/profile/grants/grant-003',
  '/profile/active-patient',
  '/profile/settings',
  '/profile/security',
  '/profile/privacy',
  '/profile/privacy/consents/image-analysis',
  '/profile/data',
  '/profile/account-closure',
];

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];

const themes = ['light', 'dark'];

const ignoredConsoleFragments = [
  'Download the React DevTools',
  'pointerEvents is deprecated',
  'props.pointerEvents is deprecated',
  'shadow',
];

const slug = (route) =>
  route === '/'
    ? 'entry'
    : route
        .replace(/^\//, '')
        .replaceAll('/', '__')
        .replaceAll('[', '')
        .replaceAll(']', '')
        .replace(/[^a-zA-Z0-9_-]/g, '-');

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const theme of themes) {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport,
      colorScheme: theme,
      reducedMotion: 'reduce',
      locale: 'ar',
    });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (message) => {
        if (message.type() !== 'error') return;
        const text = message.text();
        if (ignoredConsoleFragments.some((fragment) => text.includes(fragment))) return;
        consoleErrors.push(text);
      });

      page.on('pageerror', (error) => {
        const text = error?.message ?? String(error);
        if (ignoredConsoleFragments.some((fragment) => text.includes(fragment))) return;
        pageErrors.push(text);
      });

      const startedAt = Date.now();
      let responseStatus = null;
      let navigationError = null;

      try {
        const response = await page.goto(`${baseUrl}${route}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000,
        });
        responseStatus = response?.status() ?? null;
        await page
          .waitForFunction(() => document.readyState === 'complete', null, {
            timeout: 10_000,
          })
          .catch(() => undefined);
        await page.evaluate(() => document.fonts?.ready).catch(() => undefined);
        await page.waitForTimeout(900);
      } catch (error) {
        navigationError = error?.message ?? String(error);
      }

      const metrics = await page
        .evaluate(() => {
          const root = document.documentElement;
          const body = document.body;
          const text = body?.innerText?.trim() ?? '';
          const scrollWidth = Math.max(
            root?.scrollWidth ?? 0,
            body?.scrollWidth ?? 0,
            root?.clientWidth ?? 0,
          );
          const viewportWidth = window.innerWidth;

          const visibleInteractive = [
            ...document.querySelectorAll(
              'button, a, [role="button"], [role="tab"], [role="checkbox"], [role="radio"]',
            ),
          ].filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            return (
              rect.width > 0 &&
              rect.height > 0 &&
              style.visibility !== 'hidden' &&
              style.display !== 'none'
            );
          });

          const smallTargets = visibleInteractive
            .map((element) => {
              const rect = element.getBoundingClientRect();
              return {
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                label:
                  element.getAttribute('aria-label') ||
                  element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ||
                  element.tagName,
              };
            })
            .filter((item) => item.width < 40 || item.height < 40)
            .slice(0, 20);

          return {
            path: window.location.pathname,
            title: document.title,
            textLength: text.length,
            scrollWidth,
            viewportWidth,
            horizontalOverflow: scrollWidth > viewportWidth + 1,
            smallTargets,
          };
        })
        .catch(() => ({
          path: null,
          title: null,
          textLength: 0,
          scrollWidth: 0,
          viewportWidth: viewport.width,
          horizontalOverflow: true,
          smallTargets: [],
        }));

      const filename = `${slug(route)}__${theme}__${viewport.width}.png`;
      await page
        .screenshot({
          path: path.join(outDir, filename),
          fullPage: true,
          animations: 'disabled',
        })
        .catch(() => undefined);

      results.push({
        route,
        theme,
        viewport,
        screenshot: filename,
        responseStatus,
        navigationError,
        consoleErrors,
        pageErrors,
        durationMs: Date.now() - startedAt,
        ...metrics,
      });

      await page.close();
    }

    await context.close();
  }
}

await browser.close();

const fatal = results.filter(
  (result) =>
    result.navigationError ||
    (result.responseStatus !== null && result.responseStatus >= 400) ||
    result.textLength === 0 ||
    result.horizontalOverflow ||
    result.pageErrors.length > 0 ||
    result.consoleErrors.length > 0,
);

const warnings = results.filter((result) => result.smallTargets.length > 0);

const summary = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  routes: routes.length,
  widths: viewports.map((item) => item.width),
  themes,
  screenshots: results.length,
  fatalCount: fatal.length,
  warningCount: warnings.length,
  results,
};

await fs.writeFile(path.join(outDir, 'report.json'), JSON.stringify(summary, null, 2));

const md = [
  '# V5 Visual QA',
  '',
  `- Routes: ${routes.length}`,
  `- Widths: ${viewports.map((item) => item.width).join(', ')}`,
  `- Themes: ${themes.join(', ')}`,
  `- Screenshots: ${results.length}`,
  `- Fatal checks: ${fatal.length}`,
  `- Touch-target warning cases: ${warnings.length}`,
  '',
  '## Fatal findings',
  '',
  ...(fatal.length
    ? fatal.map(
        (item) =>
          `- ${item.route} · ${item.theme} · ${item.viewport.width}px — overflow=${item.horizontalOverflow}; status=${item.responseStatus}; nav=${item.navigationError ?? 'ok'}; pageErrors=${item.pageErrors.length}; consoleErrors=${item.consoleErrors.length}`,
      )
    : ['- None']),
  '',
  '## Touch-target warnings',
  '',
  ...(warnings.length
    ? warnings.map(
        (item) =>
          `- ${item.route} · ${item.theme} · ${item.viewport.width}px — ${item.smallTargets.length} visible target(s) below 40px on at least one axis`,
      )
    : ['- None']),
  '',
].join('\n');

await fs.writeFile(path.join(outDir, 'report.md'), md);

console.log(md);

if (fatal.length > 0) {
  process.exitCode = 1;
}
