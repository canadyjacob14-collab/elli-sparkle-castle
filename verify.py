#!/usr/bin/env python3
"""Spot-check generated clips with faster-whisper (pip install faster-whisper soundfile).
  python3 verify.py            # 150 random clips
  python3 verify.py -n 400 --seed 7
Words and numbers are normalized; homophones (flower/flour) and digit formats (600 vs six hundred) are expected differences."""
import argparse, json, os, random, re, subprocess, tempfile
ap = argparse.ArgumentParser(); ap.add_argument("-n", type=int, default=150); ap.add_argument("--seed", type=int, default=1); a = ap.parse_args()
ROOT = os.path.dirname(os.path.abspath(__file__)); D = json.load(open(os.path.join(ROOT, "clips.json"), encoding="utf-8"))["clips"]
from faster_whisper import WhisperModel
import soundfile as sf
m = WhisperModel("base.en", compute_type="int8"); random.seed(a.seed)
N = {str(i): w for i, w in enumerate("zero one two three four five six seven eight nine ten".split())}
norm = lambda s: [N.get(w, w) for w in re.sub(r"[^a-z0-9' ]", " ", s.lower().replace("-", " ")).split()]
missing = [c["file"] for c in D if not os.path.exists(os.path.join(ROOT, c["file"]))]
print("missing files:", len(missing), missing[:10])
S = random.sample([c for c in D if os.path.exists(os.path.join(ROOT, c["file"]))], min(a.n, len(D) - len(missing)))
wav = os.path.join(tempfile.mkdtemp(), "v.wav"); bad = []
for c in S:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(ROOT, c["file"]), "-af", "adelay=300,apad=pad_dur=0.6", "-ac", "1", "-ar", "16000", wav], check=True)
    x, _ = sf.read(wav, dtype="float32"); h = " ".join(s.text for s in m.transcribe(x, language="en", beam_size=5, condition_on_previous_text=False)[0])
    A, B = norm(c["text"]), norm(h); ov = len(set(A) & set(B)) / max(1, len(set(A)))
    if ov < 0.6: bad.append((c["file"], c["text"], h.strip(), round(ov, 2)))
print(f"checked {len(S)}, suspect {len(bad)} (review by ear; single words and numbers often differ only in format)")
for b in bad: print("  ", b)
