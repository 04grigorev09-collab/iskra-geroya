// Офлайн-кэш «Искры Героя» v2
// index.html (и навигация) — network-first: обновления с хостинга доходят сразу, офлайн берётся из кэша.
// Остальное (иконки, манифест) — cache-first.
const CACHE='iskra-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./favicon.ico'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function isPage(req){const u=new URL(req.url);return req.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html')}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const sameOrigin=new URL(req.url).origin===location.origin;if(!sameOrigin)return;
  if(isPage(req)){
    e.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp))}return res})
      .catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return res})));
});
