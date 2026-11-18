#!/bin/bash
# Build Elli v4 into /workspace/elli-app (whole-sentence Aria clips at 16 kHz / 20 kbps mono)
set -e; cd /workspace/elli-src/gh; VER=v4.2; CV=elli-v4-2
D=/workspace/elli-gh-site
python3 - <<'PY'
import json,os
import hashlib
K=json.load(open('keys.json')); fn=lambda k:'b'+hashlib.sha1(k.encode()).hexdigest()[:12]+'.mp3'
m={k:'audio/'+fn(k) for k in K if os.path.exists('audio_raw/'+fn(k)) and os.path.getsize('audio_raw/'+fn(k))>500}
json.dump(m,open('clips.json','w'),ensure_ascii=False)
print("clips",len(m))
PY
../node_modules/.bin/esbuild app.tsx --bundle --minify --jsx=automatic --define:process.env.NODE_ENV='"production"' --define:__FULL__=true --outfile=app.js --log-level=warning
rm -rf $D/audio && mkdir -p $D/audio
python3 - <<'PY'
import json,os,subprocess
from concurrent.futures import ThreadPoolExecutor
m=json.load(open('clips.json')); files=sorted(set(os.path.basename(v) for v in m.values()))
short=set(os.path.basename(v) for k,v in m.items() if k.startswith("w|") or len(k.lstrip("~≈^").split())<=2)
def enc(f): subprocess.run(["ffmpeg","-y","-loglevel","error","-i",f"audio_raw/{f}","-af","silenceremove=start_periods=1:start_threshold=-62dB:start_silence=0.12,areverse,silenceremove=start_periods=1:start_threshold=-62dB:start_silence=0.3,areverse","-ac","1","-ar","16000"]+(["-q:a","8"] if f in short else ["-b:a","20k"])+[f"/workspace/elli-gh-site/audio/{f}"],check=True)
with ThreadPoolExecutor(16) as ex: list(ex.map(enc,files))
import re
src=open('app.tsx').read()+open('garden.tsx').read()
ui=set(json.loads('"'+x+'"') for x in re.findall(r'S\("((?:[^"\\]|\\.)*)"\)',src))
core=sorted(set(m[k] for k in m if k in ui))
pass
print("encoded",len(files),"precache",len(core))
PY
cp ../fredoka.woff2 ../icon.png $D/; [ -f /workspace/elli-app/manifest.json ] && cp /workspace/elli-app/manifest.json $D/; touch $D/.nojekyll
python3 - <<'PY'
js=open('/workspace/elli-src/gh/app.js').read().replace('</script','<\\/script')
icon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23ff5fa2'/%3E%3Ctext x='50' y='80' font-size='58' text-anchor='middle'%3E%F0%9F%A6%84%3C/text%3E%3Ctext x='50' y='34' font-size='34' text-anchor='middle'%3E%F0%9F%91%91%3C/text%3E%3C/svg%3E"
html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="Cache-Control" content="no-cache">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Princess Elli's Sparkle Castle</title><meta name="theme-color" content="#ff5fa2">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Elli's Castle"><link rel="manifest" href="manifest.json">
<link rel="icon" href="{icon}"><link rel="apple-touch-icon" href="icon.png">
<style>html,body{{margin:0;background:#ffe4f1;min-height:100%;-webkit-tap-highlight-color:transparent}}button{{touch-action:manipulation;font-family:inherit}}button:disabled{{cursor:default}}</style>
</head><body><div id="root"></div><script>{js}</script>
<script>(function(){{var VER='v4.2';
if('serviceWorker' in navigator&&location.protocol==='https:'){{navigator.serviceWorker.register('sw.js',{{updateViaCache:'none'}}).then(function(r){{r.update();}}).catch(function(){{}});
 var had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',function(){{if(had&&!sessionStorage.getItem('elli-rl42')){{sessionStorage.setItem('elli-rl42','1');location.reload();}}}});}}
function chk(){{fetch('version.json?t='+Date.now(),{{cache:'no-store'}}).then(function(r){{return r.json()}}).then(function(j){{if(j&&j.v&&j.v!==VER&&sessionStorage.getItem('elli-rlv')!==j.v){{sessionStorage.setItem('elli-rlv',j.v);if(navigator.serviceWorker){{navigator.serviceWorker.getRegistrations().then(function(rs){{rs.forEach(function(x){{x.update()}})}})}}location.reload();}}}}).catch(function(){{}})}}
chk();document.addEventListener('visibilitychange',function(){{if(!document.hidden)chk()}});}})();</script>
</body></html>'''
open('/workspace/elli-gh-site/index.html','w').write(html)
PY
cat > $D/sw.js <<SW
const V='$CV';
const CORE=['./','index.html','manifest.json','icon.png','fredoka.woff2'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})));
 // GitHub build: no audio precache; each clip is cached the first time it plays
 })())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;if(/(version\.json|sw\.js)$/.test(u.pathname))return;
 if(e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&res.status===200){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp))}return res})))});
SW
echo "{\"v\":\"$VER\"}" > $D/version.json
echo built; du -sb --apparent-size $D; ls $D/audio | wc -l
