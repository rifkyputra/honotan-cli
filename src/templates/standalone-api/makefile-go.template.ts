export function generateStandaloneGoMakefile(name: string): string {
  return `.PHONY: help build run test clean docker-build docker-run fmt tidy

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \\033[36m%-15s\\033[0m %s\\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the application
	@echo "Building..."
	@go build -o bin/main main.go

run: ## Run the application
	@echo "Running..."
	@go run main.go

dev: ## Run the application with hot reload (requires air)
	@echo "Running with hot reload..."
	@air

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
	@rm -f main
	@rm -f coverage.out coverage.html

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	@docker build -t ${name}:latest .

docker-run: ## Run Docker container
	@echo "Running Docker container..."
	@docker run -p 8080:8080 --env-file .env ${name}:latest

docker-compose-up: ## Start services with docker-compose
	@echo "Starting services..."
	@docker-compose up -d

docker-compose-down: ## Stop services with docker-compose
	@echo "Stopping services..."
	@docker-compose down

fmt: ## Format code
	@echo "Formatting code..."
	@go fmt ./...

tidy: ## Tidy dependencies
	@echo "Tidying dependencies..."
	@go mod tidy

deps: ## Download dependencies
	@echo "Downloading dependencies..."
	@go mod download
`;
}
