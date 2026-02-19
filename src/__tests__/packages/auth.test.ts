import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';

describe('packages/auth', () => {
  describe('generated when hasAuth', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-auth', { infraPackages: ['auth'], hasAuth: true, hasDb: true }));
    });

    test('package.json exists', () => expect(gen.exists('packages/auth/package.json')).toBe(true));
    test('tsconfig.json exists', () => expect(gen.exists('packages/auth/tsconfig.json')).toBe(true));
    test('src/index.ts exists', () => expect(gen.exists('packages/auth/src/index.ts')).toBe(true));
    test('src/types.ts exists', () => expect(gen.exists('packages/auth/src/types.ts')).toBe(true));

    test('package name uses scope', async () => {
      const pkg = JSON.parse(await gen.read('packages/auth/package.json'));
      expect(pkg.name).toBe('@test-pkg-auth/auth');
    });

    test('index uses better-auth', async () => {
      const content = await gen.read('packages/auth/src/index.ts');
      expect(content).toContain('better-auth');
      expect(content).toContain('betterAuth');
    });

    test('index exports auth instance', async () => {
      const content = await gen.read('packages/auth/src/index.ts');
      expect(content).toContain('export');
      expect(content).toContain('auth');
    });

    test('types defines session/user types', async () => {
      const content = await gen.read('packages/auth/src/types.ts');
      // should reference session or user
      expect(content.toLowerCase()).toMatch(/session|user/);
    });

    // hasAuth implicitly sets hasDb, so packages/db must also be generated
    test('packages/db is also generated (auth requires db)', () => {
      expect(gen.exists('packages/db/package.json')).toBe(true);
    });
  });

  describe('not generated without hasAuth', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-noauth'));
    });

    test('package.json does not exist', () => expect(gen.exists('packages/auth/package.json')).toBe(false));
    test('src/index.ts does not exist', () => expect(gen.exists('packages/auth/src/index.ts')).toBe(false));
  });
});
