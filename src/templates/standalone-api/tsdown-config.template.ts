export function generateStandaloneTsdownConfig(): string {
  return `import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  shims: true,
});
`;
}
