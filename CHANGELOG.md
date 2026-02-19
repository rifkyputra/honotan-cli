# Changelog

All notable changes to this project will be documented in this file.

## [0.6.2] - 2026-02-19

### Added

- **`apps/web` counter example** – `src/lib/counter-store.ts` using `@tanstack/react-store` with `increment`, `decrement`, `reset` actions and `useCounter` hook.
- **`apps/web` hello API fetch** – `src/routes/index.tsx` uses `@tanstack/react-query` (`useQuery`) to fetch `GET /hello` from `env.VITE_API_URL`, with `Skeleton` loading state.
- `@tanstack/react-query` (`^5.0.0`) and `@tanstack/react-store` (`^0.7.0`) added to `apps/web` dependencies.
- `QueryClient` + `QueryClientProvider` wired in `src/main.tsx`; `queryClient` passed via TanStack Router context.
- `RouterAppContext` in `__root.tsx` typed with `queryClient: QueryClient`.

## [0.6.1] - 2026-02-19

### Added

- `apps/web/.env.example` generated with `VITE_API_URL` (always) and `VITE_AUTH_URL` (when `hasAuth`).
- `repository`, `homepage`, and `bugs` fields added to `package.json` for npm page links.

### Fixed

- `generate-package.ts` missing `hasPwa` and `hasS3` fields on `MonorepoTemplateData` object — caused `tsc` to error.
- `generate-package.ts` missing `case "s3"` in `collectFiles` switch — caused implicit `undefined` return type error.

## [0.6.0] - 2026-02-19

### Added

- **`packages/s3` template** – S3-compatible object storage via `aws4fetch` (Cloudflare R2, AWS S3, MinIO). Exports `createS3Client(config)` with `listObjects`, `putObject`, `getObject`, `deleteObject` methods. Adds `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET` env vars.
- **`apps/web` template** – Full TanStack Router + React web app generated when `tanstack-router` is selected. Includes TailwindCSS v4 (`@tailwindcss/vite`, no config files), shadcn components (button, dropdown, skeleton, sonner), theme toggle, and auth-aware header/user menu.
- `s3` added to infra package prompt and `PackageTemplate` type.
- `aws4fetch` added to workspace catalog when `hasS3`.

### Fixed

- Escaped backtick syntax errors (`\`` → `` ` ``) in `src-index-css.template.ts` and `src-components-user-menu.template.ts` that prevented all tests from running.

## [0.5.1] - 2025-xx-xx

### Added

- `add generate packages option` – standalone package scaffolding command.

## [0.5.0] - 2025-xx-xx

### Added

- `db-turso` package – SQLite/Turso via Drizzle ORM + `@libsql/client`. Drizzle config, schema, migrate script.
- Client env template (`packages/env/src/client.ts`) with `VITE_` prefix and `import.meta.env` runtime.
- 143 generator tests covering all packages and apps.

### Changed

- `db-turso` uses `drizzle({ client, schema })` API (not `drizzle(client, { schema })`).
- `db-turso` exports wildcard `"./*": "./src/*.ts"` for schema access.
- Auth with `db-turso` uses `drizzleAdapter(db, { provider: "sqlite", schema })`.
- Auth with `db` (postgres) uses native connection string.

## [0.4.0] - 2025-xx-xx

### Added

- `packages/auth` – `better-auth` with cookie security defaults (`sameSite: none`, `secure`, `httpOnly`), `trustedOrigins`.
- Multi-framework monorepo support; `hello` example API resource auto-generated.
- Go (Echo) hexagonal architecture templates.

## [0.3.0] - 2025-xx-xx

### Added

- Standalone API generator with Docker and Go support.
- Removed vertical-slice templates.
