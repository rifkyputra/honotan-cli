import type { MonorepoTemplateData } from '../../../../types';

export function generateWebEnvExample(data: MonorepoTemplateData): string {
  const lines: string[] = [
    '# Client',
    'VITE_API_URL=http://localhost:3000',
  ];

  if (data.hasAuth) {
    lines.push('VITE_AUTH_URL=http://localhost:3000');
  }

  return lines.join('\n') + '\n';
}
