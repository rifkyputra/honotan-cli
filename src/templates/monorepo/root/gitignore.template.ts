import type { MonorepoTemplateData } from '../../../types';

export function generateGitignore(_data: MonorepoTemplateData): string {
  return `node_modules
dist
.turbo
.env
.env.*
!.env.example
.DS_Store
*.log
coverage
.vscode
.idea
`;
}
