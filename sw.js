const CACHE_NAME = "calorie-tracker-v1";
const APP_FILES = [
 "./",
 "./index.html",
 "./manifest.json",
 "./icons/icon-192.png",
 "./icons/icon-512.png"
];
self.addEventListener("install", event => {
 event.waitUntil(
   caches.open(CACHE_NAME)
     .then(cache => cache.addAll(APP_FILES))
 );
 self.skipWaiting();
});
self.addEventListener("activate", event => {
 event.waitUntil(
   caches.keys().then(cacheNames => {
     return Promise.all(
       cacheNames
         .filter(name => name !== CACHE_NAME)
         .map(name => caches.delete(name))
     );
   })
 );
 self.clients.claim();
});
self.addEventListener("fetch", event => {
 if (event.request.method !== "GET") {
   return;
 }
 event.respondWith(
   fetch(event.request)
     .then(response => {
       const responseCopy = response.clone();
       caches.open(CACHE_NAME)
         .then(cache => {
           cache.put(event.request, responseCopy);
         });
       return response;
     })
     .catch(() => {
       return caches.match(event.request);
     })
 );
});