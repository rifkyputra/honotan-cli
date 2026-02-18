import type { MonorepoTemplateData } from '../../../../types';

export function generateEventDrivenTsconfig(data: MonorepoTemplateData): string {
  const config = {
    extends: `${data.scope}/config/tsconfig.base.json`,
    compilerOptions: {
      composite: true,
      outDir: 'dist',
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  return JSON.stringify(config, null, 2) + '\n';
}
