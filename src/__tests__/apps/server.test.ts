import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';
import type { Awaited } from 'bun';

// ---------------------------------------------------------------------------
// apps/server — always generated
// ---------------------------------------------------------------------------
describe('apps/server — always generated', () => {
  let gen: Awaited<ReturnType<typeof scaffold>>;
  beforeAll(async () => {
    gen = await scaffold(makeMonorepoData('test-server-core'));
  });

  test('package.json exists', () => expect(gen.exists('apps/server/package.json')).toBe(true));
  test('tsconfig.json exists', () => expect(gen.exists('apps/server/tsconfig.json')).toBe(true));
  test('tsdown.config.ts exists', () => expect(gen.exists('apps/server/tsdown.config.ts')).toBe(true));
  test('src/index.ts exists', () => expect(gen.exists('apps/server/src/index.ts')).toBe(true));
  test('.env.example exists', () => expect(gen.exists('apps/server/.env.example')).toBe(true));

  test('example hello resource is scaffolded', () => {
    expect(gen.exists('apps/server/src/hello/domain/entities/hello.entity.ts')).toBe(true);
    expect(gen.exists('apps/server/src/hello/application/use-cases/hello.use-case.ts')).toBe(true);
    expect(gen.exists('apps/server/src/hello/adapters/in/http/hello.routes.ts')).toBe(true);
    expect(gen.exists('apps/server/src/hello/adapters/out/persistence/in-memory-hello.repository.ts')).toBe(true);
  });

  test('example hello resource includes tests', () => {
    expect(gen.exists('apps/server/src/hello/application/use-cases/hello.use-case.test.ts')).toBe(true);
    expect(gen.exists('apps/server/src/hello/adapters/in/http/hello.routes.test.ts')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// apps/server/package.json — framework-conditional deps
// ---------------------------------------------------------------------------
describe('apps/server/package.json', () => {
  describe('hono framework', () => {
    let pkg: Record<string, Record<string, string>>;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-server-hono', { apiFramework: 'hono' }));
      pkg = JSON.parse(await gen.read('apps/server/package.json'));
    });

    test('has hono dependency', () => expect(pkg['dependencies']?.['hono']).toBeDefined());
    test('has @hono/node-server', () => expect(pkg['dependencies']?.['@hono/node-server']).toBeDefined());
    test('has valibot for validation', () => expect(pkg['dependencies']?.['valibot']).toBeDefined());
    test('no express or fastify', () => {
      expect(pkg['dependencies']?.['express']).toBeUndefined();
      expect(pkg['dependencies']?.['fastify']).toBeUndefined();
    });
  });

  describe('express framework', () => {
    let pkg: Record<string, Record<string, string>>;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-server-express', { frameworks: ['express'], apiFramework: 'express' }));
      pkg = JSON.parse(await gen.read('apps/server/package.json'));
    });

    test('has express dependency', () => expect(pkg['dependencies']?.['express']).toBeDefined());
    test('has cors dependency', () => expect(pkg['dependencies']?.['cors']).toBeDefined());
    test('has zod for validation', () => expect(pkg['dependencies']?.['zod']).toBeDefined());
    test('has @types/express in devDependencies', () => expect(pkg['devDependencies']?.['@types/express']).toBeDefined());
    test('no hono', () => expect(pkg['dependencies']?.['hono']).toBeUndefined());
  });

  describe('fastify framework', () => {
    let pkg: Record<string, Record<string, string>>;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-server-fastify', { frameworks: ['fastify'], apiFramework: 'fastify' }));
      pkg = JSON.parse(await gen.read('apps/server/package.json'));
    });

    test('has fastify dependency', () => expect(pkg['dependencies']?.['fastify']).toBeDefined());
    test('has zod for validation', () => expect(pkg['dependencies']?.['zod']).toBeDefined());
    test('no hono or express', () => {
      expect(pkg['dependencies']?.['hono']).toBeUndefined();
      expect(pkg['dependencies']?.['express']).toBeUndefined();
    });
  });

  describe('infra deps conditional', () => {
    test('includes @scope/db when hasDb', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-pkgdb', { infraPackages: ['db'], hasDb: true }));
      const pkg = JSON.parse(await gen.read('apps/server/package.json'));
      expect(pkg['dependencies']?.['@test-server-pkgdb/db']).toBeDefined();
    });

    test('includes @scope/cache when hasCache', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-pkgcache', { infraPackages: ['cache'], hasCache: true }));
      const pkg = JSON.parse(await gen.read('apps/server/package.json'));
      expect(pkg['dependencies']?.['@test-server-pkgcache/cache']).toBeDefined();
    });

    test('includes @scope/event-driven when hasEventDriven', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-pkgevents', { infraPackages: ['event-driven'], hasEventDriven: true }));
      const pkg = JSON.parse(await gen.read('apps/server/package.json'));
      expect(pkg['dependencies']?.['@test-server-pkgevents/event-driven']).toBeDefined();
    });

    test('includes @scope/auth when hasAuth', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-pkgauth', { infraPackages: ['auth'], hasAuth: true, hasDb: true }));
      const pkg = JSON.parse(await gen.read('apps/server/package.json'));
      expect(pkg['dependencies']?.['@test-server-pkgauth/auth']).toBeDefined();
    });
  });
});

// ---------------------------------------------------------------------------
// apps/server/src/index.ts — framework + auth conditionals
// ---------------------------------------------------------------------------
describe('apps/server/src/index.ts', () => {
  describe('hono', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-server-idx-hono', { apiFramework: 'hono' }));
      content = await gen.read('apps/server/src/index.ts');
    });

    test('imports hono', () => expect(content).toContain('from "hono"'));
    test('imports @hono/node-server', () => expect(content).toContain('@hono/node-server'));
    test('mounts hello routes via app.route', () => expect(content).toContain('app.route'));
  });

  describe('express', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-server-idx-express', { frameworks: ['express'], apiFramework: 'express' }));
      content = await gen.read('apps/server/src/index.ts');
    });

    test('imports express', () => expect(content).toContain("from \"express\""));
    test('mounts hello routes via app.use', () => expect(content).toContain('app.use'));
  });

  describe('fastify', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-server-idx-fastify', { frameworks: ['fastify'], apiFramework: 'fastify' }));
      content = await gen.read('apps/server/src/index.ts');
    });

    test('imports Fastify', () => expect(content).toContain('Fastify'));
    test('registers hello plugin', () => expect(content).toContain('fastify.register'));
  });

  describe('auth routes', () => {
    test('hono: includes auth handler when hasAuth', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-auth-hono', { infraPackages: ['auth'], hasAuth: true, hasDb: true }));
      const content = await gen.read('apps/server/src/index.ts');
      expect(content).toContain('/api/auth/**');
      expect(content).toContain('auth.handler');
    });

    test('hono: no auth handler without hasAuth', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-noauth-hono'));
      const content = await gen.read('apps/server/src/index.ts');
      expect(content).not.toContain('/api/auth/**');
    });

    test('express: includes auth handler when hasAuth', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-auth-express', {
        frameworks: ['express'],
        apiFramework: 'express',
        infraPackages: ['auth'],
        hasAuth: true,
        hasDb: true,
      }));
      const content = await gen.read('apps/server/src/index.ts');
      expect(content).toContain('/api/auth/*');
      expect(content).toContain('toNodeHandler');
    });

    test('fastify: includes auth handler when hasAuth', async () => {
      const gen = await scaffold(makeMonorepoData('test-server-auth-fastify', {
        frameworks: ['fastify'],
        apiFramework: 'fastify',
        infraPackages: ['auth'],
        hasAuth: true,
        hasDb: true,
      }));
      const content = await gen.read('apps/server/src/index.ts');
      expect(content).toContain('/api/auth/*');
      expect(content).toContain('toNodeHandler');
    });
  });

  test('always imports env from @scope/env/server', async () => {
    const gen = await scaffold(makeMonorepoData('test-server-env-import'));
    const content = await gen.read('apps/server/src/index.ts');
    expect(content).toContain('@test-server-env-import/env/server');
  });
});
