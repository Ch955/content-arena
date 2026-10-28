// Render reel.html frame-by-frame with Chromium, pipe frames into ffmpeg, and mux mix.wav.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const tl = JSON.parse(fs.readFileSync(path.join(__dirname, 'timeline.json')));
const out = path.join(__dirname, 'reel-rasam-intro.mp4');
const stills = process.argv.slice(2).map(Number);  // optional: render stills at these times only

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'reel.html'));
  await page.evaluate(tl => { window.SCENES = tl.scenes; window.DUR = tl.dur; }, tl);
  await page.evaluate(() => document.fonts.ready);

  if (stills.length) {
    for (const t of stills) {
      await page.evaluate(t => window.render(t), t);
      await page.screenshot({ path: path.join(__dirname, `still-${t}.png`) });
    }
    return browser.close();
  }

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-i', path.join(__dirname, 'mix.wav'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'ignore', 'inherit'] });

  const total = Math.round(tl.dur * FPS);
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('wrote', out, total, 'frames');
})();
