import type { MonorepoTemplateData } from "../../../../types";
import { PORT_WEB } from "../../constants";

export function generateViteConfig(data: MonorepoTemplateData): string {
  const pwaImport = data.hasPwa
    ? `import { VitePWA } from "vite-plugin-pwa";\n`
    : "";

  const pwaPlugin = data.hasPwa
    ? `,
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "${data.projectName}",
        short_name: "${data.projectName}",
        description: "${data.projectName} - PWA Application",
        theme_color: "#0c0c0c",
      },
      pwaAssets: { disabled: false, config: true },
      devOptions: { enabled: true },
    })`
    : "";

  return `import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
${pwaImport}
export default defineConfig({
  plugins: [tailwindcss(), tanstackRouter({}), react()${pwaPlugin}],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: ${PORT_WEB},
  },
});
`;
}
