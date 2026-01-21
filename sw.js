// Cambiamos la versión a v2 para forzar la limpieza
const CACHE_NAME = "zeus-cache-v2";

const ASSETS_TO_CACHE = [
    "./",
    "index.html",
    "perfil.html",
    "servicios.html",
    "contacto.html",
    "estilos.css",
    "manifest.json"
];

// INSTALACIÓN
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Zeus SW: Archivando activos críticos");
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// ACTIVACIÓN: Limpia cachés viejas
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log("Zeus SW: Borrando caché antigua", key);
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// EVENTO FETCH: ESTRATEGIA NETWORK FIRST (CORREGIDO)
self.addEventListener("fetch", e => {
    e.respondWith(
        // Intentamos primero buscar en internet
        fetch(e.request)
            .then(networkResponse => {
                // Si funciona, guardamos una copia actualizada en caché
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(e.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Si falla internet (Offline), buscamos en la caché
                return caches.match(e.request);
            })
    );
});
