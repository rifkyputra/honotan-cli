export function generateStandaloneGoEnvExample(name: string): string {
  return `# Server Configuration
PORT=8080

# Database Configuration (if using PostgreSQL)
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/${name}?sslmode=disable
# DB_USER=postgres
# DB_PASSWORD=postgres
# DB_NAME=${name}
# DB_PORT=5432

# Redis Configuration (if using Redis)
# REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info

# Environment
ENV=development
`;
}
