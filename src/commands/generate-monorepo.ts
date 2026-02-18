import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { writeFile } from '../utils/file-utils';
import { toKebabCase } from '../utils/string-utils';
import type { MonorepoTemplateData, MonorepoFileToGenerate, InfraPackage, Framework, ApiFramework } from '../types';
import { buildTemplateData, getRegistry } from './generate';
import { buildClientTemplateRegistry } from '../templates/client';

// Root templates
import { generateRootPackageJson } from '../templates/monorepo/root/package-json.template';
import { generateTurboJson } from '../templates/monorepo/root/turbo-json.template';
import { generateRootTsconfig } from '../templates/monorepo/root/tsconfig.template';
import { generateGitignore } from '../templates/monorepo/root/gitignore.template';
import { generateEnvExample } from '../templates/monorepo/root/env-example.template';
import { generateDockerignore } from '../templates/monorepo/root/dockerignore.template';
import { generateDockerfile } from '../templates/monorepo/root/dockerfile.template';
import { generateDockerCompose } from '../templates/monorepo/root/docker-compose.template';
import { generateDockerComposeDev } from '../templates/monorepo/root/docker-compose-dev.template';
import { generateMonorepoReadme } from '../templates/monorepo/root/readme.template';
import { generateMonorepoAgents } from '../templates/monorepo/root/agents.template';

// packages/config
import { generateConfigPackageJson } from '../templates/monorepo/packages/config/package-json.template';
import { generateTsconfigBase } from '../templates/monorepo/packages/config/tsconfig-base.template';

// packages/env
import { generateEnvPackageJson } from '../templates/monorepo/packages/env/package-json.template';
import { generateEnvTsconfig } from '../templates/monorepo/packages/env/tsconfig.template';
import { generateEnvServer } from '../templates/monorepo/packages/env/server.template';

// packages/db (optional)
import { generateDbPackageJson } from '../templates/monorepo/packages/db/package-json.template';
import { generateDbTsconfig } from '../templates/monorepo/packages/db/tsconfig.template';
import { generateDbIndex } from '../templates/monorepo/packages/db/index.template';
import { generateDbTypes } from '../templates/monorepo/packages/db/types.template';

// packages/cache (optional)
import { generateCachePackageJson } from '../templates/monorepo/packages/cache/package-json.template';
import { generateCacheTsconfig } from '../templates/monorepo/packages/cache/tsconfig.template';
import { generateCacheIndex } from '../templates/monorepo/packages/cache/index.template';
import { generateCacheTypes } from '../templates/monorepo/packages/cache/types.template';

// packages/event-driven (optional)
import { generateEventDrivenPackageJson } from '../templates/monorepo/packages/event-driven/package-json.template';
import { generateEventDrivenTsconfig } from '../templates/monorepo/packages/event-driven/tsconfig.template';
import { generateEventDrivenIndex } from '../templates/monorepo/packages/event-driven/index.template';
import { generateEventDrivenTypes } from '../templates/monorepo/packages/event-driven/types.template';
import { generateRabbitMQClient } from '../templates/monorepo/packages/event-driven/rabbitmq.template';

// packages/auth (optional)
import { generateAuthPackageJson } from '../templates/monorepo/packages/auth/package-json.template';
import { generateAuthTsconfig } from '../templates/monorepo/packages/auth/tsconfig.template';
import { generateAuthIndex } from '../templates/monorepo/packages/auth/index.template';
import { generateAuthTypes } from '../templates/monorepo/packages/auth/types.template';

// apps/server
import { generateServerPackageJson } from '../templates/monorepo/apps/server/package-json.template';
import { generateServerTsconfig } from '../templates/monorepo/apps/server/tsconfig.template';
import { generateServerTsdownConfig } from '../templates/monorepo/apps/server/tsdown-config.template';
import { generateServerIndex } from '../templates/monorepo/apps/server/index.template';

export function buildMonorepoTemplateData(
  projectName: string,
  frameworks: Framework[],
  infraPackages: InfraPackage[],
): MonorepoTemplateData {
  const apiFramework = (frameworks.find((f) => f !== 'tanstack-router') as ApiFramework) || 'hono';
  return {
    projectName,
    scope: `@${toKebabCase(projectName)}`,
    kebabName: toKebabCase(projectName),
    frameworks,
    apiFramework,
    infraPackages,
    hasDb: infraPackages.includes('db') || infraPackages.includes('auth'),
    hasCache: infraPackages.includes('cache'),
    hasEventDriven: infraPackages.includes('event-driven'),
    hasAuth: infraPackages.includes('auth'),
    hasClient: frameworks.includes('tanstack-router'),
  };
}

function collectExampleApiFiles(data: MonorepoTemplateData): MonorepoFileToGenerate[] {
  const templateData = buildTemplateData('hello', 'hexagonal', data.apiFramework, ['http'], ['in-memory']);
  const registry = getRegistry(data.apiFramework);
  const resourcePath = 'hello';

  const apiFiles = [
    ...registry.collectDomainFiles(resourcePath, templateData),
    ...registry.collectApplicationFiles(resourcePath, templateData),
    ...registry.collectOutboundFiles(resourcePath, templateData),
    ...registry.collectInboundFiles(resourcePath, templateData),
    registry.collectRootFile(resourcePath, templateData),
  ];

  return apiFiles.map((f) => ({
    path: path.join('apps', 'server', 'src', f.path),
    content: f.content,
    description: `Example API: ${f.layer}`,
  }));
}

function collectClientFiles(data: MonorepoTemplateData): MonorepoFileToGenerate[] {
  const registry = buildClientTemplateRegistry(data.projectName);
  return Object.entries(registry).map(([filePath, content]) => ({
    path: path.join('apps', 'client', filePath),
    content,
    description: `apps/client/${filePath}`,
  }));
}

function collectFiles(data: MonorepoTemplateData): MonorepoFileToGenerate[] {
  const files: MonorepoFileToGenerate[] = [];

  // Root files
  files.push(
    { path: 'package.json', content: generateRootPackageJson(data), description: 'Root package.json' },
    { path: 'turbo.json', content: generateTurboJson(data), description: 'turbo.json' },
    { path: 'tsconfig.json', content: generateRootTsconfig(data), description: 'Root tsconfig.json' },
    { path: '.gitignore', content: generateGitignore(data), description: '.gitignore' },
    { path: '.env.example', content: generateEnvExample(data), description: '.env.example' },
    { path: '.dockerignore', content: generateDockerignore(data), description: '.dockerignore' },
    { path: 'Dockerfile', content: generateDockerfile(data), description: 'Dockerfile' },
    { path: 'docker-compose.yml', content: generateDockerCompose(data), description: 'docker-compose.yml' },
    { path: 'docker-compose.dev.yml', content: generateDockerComposeDev(data), description: 'docker-compose.dev.yml' },
    { path: 'README.md', content: generateMonorepoReadme(data), description: 'README.md' },
    { path: 'AGENTS.md', content: generateMonorepoAgents(data), description: 'AGENTS.md' },
  );

  // packages/config
  files.push(
    { path: 'packages/config/package.json', content: generateConfigPackageJson(data), description: 'packages/config/package.json' },
    { path: 'packages/config/tsconfig.base.json', content: generateTsconfigBase(data), description: 'packages/config/tsconfig.base.json' },
  );

  // packages/env
  files.push(
    { path: 'packages/env/package.json', content: generateEnvPackageJson(data), description: 'packages/env/package.json' },
    { path: 'packages/env/tsconfig.json', content: generateEnvTsconfig(data), description: 'packages/env/tsconfig.json' },
    { path: 'packages/env/src/server.ts', content: generateEnvServer(data), description: 'packages/env/src/server.ts' },
  );

  // packages/db (conditional)
  if (data.hasDb) {
    files.push(
      { path: 'packages/db/package.json', content: generateDbPackageJson(data), description: 'packages/db/package.json' },
      { path: 'packages/db/tsconfig.json', content: generateDbTsconfig(data), description: 'packages/db/tsconfig.json' },
      { path: 'packages/db/src/index.ts', content: generateDbIndex(data), description: 'packages/db/src/index.ts' },
      { path: 'packages/db/src/types.ts', content: generateDbTypes(data), description: 'packages/db/src/types.ts' },
    );
  }

  // packages/cache (conditional)
  if (data.hasCache) {
    files.push(
      { path: 'packages/cache/package.json', content: generateCachePackageJson(data), description: 'packages/cache/package.json' },
      { path: 'packages/cache/tsconfig.json', content: generateCacheTsconfig(data), description: 'packages/cache/tsconfig.json' },
      { path: 'packages/cache/src/index.ts', content: generateCacheIndex(data), description: 'packages/cache/src/index.ts' },
      { path: 'packages/cache/src/types.ts', content: generateCacheTypes(data), description: 'packages/cache/src/types.ts' },
    );
  }

  // packages/event-driven (conditional)
  if (data.hasEventDriven) {
    files.push(
      { path: 'packages/event-driven/package.json', content: generateEventDrivenPackageJson(data), description: 'packages/event-driven/package.json' },
      { path: 'packages/event-driven/tsconfig.json', content: generateEventDrivenTsconfig(data), description: 'packages/event-driven/tsconfig.json' },
      { path: 'packages/event-driven/src/index.ts', content: generateEventDrivenIndex(data), description: 'packages/event-driven/src/index.ts' },
      { path: 'packages/event-driven/src/types.ts', content: generateEventDrivenTypes(data), description: 'packages/event-driven/src/types.ts' },
      { path: 'packages/event-driven/src/rabbitmq.ts', content: generateRabbitMQClient(data), description: 'packages/event-driven/src/rabbitmq.ts' },
    );
  }

  // packages/auth (conditional)
  if (data.hasAuth) {
    files.push(
      { path: 'packages/auth/package.json', content: generateAuthPackageJson(data), description: 'packages/auth/package.json' },
      { path: 'packages/auth/tsconfig.json', content: generateAuthTsconfig(data), description: 'packages/auth/tsconfig.json' },
      { path: 'packages/auth/src/index.ts', content: generateAuthIndex(data), description: 'packages/auth/src/index.ts' },
      { path: 'packages/auth/src/types.ts', content: generateAuthTypes(data), description: 'packages/auth/src/types.ts' },
    );
  }

  // apps/server
  files.push(
    { path: 'apps/server/package.json', content: generateServerPackageJson(data), description: 'apps/server/package.json' },
    { path: 'apps/server/tsconfig.json', content: generateServerTsconfig(data), description: 'apps/server/tsconfig.json' },
    { path: 'apps/server/tsdown.config.ts', content: generateServerTsdownConfig(data), description: 'apps/server/tsdown.config.ts' },
    { path: 'apps/server/.env.example', content: generateEnvExample(data), description: 'apps/server/.env.example' },
    { path: 'apps/server/src/index.ts', content: generateServerIndex(data), description: 'apps/server/src/index.ts' },
  );

  // Example "hello" API resource
  files.push(...collectExampleApiFiles(data));

  // apps/client (conditional — TanStack Router)
  if (data.hasClient) {
    files.push(...collectClientFiles(data));
  }

  return files;
}

export async function generateMonorepo(data: MonorepoTemplateData, outputDir: string): Promise<void> {
  const spinner = ora('Scaffolding monorepo...').start();

  try {
    const basePath = path.resolve(process.cwd(), outputDir, data.projectName);
    const files = collectFiles(data);

    for (const file of files) {
      spinner.text = `Generating ${file.description}...`;
      await writeFile(path.join(basePath, file.path), file.content);
    }

    spinner.succeed(chalk.green(`Monorepo "${data.projectName}" created successfully!`));

    console.log(chalk.cyan('\nGenerated structure:'));
    for (const file of files) {
      console.log(chalk.gray(`  ${data.projectName}/${file.path}`));
    }

    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.gray(`  1. cd ${chalk.white(data.projectName)}`));
    console.log(chalk.gray(`  2. ${chalk.white('bun install')}`));
    console.log(chalk.gray(`  3. Copy ${chalk.white('.env.example')} to ${chalk.white('.env')} and fill in values`));
    console.log(chalk.gray(`  4. ${chalk.white('bun run dev')} to start development`));
    if (data.hasDb || data.hasCache || data.hasEventDriven) {
      console.log(chalk.gray(`  5. ${chalk.white('docker-compose -f docker-compose.dev.yml up -d')} to start infra services`));
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to scaffold monorepo'));
    throw error;
  }
}
