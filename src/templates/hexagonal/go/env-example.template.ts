import type { TemplateData } from "../../../types";

export function generateGoEnvExampleTemplate(data: TemplateData): string {
  return `# Server Configuration
PORT=8080

# Database Configuration (optional)
DATABASE_URL=postgres://user:password@localhost:5432/${data.name}?sslmode=disable

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Environment
ENV=development

# Logging
LOG_LEVEL=info
`;
}
