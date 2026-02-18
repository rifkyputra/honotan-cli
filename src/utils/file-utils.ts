import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile as fsWriteFile } from 'fs/promises';

export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  await fsWriteFile(filePath, content, 'utf-8');
}
