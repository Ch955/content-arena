// Micro-doc "Ronald Ross, Begumpet, 1897" (PIXEL + PAPER skins): render ep.html frame-by-frame (30 fps) with Chromium + ffmpeg.
//   node render.js 2 8 15            -> stills/still-<t>.png (also writes beats.json for mix.py)
//   node render.js --beats           -> beats.json only
//   node render.js --chunk K N       -> part<K>.mp4 = frames of chunk K of N (video only; neon is ~2.7 s/frame, so run N in parallel)
//   node render.js --join N          -> concat part0..N-1 + mix.wav -> reel-rasam-ross-anim.mp4
//   node render.js                   -> whole reel in one process
const { chromium } = require('playwright');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const tl = JSON.parse(fs.readFileSync(path.join(__dirname, 'timeline.json')));
const args = process.argv.slice(2);
const OUT = path.join(__dirname, 'reel-rasam-ross-anim.mp4');
const total = Math.round(tl.dur * 30);
if (args[0] === '--join') {
  const n = +args[1], list = path.join(__dirname, 'parts.txt');
  fs.writeFileSync(list, [...Array(n)].map((_, k) => `file '${path.join(__dirname, `part${k}.mp4`)}'`).join('\n'));
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', path.join(__dirname, 'mix.wav'),
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
  console.log(r.status === 0 ? 'wrote ' + OUT : 'join failed'); process.exit(r.status);
}
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.goto('file://' + path.join(__dirname, 'ep.html'));
  await p.evaluate(tl => { TL = tl; }, tl);
  await p.evaluate(() => document.fonts.ready);
  fs.writeFileSync(path.join(__dirname, 'beats.json'), JSON.stringify(await p.evaluate(() => beats()), null, 1));
  if (args[0] === '--beats') return b.close();
  if (args.length && args[0] !== '--chunk') {
    fs.mkdirSync(path.join(__dirname, 'stills'), { recursive: true });
    for (const t of args.map(Number)) { const t0 = Date.now(); await p.evaluate(t => render(t), t);
      await p.screenshot({ path: path.join(__dirname, 'stills', `still-${t}.png`) }); console.log('still', t, Date.now() - t0, 'ms'); }
    return b.close();
  }
  let f0 = 0, f1 = total, out = OUT, audio = true;
  if (args[0] === '--chunk') { const k = +args[1], n = +args[2]; f0 = Math.floor(total * k / n); f1 = Math.floor(total * (k + 1) / n); out = path.join(__dirname, `part${k}.mp4`); audio = false; }
  const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-i', '-'];
  if (audio) ffArgs.push('-i', path.join(__dirname, 'mix.wav'));
  ffArgs.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium');
  if (audio) ffArgs.push('-c:a', 'aac', '-b:a', '160k', '-shortest');
  ffArgs.push('-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'ignore', 'inherit'] });
  const tStart = Date.now();
  for (let i = f0; i < f1; i++) {
    await p.evaluate(t => render(t), i / 30);
    const buf = await p.screenshot({ type: 'jpeg', quality: 90 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((i - f0) % 30 === 0) console.log(`frame ${i} (${i - f0 + 1}/${f1 - f0}) ${((Date.now() - tStart) / (i - f0 + 1) / 1000).toFixed(2)} s/frame`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log('wrote', out, f0, f1);
})();
