export function generateStandaloneGoDockerCompose(name: string): string {
  return `version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${name}
    ports:
      - "\${PORT:-8080}:8080"
    environment:
      - PORT=8080
    restart: unless-stopped
    networks:
      - ${name}-network

  # Uncomment if you need PostgreSQL
  # postgres:
  #   image: postgres:16-alpine
  #   container_name: ${name}-postgres
  #   environment:
  #     POSTGRES_USER: \${DB_USER:-postgres}
  #     POSTGRES_PASSWORD: \${DB_PASSWORD:-postgres}
  #     POSTGRES_DB: \${DB_NAME:-${name}}
  #   ports:
  #     - "\${DB_PORT:-5432}:5432"
  #   volumes:
  #     - postgres-data:/var/lib/postgresql/data
  #   networks:
  #     - ${name}-network

  # Uncomment if you need Redis
  # redis:
  #   image: redis:7-alpine
  #   container_name: ${name}-redis
  #   ports:
  #     - "\${REDIS_PORT:-6379}:6379"
  #   networks:
  #     - ${name}-network

networks:
  ${name}-network:
    driver: bridge

# volumes:
#   postgres-data:
`;
}
