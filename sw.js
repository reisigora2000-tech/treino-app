const VERSION = 'treino-v1';
const SHELL = ['./', 'index.html', 'style.css', 'plan.js', 'app.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
const IMG_HOST = 'raw.githubusercontent.com';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  // imagens dos exercícios: guarda na primeira vez que forem vistas e passa a funcionar offline
  if (url.hostname === IMG_HOST) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const res = await fetch(req); c.put(req, res.clone()); return res; } catch (err) { return Response.error(); }
    }));
    return;
  }
  // arquivos do app: tenta a rede e cai no cache se estiver offline
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  }
});
