import type { MonorepoTemplateData } from '../../../../types';

export function generateAuthTypes(_data: MonorepoTemplateData): string {
  return `import type { auth } from "./index";

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
`;
}
