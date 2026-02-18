import { Command } from "commander";
import chalk from "chalk";
import { generate, addAdapters, buildTemplateData } from "./commands/generate";
import { generateClient } from "./commands/generate-client";
import {
  buildMonorepoTemplateData,
  generateMonorepo,
} from "./commands/generate-monorepo";
import { detectExistingResources } from "./commands/detect-resource";
import { cleanProject } from "./commands/util";
import {
  promptAction,
  promptArchitecture,
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
} from "./commands/prompts";
import type { InboundAdapter, OutboundAdapter } from "./types";

const program = new Command();

program
  .name("honotan")
  .description(
    "CLI toolkit for generating Hexagonal & Vertical Slice architecture in turbo monorepo",
  )
  .version("0.1.0");

const generateCmd = program
  .command("generate")
  .description("Generate boilerplate code");

generateCmd
  .command("api")
  .description("Generate or extend an API resource (interactive)")
  .option("-o, --output <path>", "Output directory", "src")
  .action(async (options: { output: string }) => {
    try {
      const action = await promptAction();

      if (action === "new") {
        const architecture = await promptArchitecture();
        const framework = await promptApiFramework();
        const name = await promptResourceName();

        let inboundAdapters: InboundAdapter[] = ["http"];
        let outboundAdapters: OutboundAdapter[] = ["in-memory"];

        if (architecture === "hexagonal") {
          inboundAdapters = await promptInboundAdapters(framework);
          outboundAdapters = await promptOutboundAdapters();
        }

        const output = await promptOutputDir(options.output);
        const data = buildTemplateData(
          name,
          architecture,
          framework,
          inboundAdapters,
          outboundAdapters,
        );

        const summary =
          architecture === "hexagonal"
            ? `Generate "${data.capitalizedName}" (${architecture}, ${framework}) with ${inboundAdapters.join(", ")} inbound + ${outboundAdapters.join(", ")} outbound in ${output}?`
            : `Generate "${data.capitalizedName}" (${architecture}, ${framework}) in ${output}?`;

        const confirmed = await promptConfirm(summary);

        if (!confirmed) {
          console.log(chalk.yellow("Aborted."));
          return;
        }

        await generate(data, output);
      } else {
        const resources = await detectExistingResources(options.output);

        if (resources.length === 0) {
          console.log(
            chalk.yellow(`No existing resources found in ${options.output}`),
          );
          console.log(
            chalk.gray(
              'Create a new resource first with "honotan generate api"',
            ),
          );
          return;
        }

        // Filter to hexagonal resources only for add-adapter
        const hexResources = resources.filter(
          (r) => r.architecture === "hexagonal",
        );
        if (hexResources.length === 0) {
          console.log(
            chalk.yellow(
              "Add-adapter is only supported for hexagonal architecture resources.",
            ),
          );
          console.log(
            chalk.gray("Vertical slice resources are regenerated as a whole."),
          );
          return;
        }

        const resource = await promptExistingResource(hexResources);
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
  .command("monorepo")
  .description("Scaffold a full turborepo monorepo project")
  .action(async () => {
    try {
      const projectName = await promptProjectName();
      const framework = await promptFramework();
      const infraPackages = await promptInfraPackages();

      const data = buildMonorepoTemplateData(
        projectName,
        framework,
        infraPackages,
      );

      const infraSummary =
        infraPackages.length > 0 ? ` with ${infraPackages.join(", ")}` : "";
      const confirmed = await promptConfirm(
        `Create "${projectName}" (${framework} server${infraSummary})?`,
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
