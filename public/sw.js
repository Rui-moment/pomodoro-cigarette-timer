const CACHE_NAME = "pomodoro-v1";

//インストール時初回のみ
self.addEventListener("install", (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting(); //すぐアクティブ化
});

//アクティベート時
self.addEventListener("activate", (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.key().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Delete old caches');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

//フェッチ時
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            //オフライン時の処理(今は何もしない)
            return caches.match(event.request);
        })
    )
});