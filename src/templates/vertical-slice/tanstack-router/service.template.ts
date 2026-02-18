import type { TemplateData } from '../../../types';

export function generateVsTanStackServiceTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import type { ${capitalizedName} } from './${name}.entity';
import { ${capitalizedName}Repository } from './${name}.repository';

// Initialize repository (in a real app, use dependency injection)
const repository = new ${capitalizedName}Repository();

export async function load${capitalizedName}Data() {
  try {
    const ${pluralName} = await repository.findAll();
    return { ${pluralName} };
  } catch (error) {
    console.error('Failed to load ${pluralName}:', error);
    throw new Error('Failed to load ${pluralName}');
  }
}

export async function load${capitalizedName}ById(id: string) {
  try {
    const ${camelCaseName} = await repository.findById(id);
    if (!${camelCaseName}) {
      throw new Error('${capitalizedName} not found');
    }
    return { ${camelCaseName} };
  } catch (error) {
    console.error(\`Failed to load ${name} \${id}:\`, error);
    throw error;
  }
}

export async function create${capitalizedName}(data: Omit<${capitalizedName}, 'id'>): Promise<${capitalizedName}> {
  try {
    const ${camelCaseName} = await repository.create(data);
    return ${camelCaseName};
  } catch (error) {
    console.error('Failed to create ${name}:', error);
    throw new Error('Failed to create ${name}');
  }
}

export async function update${capitalizedName}(id: string, data: Partial<${capitalizedName}>): Promise<${capitalizedName}> {
  try {
    const ${camelCaseName} = await repository.update(id, data);
    if (!${camelCaseName}) {
      throw new Error('${capitalizedName} not found');
    }
    return ${camelCaseName};
  } catch (error) {
    console.error(\`Failed to update ${name} \${id}:\`, error);
    throw error;
  }
}

export async function delete${capitalizedName}(id: string): Promise<void> {
  try {
    const deleted = await repository.delete(id);
    if (!deleted) {
      throw new Error('${capitalizedName} not found');
    }
  } catch (error) {
    console.error(\`Failed to delete ${name} \${id}:\`, error);
    throw error;
  }
}
`;
}
