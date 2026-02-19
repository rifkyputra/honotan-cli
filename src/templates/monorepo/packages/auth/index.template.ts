import type { MonorepoTemplateData } from '../../../../types';

export function generateAuthIndex(data: MonorepoTemplateData): string {
  if (data.hasDbTurso) {
    return generateTursoAuthIndex(data);
  }
  return generatePostgresAuthIndex(data);
}

function generateTursoAuthIndex(data: MonorepoTemplateData): string {
  return `import { db } from "${data.scope}/db";
import * as schema from "${data.scope}/db/schema";
import { env } from "${data.scope}/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [],
});

export type { Session, User } from "./types";
`;
}

function generatePostgresAuthIndex(data: MonorepoTemplateData): string {
  return `import { betterAuth } from "better-auth";
import { env } from "${data.scope}/env/server";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: {
    type: "postgres",
    url: env.DATABASE_URL,
  },
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [],
});

export type { Session, User } from "./types";
`;
}
