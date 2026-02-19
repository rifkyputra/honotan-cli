# Honotan CLI

**Scaffold production-ready monorepos with hexagonal architecture** – opinionated, Bun-native, TypeScript-first.

## Features

- **Monorepo generator** – complete `apps/` + `packages/` workspace with Turborepo
- **Hexagonal API scaffolding** – domain, application, and adapter layers with dependency injection
- **Full-stack optional** – TanStack Router + React web app with shadcn components
- **Infra packages à la carte** – pick only what you need
- **Polyglot** – TypeScript (Hono) and Go (Chi) API support

## Installation

```bash
bun add -g honotan
```

## Quick Start

```bash
# Generate a full monorepo
honotan generate monorepo

# Add a hexagonal API resource inside your project
honotan generate api

# Generate a standalone client app
honotan generate client
```

## Monorepo Generator

```bash
honotan generate monorepo
```

Interactive prompts let you choose:

- **API framework** – Hono (default) or Go
- **Client** – TanStack Router (React)
- **Infrastructure packages** – any combination of the packages below

### Always generated

| Path | Purpose |
| ------ | ------- |
| `packages/config` | Shared TypeScript base config |
| `packages/env` | Validated env vars (`@t3-oss/env-core` + Zod) |
| `apps/server` | API server with a `hello` example resource |

### Optional infrastructure packages

| Flag | Package | Stack |
| ---- | ------- | ----- |
| `db` | `packages/db` | PostgreSQL via `Bun.sql` |
| `db-turso` | `packages/db` | SQLite/Turso via Drizzle + `@libsql/client` |
| `cache` | `packages/cache` | Redis via `Bun.redis` |
| `event-driven` | `packages/event-driven` | RabbitMQ via `amqplib` |
| `auth` | `packages/auth` | `better-auth` (drizzle adapter when db-turso, native pg otherwise) |
| `s3` | `packages/s3` | S3-compatible object storage via `aws4fetch` (Cloudflare R2, AWS S3, MinIO) |
| `pwa` | – | `vite-plugin-pwa` support in the web app |

### Client app (`apps/web`)

Generated when TanStack Router is selected:

- Vite + React + TypeScript
- TailwindCSS v4 (`@tailwindcss/vite` – no config files needed)
- TanStack Router `^1.141.1`
- shadcn components (button, dropdown, skeleton, sonner)
- Theme toggle (light / dark)
- Auth-aware header + user menu when `auth` is enabled

## Hexagonal API Generator

```bash
honotan generate api
```

Generates a self-contained resource module inside `apps/server/src/<name>/`:

```
src/product/
├── domain/
│   ├── entities/           # Business models
│   └── ports/
│       ├── in/             # Use case interfaces
│       └── out/            # Repository interfaces
├── application/
│   └── use-cases/          # Business logic + tests
├── adapters/
│   ├── in/http/            # Routes, controllers, validation
│   └── out/persistence/    # Repository implementations
└── index.ts                # Composition root
```

Supported frameworks: **Hono**, **Go (Chi)**
Inbound adapters: **HTTP**, **WebSocket**
Outbound adapters: **In-Memory**, **Database**, **Cache**

## Client Generator

```bash
honotan generate client
```

Generates a standalone TanStack Router + React app (outside the monorepo structure).

## Environment Variables

Each generated project includes `.env.example`. Variables added per package:

| Package | Variables |
| ------- | --------- |
| `db` | `DATABASE_URL` |
| `db-turso` | `DATABASE_URL`, `DATABASE_AUTH_TOKEN` |
| `cache` | `REDIS_URL` |
| `event-driven` | `RABBITMQ_URL` |
| `auth` | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |
| `s3` | `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET` |

## Local Development

```bash
git clone https://github.com/rifkyputra/honotan-cli.git
cd honotan-cli
bun install

# Run tests (generate projects into .generated/ and assert on output files)
bun test

# Type check
bun run check-types

# Build
bun run build

# Link globally for manual testing
bun link
```

## Roadmap

- [x] TypeScript + Hono hexagonal templates
- [x] Go + Chi hexagonal templates
- [x] Monorepo structure generation
- [x] TanStack Router client generation
- [x] DB (Postgres), DB-Turso, Cache, Event-Driven, Auth, S3 packages
- [x] Turborepo integration
- [ ] GraphQL adapter
- [ ] Kafka support
- [ ] Express & Fastify support
- [ ] Rust support

## License

MIT
