import type { MonorepoTemplateData } from '../../../../types';

export function generateConfigPackageJson(data: MonorepoTemplateData): string {
  const pkg = {
    name: `${data.scope}/config`,
    version: '0.0.0',
    private: true,
    type: 'module',
  };

  return JSON.stringify(pkg, null, 2) + '\n';
}
