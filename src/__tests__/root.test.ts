import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from './fixtures';

// ---------------------------------------------------------------------------
// root/package.json
// ---------------------------------------------------------------------------
describe('root/package.json', () => {
  describe('minimal', () => {
    let pkg: Record<string, unknown>;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-root-minimal'));
      pkg = JSON.parse(await gen.read('package.json'));
    });

    test('project name matches', () => {
      expect(pkg['name']).toBe('test-root-minimal');
    });

    test('workspaces covers apps and packages', () => {
      const ws = pkg['workspaces'] as { packages: string[] };
      expect(ws.packages).toContain('apps/*');
      expect(ws.packages).toContain('packages/*');
    });

    test('catalog always includes zod and typescript', () => {
      const catalog = (pkg['workspaces'] as { catalog: Record<string, string> }).catalog;
      expect(catalog['zod']).toBeDefined();
      expect(catalog['typescript']).toBeDefined();
    });

    test('catalog does not include optional deps without flags', () => {
      const catalog = (pkg['workspaces'] as { catalog: Record<string, string> }).catalog;
      expect(catalog['@libsql/client']).toBeUndefined();
      expect(catalog['amqplib']).toBeUndefined();
      expect(catalog['better-auth']).toBeUndefined();
    });
  });

  describe('with db-turso', () => {
    let pkg: Record<string, unknown>;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-root-turso', { infraPackages: ['db-turso'], hasDbTurso: true }));
      pkg = JSON.parse(await gen.read('package.json'));
    });

    test('catalog includes drizzle and libsql', () => {
      const catalog = (pkg['workspaces'] as { catalog: Record<string, string> }).catalog;
      expect(catalog['@libsql/client']).toBeDefined();
      expect(catalog['drizzle-orm']).toBeDefined();
      expect(catalog['drizzle-kit']).toBeDefined();
    });
  });

  describe('with event-driven', () => {
    let pkg: Record<string, unknown>;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-root-events', { infraPackages: ['event-driven'], hasEventDriven: true }));
      pkg = JSON.parse(await gen.read('package.json'));
    });

    test('catalog includes amqplib', () => {
      const catalog = (pkg['workspaces'] as { catalog: Record<string, string> }).catalog;
      expect(catalog['amqplib']).toBeDefined();
    });
  });

  describe('with auth', () => {
    let pkg: Record<string, unknown>;
    beforeAll(async () => {
      const gen = await scaffold(makeMonorepoData('test-root-auth', { infraPackages: ['auth'], hasAuth: true, hasDb: true }));
      pkg = JSON.parse(await gen.read('package.json'));
    });

    test('catalog includes better-auth', () => {
      const catalog = (pkg['workspaces'] as { catalog: Record<string, string> }).catalog;
      expect(catalog['better-auth']).toBeDefined();
    });
  });
});

// ---------------------------------------------------------------------------
// root/.env.example
// ---------------------------------------------------------------------------
describe('root/.env.example', () => {
  test('always includes base server vars', async () => {
    const gen = await scaffold(makeMonorepoData('test-root-env-minimal'));
    const content = await gen.read('.env.example');
    expect(content).toContain('PORT=3000');
    expect(content).toContain('NODE_ENV=development');
    expect(content).toContain('CORS_ORIGIN=');
  });

  test('includes DATABASE_URL when hasDb', async () => {
    const gen = await scaffold(makeMonorepoData('test-root-env-db', { infraPackages: ['db'], hasDb: true }));
    const content = await gen.read('.env.example');
    expect(content).toContain('DATABASE_URL=');
  });

  test('does not include DATABASE_URL without hasDb', async () => {
    const gen = await scaffold(makeMonorepoData('test-root-env-nodb'));
    const content = await gen.read('.env.example');
    expect(content).not.toContain('DATABASE_URL=');
  });

  test('includes TURSO vars when hasDbTurso', async () => {
    const gen = await scaffold(makeMonorepoData('test-root-env-turso', { infraPackages: ['db-turso'], hasDbTurso: true }));
    const content = await gen.read('.env.example');
    expect(content).toContain('TURSO_DATABASE_URL=');
    expect(content).toContain('TURSO_AUTH_TOKEN=');
  });

  test('includes REDIS_URL when hasCache', async () => {
    const gen = await scaffold(makeMonorepoData('test-root-env-cache', { infraPackages: ['cache'], hasCache: true }));
    const content = await gen.read('.env.example');
    expect(content).toContain('REDIS_URL=');
  });

  test('includes RABBITMQ_URL when hasEventDriven', async () => {
    const gen = await scaffold(makeMonorepoData('test-root-env-events', { infraPackages: ['event-driven'], hasEventDriven: true }));
    const content = await gen.read('.env.example');
    expect(content).toContain('RABBITMQ_URL=');
  });

  test('includes BETTER_AUTH vars when hasAuth', async () => {
    const gen = await scaffold(makeMonorepoData('test-root-env-auth', { infraPackages: ['auth'], hasAuth: true, hasDb: true }));
    const content = await gen.read('.env.example');
    expect(content).toContain('BETTER_AUTH_SECRET=');
    expect(content).toContain('BETTER_AUTH_URL=');
  });
});

// ---------------------------------------------------------------------------
// root/docker-compose.yml
// ---------------------------------------------------------------------------
describe('root/docker-compose.yml', () => {
  test('always includes server service', async () => {
    const gen = await scaffold(makeMonorepoData('test-dc-minimal'));
    const content = await gen.read('docker-compose.yml');
    expect(content).toContain('container_name: test-dc-minimal-server');
  });

  test('no infra services without flags', async () => {
    const gen = await scaffold(makeMonorepoData('test-dc-noop'));
    const content = await gen.read('docker-compose.yml');
    expect(content).not.toContain('postgres:');
    expect(content).not.toContain('redis:');
    expect(content).not.toContain('rabbitmq:');
    expect(content).not.toContain('networks:');
  });

  test('includes postgres service when hasDb', async () => {
    const gen = await scaffold(makeMonorepoData('test-dc-db', { infraPackages: ['db'], hasDb: true }));
    const content = await gen.read('docker-compose.yml');
    expect(content).toContain('image: postgres:16-alpine');
    expect(content).toContain('postgres-data:');
    expect(content).toContain('networks:');
  });

  test('includes redis service when hasCache', async () => {
    const gen = await scaffold(makeMonorepoData('test-dc-cache', { infraPackages: ['cache'], hasCache: true }));
    const content = await gen.read('docker-compose.yml');
    expect(content).toContain('image: redis:7-alpine');
  });

  test('includes rabbitmq service when hasEventDriven', async () => {
    const gen = await scaffold(makeMonorepoData('test-dc-events', { infraPackages: ['event-driven'], hasEventDriven: true }));
    const content = await gen.read('docker-compose.yml');
    expect(content).toContain('image: rabbitmq:3.13-management-alpine');
  });

  test('server depends_on postgres when hasDb', async () => {
    const gen = await scaffold(makeMonorepoData('test-dc-depends', { infraPackages: ['db'], hasDb: true }));
    const content = await gen.read('docker-compose.yml');
    expect(content).toContain('depends_on:');
    expect(content).toContain('condition: service_healthy');
  });
});

// ---------------------------------------------------------------------------
// root/docker-compose.dev.yml
// ---------------------------------------------------------------------------
describe('root/docker-compose.dev.yml', () => {
  test('dev server uses bun run dev:server command', async () => {
    const gen = await scaffold(makeMonorepoData('test-dcd-minimal'));
    const content = await gen.read('docker-compose.dev.yml');
    expect(content).toContain('bun run dev:server');
  });

  test('dev compose mounts source volume', async () => {
    const gen = await scaffold(makeMonorepoData('test-dcd-vol'));
    const content = await gen.read('docker-compose.dev.yml');
    expect(content).toContain('- .:/app');
  });

  test('dev postgres container name has -dev suffix', async () => {
    const gen = await scaffold(makeMonorepoData('test-dcd-db', { infraPackages: ['db'], hasDb: true }));
    const content = await gen.read('docker-compose.dev.yml');
    expect(content).toContain('test-dcd-db-postgres-dev');
  });
});
