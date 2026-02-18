import type { TemplateData } from '../../../types';

export function generateUseCasePortTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `import type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from '../../entities/${data.name}.entity';

export interface ${capitalizedName}UseCasePort {
  getAll${capitalizedName}s(): Promise<${capitalizedName}Entity[]>;
  get${capitalizedName}ById(id: string): Promise<${capitalizedName}Entity>;
  create${capitalizedName}(data: Create${capitalizedName}Data): Promise<${capitalizedName}Entity>;
  update${capitalizedName}(id: string, data: Update${capitalizedName}Data): Promise<${capitalizedName}Entity>;
  delete${capitalizedName}(id: string): Promise<void>;
}
`;
}
