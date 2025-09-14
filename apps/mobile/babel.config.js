module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
          '@palmera/ui': '../../packages/ui/src',
          '@palmera/types': '../../packages/types/src',
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};