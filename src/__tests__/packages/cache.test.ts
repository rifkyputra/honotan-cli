import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';

describe('packages/cache', () => {
  describe('generated when hasCache', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-cache', { infraPackages: ['cache'], hasCache: true }));
    });

    test('package.json exists', () => expect(gen.exists('packages/cache/package.json')).toBe(true));
    test('tsconfig.json exists', () => expect(gen.exists('packages/cache/tsconfig.json')).toBe(true));
    test('src/index.ts exists', () => expect(gen.exists('packages/cache/src/index.ts')).toBe(true));
    test('src/types.ts exists', () => expect(gen.exists('packages/cache/src/types.ts')).toBe(true));

    test('package name uses scope', async () => {
      const pkg = JSON.parse(await gen.read('packages/cache/package.json'));
      expect(pkg.name).toBe('@test-pkg-cache/cache');
    });

    test('index exports createCache factory', async () => {
      const content = await gen.read('packages/cache/src/index.ts');
      expect(content).toContain('createCache');
    });

    test('index implements set/get/del operations', async () => {
      const content = await gen.read('packages/cache/src/index.ts');
      expect(content).toContain('set');
      expect(content).toContain('get');
      expect(content).toContain('del');
    });

    test('types defines CacheClient interface', async () => {
      const content = await gen.read('packages/cache/src/types.ts');
      expect(content).toContain('CacheClient');
    });
  });

  describe('not generated without hasCache', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-nocache'));
    });

    test('package.json does not exist', () => expect(gen.exists('packages/cache/package.json')).toBe(false));
    test('src/index.ts does not exist', () => expect(gen.exists('packages/cache/src/index.ts')).toBe(false));
  });
});
