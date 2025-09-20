import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  // Use esbuild instead of Rollup to avoid native binary issues
  bundle: true,
  target: 'node18',
  platform: 'node',
});
