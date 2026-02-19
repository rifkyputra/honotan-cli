import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTursoTsconfig(data: MonorepoTemplateData): string {
  const config = {
    extends: `${data.scope}/config/tsconfig.base.json`,
    compilerOptions: {
      composite: true,
      outDir: 'dist',
    },
    include: ['src/**/*', 'drizzle.config.ts'],
    exclude: ['node_modules', 'dist'],
  };

  return JSON.stringify(config, null, 2) + '\n';
}
