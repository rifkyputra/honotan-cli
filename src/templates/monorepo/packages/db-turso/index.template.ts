import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTursoIndex(data: MonorepoTemplateData): string {
  return `import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "${data.scope}/env/server";
import * as schema from "./schema";

const client = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });

export * from "./schema";
`;
}
