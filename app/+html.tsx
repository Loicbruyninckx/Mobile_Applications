import type { PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';
import { colors } from '../src/theme/colors';

/**
 * De HTML rond elke pagina van de webversie. Wordt alleen bij het bouwen (Node) uitgevoerd,
 * niet in de browser. Hier staan de PWA-onderdelen: manifest, iconen en de service worker.
 */

// Service worker pas registreren als de pagina geladen is, zodat de eerste keer laden niet trager wordt.
const registerServiceWorker = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').catch(function (error) {
      console.warn('Service worker niet geregistreerd:', error);
    });
  });
}
`;

// Achtergrondkleur meteen zetten, zodat je bij het opstarten geen witte flits ziet.
const baseStyle = `body { background-color: ${colors.background}; }`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* viewport-fit=cover: de app loopt door tot onder de notch; de navigatiebalk houdt zelf rekening met de veilige zone. */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <title>Bierapp</title>
        <meta name="description" content="Rate speciaalbieren en deel ze met je vriendengroep." />

        {/* PWA: manifest en kleur van de browserbalk (Android). */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={colors.primary} />
        <link rel="icon" type="image/png" href="/icon-192.png" />

        {/* iPhone/iPad lezen het manifest maar half: deze tags zorgen voor icoon en volledig scherm. */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bierapp" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: baseStyle }} />
        <script dangerouslySetInnerHTML={{ __html: registerServiceWorker }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
