import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTursoDrizzleConfig(_data: MonorepoTemplateData): string {
  return `import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
`;
}
