import type { MonorepoTemplateData } from '../../../../types';

export function generateServerTsdownConfig(_data: MonorepoTemplateData): string {
  return `import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  shims: true,
});
`;
}
