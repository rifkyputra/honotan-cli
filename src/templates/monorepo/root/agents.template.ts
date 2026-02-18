import type { MonorepoTemplateData } from '../../../types';

export function generateMonorepoAgents(data: MonorepoTemplateData): string {
  const { projectName, apiFramework, hasClient, hasDb, hasCache, hasEventDriven, hasAuth } = data;

  return `# AI Coding Assistant Guide
## Project Overview

**Name**: ${projectName}  
**Type**: Monorepo with hexagonal architecture  
**API Framework**: ${apiFramework.charAt(0).toUpperCase() + apiFramework.slice(1)}  
**Client**: ${hasClient ? 'React + TanStack Router' : 'None'}  
**Package Manager**: bun (workspaces)  
**Build System**: Turborepo  

## Architecture Principles

This monorepo follows **hexagonal (clean) architecture** for all API services. When generating code, always respect these boundaries:

### 1. Domain Layer (Pure Business Logic)
- **Location**: \`apps/server/src/<resource>/domain/\`
- **Rules**:
  - no frameworks, databases, HTTP
  - Define entities, value objects, and domain logic
  - Pure TypeScript classes and functions
  - 100% testable with unit tests

### 2. Application Layer (Use Cases & Ports)
- **Location**: \`apps/server/src/<resource>/application/\`
- **Rules**:
  - Define use cases (business operations)
  - Define port interfaces (in/ and out/)
  - Depend ONLY on domain layer
  - No concrete implementations (only interfaces)

### 3. Adapters Layer (Infrastructure)
- **Location**: \`apps/server/src/<resource>/adapters/\`
- **Rules**:
  - Implement port interfaces
  - Inbound: HTTP controllers, DTOs, validation
  - Outbound: Repository implementations, external APIs
  - Can use frameworks and libraries

### 4. Composition Root
- **Location**: \`apps/server/src/<resource>/composition-root.ts\`
- **Rules**:
  - Wire up all dependencies
  - Create instances and inject them
  - Export the configured router

## Monorepo Structure

\`\`\`
${projectName}/
├── apps/
│   ├── server/          # Backend API
${hasClient ? `│   └── client/          # Frontend app\n` : ''}├── packages/
│   ├── config/          # Shared configs
│   ├── env/             # Env validation
${hasDb ? `│   ├── db/              # Database\n` : ''}${hasCache ? `│   ├── cache/           # Cache\n` : ''}${hasEventDriven ? `│   ├── event-driven/    # Events/messaging\n` : ''}${hasAuth ? `│   └── auth/            # Authentication\n` : ''}└── turbo.json
\`\`\`

## Code Generation Guidelines

### When Adding a New API Resource

1. **Create the domain layer first**:
   \`\`\`
   apps/server/src/<resource>/domain/entities/<Entity>.ts
   \`\`\`

2. **Define use cases and ports**:
   \`\`\`
   apps/server/src/<resource>/application/
   ├── use-cases/
   │   ├── Create<Resource>.ts
   │   ├── Get<Resource>.ts
   │   ├── Update<Resource>.ts
   │   └── Delete<Resource>.ts
   └── ports/
       ├── in/
       │   └── I<Resource>Service.ts
       └── out/
           └── I<Resource>Repository.ts
   \`\`\`

3. **Implement adapters**:
   \`\`\`
   apps/server/src/<resource>/adapters/
   ├── in/http/
   │   ├── <resource>.controller.ts
   │   ├── <resource>.routes.ts
   │   ├── <resource>.dto.ts
   │   └── <resource>.validation.ts
   └── out/persistence/
       ├── InMemory<Resource>Repository.ts
       └── <Resource>Repository.ts (if database)
   \`\`\`

4. **Create composition root**:
   \`\`\`
   apps/server/src/<resource>/composition-root.ts
   \`\`\`

### Naming Conventions

- **Entities**: PascalCase (e.g., \`User\`, \`Product\`)
- **Interfaces**: \`I\` prefix (e.g., \`IUserRepository\`, \`IUserService\`)
- **Use Cases**: PascalCase (e.g., \`CreateUser\`, \`GetUserById\`)
- **DTOs**: \`<Action><Resource>DTO\` (e.g., \`CreateUserDTO\`)
- **Validation Schemas**: \`<action><Resource>Schema\` (e.g., \`createUserSchema\`)
- **Files**: kebab-case (e.g., \`user-repository.ts\`)

### Testing Strategy

- **Domain Layer**: Pure unit tests
- **Application Layer**: Test use cases with mocked repositories
- **Adapters**: Integration tests (test actual HTTP endpoints, DB queries)

### Import Paths

Use workspace aliases for shared packages:

\`\`\`typescript
import { env } from '@${data.scope}/env/server';
${hasDb ? `import { db } from '@${data.scope}/db';\n` : ''}${hasCache ? `import { cache } from '@${data.scope}/cache';\n` : ''}${hasAuth ? `import { auth } from '@${data.scope}/auth';\n` : ''}
\`\`\`

## Common Patterns

### 1. Repository Pattern (Outbound Port)

\`\`\`typescript
// application/ports/out/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
\`\`\`

### 2. Service Pattern (Inbound Port)

\`\`\`typescript
// application/ports/in/IUserService.ts
export interface IUserService {
  getUser(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  createUser(data: CreateUserDTO): Promise<User>;
  updateUser(id: string, data: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
\`\`\`

### 3. Use Case Pattern

\`\`\`typescript
// application/use-cases/CreateUser.ts
export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    const user = new User(dto);
    return await this.userRepository.create(user);
  }
}
\`\`\`

### 4. HTTP Controller Pattern

\`\`\`typescript
// adapters/in/http/user.controller.ts
export function createUserController(userService: IUserService) {
  return async (c: Context) => {
    const dto = await c.req.json();
    const user = await userService.createUser(dto);
    return c.json(user, 201);
  };
}
\`\`\`

### 5. Composition Root Pattern

\`\`\`typescript
// composition-root.ts
export function createUserModule() {
  // Repositories
  const userRepository = new InMemoryUserRepository();
  
  // Use Cases
  const createUser = new CreateUser(userRepository);
  const getUser = new GetUserById(userRepository);
  
  // Service
  const userService = new UserService(createUser, getUser, ...);
  
  // Routes
  const router = createUserRoutes(userService);
  
  return router;
}
\`\`\`

## Framework-Specific Patterns

### ${apiFramework.charAt(0).toUpperCase() + apiFramework.slice(1)}

${apiFramework === 'hono' ? `
#### Controller
\`\`\`typescript
import { Context } from 'hono';

export function createController(service: IService) {
  return async (c: Context) => {
    const result = await service.execute();
    return c.json(result);
  };
}
\`\`\`

#### Routes
\`\`\`typescript
import { Hono } from 'hono';

export function createRoutes(service: IService) {
  const app = new Hono();
  app.get('/', createController(service));
  return app;
}
\`\`\`
` : ''}${apiFramework === 'express' ? `
#### Controller
\`\`\`typescript
import { Request, Response } from 'express';

export function createController(service: IService) {
  return async (req: Request, res: Response) => {
    const result = await service.execute();
    res.json(result);
  };
}
\`\`\`

#### Routes
\`\`\`typescript
import express from 'express';

export function createRoutes(service: IService) {
  const router = express.Router();
  router.get('/', createController(service));
  return router;
}
\`\`\`
` : ''}${apiFramework === 'fastify' ? `
#### Handler
\`\`\`typescript
import { FastifyRequest, FastifyReply } from 'fastify';

export function createHandler(service: IService) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await service.execute();
    return reply.send(result);
  };
}
\`\`\`

#### Routes
\`\`\`typescript
import { FastifyInstance } from 'fastify';

export async function createRoutes(
  app: FastifyInstance,
  service: IService
) {
  app.get('/', createHandler(service));
}
\`\`\`
` : ''}
## Shared Packages

### @${data.scope}/env

Environment variable validation using Zod:

\`\`\`typescript
import { env } from '@${data.scope}/env/server';

const port = env.PORT;
const dbUrl = env.DATABASE_URL;
\`\`\`

${hasDb ? `
### @${data.scope}/db

Database client and schema:

\`\`\`typescript
import { db } from '@${data.scope}/db';

const users = await db.select().from(schema.users);
\`\`\`
` : ''}${hasCache ? `
### @${data.scope}/cache

Redis cache client:

\`\`\`typescript
import { cache } from '@${data.scope}/cache';

await cache.set('key', 'value', { ex: 3600 });
const value = await cache.get('key');
\`\`\`
` : ''}${hasEventDriven ? `
### @${data.scope}/event-driven

RabbitMQ client and event handling:

\`\`\`typescript
import { eventBus } from '@${data.scope}/event-driven';

await eventBus.publish('user.created', { userId: '123' });
\`\`\`
` : ''}${hasAuth ? `
### @${data.scope}/auth

Authentication utilities:

\`\`\`typescript
import { verifyToken, hashPassword } from '@${data.scope}/auth';

const user = await verifyToken(token);
const hash = await hashPassword(password);
\`\`\`
` : ''}
## Package Management Commands

\`\`\`bash
# Add dependency to specific package
bun --filter @${data.scope}/server add <package>

# Add dev dependency to workspace root
bun add -Dw <package>

# Add workspace dependency
bun --filter @${data.scope}/server add @${data.scope}/db

# Run script in specific package
bun --filter @${data.scope}/server dev
\`\`\`

## When Making Changes

1. **Respect layer boundaries**: Domain should never import from adapters
2. **Use dependency injection**: Pass dependencies through constructors
3. **Test at each layer**: Unit tests for domain, integration tests for adapters
4. **Keep interfaces in ports**: Define contracts in \`application/ports/\`
5. **Follow naming conventions**: Stay consistent with existing code
6. **Update types**: Keep TypeScript types accurate and strict

## Error Handling

### Domain Layer
\`\`\`typescript
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
\`\`\`

### Application Layer
\`\`\`typescript
export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}
\`\`\`

### HTTP Layer
\`\`\`typescript
// Map domain/application errors to HTTP responses
try {
  const result = await service.execute();
  return c.json(result);
} catch (error) {
  if (error instanceof ApplicationError) {
    return c.json({ error: error.message }, error.statusCode);
  }
  return c.json({ error: 'Internal Server Error' }, 500);
}
\`\`\`

## Best Practices for AI Assistants

1. ✅ **Always generate hexagonal architecture** - don't mix layers
2. ✅ **Create comprehensive tests** - especially for domain logic
3. ✅ **Follow TypeScript best practices** - use strict types
4. ✅ **Use existing patterns** - check similar resources for reference
5. ✅ **Keep dependencies minimal** - especially in domain/application layers
6. ✅ **Document complex logic** - add JSDoc comments
7. ✅ **Handle errors properly** - use custom error classes
8. ✅ **Validate inputs** - use Zod schemas for validation
9. ✅ **Use workspace packages** - import from \`@${data.scope}/*\`
10. ✅ **Run tests after changes** - ensure nothing breaks

## Quick Reference

- **API Framework**: ${apiFramework}
- **Test Framework**: Vitest (recommended) or Jest
- **Validation**: Zod
- **Workspace Scope**: \`@${data.scope}\`
${hasDb ? `- **Database**: PostgreSQL + Drizzle ORM\n` : ''}${hasCache ? `- **Cache**: Redis\n` : ''}${hasEventDriven ? `- **Message Queue**: RabbitMQ\n` : ''}${hasClient ? `- **Frontend**: React + TanStack Router\n` : ''}
---

**Remember**: The goal is clean, maintainable, testable code. When in doubt, favor simplicity and adherence to hexagonal architecture principles.
`;
}
