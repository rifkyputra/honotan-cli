import type { MonorepoTemplateData } from '../../../../types';

export function generateEnvClient(data: MonorepoTemplateData): string {
  const clientVars: string[] = [
    `    VITE_API_URL: z.string().url(),`,
  ];

  if (data.hasAuth) {
    clientVars.push(`    VITE_AUTH_URL: z.string().url(),`);
  }

  return `import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
${clientVars.join('\n')}
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
`;
}
