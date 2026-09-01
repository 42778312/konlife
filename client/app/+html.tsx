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
        <meta name="theme-color" content="#161616" />
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
        <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css" />
        <style dangerouslySetInnerHTML={{ __html: nativeWebCss }} />
      </head>
      <body>
        {/*
THESIS: Discover is a night you open from a photo plate — not a paper clipboard, not a ticket desk.
OWN-WORLD: Black #000000 field, plate #171717, lime #F2F862 on selected stadium, Open night, and the door-time mark; Poppins; 32px photo plate; circular chrome.
STORY: Scan Konstanz categories, open tonight’s featured night, swipe the coming posters. No tickets, no account, no fake crowds.
FIRST VIEWPORT: K mark · Welcome back / Konstanz · saved; Discover search + filter; category stadiums; photo plate with date badge, save, title, place, price, door-time mark, Open night; Top nights posters.
FORM: User-pinned home screenshot (.impeccable/mocks/home-approved.png); sampled #000000 / #171717 / #F2F862; Poppins.
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
  background-color: #161616;
  overscroll-behavior: none;
}
html { height: 100%; height: 100dvh; }
body {
  position: fixed;
  inset: 0;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  -webkit-text-size-adjust: 100%;
  font-family: Poppins, system-ui, sans-serif;
  color: #FFFFFF;
}
::selection { background: #F2F862; color: #161616; }
:focus-visible { outline: 2px solid #F2F862; outline-offset: 2px; }
input, textarea { caret-color: #F2F862; font-size: 16px; }
* { box-sizing: border-box; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
.maplibregl-map {
  font-family: Poppins, system-ui, sans-serif;
  background: #161616;
  touch-action: none;
}
.maplibregl-canvas,
.maplibregl-canvas-container {
  touch-action: none;
}
.maplibregl-ctrl-attrib {
  background: rgba(22, 22, 22, 0.72) !important;
  color: #8E8E93 !important;
  font-size: 12px !important;
  font-family: Poppins, system-ui, sans-serif !important;
}
.maplibregl-ctrl-attrib a { color: #C7C7C7 !important; }
.maplibregl-ctrl-bottom-left, .maplibregl-ctrl-bottom-right { margin: 8px !important; }
.maplibregl-marker { background: transparent; }
`;
