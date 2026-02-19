import { describe, test, expect, beforeAll } from 'bun:test';
import { makeMonorepoData, scaffold } from '../fixtures';

describe('packages/event-driven', () => {
  describe('generated when hasEventDriven', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-events', { infraPackages: ['event-driven'], hasEventDriven: true }));
    });

    test('package.json exists', () => expect(gen.exists('packages/event-driven/package.json')).toBe(true));
    test('tsconfig.json exists', () => expect(gen.exists('packages/event-driven/tsconfig.json')).toBe(true));
    test('src/index.ts exists', () => expect(gen.exists('packages/event-driven/src/index.ts')).toBe(true));
    test('src/types.ts exists', () => expect(gen.exists('packages/event-driven/src/types.ts')).toBe(true));
    test('src/rabbitmq.ts exists', () => expect(gen.exists('packages/event-driven/src/rabbitmq.ts')).toBe(true));

    test('package name uses scope', async () => {
      const pkg = JSON.parse(await gen.read('packages/event-driven/package.json'));
      expect(pkg.name).toBe('@test-pkg-events/event-driven');
    });

    test('rabbitmq.ts implements publish and consume', async () => {
      const content = await gen.read('packages/event-driven/src/rabbitmq.ts');
      expect(content).toContain('publish');
      expect(content).toContain('consume');
    });

    test('rabbitmq.ts uses amqplib', async () => {
      const content = await gen.read('packages/event-driven/src/rabbitmq.ts');
      expect(content).toContain('amqplib');
    });

    test('rabbitmq.ts handles reconnect', async () => {
      const content = await gen.read('packages/event-driven/src/rabbitmq.ts');
      expect(content).toContain('connect');
    });
  });

  describe('not generated without hasEventDriven', () => {
    let gen: Awaited<ReturnType<typeof scaffold>>;
    beforeAll(async () => {
      gen = await scaffold(makeMonorepoData('test-pkg-noevents'));
    });

    test('package.json does not exist', () => expect(gen.exists('packages/event-driven/package.json')).toBe(false));
    test('src/rabbitmq.ts does not exist', () => expect(gen.exists('packages/event-driven/src/rabbitmq.ts')).toBe(false));
  });
});
