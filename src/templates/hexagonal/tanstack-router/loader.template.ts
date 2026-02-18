import type { TemplateData } from '../../../types';

export function generateTanStackLoaderTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${name}.use-case.port';

export interface ${capitalizedName}LoaderContext {
  ${camelCaseName}UseCases: ${capitalizedName}UseCasePort;
}

export async function load${capitalizedName}Data(context: ${capitalizedName}LoaderContext) {
  try {
    const ${pluralName} = await context.${camelCaseName}UseCases.getAll${capitalizedName}s();
    return { ${pluralName} };
  } catch (error) {
    console.error('Failed to load ${pluralName}:', error);
    throw new Error('Failed to load ${pluralName}');
  }
}

export async function load${capitalizedName}ById(id: string, context: ${capitalizedName}LoaderContext) {
  try {
    const ${camelCaseName} = await context.${camelCaseName}UseCases.get${capitalizedName}ById(id);
    return { ${camelCaseName} };
  } catch (error) {
    console.error(\`Failed to load ${name} \${id}:\`, error);
    throw new Error(\`Failed to load ${name}\`);
  }
}
`;
}
