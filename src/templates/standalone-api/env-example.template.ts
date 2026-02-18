export function generateStandaloneEnvExample(name: string): string {
  return `# Server
PORT=3000

# Database
DATABASE_URL=postgresql://${name}:${name}_password@localhost:5432/${name}

# Cache
REDIS_URL=redis://localhost:6379
`;
}
