const VERSION = 'treino-v4';
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
  // imagens dos exercícios: cache na primeira vez; depois abrem na hora e offline
  if (url.hostname === IMG_HOST) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; } catch (err) { return Response.error(); }
    }));
    return;
  }
  // arquivos do app: sempre do cache da versão atual (abre na hora, mesmo sem sinal).
  // Todos os arquivos são baixados juntos na instalação, então nunca há mistura de versões.
  // Para publicar uma atualização, basta trocar VERSION acima.
  if (url.origin === location.origin) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      try { const res = await fetch(req); if (res.ok) c.put(req, res.clone()); return res; }
      catch (err) { return (await c.match('index.html')) || Response.error(); }
    }));
  }
});
