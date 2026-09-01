const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const maplibreBrowser = path.join(__dirname, 'node_modules/maplibre-gl/dist/maplibre-gl.js');
const upstream = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'maplibre-gl') {
    return { type: 'sourceFile', filePath: maplibreBrowser };
  }
  if (upstream) return upstream(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
