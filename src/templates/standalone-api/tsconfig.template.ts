export function generateStandaloneTsconfig(): string {
  const config = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'bundler',
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      outDir: 'dist',
      declaration: true,
      types: ['bun-types'],
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };

  return JSON.stringify(config, null, 2) + '\n';
}
