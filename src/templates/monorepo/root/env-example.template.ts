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

  if (data.hasDbTurso) {
    lines.push(
      '',
      '# Database (Turso SQLite)',
      '# For local development you can use: TURSO_DATABASE_URL=file:local.db',
      'TURSO_DATABASE_URL=libsql://your-db-name.turso.io',
      'TURSO_AUTH_TOKEN=your-turso-auth-token',
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

  if (data.hasS3) {
    lines.push(
      '',
      '# S3 / Object Storage (aws4fetch — compatible with Cloudflare R2, AWS S3, MinIO)',
      'S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com',
      'S3_ACCESS_KEY_ID=your-access-key-id',
      'S3_SECRET_ACCESS_KEY=your-secret-access-key',
      'S3_BUCKET=your-bucket-name',
    );
  }

  return lines.join('\n') + '\n';
}
