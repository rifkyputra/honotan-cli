import type { MonorepoTemplateData } from '../../../types';

export function generateDockerCompose(data: MonorepoTemplateData): string {
  const hasInfra = data.hasDb || data.hasCache || data.hasEventDriven;

  const services: string[] = [];
  const serverDependsOn: string[] = [];
  const serverEnv: string[] = [
    '      PORT: 3000',
    '      NODE_ENV: production',
    '      CORS_ORIGIN: http://localhost:3000',
  ];

  if (data.hasDb) {
    serverDependsOn.push('postgres');
    serverEnv.push(`      DATABASE_URL: postgresql://${data.kebabName}:${data.kebabName}_password@postgres:5432/${data.kebabName}`);
    services.push(`  postgres:
    image: postgres:16-alpine
    container_name: ${data.kebabName}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${data.kebabName}
      POSTGRES_PASSWORD: ${data.kebabName}_password
      POSTGRES_DB: ${data.kebabName}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${data.kebabName}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - ${data.kebabName}-network`);
  }

  if (data.hasCache) {
    serverDependsOn.push('redis');
    serverEnv.push('      REDIS_URL: redis://redis:6379');
    services.push(`  redis:
    image: redis:7-alpine
    container_name: ${data.kebabName}-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - ${data.kebabName}-network`);
  }

  if (data.hasEventDriven) {
    serverDependsOn.push('rabbitmq');
    serverEnv.push(`      RABBITMQ_URL: amqp://${data.kebabName}:${data.kebabName}_password@rabbitmq:5672`);
    services.push(`  rabbitmq:
    image: rabbitmq:3.13-management-alpine
    container_name: ${data.kebabName}-rabbitmq
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: ${data.kebabName}
      RABBITMQ_DEFAULT_PASS: ${data.kebabName}_password
    ports:
      - "5672:5672"
      - "15672:15672"
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - ${data.kebabName}-network`);
  }

  // Build depends_on block
  let dependsOnBlock = '';
  if (serverDependsOn.length > 0) {
    const deps = serverDependsOn
      .map((dep) => `      ${dep}:\n        condition: service_healthy`)
      .join('\n');
    dependsOnBlock = `    depends_on:\n${deps}\n`;
  }

  // Build server service
  const networkLine = hasInfra ? `    networks:\n      - ${data.kebabName}-network\n` : '';
  const serverService = `  server:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${data.kebabName}-server
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
${serverEnv.join('\n')}
${dependsOnBlock}${networkLine}`;

  services.push(serverService);

  // Build volumes section
  const volumes: string[] = [];
  if (data.hasDb) {
    volumes.push('  postgres-data:');
  }

  // Assemble full file
  let content = `services:\n${services.join('\n\n')}\n`;

  if (hasInfra) {
    if (volumes.length > 0) {
      content += `\nvolumes:\n${volumes.join('\n')}\n`;
    }
    content += `\nnetworks:\n  ${data.kebabName}-network:\n    driver: bridge\n`;
  }

  return content;
}
