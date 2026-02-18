import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { capitalize, toCamelCase, toPlural, toKebabCase } from '../utils/string-utils';
import { writeFile } from '../utils/file-utils';
import type {
  TemplateData,
  FileToGenerate,
  ExistingResourceInfo,
  ArchitecturePattern,
  Framework,
  InboundAdapter,
  OutboundAdapter,
} from '../types';

// Hexagonal shared templates
import * as hexShared from '../templates/hexagonal/shared/index';
// Hexagonal framework-specific templates
import * as hexHono from '../templates/hexagonal/hono/index';
import * as hexExpress from '../templates/hexagonal/express/index';
import * as hexFastify from '../templates/hexagonal/fastify/index';
import * as hexTanStack from '../templates/hexagonal/tanstack-router/index';
// Vertical slice shared templates
import * as vsShared from '../templates/vertical-slice/shared/index';
// Vertical slice framework-specific templates
import * as vsHono from '../templates/vertical-slice/hono/index';
import * as vsExpress from '../templates/vertical-slice/express/index';
import * as vsFastify from '../templates/vertical-slice/fastify/index';
import * as vsTanStack from '../templates/vertical-slice/tanstack-router/index';

interface TemplateRegistry {
  collectDomainFiles(resourcePath: string, data: TemplateData): FileToGenerate[];
  collectApplicationFiles(resourcePath: string, data: TemplateData): FileToGenerate[];
  collectInboundFiles(resourcePath: string, data: TemplateData): FileToGenerate[];
  collectOutboundFiles(resourcePath: string, data: TemplateData): FileToGenerate[];
  collectRootFile(resourcePath: string, data: TemplateData): FileToGenerate;
}

// --- Hexagonal registries ---

function buildHexagonalRegistry(
  shared: typeof hexShared,
  fw: typeof hexHono | typeof hexExpress | typeof hexFastify | typeof hexTanStack,
  frameworkName: Framework,
): TemplateRegistry {
  return {
    collectDomainFiles(resourcePath, data) {
      return [
        {
          path: path.join(resourcePath, 'domain', 'entities', `${data.name}.entity.ts`),
          content: shared.generateEntityTemplate(data),
          layer: 'Domain Entity',
        },
        {
          path: path.join(resourcePath, 'domain', 'ports', 'in', `${data.name}.use-case.port.ts`),
          content: shared.generateUseCasePortTemplate(data),
          layer: 'Driving Port (Use Case)',
        },
        {
          path: path.join(resourcePath, 'domain', 'ports', 'out', `${data.name}.repository.port.ts`),
          content: shared.generateRepositoryPortTemplate(data),
          layer: 'Driven Port (Repository)',
        },
      ];
    },

    collectApplicationFiles(resourcePath, data) {
      return [
        {
          path: path.join(resourcePath, 'application', 'use-cases', `${data.name}.use-case.ts`),
          content: shared.generateUseCaseTemplate(data),
          layer: 'Use Case',
        },
        {
          path: path.join(resourcePath, 'application', 'use-cases', `${data.name}.use-case.test.ts`),
          content: shared.generateUseCaseTestTemplate(data),
          layer: 'Use Case Test',
        },
      ];
    },

    collectOutboundFiles(resourcePath, data) {
      const files: FileToGenerate[] = [];
      if (data.outboundAdapters.includes('in-memory')) {
        files.push({
          path: path.join(resourcePath, 'adapters', 'out', 'persistence', `in-memory-${data.name}.repository.ts`),
          content: shared.generateInMemoryRepositoryTemplate(data),
          layer: 'In-Memory Repository',
        });
      }
      if (data.outboundAdapters.includes('database')) {
        files.push({
          path: path.join(resourcePath, 'adapters', 'out', 'persistence', `database-${data.name}.repository.ts`),
          content: shared.generateDatabaseRepositoryTemplate(data),
          layer: 'Database Repository',
        });
      }
      if (data.outboundAdapters.includes('cache')) {
        files.push({
          path: path.join(resourcePath, 'adapters', 'out', 'cache', `cache-${data.name}.repository.ts`),
          content: shared.generateCacheRepositoryTemplate(data),
          layer: 'Cache Repository',
        });
      }
      return files;
    },

    collectInboundFiles(resourcePath, data) {
      const files: FileToGenerate[] = [];

      if (frameworkName === 'tanstack-router') {
        // TanStack Router uses routes instead of http adapters
        const t = fw as typeof hexTanStack;
        files.push(
          { path: path.join(resourcePath, 'adapters', 'in', 'routes', `${data.name}.validation.ts`), content: t.generateTanStackValidationTemplate(data), layer: 'Route Validation' },
          { path: path.join(resourcePath, 'adapters', 'in', 'routes', `${data.name}.loader.ts`), content: t.generateTanStackLoaderTemplate(data), layer: 'Route Loader' },
          { path: path.join(resourcePath, 'adapters', 'in', 'routes', `${data.name}.component.ts`), content: t.generateTanStackComponentTemplate(data), layer: 'Route Component' },
          { path: path.join(resourcePath, 'adapters', 'in', 'routes', `${data.name}.route.ts`), content: t.generateTanStackRouteTemplate(data), layer: 'Route Definition' },
          { path: path.join(resourcePath, 'adapters', 'in', 'routes', `${data.name}.detail-route.ts`), content: t.generateTanStackDetailRouteTemplate(data), layer: 'Detail Route' },
          { path: path.join(resourcePath, 'adapters', 'in', 'routes', `${data.name}.detail-component.ts`), content: t.generateTanStackDetailComponentTemplate(data), layer: 'Detail Component' },
        );
      } else if (data.inboundAdapters.includes('http')) {
        if (frameworkName === 'hono') {
          const h = fw as typeof hexHono;
          files.push(
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.validation.ts`), content: h.generateHonoValidationTemplate(data), layer: 'HTTP Validation' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.controller.ts`), content: h.generateHonoControllerTemplate(data), layer: 'HTTP Controller' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.routes.ts`), content: h.generateHonoRoutesTemplate(data), layer: 'HTTP Routes' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.routes.test.ts`), content: h.generateHonoRoutesTestTemplate(data), layer: 'HTTP Routes Test' },
          );
        } else if (frameworkName === 'express') {
          const e = fw as typeof hexExpress;
          files.push(
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.validation.ts`), content: e.generateExpressValidationTemplate(data), layer: 'HTTP Validation' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.controller.ts`), content: e.generateExpressControllerTemplate(data), layer: 'HTTP Controller' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.routes.ts`), content: e.generateExpressRoutesTemplate(data), layer: 'HTTP Routes' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.routes.test.ts`), content: e.generateExpressRoutesTestTemplate(data), layer: 'HTTP Routes Test' },
          );
        } else {
          const f = fw as typeof hexFastify;
          files.push(
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.validation.ts`), content: f.generateFastifyValidationTemplate(data), layer: 'HTTP Validation' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.handler.ts`), content: f.generateFastifyHandlerTemplate(data), layer: 'HTTP Handler' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.routes.ts`), content: f.generateFastifyRoutesTemplate(data), layer: 'HTTP Routes' },
            { path: path.join(resourcePath, 'adapters', 'in', 'http', `${data.name}.routes.test.ts`), content: f.generateFastifyRoutesTestTemplate(data), layer: 'HTTP Routes Test' },
          );
        }
      }

      if (data.inboundAdapters.includes('websocket')) {
        files.push(
          { path: path.join(resourcePath, 'adapters', 'in', 'websocket', `${data.name}.ws-handler.ts`), content: shared.generateWebSocketHandlerTemplate(data), layer: 'WebSocket Handler' },
          { path: path.join(resourcePath, 'adapters', 'in', 'websocket', `${data.name}.ws-routes.ts`), content: shared.generateWebSocketRoutesTemplate(data), layer: 'WebSocket Routes' },
        );
      }

      return files;
    },

    collectRootFile(resourcePath, data) {
      if (frameworkName === 'hono') {
        return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof hexHono).generateHonoCompositionRootTemplate(data), layer: 'Composition Root' };
      } else if (frameworkName === 'express') {
        return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof hexExpress).generateExpressCompositionRootTemplate(data), layer: 'Composition Root' };
      } else if (frameworkName === 'tanstack-router') {
        return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof hexTanStack).generateTanStackCompositionRootTemplate(data), layer: 'Composition Root' };
      }
      return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof hexFastify).generateFastifyCompositionRootTemplate(data), layer: 'Composition Root' };
    },
  };
}

// --- Vertical Slice registries ---

function buildVerticalSliceRegistry(
  shared: typeof vsShared,
  fw: typeof vsHono | typeof vsExpress | typeof vsFastify | typeof vsTanStack,
  frameworkName: Framework,
): TemplateRegistry {
  return {
    collectDomainFiles(resourcePath, data) {
      return [
        { path: path.join(resourcePath, `${data.name}.entity.ts`), content: shared.generateVsEntityTemplate(data), layer: 'Entity' },
        { path: path.join(resourcePath, `${data.name}.repository.ts`), content: shared.generateVsRepositoryPortTemplate(data), layer: 'Repository Port' },
      ];
    },

    collectApplicationFiles(resourcePath, data) {
      // Vertical slice: service is the application layer
      if (frameworkName === 'hono') {
        return [{ path: path.join(resourcePath, `${data.name}.service.ts`), content: (fw as typeof vsHono).generateVsHonoServiceTemplate(data), layer: 'Service' }];
      } else if (frameworkName === 'express') {
        return [{ path: path.join(resourcePath, `${data.name}.service.ts`), content: (fw as typeof vsExpress).generateVsExpressServiceTemplate(data), layer: 'Service' }];
      } else if (frameworkName === 'tanstack-router') {
        return [{ path: path.join(resourcePath, `${data.name}.service.ts`), content: (fw as typeof vsTanStack).generateVsTanStackServiceTemplate(data), layer: 'Service' }];
      }
      return [{ path: path.join(resourcePath, `${data.name}.service.ts`), content: (fw as typeof vsFastify).generateVsFastifyServiceTemplate(data), layer: 'Service' }];
    },

    collectOutboundFiles(resourcePath, data) {
      return [
        { path: path.join(resourcePath, `${data.name}.in-memory.repository.ts`), content: shared.generateVsInMemoryRepositoryTemplate(data), layer: 'In-Memory Repository' },
      ];
    },

    collectInboundFiles(resourcePath, data) {
      const files: FileToGenerate[] = [];

      if (frameworkName === 'hono') {
        const h = fw as typeof vsHono;
        files.push(
          { path: path.join(resourcePath, `${data.name}.validation.ts`), content: h.generateVsHonoValidationTemplate(data), layer: 'Validation' },
          { path: path.join(resourcePath, `${data.name}.handler.ts`), content: h.generateVsHonoHandlerTemplate(data), layer: 'Handler' },
          { path: path.join(resourcePath, `${data.name}.routes.ts`), content: h.generateVsHonoRoutesTemplate(data), layer: 'Routes' },
          { path: path.join(resourcePath, `${data.name}.test.ts`), content: h.generateVsHonoTestTemplate(data), layer: 'Test' },
        );
      } else if (frameworkName === 'express') {
        const e = fw as typeof vsExpress;
        files.push(
          { path: path.join(resourcePath, `${data.name}.validation.ts`), content: e.generateVsExpressValidationTemplate(data), layer: 'Validation' },
          { path: path.join(resourcePath, `${data.name}.handler.ts`), content: e.generateVsExpressHandlerTemplate(data), layer: 'Handler' },
          { path: path.join(resourcePath, `${data.name}.routes.ts`), content: e.generateVsExpressRoutesTemplate(data), layer: 'Routes' },
          { path: path.join(resourcePath, `${data.name}.test.ts`), content: e.generateVsExpressTestTemplate(data), layer: 'Test' },
        );
      } else if (frameworkName === 'tanstack-router') {
        const t = fw as typeof vsTanStack;
        files.push(
          { path: path.join(resourcePath, `${data.name}.validation.ts`), content: t.generateVsTanStackValidationTemplate(data), layer: 'Validation' },
          { path: path.join(resourcePath, `${data.name}.component.ts`), content: t.generateVsTanStackComponentTemplate(data), layer: 'Component' },
          { path: path.join(resourcePath, `${data.name}.route.ts`), content: t.generateVsTanStackRouteTemplate(data), layer: 'Route' },
          { path: path.join(resourcePath, `${data.name}.detail-route.ts`), content: t.generateVsTanStackDetailRouteTemplate(data), layer: 'Detail Route' },
          { path: path.join(resourcePath, `${data.name}.detail-component.ts`), content: t.generateVsTanStackDetailComponentTemplate(data), layer: 'Detail Component' },
          { path: path.join(resourcePath, `${data.name}.test.ts`), content: t.generateVsTanStackTestTemplate(data), layer: 'Test' },
        );
      } else {
        const f = fw as typeof vsFastify;
        files.push(
          { path: path.join(resourcePath, `${data.name}.validation.ts`), content: f.generateVsFastifyValidationTemplate(data), layer: 'Validation' },
          { path: path.join(resourcePath, `${data.name}.plugin.ts`), content: f.generateVsFastifyPluginTemplate(data), layer: 'Plugin' },
          { path: path.join(resourcePath, `${data.name}.test.ts`), content: f.generateVsFastifyTestTemplate(data), layer: 'Test' },
        );
      }

      return files;
    },

    collectRootFile(resourcePath, data) {
      if (frameworkName === 'hono') {
        return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof vsHono).generateVsHonoIndexTemplate(data), layer: 'Index (wiring)' };
      } else if (frameworkName === 'express') {
        return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof vsExpress).generateVsExpressIndexTemplate(data), layer: 'Index (wiring)' };
      } else if (frameworkName === 'tanstack-router') {
        return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof vsTanStack).generateVsTanStackIndexTemplate(data), layer: 'Index (barrel)' };
      }
      return { path: path.join(resourcePath, 'index.ts'), content: (fw as typeof vsFastify).generateVsFastifyIndexTemplate(data), layer: 'Index (wiring)' };
    },
  };
}

// --- Registry dispatch table ---

export function getRegistry(architecture: ArchitecturePattern, framework: Framework): TemplateRegistry {
  if (architecture === 'hexagonal') {
    switch (framework) {
      case 'hono': return buildHexagonalRegistry(hexShared, hexHono, 'hono');
      case 'express': return buildHexagonalRegistry(hexShared, hexExpress, 'express');
      case 'fastify': return buildHexagonalRegistry(hexShared, hexFastify, 'fastify');
      case 'tanstack-router': return buildHexagonalRegistry(hexShared, hexTanStack, 'tanstack-router');
    }
  }
  switch (framework) {
    case 'hono': return buildVerticalSliceRegistry(vsShared, vsHono, 'hono');
    case 'express': return buildVerticalSliceRegistry(vsShared, vsExpress, 'express');
    case 'fastify': return buildVerticalSliceRegistry(vsShared, vsFastify, 'fastify');
    case 'tanstack-router': return buildVerticalSliceRegistry(vsShared, vsTanStack, 'tanstack-router');
  }
}

// --- Public API ---

export function buildTemplateData(
  name: string,
  architecture: ArchitecturePattern,
  framework: Framework,
  inboundAdapters: InboundAdapter[],
  outboundAdapters: OutboundAdapter[],
): TemplateData {
  const lower = name.toLowerCase();
  return {
    name: lower,
    capitalizedName: capitalize(lower),
    camelCaseName: toCamelCase(capitalize(lower)),
    pluralName: toPlural(lower),
    kebabName: toKebabCase(lower),
    architecture,
    framework,
    inboundAdapters,
    outboundAdapters,
  };
}

export async function generate(data: TemplateData, outputDir: string = 'src'): Promise<void> {
  const spinner = ora('Generating API boilerplate...').start();

  try {
    spinner.text = `Creating ${data.capitalizedName} API structure...`;

    const basePath = path.resolve(process.cwd(), outputDir);
    const resourcePath = path.join(basePath, data.name);
    const registry = getRegistry(data.architecture, data.framework);

    const files: FileToGenerate[] = [
      ...registry.collectDomainFiles(resourcePath, data),
      ...registry.collectApplicationFiles(resourcePath, data),
      ...registry.collectOutboundFiles(resourcePath, data),
      ...registry.collectInboundFiles(resourcePath, data),
      registry.collectRootFile(resourcePath, data),
    ];

    for (const file of files) {
      spinner.text = `Generating ${file.layer}...`;
      await writeFile(file.path, file.content);
    }

    spinner.succeed(chalk.green(`Successfully generated ${data.capitalizedName} API!`));
    printSummary(files, data);
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate API'));
    throw error;
  }
}

export async function addAdapters(
  resource: ExistingResourceInfo,
  data: TemplateData,
  direction: 'inbound' | 'outbound',
): Promise<void> {
  const spinner = ora(`Adding adapters to ${resource.name}...`).start();

  try {
    const resourcePath = resource.path;
    const allInbound = resolveCurrentInboundAdapters(resource, direction === 'inbound' ? data.inboundAdapters : []);
    const allOutbound = resolveCurrentOutboundAdapters(resource, direction === 'outbound' ? data.outboundAdapters : []);

    const registry = getRegistry(data.architecture, data.framework);
    let files: FileToGenerate[] = [];

    if (direction === 'outbound') {
      files = registry.collectOutboundFiles(resourcePath, data);
    } else {
      files = registry.collectInboundFiles(resourcePath, { ...data, outboundAdapters: allOutbound });
    }

    // Regenerate composition root with all adapters
    const compositionData: TemplateData = {
      ...data,
      inboundAdapters: allInbound,
      outboundAdapters: allOutbound,
    };
    files.push(registry.collectRootFile(resourcePath, compositionData));

    for (const file of files) {
      spinner.text = `Generating ${file.layer}...`;
      await writeFile(file.path, file.content);
    }

    spinner.succeed(chalk.green(`Successfully added adapters to ${data.capitalizedName}!`));
    printSummary(files, data);
  } catch (error) {
    spinner.fail(chalk.red('Failed to add adapters'));
    throw error;
  }
}

function resolveCurrentInboundAdapters(resource: ExistingResourceInfo, newAdapters: InboundAdapter[]): InboundAdapter[] {
  const adapters: InboundAdapter[] = [...newAdapters];
  if (resource.hasHttp && !adapters.includes('http')) adapters.push('http');
  if (resource.hasWebSocket && !adapters.includes('websocket')) adapters.push('websocket');
  return adapters;
}

function resolveCurrentOutboundAdapters(resource: ExistingResourceInfo, newAdapters: OutboundAdapter[]): OutboundAdapter[] {
  const adapters: OutboundAdapter[] = [...newAdapters];
  if (resource.hasInMemory && !adapters.includes('in-memory')) adapters.push('in-memory');
  if (resource.hasDatabase && !adapters.includes('database')) adapters.push('database');
  if (resource.hasCache && !adapters.includes('cache')) adapters.push('cache');
  return adapters;
}

function printSummary(files: FileToGenerate[], data: TemplateData): void {
  console.log(chalk.cyan('\nGenerated files:'));
  files.forEach((file) => {
    const relativePath = path.relative(process.cwd(), file.path);
    console.log(chalk.gray(`  ${relativePath}`));
  });

  console.log(chalk.cyan('\nNext steps:'));
  console.log(chalk.gray(`  1. Update the entity properties in ${chalk.white(data.name + '/')}`));
  console.log(chalk.gray(`  2. Import from the composition root in your main app:`));
  console.log(chalk.yellow(`     import { ${data.camelCaseName}Routes } from './${data.name}';`));
}
