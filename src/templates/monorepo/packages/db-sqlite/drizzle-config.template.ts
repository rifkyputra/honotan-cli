import type { MonorepoTemplateData } from '../../../../types';

export function generateDbSqliteDrizzleConfig(_data: MonorepoTemplateData): string {
  return `import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), "../../apps/server/.env"), override: false });

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
`;
}
