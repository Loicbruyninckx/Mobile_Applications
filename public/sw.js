/**
 * Service worker van Bierapp: zorgt dat de app ook zonder internet opent.
 *
 * Gewoon JavaScript: bestanden in public/ worden niet door TypeScript gecompileerd,
 * de browser laadt dit bestand rechtstreeks.
 *
 * Strategie:
 * - Installeren: de startpagina, alle JS/CSS waar ze naar verwijst en de lettertypes
 *   (iconen in de tabbalk) meteen in de cache zetten.
 * - Pagina's (navigatie): eerst het netwerk (altijd de nieuwste versie), offline → uit de cache.
 * - Gebouwde bestanden in /_expo/static/ en /assets/: eerst de cache. Hun naam bevat een hash,
 *   dus een nieuwe versie van de app krijgt automatisch nieuwe bestandsnamen.
 * - Supabase (ander domein) en alles behalve GET: nooit cachen, altijd live.
 */

// Verhoog dit nummer als je de cache-strategie verandert: oude caches worden dan opgeruimd.
const CACHE_NAME = 'bierapp-v2';

const APP_SHELL = ['/', '/manifest.json', '/icon-192.png', '/icon-512.png'];

/** Zoekt in de HTML naar <script src> en <link href> van onze eigen site. */
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

/** Lettertypes worden pas door de JavaScript geladen: zoek hun pad in de bundels. */
function findFontUrls(javascript) {
  return javascript.match(/\/assets\/[^"']+\.ttf/g) || [];
}

async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(APP_SHELL);

  // De JS-bundels hebben een hash in hun naam: lees ze uit de startpagina.
  const response = await cache.match('/');
  if (!response) return;
  const assetUrls = findAssetUrls(await response.text());
  // Eén mislukt bestand mag de installatie niet blokkeren.
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

/** Netwerk eerst; lukt dat niet, dan de cache. Voor pagina's valt het terug op de startpagina. */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
    if (cached) return cached;
    // Offline op een pagina die nog niet bezocht werd (bv. /groepen/abc):
    // de startpagina laden, expo-router toont daarna zelf het juiste scherm.
    if (request.mode === 'navigate') {
      const shell = await cache.match('/');
      if (shell) return shell;
    }
    throw error;
  }
}

/** Cache eerst; niet gevonden, dan ophalen en bewaren voor de volgende keer. */
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
  // Supabase en andere domeinen: niet aankomen, data moet altijd live zijn.
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith('/_expo/static/') || url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
