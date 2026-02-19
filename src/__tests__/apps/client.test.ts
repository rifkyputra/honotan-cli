import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';

// ---------------------------------------------------------------------------
// apps/web — generated only when hasClient (tanstack-router)
// ---------------------------------------------------------------------------
describe('apps/web', () => {
  describe('generated when hasClient', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-web-yes', {
        frameworks: ['hono', 'tanstack-router'],
        hasClient: true,
      }));
    });

    // Core files
    test('package.json exists', () => expect(gen.exists('apps/web/package.json')).toBe(true));
    test('tsconfig.json exists', () => expect(gen.exists('apps/web/tsconfig.json')).toBe(true));
    test('vite.config.ts exists', () => expect(gen.exists('apps/web/vite.config.ts')).toBe(true));
    test('index.html exists', () => expect(gen.exists('apps/web/index.html')).toBe(true));
    test('src/main.tsx exists', () => expect(gen.exists('apps/web/src/main.tsx')).toBe(true));
    test('src/index.css exists', () => expect(gen.exists('apps/web/src/index.css')).toBe(true));

    // Routes
    test('src/routes/__root.tsx exists', () => expect(gen.exists('apps/web/src/routes/__root.tsx')).toBe(true));
    test('src/routes/index.tsx exists', () => expect(gen.exists('apps/web/src/routes/index.tsx')).toBe(true));

    // Components
    test('src/components/header.tsx exists', () => expect(gen.exists('apps/web/src/components/header.tsx')).toBe(true));
    test('src/components/theme-provider.tsx exists', () => expect(gen.exists('apps/web/src/components/theme-provider.tsx')).toBe(true));
    test('src/components/ui/button.tsx exists', () => expect(gen.exists('apps/web/src/components/ui/button.tsx')).toBe(true));

    // Lib
    test('src/lib/utils.ts exists', () => expect(gen.exists('apps/web/src/lib/utils.ts')).toBe(true));

    test('package.json includes @tanstack/react-router', async () => {
      const pkg = JSON.parse(await gen.read('apps/web/package.json'));
      expect(pkg['dependencies']?.['@tanstack/react-router']).toBeDefined();
    });

    test('vite.config.ts uses vite', async () => {
      const content = await gen.read('apps/web/vite.config.ts');
      expect(content).toContain('vite');
    });

    test('vite.config.ts does NOT include VitePWA without hasPwa', async () => {
      const content = await gen.read('apps/web/vite.config.ts');
      expect(content).not.toContain('VitePWA');
    });
  });

  describe('not generated without hasClient', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-web-no'));
    });

    test('apps/web directory is not created', () => {
      expect(gen.exists('apps/web/package.json')).toBe(false);
      expect(gen.exists('apps/web/src/main.tsx')).toBe(false);
    });
  });

  describe('PWA support when hasPwa', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-web-pwa', {
        frameworks: ['hono', 'tanstack-router'],
        infraPackages: ['pwa'],
        hasClient: true,
        hasPwa: true,
      }));
    });

    test('vite.config.ts includes VitePWA import', async () => {
      const content = await gen.read('apps/web/vite.config.ts');
      expect(content).toContain('vite-plugin-pwa');
    });

    test('vite.config.ts includes VitePWA plugin config', async () => {
      const content = await gen.read('apps/web/vite.config.ts');
      expect(content).toContain('VitePWA(');
      expect(content).toContain('registerType');
      expect(content).toContain('test-web-pwa');
    });

    test('package.json includes vite-plugin-pwa', async () => {
      const pkg = JSON.parse(await gen.read('apps/web/package.json'));
      expect(pkg['dependencies']?.['vite-plugin-pwa']).toBeDefined();
    });

    test('package.json includes @vite-pwa/assets-generator in devDependencies', async () => {
      const pkg = JSON.parse(await gen.read('apps/web/package.json'));
      expect(pkg['devDependencies']?.['@vite-pwa/assets-generator']).toBeDefined();
    });

    test('package.json includes generate-pwa-assets script', async () => {
      const pkg = JSON.parse(await gen.read('apps/web/package.json'));
      expect(pkg['scripts']?.['generate-pwa-assets']).toBe('pwa-assets-generator');
    });
  });

  describe('auth-aware components when hasAuth', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-web-auth', {
        frameworks: ['hono', 'tanstack-router'],
        infraPackages: ['auth'],
        hasClient: true,
        hasAuth: true,
        hasDb: true,
      }));
    });

    test('src/lib/auth-client.ts exists', () => expect(gen.exists('apps/web/src/lib/auth-client.ts')).toBe(true));
    test('src/components/user-menu.tsx exists', () => expect(gen.exists('apps/web/src/components/user-menu.tsx')).toBe(true));

    test('package.json includes better-auth', async () => {
      const pkg = JSON.parse(await gen.read('apps/web/package.json'));
      expect(pkg['dependencies']?.['better-auth']).toBeDefined();
    });
  });
});
