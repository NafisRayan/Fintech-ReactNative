// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure web-specific settings
config.resolver.platforms = ['web', 'native', 'ios', 'android'];

// Add web-specific module resolution
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  // Fix victory-native web compatibility
  'victory-native': 'victory',
  // Fix stream polyfills for web platform
  'stream/web': 'stream-browserify',
  'stream': 'readable-stream',
  'util': 'util',
};

// Configure platform-specific extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'];

// Add Node.js polyfills for web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Web-specific node modules resolution
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  'node_modules'
];

module.exports = config;
