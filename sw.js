// Nombre de la caché (Cámbiale la versión v1, v2... cuando hagas cambios grandes)
const CACHE_NAME = "zeus-cache-v1";

// Archivos críticos para que la web funcione sin internet
const ASSETS_TO_CACHE = [
    "./",
    "index.html",
    "perfil.html",
    "servicios.html",
    "contacto.html",
    "estilos.css",
    "manifest.json"
];

// EVENTO DE INSTALACIÓN: Guarda los archivos en el navegador
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Zeus SW: Archivando activos críticos");
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// EVENTO DE ACTIVACIÓN: Borra versiones viejas de la caché automáticamente
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

// EVENTO FETCH: La magia que permite ver la web offline
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            // Si el archivo está en caché, lo entrega. Si no, lo busca en internet.
            return response || fetch(e.request).then(fetchResponse => {
                // Opcional: Podríamos guardar dinámicamente nuevos recursos aquí
                return fetchResponse;
            });
        }).catch(() => {
            // Si falla todo (no hay red ni caché), podrías mostrar una página de error
            if (e.request.mode === 'navigate') {
                return caches.match("index.html");
            }
        })
    );
});
