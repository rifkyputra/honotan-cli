import type { MonorepoTemplateData } from "../../../../types";

export function generateThemeProviderTsx(_data: MonorepoTemplateData): string {
  return `import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme } from "next-themes";
`;
}
