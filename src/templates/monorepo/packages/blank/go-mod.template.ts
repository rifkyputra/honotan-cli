export function generateBlankGoMod(moduleName: string): string {
  return `module ${moduleName}\n\ngo 1.23\n`;
}
