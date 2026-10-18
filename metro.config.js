const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = wrapWithReanimatedMetroConfig(getDefaultConfig(__dirname));

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './src/uniwind-types.d.ts',
  // Preserve NativeWind's rem scale while the existing screen styles migrate.
  polyfills: { rem: 14 },
});
