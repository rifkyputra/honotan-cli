import type { MonorepoTemplateData } from '../../../../types';

export function generateDbIndex(_data: MonorepoTemplateData): string {
  return `import type { Database } from "./types";

// Bun's built-in Postgres client.
// Connection is configured via DATABASE_URL env variable.
// Bun automatically loads .env.
export const sql = Bun.sql;

export type { Database } from "./types";
`;
}
