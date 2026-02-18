import type { MonorepoTemplateData } from '../../../../types';

export function generateServerTsconfig(data: MonorepoTemplateData): string {
  const { scope, apiFramework: framework } = data;

  const compilerOptions: Record<string, unknown> = {
    composite: true,
    outDir: 'dist',
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*'],
    },
  };

  if (framework === 'hono') {
    compilerOptions['jsx'] = 'react-jsx';
    compilerOptions['jsxImportSource'] = 'hono/jsx';
  }

  const tsconfig = {
    extends: `${scope}/config/tsconfig.base.json`,
    compilerOptions,
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  return JSON.stringify(tsconfig, null, 2) + '\n';
}
