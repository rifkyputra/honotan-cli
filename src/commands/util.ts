import { readdir, rm } from "fs/promises";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { promptConfirm } from "./prompts";

export async function cleanProject(cwd: string = process.cwd()) {
  const confirmed = await promptConfirm(
    "This will delete all node_modules, dist, .turbo, and other build artifacts. Continue?",
  );

  if (!confirmed) {
    console.log(chalk.yellow("Aborted."));
    return;
  }

  const spinner = ora("Cleaning project...").start();

  try {
    const dirsToRemove = [
      "node_modules",
      "dist",
      ".turbo",
      ".next",
      ".output",
      "build",
      "coverage",
    ];

    let count = 0;

    // Helper to recursively finding directories to delete
    async function scanAndClean(dir: string, depth = 0) {
      if (depth > 6) return; // Prevent too deep recursion

      // Check if we are in a directory that is ignored
      if (dir.includes("node_modules") && depth > 0) return; // Don't scan inside node_modules

      try {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            if (dirsToRemove.includes(entry.name)) {
              spinner.text = `Removing ${fullPath}...`;
              await rm(fullPath, { recursive: true, force: true });
              count++;
            } else {
              // Recurse into packages, apps, etc.
              // We only want to recurse into directories that might contain build artifacts
              if (!entry.name.startsWith(".")) {
                await scanAndClean(fullPath, depth + 1);
              }
            }
          }
        }
      } catch {
        // Ignore permission errors or if dir disappeared
      }
    }

    await scanAndClean(cwd);

    spinner.succeed(chalk.green(`Cleaned ${count} directories!`));
    console.log(chalk.gray("Run `bun install` to restore dependencies."));
  } catch (error) {
    spinner.fail(chalk.red("Failed to clean project"));
    console.error(error);
  }
}
