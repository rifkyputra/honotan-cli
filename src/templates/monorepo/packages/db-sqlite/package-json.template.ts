import type { MonorepoTemplateData } from '../../../../types';

export function generateDbSqlitePackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/db`,
    version: '0.0.0',
    private: true,
    type: 'module',
    exports: {
      '.': { default: './src/index.ts' },
      './*': { default: './src/*.ts' },
    },
    scripts: {
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'drizzle-kit migrate',
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
    },
    dependencies: {
      [`${data.scope}/env`]: 'workspace:*',
      '@libsql/client': 'catalog:',
      'drizzle-orm': 'catalog:',
      dotenv: 'catalog:',
      zod: 'catalog:',
    },
    devDependencies: {
      [`${data.scope}/config`]: 'workspace:*',
      'drizzle-kit': 'catalog:',
      typescript: 'catalog:',
    },
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
