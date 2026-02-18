import type { MonorepoTemplateData } from '../../../types';

export function generateRootPackageJson(data: MonorepoTemplateData): string {
  const catalog: Record<string, string> = {
    zod: '^4.1.13',
    typescript: '^5',
    '@types/node': '^22.13.14',
  };

  if (data.hasEventDriven) {
    catalog['amqplib'] = '^0.10.4';
  }

  const pkg = {
    name: data.projectName,
    private: true,
    workspaces: {
      packages: ['apps/*', 'packages/*'],
      catalog,
    },
    type: 'module',
    scripts: {
      dev: 'turbo dev',
      build: 'turbo build',
      'check-types': 'turbo check-types',
      'dev:server': 'turbo -F server dev',
    },
    dependencies: {
      [`${data.scope}/env`]: 'workspace:*',
      zod: 'catalog:',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      '@types/node': 'catalog:',
      turbo: '^2.6.3',
      typescript: 'catalog:',
    },
    packageManager: 'bun@1.3.1',
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
