import type { MonorepoTemplateData } from '../../../../types';

export function generateTsconfigBase(_data: MonorepoTemplateData): string {
  const config = {
    $schema: 'https://json.schemastore.org/tsconfig',
    compilerOptions: {
      target: 'ESNext',
      module: 'ESNext',
      moduleResolution: 'bundler',
      lib: ['ESNext'],
      verbatimModuleSyntax: true,
      strict: true,
      skipLibCheck: true,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      isolatedModules: true,
      noUncheckedIndexedAccess: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      types: ['node'],
    },
  };

  return JSON.stringify(config, null, 2) + '\n';
}
