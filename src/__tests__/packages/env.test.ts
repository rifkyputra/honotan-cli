import { describe, test, expect, beforeAll } from 'bun:test';
import { fixtures, makeMonorepoData, scaffold } from '../fixtures';

// ---------------------------------------------------------------------------
// packages/env/src/server.ts
// ---------------------------------------------------------------------------
describe('packages/env/src/server.ts', () => {
  describe('minimal (no infra)', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(fixtures.minimal);
      content = await gen.read('packages/env/src/server.ts');
    });

    test('file is generated', async () => {
      const gen = await scaffold(fixtures.minimal);
      expect(gen.exists('packages/env/src/server.ts')).toBe(true);
    });

    test('uses createEnv from @t3-oss/env-core', () => {
      expect(content).toContain('@t3-oss/env-core');
      expect(content).toContain('createEnv');
    });

    test('includes base server vars', () => {
      expect(content).toContain('PORT');
      expect(content).toContain('NODE_ENV');
      expect(content).toContain('CORS_ORIGIN');
    });

    test('does not include infra vars', () => {
      expect(content).not.toContain('DATABASE_URL');
      expect(content).not.toContain('REDIS_URL');
      expect(content).not.toContain('RABBITMQ_URL');
      expect(content).not.toContain('BETTER_AUTH_SECRET');
    });
  });

  describe('with db', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-env-db', { infraPackages: ['db'], hasDb: true }));
      content = await gen.read('packages/env/src/server.ts');
    });

    test('includes DATABASE_URL', () => {
      expect(content).toContain('DATABASE_URL');
    });
  });

  describe('with db-turso', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-env-turso', { infraPackages: ['db-turso'], hasDbTurso: true }));
      content = await gen.read('packages/env/src/server.ts');
    });

    test('includes DATABASE vars', () => {
      expect(content).toContain('DATABASE_URL');
      expect(content).toContain('DATABASE_AUTH_TOKEN');
    });
  });

  describe('with cache', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-env-cache', { infraPackages: ['cache'], hasCache: true }));
      content = await gen.read('packages/env/src/server.ts');
    });

    test('includes REDIS_URL', () => {
      expect(content).toContain('REDIS_URL');
    });
  });

  describe('with event-driven', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-env-events', { infraPackages: ['event-driven'], hasEventDriven: true }));
      content = await gen.read('packages/env/src/server.ts');
    });

    test('includes RABBITMQ_URL', () => {
      expect(content).toContain('RABBITMQ_URL');
    });
  });

  describe('with auth', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(fixtures.withAuth);
      content = await gen.read('packages/env/src/server.ts');
    });

    test('includes auth vars', () => {
      expect(content).toContain('BETTER_AUTH_SECRET');
      expect(content).toContain('BETTER_AUTH_URL');
    });
  });
});

// ---------------------------------------------------------------------------
// packages/env/src/client.ts
// ---------------------------------------------------------------------------
describe('packages/env/src/client.ts', () => {
  describe('with client', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(fixtures.withClient);
    });

    test('file is generated', () => {
      expect(gen.exists('packages/env/src/client.ts')).toBe(true);
    });

    test('includes VITE_API_URL', async () => {
      const content = await gen.read('packages/env/src/client.ts');
      expect(content).toContain('VITE_API_URL');
    });

    test('uses clientPrefix VITE_', async () => {
      const content = await gen.read('packages/env/src/client.ts');
      expect(content).toContain('clientPrefix: "VITE_"');
    });

    test('uses import.meta.env as runtimeEnv', async () => {
      const content = await gen.read('packages/env/src/client.ts');
      expect(content).toContain('import.meta.env');
    });

    test('does not include auth var without hasAuth', async () => {
      const content = await gen.read('packages/env/src/client.ts');
      expect(content).not.toContain('VITE_AUTH_URL');
    });
  });

  describe('with client + auth', () => {
    let content: string;
    beforeAll(async () => {
      const gen = await scaffold(fixtures.withClientAndAuth);
      content = await gen.read('packages/env/src/client.ts');
    });

    test('includes VITE_AUTH_URL', () => {
      expect(content).toContain('VITE_AUTH_URL');
    });
  });

  describe('without client', () => {
    test('file is not generated', async () => {
      const gen = await scaffold(fixtures.minimal);
      expect(gen.exists('packages/env/src/client.ts')).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// packages/env/package.json
// ---------------------------------------------------------------------------
describe('packages/env/package.json', () => {
  test('always exports ./server', async () => {
    const gen = await scaffold(fixtures.minimal);
    const pkg = JSON.parse(await gen.read('packages/env/package.json'));
    expect(pkg.exports['./server']).toBe('./src/server.ts');
  });

  test('exports ./client when hasClient', async () => {
    const gen = await scaffold(fixtures.withClient);
    const pkg = JSON.parse(await gen.read('packages/env/package.json'));
    expect(pkg.exports['./client']).toBe('./src/client.ts');
  });

  test('does not export ./client without hasClient', async () => {
    const gen = await scaffold(fixtures.minimal);
    const pkg = JSON.parse(await gen.read('packages/env/package.json'));
    expect(pkg.exports['./client']).toBeUndefined();
  });

  test('package name uses project scope', async () => {
    const gen = await scaffold(fixtures.minimal);
    const pkg = JSON.parse(await gen.read('packages/env/package.json'));
    expect(pkg.name).toBe('@test-minimal/env');
  });
});
