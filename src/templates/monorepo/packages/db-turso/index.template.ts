import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTursoIndex(data: MonorepoTemplateData): string {
  return `import { env } from "${data.scope}/env/server";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle({ client, schema });
`;
}
