import type { MonorepoTemplateData } from '../../../../types';

export function generateAuthIndex(data: MonorepoTemplateData): string {
  return `import { betterAuth } from "better-auth";
import { env } from "${data.scope}/env/server";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: {
    type: "postgres",
    url: env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
  },
});

export type { Session, User } from "./types";
`;
}
