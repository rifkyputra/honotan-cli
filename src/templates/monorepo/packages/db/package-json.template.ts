import type { MonorepoTemplateData } from '../../../../types';

export function generateDbPackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/db`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      '.': './src/index.ts',
      './types': './src/types.ts',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
