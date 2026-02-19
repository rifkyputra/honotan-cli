import type { MonorepoTemplateData } from "../../../../types";

export function generateLibUtilsTs(_data: MonorepoTemplateData): string {
  return `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
}
