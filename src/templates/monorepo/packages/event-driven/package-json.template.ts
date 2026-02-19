import type { MonorepoTemplateData } from '../../../../types';

export function generateEventDrivenPackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/event-driven`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      '.': './src/index.ts',
      './types': './src/types.ts',
    },
    dependencies: {
      amqplib: '^0.10.4',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      '@types/amqplib': '^0.10.5',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
