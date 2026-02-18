import { generateCounterStore } from './counter-store.template'
import { generateQueryClient } from './query-client.template'
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
import { generateTailwindConfig } from './tailwind-config.template'
import { generatePostcssConfig } from './postcss-config.template'
import { generateIndexCss } from './index-css.template'

export interface TemplateRegistry {
  [filePath: string]: string
}

export function buildClientTemplateRegistry(projectName: string): TemplateRegistry {
  return {
    // Project configuration files (root level)
    'package.json': generatePackageJson(projectName),
    'tsconfig.json': generateTsConfig(),
    'tsconfig.node.json': generateTsConfigNode(),
    'vite.config.ts': generateViteConfig(),
    'tailwind.config.js': generateTailwindConfig(),
    'postcss.config.js': generatePostcssConfig(),
    'index.html': generateIndexHtml(projectName),
    '.gitignore': generateGitignore(),

    // Source files
    'src/main.tsx': generateMainTsx(),
    'src/index.css': generateIndexCss(),
    'src/routeTree.gen.ts': generateRouteTree(),

    // Lib (Store + Query Client)
    'src/lib/counter-store.ts': generateCounterStore(),
    'src/lib/query-client.ts': generateQueryClient(),

    // Routes
    'src/routes/__root.tsx': generateRootRoute(),
    'src/routes/index.tsx': generateIndexRoute(),
    'src/routes/about.tsx': generateAboutRoute(),
  }
}
