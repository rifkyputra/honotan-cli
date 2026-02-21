import path from "path";
import chalk from "chalk";
import ora from "ora";
import { writeFile } from "../utils/file-utils";
import type { MonorepoTemplateData } from "../types";
import type { PackageTemplate } from "./prompts";

// blank package templates
import { generateBlankPackageJson } from "../templates/monorepo/packages/blank/package-json.template";
import { generateBlankTsconfig } from "../templates/monorepo/packages/blank/tsconfig.template";
import { generateBlankIndex } from "../templates/monorepo/packages/blank/index.template";
import { generateBlankGoMod } from "../templates/monorepo/packages/blank/go-mod.template";
import { generateBlankGo } from "../templates/monorepo/packages/blank/go.template";

// packages/db
import { generateDbPackageJson } from "../templates/monorepo/packages/db/package-json.template";
import { generateDbTsconfig } from "../templates/monorepo/packages/db/tsconfig.template";
import { generateDbIndex } from "../templates/monorepo/packages/db/index.template";
import { generateDbTypes } from "../templates/monorepo/packages/db/types.template";

// packages/db-turso
import { generateDbTursoPackageJson } from "../templates/monorepo/packages/db-turso/package-json.template";
import { generateDbTursoTsconfig } from "../templates/monorepo/packages/db-turso/tsconfig.template";
import { generateDbTursoIndex } from "../templates/monorepo/packages/db-turso/index.template";
import { generateDbTursoSchema } from "../templates/monorepo/packages/db-turso/schema.template";
import { generateDbTursoDrizzleConfig } from "../templates/monorepo/packages/db-turso/drizzle-config.template";
import { generateDbTursoMigrate } from "../templates/monorepo/packages/db-turso/migrate.template";

// packages/db-sqlite
import { generateDbSqlitePackageJson } from "../templates/monorepo/packages/db-sqlite/package-json.template";
import { generateDbSqliteTsconfig } from "../templates/monorepo/packages/db-sqlite/tsconfig.template";
import { generateDbSqliteIndex } from "../templates/monorepo/packages/db-sqlite/index.template";
import { generateDbSqliteSchema } from "../templates/monorepo/packages/db-sqlite/schema.template";
import { generateDbSqliteDrizzleConfig } from "../templates/monorepo/packages/db-sqlite/drizzle-config.template";
import { generateDbSqliteMigrate } from "../templates/monorepo/packages/db-sqlite/migrate.template";

// packages/cache
import { generateCachePackageJson } from "../templates/monorepo/packages/cache/package-json.template";
import { generateCacheTsconfig } from "../templates/monorepo/packages/cache/tsconfig.template";
import { generateCacheIndex } from "../templates/monorepo/packages/cache/index.template";
import { generateCacheTypes } from "../templates/monorepo/packages/cache/types.template";

// packages/event-driven
import { generateEventDrivenPackageJson } from "../templates/monorepo/packages/event-driven/package-json.template";
import { generateEventDrivenTsconfig } from "../templates/monorepo/packages/event-driven/tsconfig.template";
import { generateEventDrivenIndex } from "../templates/monorepo/packages/event-driven/index.template";
import { generateEventDrivenTypes } from "../templates/monorepo/packages/event-driven/types.template";
import { generateRabbitMQClient } from "../templates/monorepo/packages/event-driven/rabbitmq.template";

// packages/auth
import { generateAuthPackageJson } from "../templates/monorepo/packages/auth/package-json.template";
import { generateAuthTsconfig } from "../templates/monorepo/packages/auth/tsconfig.template";
import { generateAuthIndex } from "../templates/monorepo/packages/auth/index.template";
import { generateAuthTypes } from "../templates/monorepo/packages/auth/types.template";

// packages/s3
import { generateS3PackageJson } from "../templates/monorepo/packages/s3/package-json.template";
import { generateS3Tsconfig } from "../templates/monorepo/packages/s3/tsconfig.template";
import { generateS3Index } from "../templates/monorepo/packages/s3/index.template";

// packages/env
import { generateEnvPackageJson } from "../templates/monorepo/packages/env/package-json.template";
import { generateEnvTsconfig } from "../templates/monorepo/packages/env/tsconfig.template";
import { generateEnvServer } from "../templates/monorepo/packages/env/server.template";
import { generateEnvClient } from "../templates/monorepo/packages/env/client.template";

export type PackageLanguage = "typescript" | "go";

interface PackageFile {
  path: string;
  content: string;
}

function buildMonorepoData(
  packageName: string,
  template: PackageTemplate,
): MonorepoTemplateData {
  const atIdx = packageName.indexOf("/");
  const scope =
    packageName.startsWith("@") && atIdx > 0
      ? packageName.substring(0, atIdx)
      : "@scope";
  const shortName =
    packageName.startsWith("@") && atIdx > 0
      ? packageName.substring(atIdx + 1)
      : packageName;

  return {
    projectName: shortName,
    scope,
    kebabName: shortName,
    frameworks: ["hono"],
    apiFramework: "hono",
    infraPackages: [],
    hasDb: template === "db",
    hasDbTurso: template === "db-turso",
    hasDbSqlite: template === "db-sqlite",
    hasCache: template === "cache",
    hasEventDriven: template === "event-driven",
    hasAuth: template === "auth",
    hasClient: template === "env",
    hasPwa: false,
    hasS3: template === "s3",
  };
}

function blankTypeScriptFiles(packageName: string): PackageFile[] {
  return [
    { path: "package.json", content: generateBlankPackageJson(packageName) },
    { path: "tsconfig.json", content: generateBlankTsconfig() },
    { path: "src/index.ts", content: generateBlankIndex() },
  ];
}

function blankGoFiles(packageName: string): PackageFile[] {
  const safeName = packageName.replace(/[^a-zA-Z0-9_]/g, "_");
  return [
    { path: "go.mod", content: generateBlankGoMod(packageName) },
    { path: `${safeName}.go`, content: generateBlankGo(safeName) },
  ];
}

function collectFiles(
  packageName: string,
  template: PackageTemplate,
  language: PackageLanguage,
): PackageFile[] {
  if (language === "go") {
    return blankGoFiles(packageName);
  }

  if (template === "blank") {
    return blankTypeScriptFiles(packageName);
  }

  const data = buildMonorepoData(packageName, template);

  switch (template) {
    case "db":
      return [
        { path: "package.json", content: generateDbPackageJson(data) },
        { path: "tsconfig.json", content: generateDbTsconfig(data) },
        { path: "src/index.ts", content: generateDbIndex(data) },
        { path: "src/types.ts", content: generateDbTypes(data) },
      ];
    case "db-turso":
      return [
        { path: "package.json", content: generateDbTursoPackageJson(data) },
        { path: "tsconfig.json", content: generateDbTursoTsconfig(data) },
        {
          path: "drizzle.config.ts",
          content: generateDbTursoDrizzleConfig(data),
        },
        { path: "src/index.ts", content: generateDbTursoIndex(data) },
        { path: "src/schema.ts", content: generateDbTursoSchema(data) },
        { path: "src/migrate.ts", content: generateDbTursoMigrate(data) },
      ];
    case "db-sqlite":
      return [
        { path: "package.json", content: generateDbSqlitePackageJson(data) },
        { path: "tsconfig.json", content: generateDbSqliteTsconfig(data) },
        { path: "drizzle.config.ts", content: generateDbSqliteDrizzleConfig(data) },
        { path: "src/index.ts", content: generateDbSqliteIndex(data) },
        { path: "src/schema.ts", content: generateDbSqliteSchema(data) },
        { path: "src/migrate.ts", content: generateDbSqliteMigrate(data) },
      ];
    case "cache":
      return [
        { path: "package.json", content: generateCachePackageJson(data) },
        { path: "tsconfig.json", content: generateCacheTsconfig(data) },
        { path: "src/index.ts", content: generateCacheIndex(data) },
        { path: "src/types.ts", content: generateCacheTypes(data) },
      ];
    case "event-driven":
      return [
        {
          path: "package.json",
          content: generateEventDrivenPackageJson(data),
        },
        {
          path: "tsconfig.json",
          content: generateEventDrivenTsconfig(data),
        },
        { path: "src/index.ts", content: generateEventDrivenIndex(data) },
        { path: "src/types.ts", content: generateEventDrivenTypes(data) },
        { path: "src/rabbitmq.ts", content: generateRabbitMQClient(data) },
      ];
    case "auth":
      return [
        { path: "package.json", content: generateAuthPackageJson(data) },
        { path: "tsconfig.json", content: generateAuthTsconfig(data) },
        { path: "src/index.ts", content: generateAuthIndex(data) },
        { path: "src/types.ts", content: generateAuthTypes(data) },
      ];
    case "env":
      return [
        { path: "package.json", content: generateEnvPackageJson(data) },
        { path: "tsconfig.json", content: generateEnvTsconfig(data) },
        { path: "src/server.ts", content: generateEnvServer(data) },
        { path: "src/client.ts", content: generateEnvClient(data) },
      ];
    case "s3":
      return [
        { path: "package.json", content: generateS3PackageJson(data) },
        { path: "tsconfig.json", content: generateS3Tsconfig(data) },
        { path: "src/index.ts", content: generateS3Index(data) },
      ];
  }
}

export async function generatePackage(
  packageName: string,
  template: PackageTemplate,
  language: PackageLanguage,
  outputDir: string,
): Promise<void> {
  const spinner = ora(`Scaffolding package "${packageName}"...`).start();

  try {
    const basePath = path.resolve(process.cwd(), outputDir);
    const files = collectFiles(packageName, template, language);

    for (const file of files) {
      spinner.text = `Generating ${file.path}...`;
      await writeFile(path.join(basePath, file.path), file.content);
    }

    spinner.succeed(
      chalk.green(`Package "${packageName}" created in ${outputDir}`),
    );

    console.log(chalk.cyan("\nGenerated files:"));
    for (const file of files) {
      console.log(chalk.gray(`  ${outputDir}/${file.path}`));
    }
  } catch (error) {
    spinner.fail(chalk.red("Failed to scaffold package"));
    throw error;
  }
}
