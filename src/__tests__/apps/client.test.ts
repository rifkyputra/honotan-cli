import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';
import type { Awaited } from 'bun';

// ---------------------------------------------------------------------------
// apps/client — generated only when hasClient (tanstack-router)
// ---------------------------------------------------------------------------
describe('apps/client', () => {
  describe('generated when hasClient', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-client-yes', {
        frameworks: ['hono', 'tanstack-router'],
        hasClient: true,
      }));
    });

    // Core files
    test('package.json exists', () => expect(gen.exists('apps/client/package.json')).toBe(true));
    test('tsconfig.json exists', () => expect(gen.exists('apps/client/tsconfig.json')).toBe(true));
    test('vite.config.ts exists', () => expect(gen.exists('apps/client/vite.config.ts')).toBe(true));
    test('index.html exists', () => expect(gen.exists('apps/client/index.html')).toBe(true));
    test('src/main.tsx exists', () => expect(gen.exists('apps/client/src/main.tsx')).toBe(true));
    test('.env.example exists', () => expect(gen.exists('apps/client/.env.example')).toBe(true));

    // Config files
    test('tailwind.config.js exists', () => expect(gen.exists('apps/client/tailwind.config.js')).toBe(true));
    test('postcss.config.js exists', () => expect(gen.exists('apps/client/postcss.config.js')).toBe(true));

    // Routes
    test('src/routes/__root.tsx exists', () => expect(gen.exists('apps/client/src/routes/__root.tsx')).toBe(true));
    test('src/routes/index.tsx exists', () => expect(gen.exists('apps/client/src/routes/index.tsx')).toBe(true));
    test('src/routes/about.tsx exists', () => expect(gen.exists('apps/client/src/routes/about.tsx')).toBe(true));

    // Lib files
    test('src/lib/query-client.ts exists', () => expect(gen.exists('apps/client/src/lib/query-client.ts')).toBe(true));
    test('src/lib/hello-api.ts exists', () => expect(gen.exists('apps/client/src/lib/hello-api.ts')).toBe(true));

    test('package.json includes @tanstack/react-router', async () => {
      const pkg = JSON.parse(await gen.read('apps/client/package.json'));
      expect(pkg['dependencies']?.['@tanstack/react-router']).toBeDefined();
    });

    test('package.json includes @tanstack/react-query', async () => {
      const pkg = JSON.parse(await gen.read('apps/client/package.json'));
      expect(pkg['dependencies']?.['@tanstack/react-query']).toBeDefined();
    });

    test('vite.config.ts uses vite', async () => {
      const content = await gen.read('apps/client/vite.config.ts');
      expect(content).toContain('vite');
    });

    test('.env.example includes VITE_ vars', async () => {
      const content = await gen.read('apps/client/.env.example');
      expect(content).toContain('VITE_');
    });
  });

  describe('not generated without hasClient', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-client-no'));
    });

    test('apps/client directory is not created', () => {
      expect(gen.exists('apps/client/package.json')).toBe(false);
      expect(gen.exists('apps/client/src/main.tsx')).toBe(false);
    });
  });
});
