import type { TemplateData } from '../../../types';

export function generateVsHonoServiceTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name } = data;

  return `import type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from './${name}.entity';
import type { ${capitalizedName}RepositoryPort } from './${name}.repository';

export class ${capitalizedName}Service {
  constructor(private readonly ${camelCaseName}Repository: ${capitalizedName}RepositoryPort) {}

  async getAll${capitalizedName}s(): Promise<${capitalizedName}Entity[]> {
    return await this.${camelCaseName}Repository.findAll();
  }

  async get${capitalizedName}ById(id: string): Promise<${capitalizedName}Entity> {
    const ${camelCaseName} = await this.${camelCaseName}Repository.findById(id);
    if (!${camelCaseName}) {
      throw new Error(\`${capitalizedName} with id \${id} not found\`);
    }
    return ${camelCaseName};
  }

  async create${capitalizedName}(data: Create${capitalizedName}Data): Promise<${capitalizedName}Entity> {
    return await this.${camelCaseName}Repository.create(data);
  }

  async update${capitalizedName}(id: string, data: Update${capitalizedName}Data): Promise<${capitalizedName}Entity> {
    const updated${capitalizedName} = await this.${camelCaseName}Repository.update(id, data);
    if (!updated${capitalizedName}) {
      throw new Error(\`${capitalizedName} with id \${id} not found\`);
    }
    return updated${capitalizedName};
  }

  async delete${capitalizedName}(id: string): Promise<void> {
    const deleted = await this.${camelCaseName}Repository.delete(id);
    if (!deleted) {
      throw new Error(\`${capitalizedName} with id \${id} not found\`);
    }
  }
}
`;
}
