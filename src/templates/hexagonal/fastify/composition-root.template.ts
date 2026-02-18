import type { TemplateData } from '../../../types';

export function generateFastifyCompositionRootTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, outboundAdapters, inboundAdapters } = data;
  const hasDatabase = outboundAdapters.includes('database');
  const hasInMemory = outboundAdapters.includes('in-memory');
  const hasCache = outboundAdapters.includes('cache');
  const hasHttp = inboundAdapters.includes('http');
  const hasWebSocket = inboundAdapters.includes('websocket');

  const imports: string[] = [];
  const wiringLines: string[] = [];

  imports.push(`import type { FastifyInstance } from 'fastify';`);
  imports.push(`import { ${capitalizedName}UseCases } from './application/use-cases/${data.name}.use-case';`);

  if (hasDatabase) {
    imports.push(`import { Database${capitalizedName}Repository } from './adapters/out/persistence/database-${data.name}.repository';`);
  }
  if (hasInMemory && !hasDatabase) {
    imports.push(`import { InMemory${capitalizedName}Repository } from './adapters/out/persistence/in-memory-${data.name}.repository';`);
  }
  if (!hasDatabase && !hasInMemory) {
    imports.push(`import { InMemory${capitalizedName}Repository } from './adapters/out/persistence/in-memory-${data.name}.repository';`);
  }
  if (hasCache) {
    imports.push(`import { Cached${capitalizedName}Repository } from './adapters/out/cache/cache-${data.name}.repository';`);
  }

  if (hasHttp) {
    imports.push(`import { create${capitalizedName}Routes } from './adapters/in/http/${data.name}.routes';`);
  }
  if (hasWebSocket) {
    imports.push(`import { create${capitalizedName}WsConfig } from './adapters/in/websocket/${data.name}.ws-routes';`);
  }

  const baseRepoClass = hasDatabase
    ? `Database${capitalizedName}Repository`
    : `InMemory${capitalizedName}Repository`;

  wiringLines.push(`const baseRepository = new ${baseRepoClass}();`);

  if (hasCache) {
    wiringLines.push(`const redis = new Bun.RedisClient();`);
    wiringLines.push(`const repository = new Cached${capitalizedName}Repository(baseRepository, redis);`);
  } else {
    wiringLines.push(`const repository = baseRepository;`);
  }

  wiringLines.push(`const ${camelCaseName}UseCases = new ${capitalizedName}UseCases(repository);`);

  if (hasHttp) {
    wiringLines.push(`export const ${camelCaseName}Plugin = create${capitalizedName}Routes(${camelCaseName}UseCases);`);
  }
  if (hasWebSocket) {
    wiringLines.push(`export const ${camelCaseName}WsConfig = create${capitalizedName}WsConfig(${camelCaseName}UseCases);`);
  }

  return `${imports.join('\n')}\n\n// Outbound adapters\n${wiringLines.join('\n')}\n`;
}
