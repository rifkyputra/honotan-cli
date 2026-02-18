import type { MonorepoTemplateData } from '../../../types';

export function generateDockerignore(_data: MonorepoTemplateData): string {
  return `node_modules
.git
.gitignore
README.md
.env
.env.*
dist
.turbo
*.log
.DS_Store
.vscode
.idea
coverage
*.md
!README.md
`;
}
