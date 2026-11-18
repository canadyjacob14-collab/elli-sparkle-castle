#!/usr/bin/env python3
"""Regenerate every voice clip for Princess Elli's Sparkle Castle into audio/.

Uses edge-tts (voice en-US-AriaNeural, one whole sentence per clip) + ffmpeg,
with the exact names and encode settings listed in clips.json.
  pip install edge-tts      (and have ffmpeg on PATH)
  python3 gen_audio.py              # make missing clips (safe to re-run)
  python3 gen_audio.py --force      # remake everything
  python3 gen_audio.py -j 12        # concurrency (default 8)
"""
import argparse, asyncio, json, os, subprocess, sys, tempfile, random
from concurrent.futures import ThreadPoolExecutor

ap = argparse.ArgumentParser(); ap.add_argument("-j", type=int, default=8); ap.add_argument("--force", action="store_true"); ap.add_argument("--retries", type=int, default=6)
a = ap.parse_args()
ROOT = os.path.dirname(os.path.abspath(__file__)); D = json.load(open(os.path.join(ROOT, "clips.json"), encoding="utf-8"))
os.makedirs(os.path.join(ROOT, "audio"), exist_ok=True)
import edge_tts
TMP = tempfile.mkdtemp(prefix="elli-tts-"); pool = ThreadPoolExecutor(max(2, a.j)); fails = []; done = 0

def encode(raw, c):
    e = c["encode"]; q = ["-q:a", "8"] if c["kind"] == "word" else ["-b:a", "20k"]
    out = os.path.join(ROOT, c["file"])
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", e["filter"], "-ac", "1", "-ar", str(e["sample_rate"])] + q + [out + ".part.mp3"], check=True)
    os.replace(out + ".part.mp3", out); os.remove(raw)

async def one(c, sem):
    global done
    out = os.path.join(ROOT, c["file"])
    if not a.force and os.path.exists(out) and os.path.getsize(out) > 300: done += 1; return
    raw = os.path.join(TMP, os.path.basename(c["file"]))
    async with sem:
        for i in range(a.retries):
            try:
                await edge_tts.Communicate(c["text"], c["voice"], rate=c["rate"]).save(raw)
                if os.path.getsize(raw) < 500: raise RuntimeError("tiny file")
                await asyncio.get_running_loop().run_in_executor(pool, encode, raw, c); done += 1; return
            except Exception as ex:
                await asyncio.sleep(1.5 * (i + 1) + random.random())
        fails.append(c["key"])

async def main():
    sem = asyncio.Semaphore(a.j); C = D["clips"]
    for i in range(0, len(C), 200):
        await asyncio.gather(*[one(c, sem) for c in C[i:i + 200]]); print(f"{min(i + 200, len(C))}/{len(C)} ok={done} fail={len(fails)}", flush=True)
asyncio.run(main())
tot = sum(os.path.getsize(os.path.join(ROOT, c["file"])) for c in D["clips"] if os.path.exists(os.path.join(ROOT, c["file"])))
print(f"done: {done}/{len(D['clips'])} clips, {tot/1e6:.1f} MB in audio/, failures: {len(fails)}")
if fails: print("FAILED:", fails[:20]); sys.exit(1)
