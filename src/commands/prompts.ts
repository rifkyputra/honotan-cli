import inquirer from "inquirer";
import type {
  ArchitecturePattern,
  ClientArchitecturePattern,
  Framework,
  ApiFramework,
  ClientFramework,
  InboundAdapter,
  OutboundAdapter,
  ExistingResourceInfo,
  InfraPackage,
} from "../types";

export async function promptAction(): Promise<"new" | "add-adapter"> {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "Create a new resource", value: "new" },
        {
          name: "Add adapter(s) to an existing resource",
          value: "add-adapter",
        },
      ],
    },
  ]);
  return action;
}

export async function promptArchitecture(): Promise<ArchitecturePattern> {
  const { architecture } = await inquirer.prompt([
    {
      type: "list",
      name: "architecture",
      message: "Architecture pattern:",
      choices: [
        { name: "Hexagonal (Ports & Adapters)", value: "hexagonal" },
        { name: "Vertical Slice", value: "vertical-slice" },
      ],
    },
  ]);
  return architecture;
}

export async function promptClientArchitecture(): Promise<ClientArchitecturePattern> {
  const { architecture } = await inquirer.prompt([
    {
      type: "list",
      name: "architecture",
      message: "Client architecture pattern:",
      choices: [
        { name: "Horizontal Slice (Feature-based)", value: "horizontal-slice" },
        {
          name: "Clean Architecture (Layer-based)",
          value: "clean-architecture",
        },
      ],
    },
  ]);
  return architecture;
}

export async function promptFramework(): Promise<Framework[]> {
  const { frameworks } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "frameworks",
      message: "Select framework(s):",
      choices: [
        { name: "Hono (API server)", value: "hono" as const, checked: true },
        {
          name: "TanStack Router (React client)",
          value: "tanstack-router" as const,
        },
      ],
      validate: (val: unknown[]) =>
        val.length > 0 || "Select at least one framework",
    },
  ]);
  return frameworks;
}

export async function promptApiFramework(): Promise<ApiFramework> {
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "API Framework:",
      choices: [
        { name: "Hono", value: "hono" },
        { name: "Go (Chi)", value: "go" },
        // Coming soon:
        // { name: 'Express', value: 'express' },
        // { name: 'Fastify', value: 'fastify' },
      ],
    },
  ]);
  return framework;
}

export async function promptClientFramework(): Promise<ClientFramework> {
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Client Framework:",
      choices: [{ name: "TanStack Router (React)", value: "tanstack-router" }],
    },
  ]);
  return framework;
}

export async function promptResourceName(): Promise<string> {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Resource name (e.g., product, order):",
      validate: (val: string) =>
        val.trim().length > 0 || "Resource name is required",
    },
  ]);
  return name.trim();
}

export async function promptInboundAdapters(
  framework: Framework,
): Promise<InboundAdapter[]> {
  const frameworkLabel = framework.charAt(0).toUpperCase() + framework.slice(1);
  const { adapters } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "adapters",
      message: "Select inbound adapters:",
      choices: [
        {
          name: `HTTP (${frameworkLabel} controller + routes + validation)`,
          value: "http" as const,
          checked: true,
        },
        {
          name: "WebSocket (generic WebSocket adapter)",
          value: "websocket" as const,
        },
      ],
      validate: (val: unknown[]) =>
        val.length > 0 || "Select at least one inbound adapter",
    },
  ]);
  return adapters;
}

export async function promptOutboundAdapters(): Promise<OutboundAdapter[]> {
  const { adapters } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "adapters",
      message: "Select outbound adapters:",
      choices: [
        {
          name: "In-Memory Repository",
          value: "in-memory" as const,
          checked: true,
        },
        { name: "Database (Bun.sql for Postgres)", value: "database" as const },
        { name: "Cache (Bun.redis)", value: "cache" as const },
      ],
      validate: (val: unknown[]) =>
        val.length > 0 || "Select at least one outbound adapter",
    },
  ]);
  return adapters;
}

export async function promptOutputDir(defaultDir = "src"): Promise<string> {
  const { output } = await inquirer.prompt([
    {
      type: "input",
      name: "output",
      message: "Output directory:",
      default: defaultDir,
    },
  ]);
  return output;
}

export async function promptExistingResource(
  resources: ExistingResourceInfo[],
): Promise<ExistingResourceInfo> {
  const { resource } = await inquirer.prompt([
    {
      type: "list",
      name: "resource",
      message: "Select resource:",
      choices: resources.map((r) => ({
        name: `${r.name} (${r.architecture}, ${r.framework})`,
        value: r,
      })),
    },
  ]);
  return resource;
}

export async function promptAdapterDirection(): Promise<
  "inbound" | "outbound"
> {
  const { direction } = await inquirer.prompt([
    {
      type: "list",
      name: "direction",
      message: "What adapter type do you want to add?",
      choices: [
        { name: "Inbound adapter", value: "inbound" },
        { name: "Outbound adapter", value: "outbound" },
      ],
    },
  ]);
  return direction;
}

export async function promptNewInboundAdapters(
  existing: ExistingResourceInfo,
  framework: Framework,
): Promise<InboundAdapter[]> {
  const frameworkLabel = framework.charAt(0).toUpperCase() + framework.slice(1);
  const choices: { name: string; value: InboundAdapter }[] = [];
  if (!existing.hasHttp) {
    choices.push({
      name: `HTTP (${frameworkLabel} controller + routes + validation)`,
      value: "http",
    });
  }
  if (!existing.hasWebSocket) {
    choices.push({
      name: "WebSocket (generic WebSocket adapter)",
      value: "websocket",
    });
  }

  if (choices.length === 0) {
    return [];
  }

  const { adapters } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "adapters",
      message: "Select inbound adapter(s) to add:",
      choices,
      validate: (val: unknown[]) =>
        val.length > 0 || "Select at least one adapter",
    },
  ]);
  return adapters;
}

export async function promptNewOutboundAdapters(
  existing: ExistingResourceInfo,
): Promise<OutboundAdapter[]> {
  const choices: { name: string; value: OutboundAdapter }[] = [];
  if (!existing.hasInMemory) {
    choices.push({ name: "In-Memory Repository", value: "in-memory" });
  }
  if (!existing.hasDatabase) {
    choices.push({
      name: "Database (Bun.sql for Postgres)",
      value: "database",
    });
  }
  if (!existing.hasCache) {
    choices.push({ name: "Cache (Bun.redis)", value: "cache" });
  }

  if (choices.length === 0) {
    return [];
  }

  const { adapters } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "adapters",
      message: "Select outbound adapter(s) to add:",
      choices,
      validate: (val: unknown[]) =>
        val.length > 0 || "Select at least one adapter",
    },
  ]);
  return adapters;
}

export async function promptConfirm(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmed",
      message,
      default: true,
    },
  ]);
  return confirmed;
}

export async function promptProjectName(): Promise<string> {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Project name (used as directory name and @scope prefix):",
      validate: (val: string) => {
        const trimmed = val.trim();
        if (trimmed.length === 0) return "Project name is required";
        if (!/^[a-z0-9-]+$/.test(trimmed))
          return "Use lowercase letters, numbers, and hyphens only";
        return true;
      },
    },
  ]);
  return name.trim();
}

export async function promptInfraPackages(): Promise<InfraPackage[]> {
  const { packages } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "packages",
      message: "Select optional infrastructure packages to include:",
      choices: [
        { name: "DB (Postgres via Bun.sql)", value: "db" as const },
        { name: "DB (Turso SQLite via @libsql/client + Drizzle)", value: "db-turso" as const },
        { name: "Cache (Redis via Bun.redis)", value: "cache" as const },
        {
          name: "Event-Driven (RabbitMQ via amqplib)",
          value: "event-driven" as const,
        },
        {
          name: "Auth (better-auth)",
          value: "auth" as const,
        },
      ],
    },
  ]);
  return packages;
}
