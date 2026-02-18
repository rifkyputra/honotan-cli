import type { MonorepoTemplateData } from '../../../../types';

export function generateCacheIndex(_data: MonorepoTemplateData): string {
  return `import type { CacheClient } from "./types";

export function createCache(url: string): CacheClient {
  const redis = new Bun.RedisClient(url);

  return {
    async set<T = unknown>(key: string, value: T, ttl?: number): Promise<void> {
      const serialized = JSON.stringify(value);
      if (ttl !== undefined && ttl > 0) {
        await redis.set(key, serialized, "EX", ttl);
      } else {
        await redis.set(key, serialized);
      }
    },

    async get<T = unknown>(key: string): Promise<T | null> {
      const value = await redis.get(key);
      if (value === null) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    },

    async del(key: string): Promise<void> {
      await redis.del(key);
    },

    async exists(key: string): Promise<boolean> {
      return (await redis.exists(key)) === 1;
    },

    async expire(key: string, ttl: number): Promise<void> {
      await redis.expire(key, ttl);
    },

    async disconnect(): Promise<void> {
      redis.close();
    },
  };
}

export type { CacheClient } from "./types";
`;
}
