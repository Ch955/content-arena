// Contact sheet: renders every demo.html?view=N panel and tiles them (3 per row, 960x540 each) into sheet.png.
//   node sheet.js            -> stills/view-NN.png + sheet.png       node sheet.js 4 9   -> only those panels (stills)
const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.join(__dirname, 'stills'); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.goto('file://' + path.join(__dirname, 'demo.html') + '?view=0'); await p.evaluate(() => document.fonts.ready);
  const n = await p.evaluate(() => VIEWS), only = process.argv.slice(2).map(Number);
  for (let v = 0; v < n; v++) { if (only.length && !only.includes(v)) continue;
    await p.goto('file://' + path.join(__dirname, 'demo.html') + '?view=' + v); await p.evaluate(() => document.fonts.ready);
    const t0 = Date.now(); await p.evaluate(() => render(1.3)); const ms = Date.now() - t0;
    await p.screenshot({ path: path.join(dir, `view-${String(v).padStart(2, '0')}.png`) }); console.log('view', v, ms, 'ms'); }
  await b.close();
  if (only.length) return;
  const rows = Math.ceil(n / 3);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(dir, 'view-%02d.png'),
    '-vf', `scale=960:540,tile=3x${rows}:padding=10:margin=10:color=0x241810`, '-frames:v', '1', path.join(__dirname, 'sheet.png')], { stdio: 'inherit' });
  console.log(r.status === 0 ? 'wrote ' + path.join(__dirname, 'sheet.png') : 'tile failed');
})();
