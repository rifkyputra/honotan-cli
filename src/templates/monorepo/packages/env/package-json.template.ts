import type { MonorepoTemplateData } from '../../../../types';

export function generateEnvPackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/env`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      './server': './src/server.ts',
      ...(data.hasClient ? { './client': './src/client.ts' } : {}),
    },
    dependencies: {
      '@t3-oss/env-core': '^0.13.1',
      zod: 'catalog:',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
