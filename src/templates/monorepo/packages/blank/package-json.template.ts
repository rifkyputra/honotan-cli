export function generateBlankPackageJson(packageName: string): string {
  const pkg = {
    name: packageName,
    version: "0.0.0",
    private: true,
    type: "module",
    exports: {
      ".": "./src/index.ts",
    },
    devDependencies: {
      typescript: "catalog:",
    },
  };

  return JSON.stringify(pkg, null, 2) + "\n";
}
