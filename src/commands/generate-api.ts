import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { writeFile } from '../utils/file-utils';
import { toKebabCase } from '../utils/string-utils';
import type { ApiFramework, ArchitecturePattern, FileToGenerate } from '../types';
import { buildTemplateData, getRegistry } from './generate';

// Standalone API templates - TypeScript
import { generateStandalonePackageJson } from '../templates/standalone-api/package-json.template';
import { generateStandaloneTsconfig } from '../templates/standalone-api/tsconfig.template';
import { generateStandaloneTsdownConfig } from '../templates/standalone-api/tsdown-config.template';
import { generateStandaloneDockerfile } from '../templates/standalone-api/dockerfile.template';
import { generateStandaloneDockerCompose } from '../templates/standalone-api/docker-compose.template';
import { generateStandaloneEnvExample } from '../templates/standalone-api/env-example.template';
import { generateStandaloneGitignore } from '../templates/standalone-api/gitignore.template';
import { generateStandaloneServerIndex } from '../templates/standalone-api/index.template';

// Standalone API templates - Go
import { generateStandaloneGoMod } from '../templates/standalone-api/go-mod.template';
import { generateStandaloneGoMain } from '../templates/standalone-api/main-go.template';
import { generateStandaloneGoDockerfile } from '../templates/standalone-api/dockerfile-go.template';
import { generateStandaloneGoDockerCompose } from '../templates/standalone-api/docker-compose-go.template';
import { generateStandaloneGoEnvExample } from '../templates/standalone-api/env-example-go.template';
import { generateStandaloneGoGitignore } from '../templates/standalone-api/gitignore-go.template';
import { generateStandaloneGoMakefile } from '../templates/standalone-api/makefile-go.template';
import { generateStandaloneGoReadme } from '../templates/standalone-api/readme-go.template';

interface StandaloneApiFile {
  path: string;
  content: string;
  description: string;
}

function collectExampleResourceFiles(
  framework: ApiFramework,
  architecture: ArchitecturePattern,
): FileToGenerate[] {
  const templateData = buildTemplateData('hello', architecture, framework, ['http'], ['in-memory']);
  const registry = getRegistry(framework);
  const resourcePath = 'hello';

  return [
    ...registry.collectDomainFiles(resourcePath, templateData),
    ...registry.collectApplicationFiles(resourcePath, templateData),
    ...registry.collectOutboundFiles(resourcePath, templateData),
    ...registry.collectInboundFiles(resourcePath, templateData),
    registry.collectRootFile(resourcePath, templateData),
  ];
}

export async function generateApi(
  name: string,
  framework: ApiFramework,
  architecture: ArchitecturePattern,
  outputDir: string,
): Promise<void> {
  const spinner = ora('Scaffolding standalone API...').start();

  try {
    const kebabName = toKebabCase(name);
    const basePath = path.resolve(process.cwd(), outputDir, kebabName);

    const files: StandaloneApiFile[] = [];

    if (framework === 'go') {
      // Go project configuration files
      files.push(
        { path: 'go.mod', content: generateStandaloneGoMod(kebabName), description: 'go.mod' },
        { path: 'main.go', content: generateStandaloneGoMain(kebabName), description: 'main.go' },
        { path: 'Dockerfile', content: generateStandaloneGoDockerfile(kebabName), description: 'Dockerfile' },
        { path: 'docker-compose.yml', content: generateStandaloneGoDockerCompose(kebabName), description: 'docker-compose.yml' },
        { path: '.env.example', content: generateStandaloneGoEnvExample(kebabName), description: '.env.example' },
        { path: '.gitignore', content: generateStandaloneGoGitignore(), description: '.gitignore' },
        { path: 'Makefile', content: generateStandaloneGoMakefile(kebabName), description: 'Makefile' },
        { path: 'README.md', content: generateStandaloneGoReadme(kebabName), description: 'README.md' },
      );
    } else {
      // TypeScript project configuration files
      files.push(
        { path: 'package.json', content: generateStandalonePackageJson(kebabName, framework), description: 'package.json' },
        { path: 'tsconfig.json', content: generateStandaloneTsconfig(), description: 'tsconfig.json' },
        { path: 'tsdown.config.ts', content: generateStandaloneTsdownConfig(), description: 'tsdown.config.ts' },
        { path: 'Dockerfile', content: generateStandaloneDockerfile(kebabName), description: 'Dockerfile' },
        { path: 'docker-compose.yml', content: generateStandaloneDockerCompose(kebabName), description: 'docker-compose.yml' },
        { path: '.env.example', content: generateStandaloneEnvExample(kebabName), description: '.env.example' },
        { path: '.gitignore', content: generateStandaloneGitignore(), description: '.gitignore' },
      );

      // Server entry point
      files.push(
        { path: 'src/index.ts', content: generateStandaloneServerIndex(framework), description: 'src/index.ts' },
      );

      // Example "hello" resource
      const resourceFiles = collectExampleResourceFiles(framework, architecture);
      for (const f of resourceFiles) {
        files.push({
          path: path.join('src', f.path),
          content: f.content,
          description: `Example API: ${f.layer}`,
        });
      }
    }

    for (const file of files) {
      spinner.text = `Generating ${file.description}...`;
      await writeFile(path.join(basePath, file.path), file.content);
    }

    spinner.succeed(chalk.green(`Standalone API "${kebabName}" created successfully!`));

    console.log(chalk.cyan('\nGenerated structure:'));
    for (const file of files) {
      console.log(chalk.gray(`  ${kebabName}/${file.path}`));
    }

    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.gray(`  1. cd ${chalk.white(path.join(outputDir, kebabName))}`));

    if (framework === 'go') {
      console.log(chalk.gray(`  2. ${chalk.white('go mod download')} to download dependencies`));
      console.log(chalk.gray(`  3. Copy ${chalk.white('.env.example')} to ${chalk.white('.env')} and fill in values`));
      console.log(chalk.gray(`  4. ${chalk.white('go run main.go')} or ${chalk.white('make run')} to start development`));
      console.log(chalk.gray(`  5. ${chalk.white('make help')} to see all available commands`));
    } else {
      console.log(chalk.gray(`  2. ${chalk.white('bun install')}`));
      console.log(chalk.gray(`  3. Copy ${chalk.white('.env.example')} to ${chalk.white('.env')} and fill in values`));
      console.log(chalk.gray(`  4. ${chalk.white('bun run dev')} to start development`));
      console.log(chalk.gray(`  5. ${chalk.white('docker-compose up -d')} to start infra services`));
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to scaffold standalone API'));
    throw error;
  }
}
