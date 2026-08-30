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
        <meta name="theme-color" content="#080809" />
        <meta name="color-scheme" content="dark" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KONSTANZ" />
        <meta name="application-name" content="KONSTANZ" />
        <meta name="format-detection" content="telephone=no" />
        <title>KONSTANZ | Party & Event Finder</title>
        <meta
          name="description"
          content="Discover events, clubs, bars, and nightlife in Konstanz"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: nativeWebCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const nativeWebCss = `
html, body, #root {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #080809;
  overscroll-behavior: none;
}
html {
  height: 100%;
  height: 100dvh;
}
body {
  position: fixed;
  inset: 0;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
input, textarea {
  user-select: text;
  -webkit-user-select: text;
  font-size: 16px;
}
* {
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
`;
