import type { TemplateData } from "../../../types";

export function generateGoGitignoreTemplate(_data: TemplateData): string {
  return `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib
bin/
dist/

# Test binary, built with 'go test -c'
*.test

# Output of the go coverage tool
*.out
coverage.html
coverage.out

# Dependency directories
vendor/

# Go workspace file
go.work

# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
*.log
logs/

# Temporary files
tmp/
temp/

# Database files
*.db
*.sqlite

# Docker
docker-compose.override.yml
`;
}
