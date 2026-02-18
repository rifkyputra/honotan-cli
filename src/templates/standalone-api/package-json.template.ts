import type { ApiFramework } from '../../types';

export function generateStandalonePackageJson(name: string, framework: ApiFramework): string {
  const dependencies: Record<string, string> = {};

  if (framework === 'hono') {
    dependencies['hono'] = '^4.0.0';
    dependencies['@hono/node-server'] = '^1.0.0';
    dependencies['valibot'] = '^0.42.1';
  } else if (framework === 'express') {
    dependencies['express'] = '^4.18.0';
    dependencies['cors'] = '^2.8.5';
    dependencies['zod'] = '^3.23.0';
  } else if (framework === 'fastify') {
    dependencies['fastify'] = '^4.0.0';
    dependencies['zod'] = '^3.23.0';
  }

  const devDependencies: Record<string, string> = {
    '@types/node': '^22.0.0',
    'tsdown': '^0.16.5',
    'typescript': '^5.0.0',
  };

  if (framework === 'express') {
    devDependencies['@types/express'] = '^4.17.0';
    devDependencies['@types/cors'] = '^2.8.0';
  }

  const pkg = {
    name,
    version: '0.0.1',
    type: 'module',
    main: 'src/index.ts',
    scripts: {
      build: 'tsdown',
      'check-types': 'tsc --noEmit',
      dev: 'bun --watch src/index.ts',
      start: 'node dist/index.mjs',
      test: 'bun test',
    },
    dependencies,
    devDependencies,
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
