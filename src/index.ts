import { Command } from "commander";
import chalk from "chalk";
import { generate, addAdapters, buildTemplateData } from "./commands/generate";
import { generateApi } from "./commands/generate-api";
import { generateClient } from "./commands/generate-client";
import {
  buildMonorepoTemplateData,
  generateMonorepo,
} from "./commands/generate-monorepo";
import { generatePackage } from "./commands/generate-package";
import { detectExistingResources } from "./commands/detect-resource";
import { cleanProject } from "./commands/util";
import {
  promptAction,
  promptFramework,
  promptApiFramework,
  promptResourceName,
  promptInboundAdapters,
  promptOutboundAdapters,
  promptOutputDir,
  promptExistingResource,
  promptAdapterDirection,
  promptNewInboundAdapters,
  promptNewOutboundAdapters,
  promptConfirm,
  promptProjectName,
  promptInfraPackages,
  promptPackageName,
  promptPackageLanguage,
  promptPackageTemplate,
} from "./commands/prompts";

const program = new Command();

program
  .name("honotan")
  .description(
    "CLI toolkit for generating Hexagonal architecture in turbo monorepo",
  )
  .version("0.3.0");

const generateCmd = program
  .command("generate")
  .description("Generate boilerplate code");

generateCmd
  .command("api")
  .description("Scaffold a standalone API microservice app")
  .option("-o, --output <path>", "Output directory", "apps")
  .action(async (options: { output: string }) => {
    try {
      const name = await promptResourceName();
      const framework = await promptApiFramework();
      const output = await promptOutputDir(options.output);

      const confirmed = await promptConfirm(
        `Create standalone API "${name}" (hexagonal, ${framework}) in ${output}/${name}?`,
      );

      if (!confirmed) {
        console.log(chalk.yellow("Aborted."));
        return;
      }

      await generateApi(name, framework, "hexagonal", output);
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

generateCmd
  .command("resource")
  .description("Generate or extend an API resource (interactive)")
  .option("-o, --output <path>", "Output directory", "src")
  .action(async (options: { output: string }) => {
    try {
      // Check for existing resources first
      const resources = await detectExistingResources(options.output);

      let action: "new" | "add-adapter" = "new";

      if (resources.length > 0) {
        // Only ask if resources exist
        action = await promptAction();
      }

      if (action === "new") {
        const framework = await promptApiFramework();
        const name = await promptResourceName();

        const inboundAdapters = await promptInboundAdapters(framework);
        const outboundAdapters = await promptOutboundAdapters();

        const output = await promptOutputDir(options.output);
        const data = buildTemplateData(
          name,
          "hexagonal",
          framework,
          inboundAdapters,
          outboundAdapters,
        );

        const summary = `Generate "${data.capitalizedName}" (hexagonal, ${framework}) with ${inboundAdapters.join(", ")} inbound + ${outboundAdapters.join(", ")} outbound in ${output}?`;

        const confirmed = await promptConfirm(summary);

        if (!confirmed) {
          console.log(chalk.yellow("Aborted."));
          return;
        }

        await generate(data, output);
      } else {
        const resource = await promptExistingResource(resources);
        const direction = await promptAdapterDirection();

        if (direction === "inbound") {
          const adapters = await promptNewInboundAdapters(
            resource,
            resource.framework,
          );
          if (adapters.length === 0) {
            console.log(
              chalk.yellow(
                "All inbound adapters already exist for this resource.",
              ),
            );
            return;
          }

          const confirmed = await promptConfirm(
            `Add ${adapters.join(", ")} inbound adapter(s) to "${resource.name}"?`,
          );
          if (!confirmed) {
            console.log(chalk.yellow("Aborted."));
            return;
          }

          const data = buildTemplateData(
            resource.name,
            resource.architecture,
            resource.framework,
            adapters,
            [],
          );
          await addAdapters(resource, data, "inbound");
        } else {
          const adapters = await promptNewOutboundAdapters(resource);
          if (adapters.length === 0) {
            console.log(
              chalk.yellow(
                "All outbound adapters already exist for this resource.",
              ),
            );
            return;
          }

          const confirmed = await promptConfirm(
            `Add ${adapters.join(", ")} outbound adapter(s) to "${resource.name}"?`,
          );
          if (!confirmed) {
            console.log(chalk.yellow("Aborted."));
            return;
          }

          const data = buildTemplateData(
            resource.name,
            resource.architecture,
            resource.framework,
            [],
            adapters,
          );
          await addAdapters(resource, data, "outbound");
        }
      }
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

generateCmd
  .command("client")
  .description("Generate a complete TanStack Router + React project")
  .option(
    "-o, --output <path>",
    "Output directory (default: apps/<resource-name>)",
  )
  .action(async (options: { output?: string }) => {
    try {
      const resourceName = await promptResourceName();
      const defaultOutput = `apps/${resourceName}`;
      const output = await promptOutputDir(options.output || defaultOutput);

      const dirName = output === "." ? "current directory" : output;
      const summary = `Generate TanStack Router project "${resourceName}" in ${dirName}?`;

      const confirmed = await promptConfirm(summary);

      if (!confirmed) {
        console.log(chalk.yellow("Aborted."));
        return;
      }

      await generateClient(output, resourceName);
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

generateCmd
  .command("package")
  .description("Generate a new package (blank or from a template)")
  .option("-o, --output <path>", "Output directory")
  .action(async (options: { output?: string }) => {
    try {
      const name = await promptPackageName();
      const language = await promptPackageLanguage();
      const template = await promptPackageTemplate(language);

      const shortName = name.includes("/") ? name.split("/").pop()! : name;
      const defaultOutput = `packages/${shortName}`;
      const output = await promptOutputDir(options.output || defaultOutput);

      const templateLabel = template === "blank" ? "blank" : template;
      const confirmed = await promptConfirm(
        `Create "${name}" (${language}, ${templateLabel}) in ${output}?`,
      );

      if (!confirmed) {
        console.log(chalk.yellow("Aborted."));
        return;
      }

      await generatePackage(name, template, language, output);
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

generateCmd
  .command("monorepo")
  .description("Scaffold a full turborepo monorepo project")
  .action(async () => {
    try {
      const projectName = await promptProjectName();
      const frameworks = await promptFramework();
      const infraPackages = await promptInfraPackages();

      const data = buildMonorepoTemplateData(
        projectName,
        frameworks,
        infraPackages,
      );

      const frameworkSummary = frameworks.join(", ");
      const infraSummary =
        infraPackages.length > 0 ? ` with ${infraPackages.join(", ")}` : "";
      const confirmed = await promptConfirm(
        `Create "${projectName}" (${frameworkSummary}${infraSummary})?`,
      );

      if (!confirmed) {
        console.log(chalk.yellow("Aborted."));
        return;
      }

      await generateMonorepo(data, ".");
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

const utilCmd = program
  .command("util")
  .description("Utility commands for managing the monorepo");

utilCmd
  .command("clean")
  .description("Clean all build artifacts (node_modules, dist, .turbo, etc.)")
  .action(async () => {
    try {
      await cleanProject();
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parse(process.argv);
