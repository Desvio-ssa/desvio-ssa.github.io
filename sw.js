/* desvio.ssa: cache leve para abrir rápido e funcionar com internet fraca. Troque V a cada publicação. */
var V = 'desvio-v3';
var CORE = ['./', 'index.html', 'abertura.js', 'three.min.js', 'logo.png', 'icone.png', 'icon-192.png', 'banda.jpg', 'album.jpg',
  'az-d.webp', 'az-creme.webp', 'az-cobalto.webp', 'az-ceu.webp', 'az-indigo.webp', 'manifest.webmanifest'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request; if (r.method !== 'GET') return;
  var u = new URL(r.url);
  if (/goatcounter\.com$|gc\.zgo\.at$/.test(u.hostname)) return;
  if (r.mode === 'navigate') {
    /* página: sempre tenta a versão nova; sem internet, usa a guardada */
    e.respondWith(fetch(r).then(function (res) {
      var cp = res.clone(); caches.open(V).then(function (c) { c.put('index.html', cp); }); return res;
    }).catch(function () { return caches.match('index.html'); }));
    return;
  }
  if (u.origin === self.location.origin) {
    e.respondWith(caches.match(r).then(function (hit) {
      var net = fetch(r).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    }));
  }
});
