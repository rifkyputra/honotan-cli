# Honotan CLI

**A modern CLI for scaffolding monorepo APIs with hexagonal architecture** – Embrace clean architecture, domain-driven design, and polyglot development in a monorepo structure.

## Philosophy

Honotan CLI is built on the belief that **monorepos** and **hexagonal architecture** are the foundation of scalable, maintainable backend systems. This CLI helps you:

- 🏗️ **Build monorepos from day one** – Start with proper structure, not technical debt
- 🎯 **Focus on domain logic** – Hexagonal architecture keeps your business logic pure and testable
- 🔌 **Swap implementations freely** – Ports & adapters let you change databases, frameworks, or protocols without touching core logic
- 🌐 **Polyglot-ready** – Generate APIs in multiple languages (TypeScript, Go) with consistent architecture
- 📦 **Organized by domain** – Each API module is self-contained with clear boundaries

## Features

### Monorepo Structure

Generate a complete monorepo with:

- `apps/` – Your API services
- `packages/` – Shared libraries and utilities
- Workspace management (bun, yarn, npm)
- Consistent tooling across all packages

### Hexagonal Architecture (Primary Pattern)

Every generated API follows clean hexagonal principles:

- **Domain Layer** – Pure business entities and logic
- **Application Layer** – Use cases and port interfaces
- **Adapters Layer**
  - **Inbound**: HTTP, WebSocket, CLI, GraphQL
  - **Outbound**: Databases, Cache, Message Queues, External APIs
- **Dependency Injection** – Composition roots wire everything together

### Multi-Language Support

Generate production-ready APIs in:

- **TypeScript/Node.js** – Hono, Express, Fastify
- **Go** – Chi router with modern Go practices
- _More languages coming soon_

### Full-Stack Ready

Optional client generation with:

- **TanStack Router** – File-based routing for React
- **TanStack Query** – Server state management
- **TanStack Store** – Client state management
- **Tailwind CSS** – Modern styling

## Installation

Install globally with your preferred package manager:

```bash
# Using npm
npm install -g honotan-cli

# Using bun (recommended for monorepos)
bun add -g honotan-cli

# Using bun
bun add -g honotan-cli

# Using yarn
yarn global add honotan-cli
```

## Quick Start

**Create your first monorepo API in 2 minutes:**

```bash
# 1. Generate a monorepo
honotan generate monorepo

# 2. Navigate to your project
cd my-api-platform

# 3. Generate your first API
honotan generate api

# 4. Install dependencies
bun install

# 5. Run tests
bun test

# 6. Start development server
bun dev
```

**That's it!** You now have a production-ready monorepo with hexagonal architecture.

## Local Development

To install and work on this project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/rifkyputra/honotan-cli.git
cd honotan-cli
```

### 2. Install Dependencies

Using Bun (recommended):

```bash
bun install
```

Or using npm:

```bash
npm install
```

### 3. Build the Project

```bash
bun run build
# or
npm run build
```

### 4. Link Locally for Testing

To use the CLI globally during development:

```bash
npm link
# or
bun link
```

Now you can run `honotan` from anywhere on your system.

### 5. Development Mode

Run the CLI in watch mode (auto-reloads on changes):

```bash
bun run dev
# or
npm run dev
```

### 6. Type Checking

```bash
bun run check-types
# or
npm run check-types
```

### 7. Running Tests

```bash
bun test
# or
npm test
```

Complete Monorepo

```bash
honotan generate monorepo
```

Creates a production-ready monorepo structure with:

- Workspace configuration (bun/yarn/npm)
- Apps directory for services
- Packages directory for shared libraries
- Consistent tooling and scripts
- ESLint, Prettier, TypeScript config
- CI/CD templates

### Generate an API Resource (Hexagonal)

```bash
honotan generate api
```

Follow the interactive prompts to:

1. Choose your programming language (TypeScript, Go)
2. Select an API framework (Hono, Express, Fastify, Chi)
3. Enter a resource name (e.g., "product", "user", "order")
4. Select inbound adapters (HTTP, WebSocket, GraphQL)
5. Select outbound adapters (In-Memory, Database, Cache, Message Queue)
6. Specify output directory (default: monorepo structure)

**Generated Structure** (Hexagonal):

```
src/product/
├── domain/
│   └── entities/           # Pure domain models
├── application/
│   ├── ports/
│   │   ├── in/            # Use case interfaces
│   │   └── out/           # Repository interfaces
│   └── use-cases/         # Business logic implementation
├── adapters/
│   ├── in/
│   │   └── http/          # HTTP handlers & routes
│   └── out/
│       ├── persistence/   # Database implementations
│       └── cache/         # Caching implementations
└── composition/           # Dependency injection
```

## Usage

### Generate a New API Resource

```bash
honotan generate api
```

Follow the interactive prompts to:

1. Select an API framework (Hono, Express, Fastify, or Go)
2. Enter a resource name (e.g., "product", "user")
3. Select inbound and outbound adapters
4. Specify output directory

### Generate a Client Project

```bash
honotan generate client
```

Generate a **complete, ready-to-run** TanStack Router + React project:

1. Enter a resource/project name
2. Specify output directory (default: "apps/<resource-name>")
3. Get a fully configured project ready to run

**What You Get:**

- ✅ Complete Vite + React + TypeScript setup
- ✅ TanStack Router with file-based routing
- ✅ TanStack Query for server data fetching
- ✅ TanStack Store for client-side state management
- ✅ Tailwind CSS for styling
- ✅ Headless UI components
- ✅ Heroicons for beautiful icons
- ✅ Counter example (TanStack Store)
- ✅ Fetch /hello example (TanStack Query)
- ✅ All configuration files
- ✅ Ready to run with `npm install && npm run dev`

### Client Structure (TanStack Router + Query + Store)

Following the official TanStack Router conventions:

```
apps/<resource-name>/
├── package.json
├── vite.config.ts
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx               # App entry point
    ├── index.css              # Tailwind CSS imports
    ├── routeTree.gen.ts       # Auto-generated by TanStack Router
    ├── lib/
    │   ├── query-client.ts    # TanStack Query client
    │   └── counter-store.ts   # TanStack Store state
    └── routes/
        ├── __root.tsx         # Root layout with Headless UI navigation
        ├── index.tsx          # Home with counter & fetch examples
        └── about.tsx          # About page
```

**Key Features:**

- **File-based routing**: Routes automatically mapped from file structure
- **Server data fetching**: TanStack Query for caching, background updates, and optimistic UI
- **Client-side state**: TanStack Store for simple global state management
- **Modern UI**: Tailwind CSS + Headless UI for accessible, beautiful components
- **Icons**: Heroicons for scalable SVG icons
- **Counter example**: Inc/dec/reset demonstrating TanStack Store with Headless UI buttons
- **Fetch example**: Call /hello endpoint demonstrating TanStack Query
- **Clean structure**: Minimal setup, easy to understand

**Generated Files:**

**Project Configuration:**

- `package.json` - Dependencies (React, TanStack Router, TanStack Query, TanStack Store, Tailwind CSS, Headless UI, Heroicons)
- `vite.config.ts` - Vite with TanStack Router plugin
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- `tsconfig.json` - TypeScript configuration
- `index.html` - Entry HTML
- `.gitignore` - Git ignore patterns

**Application Code:**
Create a Full Monorepo

```bash
$ honotan generate monorepo

? Project name: my-api-platform
? Package manager: bun
? Include example API: Yes

✅ Monorepo created: my-api-platform/
  ├── apps/
  ├── packages/
  ├── bun-workspace.yaml
  ├── package.json
  └── turbo.json
```

### Generate an E-Commerce API (TypeScript + Hono)

```bash
$ honotan generate api

? Language: TypeScript
? Architecture pattern: Hexagonal (Ports & Adapters)
? API Framework: Hono
? Resource name: product
? Select inbound adapters: HTTP, WebSocket
? Select outbound adapters: Database, Cache, In-Memory Repository
? Output directory: apps/product-api

✅ Generated complete hexagonal API with:
  ✓ Domain entities (Product)
  ✓ Use case ports (in/out)
  ✓ Business logic with tests
  ✓ HTTP REST endpoints
  ✓ WebSocket handlers
  ✓ PostgreSQL repository
  ✓ Redis cache layer
  ✓ In-memory repository for testing
  ✓ Request validation (Valibot)
  ✓ Comprehensive test suite
```

### Generate a Microservice (Go + Chi)

```bash
$ honotan generate api

? Language: Go
? Architecture pattern: Hexagonal (Ports & Adapters)
? API Framework: Chi
? Resource name: order
? Select inbound adapters: HTTP
? Select outbound adapters: Database, Cache
? Output directory: apps/order-service

✅ Generated production-ready Go service with:
  ✓ Domain entities
  ✓ Use case interfaces & implementations
  ✓ Chi HTTP handlers with middleware
  ✓ PostgreSQL repository
  ✓ Redis caching
  ✓ go-playground/validator
  ✓ Comprehensive tests
  ✓ Dockerfile & docker-compose
  ✓ Makefile for workflows
  ✓ Documentation
```

#### clean

Deeply cleans the project by removing build artifacts and dependencies (`node_modules`, `dist`, `.turbo`, etc.) across the monorepo.

```bash
honotan util clean
```

Use this when you need a fresh start or are experiencing dependency/caching issues.

## Examples

### Generate an API Product Resource (Hexagonal)

```bash
$ honotan generate api

? What would you like to do? Create a new resource
? Architecture pattern: Hexagonal (Ports & Adapters)
? API Framework: Hono
? Resource name: product
? Select inbound adapters: HTTP
? Select outbound adapters: In-Memory Repository, Database
? Output directory: src
```

This generates a complete product API module with:

- Domain entities and ports
- Use case implementation with tests
- HTTP routes and controllers
- In-memory and database repositories
- Validation schemas

## Why Honotan CLI?

### vs. Manual Setup

| Manual | Honotan CLI |
|--------|-------------|
| ⏱️ Hours of boilerplate | ⚡ 2 minutes to production-ready code |
| 🤷 Inconsistent patterns | 🎯 Best practices built-in |
| 📚 Read docs for each tool | 🚀 Opinionated, proven setup |
| 🐛 Common mistakes | ✅ Battle-tested architecture |

### vs. Other Generators

| Feature | Honotan | Others |
|---------|---------|--------|
| Hexagonal Architecture | ✅ Core focus | ❌ Rarely supported |
| Monorepo-first | ✅ Built-in | ⚠️ Afterthought |
| Multi-language | ✅ TS, Go, more coming | ❌ Single language |
| Production-ready | ✅ Tests, Docker, CI/CD | ⚠️ Minimal setup |
| Swappable adapters | ✅ Ports & adapters | ❌ Tight coupling |

### Who Should Use This?

**✅ Great fit:**

- Teams building multiple microservices
- Projects requiring long-term maintainability
- Developers learning clean architecture
- Companies with polyglot requirements
- Anyone who values testability

**⚠️ Might be overkill for:**

- Simple CRUD scripts
- One-off utilities
- Projects with < 3 endpoints

## Why Monorepos?

**Traditional multi-repo challenges:**

- ❌ Duplicated boilerplate across services
- ❌ Version hell with shared dependencies
- ❌ Difficult to refactor across services
- ❌ Inconsistent tooling and patterns

**Honotan monorepo benefits:**

- ✅ **Single source of truth** – One repo for all services
- ✅ **Shared libraries** – Reuse domain models, utilities, and types
- ✅ **Atomic changes** – Refactor across multiple services safely
- ✅ **Consistent tooling** – Same linting, testing, and CI/CD everywhere
- ✅ **Better discoverability** – See all services and dependencies at once
- ✅ **Simplified onboarding** – One clone, one install

## Why Hexagonal Architecture?

**The hexagonal pattern (ports & adapters) ensures:**

1. **Domain purity** – Business logic has zero framework dependencies
2. **Testability** – Test use cases without HTTP servers or databases
3. **Flexibility** – Swap Redis for Memcached without touching business code
4. **Framework-agnostic** – Migrate from Hono to Fastify by changing adapters only
5. **Clear boundaries** – Ports define contracts, adapters implement them
6. **Long-term maintainability** – Your domain logic outlives any framework

**Example**: Change from PostgreSQL to MongoDB? Just replace the adapter. Your domain and use cases remain untouched.

## Technologies Used

### TypeScript Stack

- **Frameworks**: Hono, Express, Fastify
- **Validation**: Valibot, Zod
- **Testing**: Vitest, Bun Test
- **ORM**: Drizzle, Prisma _(coming soon)_

### Go Stack

- **Framework**: Chi router
- **Validation**: go-playground/validator
- **Testing**: testify
- **Database**: database/sql, GORM _(coming soon)_
- **Cache**: go-redis

### Client Stack

- **Router**: TanStack Router
- **State**: TanStack Query + TanStack Store
- **UI**: Tailwind CSS + Headless UI
- **Icons**: Heroicons

### Monorepo Tools

- **Package Managers**: bun (recommended), yarn, npm
- **Build**: Turborepo, Nx _(coming soon)_
- **Versioning**: Changesets _(coming soon)_

## Architecture Principles

### Hexagonal Architecture (Primary)

```
┌─────────────────────────────────────────┐
│           Inbound Adapters              │
│  (HTTP, WebSocket, GraphQL, CLI)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Application Layer (Ports)        │
│  ┌─────────────────────────────────┐    │
│  │    Domain Layer (Entities)      │    │
│  └─────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Outbound Adapters              │
│  (Database, Cache, Message Queue)       │
└─────────────────────────────────────────┘
```

**Layers:**

- **Domain** – Pure business entities and rules
- **Application** – Use cases coordinating domain logic
- **Adapters** – Infrastructure implementations
- **Composition** – Wiring dependencies together

**What you get:**

- Complete React + TypeScript + Vite project
- TanStack Router for routing
- TanStack Store for state management
- Counter and fetch examples
- Ready to run immediately

## Technologies Used

- **API Frameworks**: Hono (Express and Fastify coming soon)
- **Client**: TanStack Router + TanStack Query + TanStack Store (React)
- **UI**: Tailwind CSS + Headless UI + Heroicons
- **Validation**: Zod
- **Testing**: Vitest
- **TypeScript**: Full type safety

## Architecture Patterns

### API Pattern

#### Hexagonal (Ports & Adapters)

Clean separation between domain, application, and infrastructure layers:

- **Domain**: Business entities and port interfaces
- **Application**: Use cases implementing business logic
- **Adapters**: Framework-specific implementations (routes, repositories)

### Client Pattern

The client generation follows the **official TanStack Router pattern**:

- **File-based routing**: Routes in `src/routes/` map directly to URLs
- **Simple state**: TanStack Store for global state management
- **Type safety**: Full TypeScript support throughout
- **Minimal setup**: Counter and fetch examples to get started quickly

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Use Cases

**Perfect for:**

- 🏢 **Enterprise microservices** – Build multiple services with shared domain models
- 🚀 **Startup MVPs** – Start modular, scale without rewrites
- 📚 **Learning clean architecture** – Production-ready examples in multiple languages
- 🔄 **Migrating legacy code** – Gradually introduce hexagonal patterns
- 🎓 **Educational projects** – Teach DDD and clean architecture

**Success Stories:**

- E-commerce platforms with 10+ microservices in one monorepo
- SaaS products separating domain logic from infrastructure
- API-first startups with TypeScript and Go services side-by-side

## Roadmap

- [x] TypeScript + Hono hexagonal templates
- [x] Go + Chi hexagonal templates
- [x] Monorepo structure generation
- [x] TanStack Router client generation
- [ ] Database migrations (Drizzle, golang-migrate)
- [ ] GraphQL adapter
- [ ] Message queue adapters (RabbitMQ, Kafka)
- [ ] Rust support
- [ ] Event sourcing patterns
- [ ] gRPC support
- [-] Turborepo integration
- [ ] Express & Fastify support
- [ ] Changesets for versioning

## Publishing

This project uses GitHub Actions to automate publishing to NPM.

1. **Update Version**: Bump the version in `package.json` (e.g., `npm version patch`).
2. **Push Changes**: Push your changes to the `main` branch.
3. **Automated Publish**: The GitHub Action will run tests and publish the new version to NPM automatically.

**Note**: You must add your `NPM_TOKEN` to the repository secrets for this to work.

## License

MIT
