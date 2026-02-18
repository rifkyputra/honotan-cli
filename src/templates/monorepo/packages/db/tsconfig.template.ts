import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTsconfig(data: MonorepoTemplateData): string {
  const config = {
    extends: `${data.scope}/config/tsconfig.base.json`,
    compilerOptions: {
      composite: true,
      outDir: 'dist',
      types: ['bun-types'],
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  return JSON.stringify(config, null, 2) + '\n';
}
