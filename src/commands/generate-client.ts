import { join } from 'path'
import { mkdir, writeFile, access } from 'fs/promises'
import { buildClientTemplateRegistry } from '../templates/client'

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

export async function generateClient(
  outputDir: string,
  resourceName?: string,
): Promise<void> {
  // Extract project name from resource name or output directory
  const projectName = resourceName || (outputDir === '.'
    ? 'tanstack-router-app'
    : outputDir.split('/').pop() || 'tanstack-router-app')

  const registry = buildClientTemplateRegistry(projectName)

  // All files for the new project
  const sharedFiles = [
    'package.json',
    'tsconfig.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'index.html',
    '.gitignore',
    'src/main.tsx',
    'src/index.css',
    'src/routeTree.gen.ts',
    'src/lib/counter-store.ts',
    'src/lib/query-client.ts',
    'src/routes/__root.tsx',
    'src/routes/index.tsx',
    'src/routes/about.tsx',
  ]

  // Determine the project root
  const projectRoot = outputDir === '.' ? process.cwd() : join(process.cwd(), outputDir)

  for (const [relativePath, content] of Object.entries(registry)) {
    const fullPath = join(projectRoot, relativePath)

    // Skip shared files if they already exist
    if (sharedFiles.includes(relativePath)) {
      const exists = await fileExists(fullPath)
      if (exists) {
        console.log(`  Skipped (already exists): ${relativePath}`)
        continue
      }
    }

    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'))
    await mkdir(dir, { recursive: true })
    await writeFile(fullPath, content, 'utf-8')
    console.log(`  Created: ${relativePath}`)
  }

  console.log(`\n✅ TanStack Router project generated: ${projectName}`)
  console.log(`\n📁 Project structure:`)
  console.log(`  ${projectRoot}/`)
  console.log(`  ├── package.json`)
  console.log(`  ├── vite.config.ts`)
  console.log(`  ├── tsconfig.json`)
  console.log(`  ├── index.html`)
  console.log(`  └── src/`)
  console.log(`      ├── main.tsx`)
  console.log(`      ├── routeTree.gen.ts (auto-generated)`)
  console.log(`      ├── lib/counter-store.ts`)
  console.log(`      └── routes/`)
  console.log(`          ├── __root.tsx`)
  console.log(`          ├── index.tsx`)
  console.log(`          └── about.tsx`)
  console.log(`\n📦 Next steps:`)
  console.log(`  1. cd ${projectRoot === process.cwd() ? '.' : outputDir}`)
  console.log(`  2. npm install  (or bun install)`)
  console.log(`  3. npm run dev  (or bun run dev)`)
  console.log(`  4. Open http://localhost:3000`)
  console.log(`\n💡 Features:`)
  console.log(`  - Counter with TanStack Store state management`)
  console.log(`  - /hello fetch example`)
  console.log(`  - File-based routing with TanStack Router`)
}

