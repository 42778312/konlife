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
        <style dangerouslySetInnerHTML={{ __html: nativeWebCss }} />
      </head>
      <body>
        {/*
THESIS: Weekend is a date you tap and a night you open — not a month grid, not a ticket marketplace.
OWN-WORLD: Charcoal #161616, plates #222222, lime #F2F862 only on selected date and featured card, Poppins, 24px plates, circular chrome.
STORY: Pick a day in Konstanz, scan the lime featured night, open the sheet. No tickets, no account, no fake crowds.
FIRST VIEWPORT: Site nav; Upcoming Event + lime help; month; horizontal date capsules; lime lead card then charcoal cards.
FORM: User-pinned Upcoming Event screenshot (.impeccable/mocks/weekend-approved.png); sampled #161616 / #F2F862 / #222222; Poppins.
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
`;
