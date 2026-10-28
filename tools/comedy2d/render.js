// Render ep.html frame-by-frame (30 fps) with Chromium + ffmpeg, mux mix.wav. Args: optional still times.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const tl = JSON.parse(fs.readFileSync(path.join(__dirname, 'timeline.json')));
const stills = process.argv.slice(2).map(Number);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'ep.html'));
  await p.evaluate(tl => { TL = tl; }, tl);
  await p.evaluate(() => document.fonts.ready);
  if (stills.length) {
    for (const t of stills) { await p.evaluate(t => render(t), t); await p.screenshot({ path: path.join(__dirname, `still-${t}.png`) }); }
    return b.close();
  }
  const out = path.join(__dirname, 'reel-rasam-comedy-ep1.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-i', '-',
    '-i', path.join(__dirname, 'mix.wav'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'inherit'] });
  const total = Math.round(tl.dur * 30);
  for (let i = 0; i < total; i++) {
    await p.evaluate(t => render(t), i / 30);
    const buf = await p.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log('wrote', out);
})();
