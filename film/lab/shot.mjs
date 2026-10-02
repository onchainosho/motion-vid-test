// usage: node lab/shot.mjs page.html out.png width height
import { chromium } from 'playwright';
const [,, page, out, w='1086', h='1448'] = process.argv;
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--allow-file-access-from-files','--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto('file://' + process.cwd() + '/' + page); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
await p.screenshot({ path: out }); await b.close();
