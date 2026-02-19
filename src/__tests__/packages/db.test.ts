import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';

// ---------------------------------------------------------------------------
// packages/db  (standard postgres via Bun.sql)
// ---------------------------------------------------------------------------
describe('packages/db (standard)', () => {
  describe('generated when hasDb', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-db', { infraPackages: ['db'], hasDb: true }));
    });

    test('package.json exists', () => expect(gen.exists('packages/db/package.json')).toBe(true));
    test('tsconfig.json exists', () => expect(gen.exists('packages/db/tsconfig.json')).toBe(true));
    test('src/index.ts exists', () => expect(gen.exists('packages/db/src/index.ts')).toBe(true));
    test('src/types.ts exists', () => expect(gen.exists('packages/db/src/types.ts')).toBe(true));

    test('package name uses scope', async () => {
      const pkg = JSON.parse(await gen.read('packages/db/package.json'));
      expect(pkg.name).toBe('@test-pkg-db/db');
    });

    test('index.ts exports db connection', async () => {
      const content = await gen.read('packages/db/src/index.ts');
      expect(content).toContain('Bun.sql');
    });
  });

  describe('not generated without hasDb', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-nodb'));
    });

    test('package.json does not exist', () => expect(gen.exists('packages/db/package.json')).toBe(false));
    test('src/index.ts does not exist', () => expect(gen.exists('packages/db/src/index.ts')).toBe(false));
  });
});

// ---------------------------------------------------------------------------
// packages/db  (turso / drizzle)
// ---------------------------------------------------------------------------
describe('packages/db (turso)', () => {
  let gen: Awaited<ReturnType<typeof scaffold>>;
  beforeAll(async () => {
    gen = await scaffold(makeMonorepoData('test-pkg-turso', { infraPackages: ['db-turso'], hasDbTurso: true }));
  });

  test('package.json exists', () => expect(gen.exists('packages/db/package.json')).toBe(true));
  test('drizzle.config.ts exists', () => expect(gen.exists('packages/db/drizzle.config.ts')).toBe(true));
  test('src/index.ts exists', () => expect(gen.exists('packages/db/src/index.ts')).toBe(true));
  test('src/schema.ts exists', () => expect(gen.exists('packages/db/src/schema.ts')).toBe(true));
  test('src/migrate.ts exists', () => expect(gen.exists('packages/db/src/migrate.ts')).toBe(true));

  test('index uses drizzle + libsql', async () => {
    const content = await gen.read('packages/db/src/index.ts');
    expect(content).toContain('drizzle');
    expect(content).toContain('libsql');
  });

  test('schema uses drizzle-orm/sqlite-core', async () => {
    const content = await gen.read('packages/db/src/schema.ts');
    expect(content).toContain('drizzle-orm/sqlite-core');
  });
});
