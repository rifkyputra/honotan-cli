import type { MonorepoTemplateData } from '../../../../types';

export function generateCacheTypes(_data: MonorepoTemplateData): string {
  return `export interface CacheClient {
  set<T = unknown>(key: string, value: T, ttl?: number): Promise<void>;
  get<T = unknown>(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  expire(key: string, ttl: number): Promise<void>;
  disconnect(): Promise<void>;
}
`;
}
