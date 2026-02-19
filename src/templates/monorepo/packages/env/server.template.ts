import type { MonorepoTemplateData } from '../../../../types';

export function generateEnvServer(data: MonorepoTemplateData): string {
  const envVars: string[] = [
    `    PORT: z.string().default("3000"),`,
    `    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),`,
    `    CORS_ORIGIN: z.string().url(),`,
  ];

  if (data.hasDb && !data.hasDbTurso) {
    envVars.push(`    DATABASE_URL: z.string().url(),`);
  }

  if (data.hasDbTurso) {
    envVars.push(`    DATABASE_URL: z.string().url(),`);
    envVars.push(`    DATABASE_AUTH_TOKEN: z.string().optional(),`);
  }

  if (data.hasCache) {
    envVars.push(`    REDIS_URL: z.string().url(),`);
  }

  if (data.hasEventDriven) {
    envVars.push(`    RABBITMQ_URL: z.string().url(),`);
  }

  if (data.hasAuth) {
    envVars.push(`    BETTER_AUTH_SECRET: z.string().min(32),`);
    envVars.push(`    BETTER_AUTH_URL: z.string().url(),`);
  }

  if (data.hasS3) {
    envVars.push(`    S3_ENDPOINT: z.string().url(),`);
    envVars.push(`    S3_ACCESS_KEY_ID: z.string(),`);
    envVars.push(`    S3_SECRET_ACCESS_KEY: z.string(),`);
    envVars.push(`    S3_BUCKET: z.string(),`);
  }

  return `import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
${envVars.join('\n')}
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
`;
}
