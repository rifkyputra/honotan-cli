import type { MonorepoTemplateData } from "../../../../types";

export function generateLibAuthClientTs(data: MonorepoTemplateData): string {
  const { scope } = data;
  return `import { env } from "${scope}/env/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.VITE_API_URL,
});
`;
}
