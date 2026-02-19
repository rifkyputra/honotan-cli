import type { MonorepoTemplateData } from "../../../types";

export function generateRootPackageJson(data: MonorepoTemplateData): string {
  const catalog: Record<string, string> = {
    zod: "^4.1.13",
    typescript: "^5",
    "@types/bun": "^1.3.4",
    dotenv: "^17.2.2",
  };

  if (data.hasDbTurso || data.hasDb) {
    catalog["@libsql/client"] = "0.15.15";
    catalog["libsql"] = "0.5.22";
    catalog["drizzle-orm"] = "^0.45.1";
    catalog["drizzle-kit"] = "^0.31.8";
  }

  if (data.hasAuth) {
    catalog["better-auth"] = "^1.4.18";
  }

  if (data.hasS3) {
    catalog["aws4fetch"] = "^1.0.20";
  }

  if (data.hasEventDriven) {
    catalog["amqplib"] = "^0.10.4";
  }

  const pkg = {
    name: data.projectName,
    private: true,
    workspaces: {
      packages: ["apps/*", "packages/*"],
      catalog,
    },
    type: "module",
    scripts: {
      dev: "turbo dev",
      build: "turbo build",
      "check-types": "turbo check-types",
      // Added scripts
      "dev:native": "turbo -F native dev",
      "dev:web": "turbo -F web dev",
      "dev:server": "turbo -F server dev",
      check: "oxlint && oxfmt --write",
    },
    dependencies: {
      [`${data.scope}/env`]: "workspace:*",
      zod: "catalog:",
      dotenv: "catalog:",
    },
    devDependencies: {
      [`${data.scope}/config`]: "workspace:*",
      // '@types/node': 'catalog:', // Example uses bun types in devDependencies
      "@types/bun": "catalog:",
      turbo: "^2.6.3",
      typescript: "catalog:",
      oxfmt: "^0.26.0",
      oxlint: "^1.41.0",
    },
    packageManager: "bun@1.3.1",
  } as any; // Cast to any to allow dynamic property assignment safely in TS if needed, though strictly typed is better.

  if (data.hasDbTurso || data.hasDb) {
    // Add db scripts
    pkg.scripts["db:push"] = `turbo -F ${data.scope}/db db:push`;
    pkg.scripts["db:studio"] = `turbo -F ${data.scope}/db db:studio`;
    pkg.scripts["db:generate"] = `turbo -F ${data.scope}/db db:generate`;
    pkg.scripts["db:migrate"] = `turbo -F ${data.scope}/db db:migrate`;
    pkg.scripts["db:local"] = `turbo -F ${data.scope}/db db:local`;
  }

  return JSON.stringify(pkg, null, 2) + "\n";
}
