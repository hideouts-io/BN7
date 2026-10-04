import { access, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, type Browser, type Page } from 'playwright';

/** Print the generated page using an explicitly selected, installed Chromium browser. */
async function main(): Promise<void> {
  const executablePath: string | undefined = process.argv[2];
  if (!executablePath) throw new Error('Pass the absolute path to an installed Chromium browser: npm run pdf -- /absolute/browser/path');
  if (!executablePath.startsWith('/')) throw new Error('The browser executable path must be absolute.');
  await access(executablePath);
  const inputUrl: URL = new URL('../output/web/index.html', import.meta.url);
  await access(inputUrl);
  const outputDirectory: URL = new URL('../output/pdf/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  const outputPath: string = fileURLToPath(new URL('Bridge-Node-7-Public-Playbook-Short.pdf', outputDirectory));
  const browser: Browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page: Page = await browser.newPage();
    await page.goto(inputUrl.href, { waitUntil: 'load' });
    await page.pdf({
      path: outputPath, format: 'Letter', printBackground: true, preferCSSPageSize: true,
      tagged: true, outline: true, displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font-family:Arial;font-size:8px;color:#475569;padding:0 40px;display:flex;justify-content:space-between"><span>Bridge Node 7 · Review draft</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
      margin: { top: '0.55in', bottom: '0.65in', left: '0.6in', right: '0.6in' },
    });
  } finally {
    await browser.close();
  }
  process.stdout.write(JSON.stringify({ output: outputPath, browser: executablePath }) + '\n');
}

await main();
