import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import type { ExistingResourceInfo, ArchitecturePattern, Framework } from '../types';

export async function detectExistingResources(outputDir: string): Promise<ExistingResourceInfo[]> {
  const basePath = path.resolve(process.cwd(), outputDir);

  if (!existsSync(basePath)) {
    return [];
  }

  const entries = await readdir(basePath, { withFileTypes: true });
  const resources: ExistingResourceInfo[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const resourcePath = path.join(basePath, entry.name);
    const info = await detectResource(resourcePath, entry.name);
    if (info) {
      resources.push(info);
    }
  }

  return resources;
}

async function detectResource(resourcePath: string, name: string): Promise<ExistingResourceInfo | null> {
  const architecture = detectArchitecture(resourcePath, name);
  if (!architecture) return null;

  const framework = await detectFramework(resourcePath, name);

  return {
    name,
    path: resourcePath,
    architecture,
    framework,
    hasHttp: existsSync(path.join(resourcePath, 'adapters', 'in', 'http', `${name}.routes.ts`)) ||
      existsSync(path.join(resourcePath, 'adapters', 'in', 'routes', `${name}.route.ts`)),
    hasWebSocket: existsSync(path.join(resourcePath, 'adapters', 'in', 'websocket', `${name}.ws-handler.ts`)),
    hasInMemory: existsSync(path.join(resourcePath, 'adapters', 'out', 'persistence', `in-memory-${name}.repository.ts`)),
    hasDatabase: existsSync(path.join(resourcePath, 'adapters', 'out', 'persistence', `database-${name}.repository.ts`)),
    hasCache: existsSync(path.join(resourcePath, 'adapters', 'out', 'cache', `cache-${name}.repository.ts`)),
  };
}

function detectArchitecture(resourcePath: string, name: string): ArchitecturePattern | null {
  // Hexagonal: has domain/entities/<name>.entity.ts
  if (existsSync(path.join(resourcePath, 'domain', 'entities', `${name}.entity.ts`))) {
    return 'hexagonal';
  }
  return null;
}

async function detectFramework(resourcePath: string, name: string): Promise<Framework> {
  const filesToScan: string[] = [
    path.join(resourcePath, 'adapters', 'in', 'http', `${name}.controller.ts`),
    path.join(resourcePath, 'adapters', 'in', 'http', `${name}.handler.ts`),
    path.join(resourcePath, 'adapters', 'in', 'http', `${name}.routes.ts`),
    path.join(resourcePath, 'adapters', 'in', 'routes', `${name}.route.ts`),
    path.join(resourcePath, 'adapters', 'in', 'routes', `${name}.component.ts`),
  ];

  for (const filePath of filesToScan) {
    if (!existsSync(filePath)) continue;
    try {
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n').slice(0, 10).join('\n');
      if (lines.includes('@tanstack/react-router')) return 'tanstack-router';
      if (lines.includes("'hono'") || lines.includes('"hono"')) return 'hono';
      if (lines.includes("'express'") || lines.includes('"express"')) return 'express';
      if (lines.includes("'fastify'") || lines.includes('"fastify"')) return 'fastify';
    } catch {
      // Skip unreadable files
    }
  }

  return 'hono'; // default fallback
}
