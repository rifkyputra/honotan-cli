import type { MonorepoTemplateData } from '../../../../types';

export function generateServerPackageJson(data: MonorepoTemplateData): string {
  const { scope, framework, hasDb, hasCache, hasEventDriven } = data;

  const dependencies: Record<string, string> = {};

  // Framework-conditional deps
  if (framework === 'hono') {
    dependencies['hono'] = '^4.0.0';
    dependencies['@hono/node-server'] = '^1.0.0';
    dependencies['valibot'] = '^0.42.1';
  } else if (framework === 'express') {
    dependencies['express'] = '^4.18.0';
    dependencies['cors'] = '^2.8.5';
    dependencies['zod'] = 'catalog:';
  } else if (framework === 'fastify') {
    dependencies['fastify'] = '^4.0.0';
    dependencies['zod'] = 'catalog:';
  }

  // Always include env
  dependencies[`${scope}/env`] = 'workspace:*';

  // Infra packages
  if (hasDb) {
    dependencies[`${scope}/db`] = 'workspace:*';
  }
  if (hasCache) {
    dependencies[`${scope}/cache`] = 'workspace:*';
  }
  if (hasEventDriven) {
    dependencies[`${scope}/event-driven`] = 'workspace:*';
  }

  const devDependencies: Record<string, string> = {
    [`${scope}/config`]: 'workspace:*',
    '@types/node': 'catalog:',
    'tsdown': '^0.16.5',
    'typescript': 'catalog:',
  };

  if (framework === 'express') {
    devDependencies['@types/express'] = '^4.17.0';
    devDependencies['@types/cors'] = '^2.8.0';
  }

  const pkg = {
    name: 'server',
    type: 'module',
    main: 'src/index.ts',
    scripts: {
      build: 'tsdown',
      'check-types': 'tsc -b',
      dev: 'bun run src/index.ts',
      start: 'node dist/index.mjs',
      test: 'bun test',
    },
    dependencies,
    devDependencies,
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
