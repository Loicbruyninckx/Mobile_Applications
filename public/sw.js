const CACHE_NAME = 'bierapp-v3';

const APP_SHELL = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png'];

function findAssetUrls(html) {
  const urls = [];
  const pattern = /(?:src|href)="(\/[^"]+)"/g;
  let match = pattern.exec(html);
  while (match) {
    urls.push(match[1]);
    match = pattern.exec(html);
  }
  return urls;
}

function findFontUrls(javascript) {
  return javascript.match(/\/assets\/[^"']+\.ttf/g) || [];
}

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(APP_SHELL);

  const response = await cache.match('/');
  if (!response) return;
  const assetUrls = findAssetUrls(await response.text());
  await Promise.all(assetUrls.map((url) => cache.add(url).catch(() => undefined)));

  const scripts = await Promise.all(
    assetUrls
      .filter((url) => url.endsWith('.js'))
      .map((url) => cache.match(url).then((cached) => (cached ? cached.text() : ''))),
  );
  const fontUrls = [...new Set(scripts.flatMap(findFontUrls))];
  await Promise.all(fontUrls.map((url) => cache.add(url).catch(() => undefined)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await cache.match('/');
      if (shell) return shell;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/_expo/static/') || url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
