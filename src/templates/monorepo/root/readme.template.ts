import type { MonorepoTemplateData } from '../../../types';

export function generateMonorepoReadme(data: MonorepoTemplateData): string {
  const { projectName, apiFramework, hasClient, hasDb, hasDbTurso, hasCache, hasEventDriven, hasAuth } = data;

  const features = [];
  if (hasClient) features.push('🎨 **Full-stack ready** with TanStack Router + React client');
  if (hasDb) features.push('🗄️ **Database integration** with Drizzle ORM');
  if (hasDbTurso) features.push('🗄️ **Turso SQLite** with Drizzle ORM + libsql client');
  if (hasCache) features.push('⚡ **Redis caching** for performance');
  if (hasEventDriven) features.push('📨 **Event-driven architecture** with RabbitMQ');
  if (hasAuth) features.push('🔐 **Authentication** ready with shared auth package');

  const clientCommands = hasClient ? `
### Client Development

\`\`\`bash
# Start the client dev server
bun --filter @${data.scope}/client dev

# Build the client for production
bun --filter @${data.scope}/client build

# Preview the production build
bun --filter @${data.scope}/client preview
\`\`\`
` : '';

  return `# ${projectName}

A production-ready monorepo built with hexagonal architecture principles.

## 🏗️ Architecture

This monorepo follows **hexagonal (clean) architecture** to ensure:
- ✅ Domain logic stays pure and testable
- ✅ Easy switching of frameworks, databases, or protocols
- ✅ Clear separation between business logic and infrastructure
- ✅ Scalable codebase ready for growth

## 📦 Monorepo Structure

\`\`\`
${projectName}/
├── apps/
│   ├── server/          # ${apiFramework.charAt(0).toUpperCase() + apiFramework.slice(1)} API with hexagonal architecture
${hasClient ? `│   └── client/          # React + TanStack Router client\n` : ''}├── packages/
│   ├── config/          # Shared TypeScript configs
│   ├── env/             # Environment variable validation
${hasDb ? `│   ├── db/              # Database client and schemas\n` : ''}${hasDbTurso ? `│   ├── db/              # Turso SQLite client and schema\n` : ''}${hasCache ? `│   ├── cache/           # Redis cache client\n` : ''}${hasEventDriven ? `│   ├── event-driven/    # RabbitMQ client and event handlers\n` : ''}${hasAuth ? `│   └── auth/            # Authentication utilities\n` : ''}└── turbo.json           # Turborepo pipeline configuration
\`\`\`

## ✨ Features

${features.join('\n')}
- 🏗️ **Hexagonal architecture** in all API services
- 🚀 **Turborepo** for fast builds and caching
- 🐳 **Docker** ready with development and production configs
- 🧪 **Testing** setup included
- 📝 **TypeScript** throughout

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **bun** 8+ (recommended for monorepos)
- **Docker** (optional, for databases and services)

### Installation

\`\`\`bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env

# Start development environment with Docker
docker-compose -f docker-compose.dev.yml up -d
\`\`\`

### Development

\`\`\`bash
# Start all apps in development mode
bun dev

# Start only the server
bun --filter @${data.scope}/server dev

# Build all packages and apps
bun build

# Run all tests
bun test

# Clean all build artifacts
bun clean
\`\`\`

### Server Development

\`\`\`bash
# Start the API server
bun --filter @${data.scope}/server dev

# Build the server for production
bun --filter @${data.scope}/server build

# Run the production server
bun --filter @${data.scope}/server start
\`\`\`
${clientCommands}
## 🏛️ Hexagonal Architecture

Each API in \`apps/server/src/<resource>/\` follows this structure:

\`\`\`
<resource>/
├── domain/                 # Pure business logic
│   └── entities/           # Domain entities
├── application/            # Use cases and ports
│   ├── use-cases/          # Business operations
│   └── ports/
│       ├── in/             # Input ports (interfaces)
│       └── out/            # Output ports (repository interfaces)
├── adapters/               # Infrastructure implementations
│   ├── in/
│   │   └── http/           # HTTP controllers, routes, DTOs
│   └── out/
│       └── persistence/    # Repository implementations
└── composition-root.ts     # Dependency injection
\`\`\`

### Key Benefits

- **Testability**: Domain logic has zero dependencies
- **Flexibility**: Swap databases, frameworks, or APIs without touching core logic
- **Maintainability**: Clear boundaries and single responsibility
- **Scalability**: Add new features without breaking existing code

## 📚 Package Management

This monorepo uses **bun workspaces** with **Turborepo** for:

- **Dependency deduplication**: Shared dependencies installed once
- **Build caching**: Turborepo caches build outputs
- **Parallel execution**: Run tasks across packages simultaneously
- **Task pipelines**: Automatic dependency ordering

### Adding a New Package

\`\`\`bash
# Create a new shared package
mkdir -p packages/new-package/src
cd packages/new-package

# Initialize package.json
bun init

# Install from root
bun install
\`\`\`

### Adding Dependencies

\`\`\`bash
# Add to a specific workspace
bun --filter @${data.scope}/server add express

# Add to root (development tools)
bun add -Dw typescript

# Add workspace dependency
bun --filter @${data.scope}/server add @${data.scope}/db
\`\`\`

## 🐳 Docker

### Development

\`\`\`bash
# Start infrastructure services (database, cache, etc.)
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
\`\`\`

### Production

\`\`\`bash
# Build and start all services
docker-compose up -d

# Build specific service
docker-compose build server

# View logs
docker-compose logs -f server
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage

# Test a specific package
bun --filter @${data.scope}/server test
\`\`\`

## 📝 Scripts Reference

### Root Commands

- \`bun dev\`: Start all apps in development mode
- \`bun build\`: Build all packages and apps
- \`bun test\`: Run all tests
- \`bun lint\`: Lint all packages
- \`bun clean\`: Remove all build artifacts and node_modules

### Package-Specific Commands

Use \`bun --filter <package-name> <command>\` to run commands in specific packages.

Example:
\`\`\`bash
bun --filter @${data.scope}/server dev
bun --filter @${data.scope}/db build
\`\`\`

## 🔧 Configuration

### Environment Variables

Each app has its own \`.env.example\` file. Copy it to \`.env\` and configure:

- \`apps/server/.env\`: Server configuration
${hasClient ? `- \`apps/client/.env\`: Client configuration\n` : ''}
### TypeScript

TypeScript configuration is shared via \`packages/config/tsconfig.base.json\` and extended by each package.

### Linting & Formatting

Configure ESLint and Prettier in each package or use a shared config from \`packages/config\`.

## 🚢 Deployment

### Building for Production

\`\`\`bash
# Build all packages and apps
bun build

# Build specific app
bun --filter @${data.scope}/server build
\`\`\`

### Docker Deployment

\`\`\`bash
# Build production images
docker-compose build

# Start production services
docker-compose up -d
\`\`\`

### Environment Variables

Remember to set production environment variables:

${hasDb ? `- \`DATABASE_URL\`: PostgreSQL connection string\n` : ''}${hasDbTurso ? `- \`DATABASE_URL\`: Turso database URL (e.g. libsql://your-db.turso.io)\n- \`TURSO_AUTH_TOKEN\`: Turso auth token\n` : ''}${hasCache ? `- \`REDIS_URL\`: Redis connection string\n` : ''}${hasEventDriven ? `- \`RABBITMQ_URL\`: RabbitMQ connection string\n` : ''}- \`PORT\`: Server port (default: 3000)
- \`NODE_ENV\`: Set to \`production\`

## 📖 Learn More

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Turborepo Documentation](https://turbo.build/repo)
- [bun Workspaces](https://bun.io/workspaces)
${apiFramework === 'hono' ? '- [Hono Documentation](https://hono.dev/)' : ''}
${apiFramework === 'express' ? '- [Express Documentation](https://expressjs.com/)' : ''}
${apiFramework === 'fastify' ? '- [Fastify Documentation](https://www.fastify.io/)' : ''}
${hasClient ? '- [TanStack Router](https://tanstack.com/router)' : ''}

`;
}
