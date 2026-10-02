// Fast preview: seek the root timeline and screenshot.  node lab/stills.mjs <page.html> <outdir> t1 t2 ...  (times in seconds)
import { chromium } from 'playwright';
import fs from 'fs';
const [,, page, out, ...ts] = process.argv;
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto('file://' + process.cwd() + '/' + page);
await p.waitForFunction(() => window.__ready === true, null, { timeout: 30000 }).catch(() => {});
for (const t of ts) {
  await p.evaluate(t => { window.__timelines.root.seek(+t); window.dispatchEvent(new CustomEvent('hf-seek', { detail: { time: +t } })); }, t);
  await p.waitForTimeout(30);
  await p.screenshot({ path: `${out}/${(+t).toFixed(2).padStart(5, '0')}.png` });
}
if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
await b.close();
