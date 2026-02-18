import type { TemplateData } from '../../../types';

export function generateTanStackCompositionRootTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name } = data;

  return `import { Route } from './${name}.route';
import { ${capitalizedName}UseCase } from '../../application/use-cases/${name}.use-case';
import type { ${capitalizedName}UseCasePort } from '../../domain/ports/in/${name}.use-case.port';
${data.outboundAdapters.includes('in-memory') ? `import { InMemory${capitalizedName}Repository } from '../../adapters/out/persistence/in-memory-${name}.repository';` : ''}
${data.outboundAdapters.includes('database') ? `import { Database${capitalizedName}Repository } from '../../adapters/out/persistence/database-${name}.repository';` : ''}
${data.outboundAdapters.includes('cache') ? `import { Cache${capitalizedName}Repository } from '../../adapters/out/cache/cache-${name}.repository';` : ''}

export function create${capitalizedName}RouterContext() {
  // Initialize repository
  const ${camelCaseName}Repository = ${data.outboundAdapters.includes('database')
      ? `new Database${capitalizedName}Repository();`
      : data.outboundAdapters.includes('cache')
        ? `new Cache${capitalizedName}Repository();`
        : `new InMemory${capitalizedName}Repository();`
    }

  // Initialize use case
  const ${camelCaseName}UseCases: ${capitalizedName}UseCasePort = new ${capitalizedName}UseCase(${camelCaseName}Repository);

  // Return context for route loader
  return {
    ${camelCaseName}UseCases,
  };
}
`;
}
