import type { MonorepoTemplateData } from '../../../../types';

export function generateCachePackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/cache`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      '.': './src/index.ts',
      './types': './src/types.ts',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      '@types/node': 'catalog:',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
