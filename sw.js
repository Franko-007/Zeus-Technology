self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("zeus-cache").then(cache => {
            return cache.addAll([
                "index.html",
                "perfil.html",
                "servicios.html",
                "contacto.html",
                "estilos.css"
            ]);
        })
    );
});
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== "zeus-cache") {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});
