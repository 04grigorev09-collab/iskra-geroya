// Офлайн-кэш «Искры Героя»
// index.html (и навигация) — network-first: обновления с хостинга доходят сразу, офлайн берётся из кэша.
// Остальное (иконки, манифест) — cache-first.
const CACHE='iskra-v13';
const ASSETS=['./','./index.html','./manifest.webmanifest','./logo-1200x500.png','./bg-start-1170x2532.jpg','./icon-180.png','./icon-192.png','./icon-512.png','./icon-1024.png','./favicon.ico','./favicon-32.png','./favicon-48.png','./og-image-1200x630.jpg','./icons/upgrade.png','./icons/upgrade-256.png','./icons/dash.png','./icons/dash-256.png','./icons/home.png','./icons/home-256.png','./icons/back.png','./icons/back-256.png','./icons/auto.png','./icons/auto-256.png','./icons/coin.png','./icons/coin-256.png','./icons/spark.png','./icons/spark-256.png','./icons/pause.png','./icons/pause-256.png','./icons/weapon-sword.png','./icons/weapon-sword-256.png','./icons/weapon-blaster.png','./icons/weapon-blaster-256.png','./icons/weapon-blades.png','./icons/weapon-blades-256.png','./icons/weapon-lightning.png','./icons/weapon-lightning-256.png'];
// каждый файл кэшируется отдельно: один 404 (например, нет favicon на хостинге) не ломает установку и офлайн
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))).then(()=>self.skipWaiting()))});
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
