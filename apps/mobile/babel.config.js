module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@': './src',
          '@palmera/ui': '../../packages/ui/src',
          '@palmera/schemas': '../../packages/schemas/src',
          '@palmera/sdk': '../../packages/sdk/src',
          '@palmera/i18n': '../../packages/i18n/src',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};