import type { TemplateData } from "../../../types";

export function generateGoDockerComposeTemplate(data: TemplateData): string {
  return `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - DATABASE_URL=postgres://postgres:postgres@db:5432/${data.name}?sslmode=disable
      - REDIS_URL=redis://redis:6379
      - ENV=development
    depends_on:
      - db
      - redis
    networks:
      - ${data.name}-network
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=${data.name}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - ${data.name}-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - ${data.name}-network
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:

networks:
  ${data.name}-network:
    driver: bridge
`;
}
