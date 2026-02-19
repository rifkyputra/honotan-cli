import type { MonorepoTemplateData } from '../../../../types';

export function generateS3PackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/s3`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      '.': './src/index.ts',
    },
    scripts: {
      'check-types': 'tsc --noEmit',
    },
    dependencies: {
      'aws4fetch': 'catalog:',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      '@types/node': 'catalog:',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
