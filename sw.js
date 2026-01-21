// Nombre de la caché - Subimos a v3 para forzar la limpieza total
const CACHE_NAME = "zeus-cache-v3";

const ASSETS_TO_CACHE = [
    "./",
    "index.html",
    "perfil.html",
    "servicios.html",
    "contacto.html",
    "estilos.css",
    "manifest.json"
];

// INSTALACIÓN: Guarda los archivos iniciales
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Zeus SW: Archivando activos críticos");
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// ACTIVACIÓN: Borra cualquier rastro de versiones viejas
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

// EVENTO FETCH: ESTRATEGIA NETWORK-FIRST (Clave para que el CSS cargue)
self.addEventListener("fetch", e => {
    e.respondWith(
        fetch(e.request)
            .then(networkResponse => {
                // Si hay internet, actualizamos la caché con lo nuevo
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(e.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Si falla internet, usamos lo que tengamos guardado
                return caches.match(e.request);
            })
    );
});
