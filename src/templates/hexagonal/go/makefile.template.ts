import type { TemplateData } from "../../../types";

export function generateGoMakefileTemplate(data: TemplateData): string {
  return `.PHONY: help build run test test-coverage clean docker-build docker-run lint fmt

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \\033[36m%-15s\\033[0m %s\\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the application
	@echo "Building..."
	@go build -o bin/main cmd/main.go

run: ## Run the application
	@echo "Running..."
	@go run cmd/main.go

test: ## Run tests
	@echo "Running tests..."
	@go test -v ./...

test-coverage: ## Run tests with coverage
	@echo "Running tests with coverage..."
	@go test -cover -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

clean: ## Clean build artifacts
	@echo "Cleaning..."
	@rm -rf bin/
	@rm -f coverage.out coverage.html

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	@docker build -t ${data.name}:latest .

docker-run: ## Run Docker container
	@echo "Running Docker container..."
	@docker run -p 8080:8080 --env-file .env ${data.name}:latest

lint: ## Run linter
	@echo "Running linter..."
	@golangci-lint run

fmt: ## Format code
	@echo "Formatting code..."
	@go fmt ./...

deps: ## Download dependencies
	@echo "Downloading dependencies..."
	@go mod download
	@go mod tidy

migrate-up: ## Run database migrations up
	@echo "Running migrations..."
	@migrate -path db/migrations -database "\${DATABASE_URL}" up

migrate-down: ## Run database migrations down
	@echo "Rolling back migrations..."
	@migrate -path db/migrations -database "\${DATABASE_URL}" down

migrate-create: ## Create a new migration (usage: make migrate-create name=your_migration_name)
	@migrate create -ext sql -dir db/migrations -seq \${name}
`;
}
