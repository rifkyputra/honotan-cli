export function generateStandaloneGitignore(): string {
  return `node_modules
dist
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
