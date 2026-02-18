import type { MonorepoTemplateData } from '../../../types';

export function generateEnvExample(data: MonorepoTemplateData): string {
  const lines: string[] = [
    '# Server',
    'PORT=3000',
    'NODE_ENV=development',
    'CORS_ORIGIN=http://localhost:3000',
  ];

  if (data.hasDb) {
    lines.push(
      '',
      '# Database',
      `DATABASE_URL=postgresql://${data.kebabName}:${data.kebabName}_password@localhost:5432/${data.kebabName}`,
    );
  }

  if (data.hasCache) {
    lines.push(
      '',
      '# Cache',
      'REDIS_URL=redis://localhost:6379',
    );
  }

  if (data.hasEventDriven) {
    lines.push(
      '',
      '# Event-Driven',
      `RABBITMQ_URL=amqp://${data.kebabName}:${data.kebabName}_password@localhost:5672`,
    );
  }

  if (data.hasAuth) {
    lines.push(
      '',
      '# Auth (better-auth)',
      'BETTER_AUTH_SECRET=your-secret-key-at-least-32-characters-long',
      'BETTER_AUTH_URL=http://localhost:3000',
    );
  }

  return lines.join('\n') + '\n';
}
