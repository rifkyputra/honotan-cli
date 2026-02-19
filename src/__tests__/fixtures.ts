import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { readFile as fsReadFile } from 'fs/promises';
import type { MonorepoTemplateData, InfraPackage, Framework } from '../../src/types';
import { generateMonorepo } from '../../src/commands/generate-monorepo';

const GENERATED_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../.generated');
mkdirSync(GENERATED_DIR, { recursive: true });

/**
 * Build a MonorepoTemplateData for testing.
 * `projectName` is required to keep each fixture in its own output directory.
 */
export function makeMonorepoData(
  projectName: string,
  overrides: Partial<Omit<MonorepoTemplateData, 'projectName'>> = {},
): MonorepoTemplateData {
  const infraPackages: InfraPackage[] = overrides.infraPackages ?? [];
  const frameworks: Framework[] = overrides.frameworks ?? ['hono'];

  const base: MonorepoTemplateData = {
    projectName,
    scope: `@${projectName}`,
    kebabName: projectName,
    frameworks,
    apiFramework: 'hono',
    infraPackages,
    hasDb: infraPackages.includes('db') || infraPackages.includes('auth'),
    hasDbTurso: infraPackages.includes('db-turso'),
    hasCache: infraPackages.includes('cache'),
    hasEventDriven: infraPackages.includes('event-driven'),
    hasAuth: infraPackages.includes('auth'),
    hasClient: frameworks.includes('tanstack-router'),
    hasPwa: infraPackages.includes('pwa'),
    hasS3: infraPackages.includes('s3'),
  };

  return { ...base, ...overrides };
}

/** Pre-built data fixtures for common scenarios, each with a unique project name. */
export const fixtures = {
  minimal: makeMonorepoData('test-minimal'),

  withClient: makeMonorepoData('test-with-client', {
    frameworks: ['hono', 'tanstack-router'],
    hasClient: true,
  }),

  withAuth: makeMonorepoData('test-with-auth', {
    infraPackages: ['auth'],
    hasAuth: true,
    hasDb: true,
  }),

  withClientAndAuth: makeMonorepoData('test-with-client-auth', {
    frameworks: ['hono', 'tanstack-router'],
    infraPackages: ['auth'],
    hasClient: true,
    hasAuth: true,
    hasDb: true,
  }),

  full: makeMonorepoData('test-full', {
    frameworks: ['hono', 'tanstack-router'],
    infraPackages: ['db', 'cache', 'event-driven', 'auth'],
    hasClient: true,
    hasDb: true,
    hasCache: true,
    hasEventDriven: true,
    hasAuth: true,
  }),
} satisfies Record<string, MonorepoTemplateData>;

/**
 * Run the monorepo generator into `.generated/<projectName>/` and return
 * helpers to inspect the resulting files.
 */
export async function scaffold(data: MonorepoTemplateData) {
  await generateMonorepo(data, GENERATED_DIR);

  const projectRoot = path.join(GENERATED_DIR, data.projectName);

  return {
    /** Absolute path to the root of the generated project. */
    root: projectRoot,

    /** Read a generated file relative to the project root. */
    read(relativePath: string): Promise<string> {
      return fsReadFile(path.join(projectRoot, relativePath), 'utf-8');
    },

    /** Return true if the file exists in the generated project. */
    exists(relativePath: string): boolean {
      return existsSync(path.join(projectRoot, relativePath));
    },
  };
}
