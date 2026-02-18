import type { MonorepoTemplateData } from '../../../types';

export function generateRootTsconfig(data: MonorepoTemplateData): string {
  const tsconfig = {
    extends: `${data.scope}/config/tsconfig.base.json`,
  };

  return JSON.stringify(tsconfig, null, 2) + '\n';
}
