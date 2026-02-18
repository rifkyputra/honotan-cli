import type { MonorepoTemplateData } from '../../../../types';

export function generateAuthPackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/auth`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      '.': './src/index.ts',
      './types': './src/types.ts',
    },
    dependencies: {
      'better-auth': 'catalog:',
      [`${data.scope}/db`]: 'workspace:*',
      [`${data.scope}/env`]: 'workspace:*',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      '@types/node': 'catalog:',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
