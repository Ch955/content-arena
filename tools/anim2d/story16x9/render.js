// story16x9 renderer: a scene page (any .html that loads kit.js and defines scene(t)) -> 1920x1080 30 fps mp4, frame by frame
// with Playwright Chromium + ffmpeg. Every frame is a pure function of t, so ranges can render in parallel and be joined.
//   node render.js <scene.html> --tl timeline.json --dur 95.4 --out part.mp4            whole scene (video only)
//   node render.js <scene.html> --tl timeline.json --audio mix.wav --out scene.mp4      ... with audio (dur = TL.dur if not given)
//   node render.js <scene.html> --tl timeline.json --from 30 --to 60 --out p2.mp4       a time range (seconds; frames [from*fps, to*fps))
//   node render.js <scene.html> --tl timeline.json --jobs 4 --out scene.mp4 [--audio mix.wav]   split into 4 parallel workers + join
//   node render.js <scene.html> --stills 1,5.5,12 [--dir stills] [--tl ...]               PNG stills (prints ms per still)
//   node render.js --join out.mp4 p0.mp4 p1.mp4 ... [--audio mix.wav]                   concat parts (+ audio)
//   options: --fps 30  --query "view=3&skin=paper"  --crf 20  --offset 12.5 (KIT.tlOffset: scene t 0 = TL time 12.5)
const { chromium } = require('playwright');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const argv = process.argv.slice(2), opt = {}, pos = [];
for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (a.startsWith('--')) { const k = a.slice(2), v = argv[i + 1]; if (v === undefined || v.startsWith('--')) opt[k] = true; else { opt[k] = v; i++; } } else pos.push(a); }
const FPS = +(opt.fps || 30);
function join(out, parts, audio) {
  const list = out + '.parts.txt'; fs.writeFileSync(list, parts.map(p => `file '${path.resolve(p)}'`).join('\n'));
  const a = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list];
  if (audio) a.push('-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest');
  a.push('-c:v', 'copy', '-movflags', '+faststart', out);
  const r = spawnSync('ffmpeg', a, { stdio: 'inherit' }); fs.unlinkSync(list);
  if (r.status !== 0) { console.error('join failed'); process.exit(1); } console.log('wrote', out);
}
if (opt.join) { join(opt.join, pos, opt.audio); process.exit(0); }
const page = path.resolve(pos[0] || path.join(__dirname, 'demo.html'));
const tl = opt.tl ? JSON.parse(fs.readFileSync(opt.tl)) : null;
const dur = +(opt.dur || (tl && tl.dur) || 10);
const total = Math.round(dur * FPS);
const OUT = path.resolve(opt.out || page.replace(/\.html$/, '.mp4'));

if (opt.jobs && +opt.jobs > 1 && !opt.from) {   // parallel: spawn N workers on frame ranges, then join
  const n = +opt.jobs, parts = [], procs = [];
  for (let k = 0; k < n; k++) {
    const f0 = Math.floor(total * k / n), f1 = Math.floor(total * (k + 1) / n), part = OUT.replace(/\.mp4$/, `.part${k}.mp4`); parts.push(part);
    const a = [__filename, page, '--from', String(f0 / FPS), '--to', String(f1 / FPS), '--out', part, '--fps', String(FPS)];
    a.push('--dur', String(dur));
    for (const k2 of ['tl', 'query', 'crf', 'offset']) if (opt[k2]) a.push('--' + k2, opt[k2]);
    procs.push(new Promise(res => { const c = spawn('node', a, { stdio: ['ignore', 'pipe', 'inherit'] });
      c.stdout.on('data', d => process.stdout.write(`[${k}] ${d}`)); c.on('close', code => res(code)); }));
  }
  Promise.all(procs).then(codes => { if (codes.some(c => c !== 0)) { console.error('a worker failed', codes); process.exit(1); }
    join(OUT, parts, opt.audio); if (!opt.keep) parts.forEach(p => fs.existsSync(p) && fs.unlinkSync(p)); });
} else (async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  p.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
  await p.goto('file://' + page + (opt.query ? '?' + opt.query : ''));
  if (tl) await p.evaluate(tl => { window.TL = tl; }, tl);
  if (opt.offset) await p.evaluate(o => { KIT.tlOffset = o; }, +opt.offset);
  await p.evaluate(() => document.fonts.ready);
  if (opt.stills) {
    const dir = path.resolve(opt.dir || path.join(path.dirname(page), 'stills')); fs.mkdirSync(dir, { recursive: true });
    for (const t of String(opt.stills).split(',').map(Number)) { const t0 = Date.now(); await p.evaluate(t => render(t), t);
      const f = path.join(dir, `${opt.name || 'still'}-${t}.png`); await p.screenshot({ path: f }); console.log('still', f, Date.now() - t0, 'ms'); }
    return b.close();
  }
  const f0 = opt.from ? Math.round(+opt.from * FPS) : 0, f1 = opt.to ? Math.min(total, Math.round(+opt.to * FPS)) : total;
  const ff = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-'];
  if (opt.audio && !opt.from) ff.push('-i', path.resolve(opt.audio));
  ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', String(opt.crf || 20), '-preset', 'medium', '-r', String(FPS));
  if (opt.audio && !opt.from) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  ff.push('-movflags', '+faststart', OUT);
  const enc = spawn('ffmpeg', ff, { stdio: ['pipe', 'ignore', 'inherit'] });
  const tS = Date.now();
  for (let i = f0; i < f1; i++) {
    await p.evaluate(t => render(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    if ((i - f0) % 150 === 0 || i === f1 - 1) console.log(`frame ${i} (${i - f0 + 1}/${f1 - f0}) ${((Date.now() - tS) / (i - f0 + 1) / 1000).toFixed(3)} s/frame`);
  }
  enc.stdin.end(); await new Promise(r => enc.on('close', r)); await b.close();
  console.log('wrote', OUT, 'frames', f0, f1, ((Date.now() - tS) / Math.max(1, f1 - f0) / 1000).toFixed(3), 's/frame');
})();
