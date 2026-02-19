import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTursoPackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/db`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      '.': './src/index.ts',
      './schema': './src/schema.ts',
    },
    scripts: {
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'bun src/migrate.ts',
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
    },
    dependencies: {
      '@libsql/client': 'catalog:',
      'drizzle-orm': 'catalog:',
      [`${data.scope}/env`]: 'workspace:*',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      '@types/node': 'catalog:',
      'drizzle-kit': 'catalog:',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
