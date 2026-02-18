import type { TemplateData } from '../../../types';

export function generateVsHonoIndexTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name } = data;

  return `import { InMemory${capitalizedName}Repository } from './${name}.in-memory.repository';
import { ${capitalizedName}Service } from './${name}.service';
import { create${capitalizedName}Routes } from './${name}.routes';

// Wiring
const ${camelCaseName}Repository = new InMemory${capitalizedName}Repository();
const ${camelCaseName}Service = new ${capitalizedName}Service(${camelCaseName}Repository);
export const ${camelCaseName}Routes = create${capitalizedName}Routes(${camelCaseName}Service);

// Re-exports
export { ${capitalizedName}Service } from './${name}.service';
export { ${capitalizedName}Handler } from './${name}.handler';
export { create${capitalizedName}Routes } from './${name}.routes';
export type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from './${name}.entity';
export type { ${capitalizedName}RepositoryPort } from './${name}.repository';
`;
}
