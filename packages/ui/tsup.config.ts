import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'react-native'],
  platform: 'neutral',
  target: 'es2020',
  // Use esbuild instead of Rollup to avoid native binary issues
  bundle: true,
});
