module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), './plugins/with-short-cmake-path'],
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.upertib.patient',
  },
});
