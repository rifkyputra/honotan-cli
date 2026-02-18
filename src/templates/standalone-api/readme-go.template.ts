export function generateStandaloneGoReadme(name: string): string {
  return `# ${name}

A Go REST API built with Chi router.

## Prerequisites

- Go 1.21 or later
- Docker and Docker Compose (optional)

## Getting Started

### Development

1. Install dependencies:
\`\`\`bash
go mod download
\`\`\`

2. Copy the example environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Run the application:
\`\`\`bash
go run main.go
# or
make run
\`\`\`

4. The API will be available at \`http://localhost:8080\`

### Using Make

This project includes a Makefile for common tasks:

\`\`\`bash
make help          # Show available commands
make build         # Build the application
make run           # Run the application
make test          # Run tests
make test-coverage # Run tests with coverage
make fmt           # Format code
make tidy          # Tidy dependencies
\`\`\`

### Using Docker

1. Build the Docker image:
\`\`\`bash
docker build -t ${name} .
# or
make docker-build
\`\`\`

2. Run the container:
\`\`\`bash
docker run -p 8080:8080 --env-file .env ${name}
# or
make docker-run
\`\`\`

### Using Docker Compose

\`\`\`bash
docker-compose up -d
# or
make docker-compose-up
\`\`\`

## API Endpoints

- \`GET /health\` - Health check endpoint
- \`GET /api/hello\` - Example hello endpoint

## Project Structure

\`\`\`
.
├── main.go              # Application entry point
├── go.mod               # Go module definition
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── Makefile             # Build and run tasks
├── .env.example         # Example environment variables
└── README.md            # This file
\`\`\`

## Environment Variables

See \`.env.example\` for all available environment variables.

## Testing

Run tests:
\`\`\`bash
go test -v ./...
# or
make test
\`\`\`

Run tests with coverage:
\`\`\`bash
make test-coverage
\`\`\`

## Building for Production

\`\`\`bash
go build -o bin/main main.go
# or
make build
\`\`\`

## License

MIT
`;
}
