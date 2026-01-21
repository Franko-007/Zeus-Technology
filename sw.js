// Zeus Technology - SW Cleanup Version
const CACHE_NAME = "cleanup-v1";

// Al instalar, obligamos al SW a activarse inmediatamente
self.addEventListener("install", () => {
    self.skipWaiting();
});

// Al activar, borramos absolutamente TODAS las cachés que existan en el navegador
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => caches.delete(key))
            );
        }).then(() => {
            console.log("Zeus SW: Caché purgada completamente.");
            return self.clients.claim();
        })
    );
});

// En el evento fetch, NO guardamos nada, dejamos que todo venga de internet directamente
self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
});
