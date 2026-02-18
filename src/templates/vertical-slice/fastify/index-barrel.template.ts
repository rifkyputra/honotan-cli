import type { TemplateData } from '../../../types';

export function generateVsFastifyIndexTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name } = data;

  return `import { InMemory${capitalizedName}Repository } from './${name}.in-memory.repository';
import { ${capitalizedName}Service } from './${name}.service';
import { create${capitalizedName}Plugin } from './${name}.plugin';

// Wiring
const ${camelCaseName}Repository = new InMemory${capitalizedName}Repository();
const ${camelCaseName}Service = new ${capitalizedName}Service(${camelCaseName}Repository);
export const ${camelCaseName}Plugin = create${capitalizedName}Plugin(${camelCaseName}Service);

// Re-exports
export { ${capitalizedName}Service } from './${name}.service';
export { create${capitalizedName}Plugin } from './${name}.plugin';
export type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from './${name}.entity';
export type { ${capitalizedName}RepositoryPort } from './${name}.repository';
`;
}
