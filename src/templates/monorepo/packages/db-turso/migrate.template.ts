import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTursoMigrate(data: MonorepoTemplateData): string {
  return `import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { env } from "${data.scope}/env/server";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

const db = drizzle({ client });

await migrate(db, { migrationsFolder: "./drizzle" });

console.log("Migrations applied successfully");
client.close();
`;
}
