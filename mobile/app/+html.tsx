import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="theme-color" content="#0B0A0D" />
        <meta name="color-scheme" content="dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KONSTANZ" />
        <meta name="application-name" content="KONSTANZ" />
        <meta name="format-detection" content="telephone=no" />
        <title>KONSTANZ · Nights in Konstanz</title>
        <meta
          name="description"
          content="Discover clubs, student nights, bars, and live music in Konstanz this week."
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: nativeWebCss }} />
      </head>
      <body>
        {/*
THESIS: Home is this week's nights as photographs you tap — not a clipboard, not a ticket marketplace.
OWN-WORLD: Night black #0B0A0D, warm type #F6F1EA, lime #E8FF4A on saved/price, photo-led cards, Barlow Condensed titles.
STORY: See what's on, save a night, open the photo sheet. No tickets, no account.
FIRST VIEWPORT: KONSTANZ nav; Out this week; search; full-bleed featured photo; This week row; Happening list.
FORM: User-pinned event-app canon (photos, this week, party vibe) over Door Clipboard seed a2aab498.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
        */}
        {children}
      </body>
    </html>
  );
}

const nativeWebCss = `
html, body, #root {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #0B0A0D;
  overscroll-behavior: none;
}
html { height: 100%; height: 100dvh; }
body {
  position: fixed;
  inset: 0;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  -webkit-text-size-adjust: 100%;
  font-family: Barlow, system-ui, sans-serif;
  color: #F6F1EA;
}
::selection { background: #E8FF4A; color: #0B0A0D; }
:focus-visible { outline: 2px solid #E8FF4A; outline-offset: 2px; }
input, textarea { caret-color: #E8FF4A; font-size: 16px; }
* { box-sizing: border-box; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;
