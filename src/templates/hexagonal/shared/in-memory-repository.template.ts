import type { TemplateData } from '../../../types';

export function generateInMemoryRepositoryTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName } = data;

  return `import type { ${capitalizedName}RepositoryPort } from '../../../domain/ports/out/${data.name}.repository.port';
import type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from '../../../domain/entities/${data.name}.entity';

export class InMemory${capitalizedName}Repository implements ${capitalizedName}RepositoryPort {
  private ${pluralName}: Map<string, ${capitalizedName}Entity> = new Map();
  private idCounter = 0;

  async findAll(): Promise<${capitalizedName}Entity[]> {
    return Array.from(this.${pluralName}.values());
  }

  async findById(id: string): Promise<${capitalizedName}Entity | null> {
    return this.${pluralName}.get(id) ?? null;
  }

  async create(data: Create${capitalizedName}Data): Promise<${capitalizedName}Entity> {
    const ${camelCaseName}: ${capitalizedName}Entity = {
      ...data,
      id: String(++this.idCounter),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.${pluralName}.set(${camelCaseName}.id, ${camelCaseName});
    return ${camelCaseName};
  }

  async update(id: string, data: Update${capitalizedName}Data): Promise<${capitalizedName}Entity | null> {
    const ${camelCaseName} = await this.findById(id);
    if (!${camelCaseName}) return null;

    const updated${capitalizedName}: ${capitalizedName}Entity = {
      ...${camelCaseName},
      ...data,
      updatedAt: new Date(),
    };
    this.${pluralName}.set(id, updated${capitalizedName});
    return updated${capitalizedName};
  }

  async delete(id: string): Promise<boolean> {
    return this.${pluralName}.delete(id);
  }
}
`;
}
