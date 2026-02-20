/**
 * 画像キャッシュ用 Service Worker（GitHub Pages の 10 分キャッシュを補うクライアントキャッシュ）
 * 画像リクエストを CacheFirst でキャッシュし、再訪問時の読み込みを高速化する。
 */
const IMAGE_CACHE = "kanpai-image-cache-v1";

function isImageRequest(request) {
  const url = new URL(request.url);
  return (
    request.destination === "image" ||
    /\.(png|jpeg|jpg|webp|gif|svg)(\?.*)?$/i.test(url.pathname)
  );
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k.startsWith("kanpai-image-cache-") && k !== IMAGE_CACHE)
          .map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !isImageRequest(event.request)) return;

  event.respondWith(
    caches.open(IMAGE_CACHE).then((cache) => {
      return cache.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            cache.put(event.request, res.clone());
          }
          return res;
        });
      });
    })
  );
});
