import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['@palmera/schemas'],
  // Use esbuild instead of Rollup to avoid native binary issues
  bundle: true,
  target: 'node18',
  platform: 'node',
});
