import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  dts: false,
  target: 'node20',
  shims: true,
  banner: { js: '#!/usr/bin/env node' },
});
