import type { MonorepoTemplateData } from "../../../../types";

export function generateWebPackageJson(data: MonorepoTemplateData): string {
  const { scope, hasAuth } = data;

  const dependencies: Record<string, string> = {
    "@base-ui/react": "^1.0.0",
    [`${scope}/env`]: "workspace:*",
    "@hookform/resolvers": "^5.1.1",
    "@tailwindcss/vite": "^4.0.15",
    "@tanstack/react-form": "^1.28.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-router": "^1.141.1",
    "@tanstack/react-store": "^0.7.0",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    "lucide-react": "^0.473.0",
    "next-themes": "^0.4.6",
    react: "19.2.3",
    "react-dom": "19.2.3",
    shadcn: "^3.6.2",
    sonner: "^2.0.5",
    "tailwind-merge": "^3.3.1",
    "tw-animate-css": "^1.2.5",
    zod: "catalog:",
  };

  if (hasAuth) {
    dependencies["better-auth"] = "catalog:";
    dependencies[`${scope}/auth`] = "workspace:*";
  }

  if (data.hasPwa) {
    dependencies["vite-plugin-pwa"] = "^1.0.1";
  }

  const devDependencies: Record<string, string> = {
    [`${scope}/config`]: "workspace:*",
    "@tanstack/react-router-devtools": "^1.141.1",
    "@tanstack/router-plugin": "^1.141.1",
    "@types/node": "^22.13.14",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "^4.3.4",
    tailwindcss: "^4.0.15",
    typescript: "catalog:",
    vite: "^6.2.2",
  };

  if (data.hasPwa) {
    devDependencies["@vite-pwa/assets-generator"] = "^1.0.0";
  }

  const scripts: Record<string, string> = {
    dev: "vite dev",
    build: "vite build",
    serve: "vite preview",
    "check-types": "tsc --noEmit",
  };

  if (data.hasPwa) {
    scripts["generate-pwa-assets"] = "pwa-assets-generator";
  }

  const pkg = {
    name: "web",
    version: "0.0.0",
    private: true,
    type: "module",
    scripts,
    dependencies,
    devDependencies,
  };

  return JSON.stringify(pkg, null, 2) + "\n";
}
