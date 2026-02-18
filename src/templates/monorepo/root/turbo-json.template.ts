import type { MonorepoTemplateData } from '../../../types';

export function generateTurboJson(_data: MonorepoTemplateData): string {
  const turbo = {
    $schema: 'https://turbo.build/schema.json',
    ui: 'tui',
    tasks: {
      build: {
        dependsOn: ['^build'],
        inputs: ['$TURBO_DEFAULT$', '.env*'],
        outputs: ['dist/**'],
      },
      lint: {
        dependsOn: ['^lint'],
      },
      'check-types': {
        dependsOn: ['^check-types'],
      },
      dev: {
        cache: false,
        persistent: true,
      },
    },
  };

  return JSON.stringify(turbo, null, 2) + '\n';
}
