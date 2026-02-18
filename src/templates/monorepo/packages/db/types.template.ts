import type { MonorepoTemplateData } from '../../../../types';

export function generateDbTypes(_data: MonorepoTemplateData): string {
  return `// Database schema types - define your tables here
export interface Database {
  // Add your table definitions here
}
`;
}
