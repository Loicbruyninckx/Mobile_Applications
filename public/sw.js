self.addEventListener('install' () => self.skipWaiting());
self.addEventListener('activate', (event:Event) => event.waitUntil(clients.claim()));
//TODO add fect event listeners to cache requests and serve cahed response