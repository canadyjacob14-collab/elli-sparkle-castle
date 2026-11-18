# Princess Elli's Sparkle Castle — v4.2 (GitHub Pages build)

A pink practice app for Elli (2nd grade, Taylor ES, Gwinnett County). Everything runs in the browser.
Progress is saved only in that browser's localStorage. There are no accounts, no sign-ins, and no tracking.
The Talking Garden mic recordings stay on the device.

## What's in this build
This is the **FULL** build (`__FULL__=true`). It has the whole question bank with no 25 MB trimming:
- 674 questions, 15 reading passages, and 26 Learn It lessons
- 3,486 voice clips covering every spoken line
- The deed.page copy (https://elli-sparkle-castle.deed.page/) uses a trimmed 576-question bank to stay under 25 MB.

Sections:
- **Learn It**: a step-by-step lesson for every skill, narrated, with an unscored "Your turn".
- **Build It Different Ways**: hundreds, tens and ones, snap-cube trades, and "add it back up".
- **Sign Detective**: tap the sign first, then a think pause.
- **Read It Myself**: no read-aloud; tap one word for a hint.
- Math, Reading and Spelling practice.
- **Check-Up**: no hints; shows mastery per skill.
- **Parent Report**: hold 3 seconds to open; Copy/Share.
- Talking Garden and 100 stickers.

The methods follow GA K-12 Math standards, GPB Let's Learn GA! / Math Mights, and EL Education Grade 2:
- base-ten blocks
- expanded form and word form
- `>` `<` `=` with "greater than / less than"
- open number lines and place-value strategies (no standard algorithm)

## Voice clips (audio/ is NOT in the tarball)
The `audio/` folder is generated. `clips.json` lists every clip:
- file name, exact text, voice `en-US-AriaNeural`, rate, and encode settings
- **sentences**: 16 kHz mono MP3, CBR 20 kbps
- **single words / 1–2 word clips**: 16 kHz mono MP3, VBR `-q:a 8`, for clarity
- both kinds get silence trimming with the ffmpeg filter recorded in clips.json

```bash
pip install edge-tts faster-whisper soundfile   # and install ffmpeg
python3 gen_audio.py -j 8      # ~3,486 files, about 28.5 MB total; re-run to fill any gaps
python3 verify.py -n 150       # optional whisper spot check
```
File names are `b` + sha1(key)[:12] + `.mp3`. They are compiled into `index.html`, so never rename them.
The app plays only these whole-sentence clips and never uses the device's speechSynthesis.

## Deploy
1. Commit everything, including `audio/` once it has been generated. That is about 28.5 MB, and the largest file is under 100 KB.
2. Settings → Pages → Source: **GitHub Actions**.
3. `.github/workflows/pages.yml` deploys the repo root with `actions/deploy-pages`. If `audio/` is missing or incomplete, the workflow runs `gen_audio.py` itself first.

## Service worker
`sw.js` (cache `elli-v4-2`) caches only the app shell at install. Each voice clip is cached the first time it plays, not precached.
Pages use network-first navigation. When `version.json` changes, the page reloads once to update.
For a new release, bump `VERSION` in the app, the `VER` in index.html, the `V` cache name in sw.js, and `version.json` together.

## Size
- Site without audio: about 0.7 MB
- Audio: about 28.5 MB
- GitHub Pages allows about 1 GB, and no file here is anywhere near 100 MB.
