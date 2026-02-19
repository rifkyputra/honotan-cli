import { generateCounterStore } from './counter-store.template'
import { generateQueryClient } from './query-client.template'
import { generateHelloApi, generateUseHello } from './hello-api.template'
import { generateEnvExample } from './env-example.template'
import { generateRootRoute } from './root-route.template'
import { generateIndexRoute } from './index-route.template'
import { generateAboutRoute } from './about-route.template'
import { generatePackageJson } from './package-json.template'
import { generateTsConfig, generateTsConfigNode } from './tsconfig.template'
import { generateViteConfig } from './vite-config.template'
import { generateIndexHtml } from './index-html.template'
import { generateMainTsx } from './main.template'
import { generateGitignore } from './gitignore.template'
import { generateRouteTree } from './route-tree.template'
import { generateIndexCss } from './index-css.template'

export interface TemplateRegistry {
  [filePath: string]: string
}

export interface ClientTemplateOptions {
  hasPwa?: boolean
}

export function buildClientTemplateRegistry(
  projectName: string,
  options: ClientTemplateOptions = {},
): TemplateRegistry {
  const { hasPwa = false } = options
  return {
    // Project configuration files (root level)
    'package.json': generatePackageJson(projectName, { hasPwa }),
    'tsconfig.json': generateTsConfig(),
    'tsconfig.node.json': generateTsConfigNode(),
    'vite.config.ts': generateViteConfig({ hasPwa, projectName }),
    'index.html': generateIndexHtml(projectName),
    '.gitignore': generateGitignore(),

    // Source files
    'src/main.tsx': generateMainTsx(),
    'src/index.css': generateIndexCss(),
    'src/routeTree.gen.ts': generateRouteTree(),

    // Environment
    '.env.example': generateEnvExample(),

    // Lib (Store + Query Client + API)
    'src/lib/counter-store.ts': generateCounterStore(),
    'src/lib/query-client.ts': generateQueryClient(),
    'src/lib/hello-api.ts': generateHelloApi(),
    'src/lib/use-hello.ts': generateUseHello(),

    // Routes
    'src/routes/__root.tsx': generateRootRoute(),
    'src/routes/index.tsx': generateIndexRoute(),
    'src/routes/about.tsx': generateAboutRoute(),
  }
}
