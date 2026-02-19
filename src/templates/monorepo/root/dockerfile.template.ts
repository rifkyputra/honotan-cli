import type { MonorepoTemplateData } from '../../../types';

export function generateDockerfile(data: MonorepoTemplateData): string {
  const conditionalCopyLines: string[] = [];
  if (data.hasDb || data.hasDbTurso) {
    conditionalCopyLines.push('COPY packages/db/package.json ./packages/db/');
  }
  if (data.hasCache) {
    conditionalCopyLines.push('COPY packages/cache/package.json ./packages/cache/');
  }
  if (data.hasEventDriven) {
    conditionalCopyLines.push('COPY packages/event-driven/package.json ./packages/event-driven/');
  }

  const conditionalSection = conditionalCopyLines.length > 0
    ? conditionalCopyLines.join('\n') + '\n'
    : '';

  return `FROM oven/bun:1.3.1-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
COPY turbo.json ./
COPY apps/server/package.json ./apps/server/
COPY packages/config/package.json ./packages/config/
COPY packages/env/package.json ./packages/env/
${conditionalSection}RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY . .
RUN bun run build

FROM oven/bun:1.3.1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && \\
  adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/server/package.json ./apps/server/
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
USER nodejs
EXPOSE 3000
CMD ["node", "apps/server/dist/index.mjs"]
`;
}
