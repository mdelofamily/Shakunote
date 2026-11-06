// ახალი ვერსიის გამოსაშვებად შეცვალე CACHE (და APP_VERSION js/app.js-ში): shakunote-0.5 -> shakunote-0.6
const CACHE = 'shakunote-0.5';
const FILES = ['./', './index.html', './style.css', './js/data.js', './js/storage.js', './js/history.js', './js/render.js', './js/keyboard.js', './js/app.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return; e.respondWith(fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request))); });
