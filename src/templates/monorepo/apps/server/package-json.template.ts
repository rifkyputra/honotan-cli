import type { MonorepoTemplateData } from "../../../../types";

export function generateServerPackageJson(data: MonorepoTemplateData): string {
  const {
    scope,
    apiFramework: framework,
    hasDb,
    hasDbTurso,
    hasCache,
    hasEventDriven,
  } = data;

  const dependencies: Record<string, string> = {};

  // Framework-conditional deps
  if (framework === "hono") {
    dependencies["hono"] = "^4.8.2";
    // dependencies['@hono/node-server'] = '^1.0.0'; // Example doesn't have this, it uses Bun
    dependencies["valibot"] = "^0.42.1";
  } else if (framework === "express") {
    dependencies["express"] = "^4.18.0";
    dependencies["cors"] = "^2.8.5";
    dependencies["zod"] = "catalog:";
  } else if (framework === "fastify") {
    dependencies["fastify"] = "^4.0.0";
    dependencies["zod"] = "catalog:";
  }

  // Always include env
  dependencies[`${scope}/env`] = "workspace:*";

  // Infra packages
  if (hasDb || hasDbTurso) {
    dependencies[`${scope}/db`] = "workspace:*";
  }
  if (hasCache) {
    dependencies[`${scope}/cache`] = "workspace:*";
  }
  if (hasEventDriven) {
    dependencies[`${scope}/event-driven`] = "workspace:*";
  }
  if (data.hasAuth) {
    dependencies[`${scope}/auth`] = "workspace:*";
    if (framework === "hono") {
      dependencies["better-auth"] = "catalog:";
      dependencies["dotenv"] = "catalog:"; // Example has dotenv in dependencies
      dependencies["zod"] = "catalog:"; // Example has zod, likely for validation if using zod somewhere or better-auth
    }
  }

  const devDependencies: Record<string, string> = {
    [`${scope}/config`]: "workspace:*",
    "@types/bun": "catalog:", // Example uses bun types
    // '@types/node': 'catalog:', // Example doesn't have node types in devDependencies for server, likely uses bun types
    tsdown: "^0.16.5",
    typescript: "catalog:",
  };

  if (framework === "express") {
    devDependencies["@types/express"] = "^4.17.0";
    devDependencies["@types/cors"] = "^2.8.0";
    devDependencies["@types/node"] = "catalog:"; // Express usually runs on Node
    delete devDependencies["@types/bun"]; // Remove bun types if express (assuming Node)
  }

  const pkg = {
    name: "server",
    type: "module",
    main: "src/index.ts",
    scripts: {
      build: "tsdown",
      "check-types": "tsc -b",
      compile:
        "bun build --compile --minify --sourcemap --bytecode ./src/index.ts --outfile server",
      dev: "bun run --hot src/index.ts",
      start: "bun run dist/index.mjs",
      // test: 'bun test', // Example doesn't have test script
    },
    dependencies,
    devDependencies,
  };

  return JSON.stringify(pkg, null, 2) + "\n";
}
