import type { TemplateData } from '../../../types';

export function generateVsEntityTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `export interface ${capitalizedName}Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // Add your domain-specific properties here
}

export type Create${capitalizedName}Data = Omit<${capitalizedName}Entity, 'id' | 'createdAt' | 'updatedAt'>;
export type Update${capitalizedName}Data = Partial<Create${capitalizedName}Data>;
`;
}
