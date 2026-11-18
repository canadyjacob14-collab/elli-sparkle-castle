const V='elli-v4-2';
const CORE=['./','index.html','manifest.json','icon.png','fredoka.woff2'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})));
 // GitHub build: no audio precache; each clip is cached the first time it plays
 })())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;if(/(version\.json|sw\.js)$/.test(u.pathname))return;
 if(e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/')){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));return}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&res.status===200){const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp))}return res})))});
