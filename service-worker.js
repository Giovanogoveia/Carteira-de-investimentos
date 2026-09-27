const CACHE_NAME = "carteira-investimentos-v1.1"; // Atualizei a versão
const FILES_TO_CACHE = [
  "./",
  "./teste.html",
  "./manifest.json",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Instalação e cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting()) // Ativa imediatamente
      .catch(err => console.error("Erro ao cachear:", err))
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim()) // Assume controle de todas as abas
  );
});

// Busca: online primeiro, depois cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Fallback para o cache se estiver offline
        return caches.match(event.request);
      })
  );
});
