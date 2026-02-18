import type { TemplateData } from '../../../types';

export function generateVsRepositoryPortTemplate(data: TemplateData): string {
  const { capitalizedName, name } = data;

  return `import type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from './${name}.entity';

export interface ${capitalizedName}RepositoryPort {
  findAll(): Promise<${capitalizedName}Entity[]>;
  findById(id: string): Promise<${capitalizedName}Entity | null>;
  create(data: Create${capitalizedName}Data): Promise<${capitalizedName}Entity>;
  update(id: string, data: Update${capitalizedName}Data): Promise<${capitalizedName}Entity | null>;
  delete(id: string): Promise<boolean>;
}
`;
}
