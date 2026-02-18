import type { TemplateData } from "../../../types";

export function generateGoReadmeTemplate(data: TemplateData): string {
  const { capitalizedName, pluralName } = data;

  return `# ${capitalizedName} Service

A production-ready Go service implementing hexagonal architecture (ports and adapters pattern) for managing ${pluralName}.

## Architecture

This service follows hexagonal (clean) architecture principles:

\`\`\`
├── cmd/                        # Application entry points
│   └── main.go                # Main server
├── domain/                     # Business logic layer (core)
│   └── entities/              # Domain entities
├── application/                # Application layer
│   ├── use-cases/             # Use case implementations
│   └── ports/                 # Port interfaces
│       ├── in/                # Inbound ports (use case interfaces)
│       └── out/               # Outbound ports (repository interfaces)
├── adapters/                   # Adapter implementations
│   ├── in/                    # Inbound adapters
│   │   └── http/              # HTTP handlers, routes, DTOs
│   └── out/                   # Outbound adapters
│       ├── persistence/       # Repository implementations
│       └── cache/             # Caching implementations
└── composition/                # Dependency injection setup
\`\`\`

## Features

- ✅ **Clean Architecture**: Clear separation of concerns with hexagonal architecture
- ✅ **RESTful API**: Standard HTTP endpoints with proper status codes
- ✅ **Validation**: Request validation using go-playground/validator
- ✅ **Error Handling**: Consistent error responses
- ✅ **Testing**: Comprehensive unit and integration tests
- ✅ **Dockerized**: Ready for containerized deployments
- ✅ **Graceful Shutdown**: Proper handling of shutdown signals
- ✅ **Middleware**: Logging, recovery, timeout, and request ID
- ✅ **Health Checks**: Built-in health check endpoint

## Prerequisites

- Go 1.21 or higher
- Docker (optional, for containerized deployment)
- Redis (optional, for caching)
- PostgreSQL (optional, for database persistence)

## Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${data.name}

# Download dependencies
go mod download

# Run the application
go run cmd/main.go
\`\`\`

### Running Tests

\`\`\`bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run tests with verbose output
go test -v ./...
\`\`\`

### Docker

\`\`\`bash
# Build the Docker image
docker build -t ${data.name}:latest .

# Run the container
docker run -p 8080:8080 ${data.name}:latest
\`\`\`

## API Endpoints

### Health Check
\`\`\`
GET /health
\`\`\`

### ${capitalizedName} Endpoints

#### Get All ${capitalizedName}s
\`\`\`
GET /api/${pluralName}
\`\`\`

#### Get ${capitalizedName} by ID
\`\`\`
GET /api/${pluralName}/:id
\`\`\`

#### Create ${capitalizedName}
\`\`\`
POST /api/${pluralName}
Content-Type: application/json

{
  // Add your fields here
}
\`\`\`

#### Update ${capitalizedName}
\`\`\`
PUT /api/${pluralName}/:id
Content-Type: application/json

{
  // Add your fields here
}
\`\`\`

#### Delete ${capitalizedName}
\`\`\`
DELETE /api/${pluralName}/:id
\`\`\`

## Configuration

Environment variables:

- \`PORT\`: Server port (default: 8080)
- \`DATABASE_URL\`: PostgreSQL connection string (optional)
- \`REDIS_URL\`: Redis connection string (optional)

## Development

### Project Structure

- **Domain Layer**: Contains business entities and logic, independent of external concerns
- **Application Layer**: Contains use cases (business operations) and port interfaces
- **Adapters Layer**: Contains implementations of ports (HTTP handlers, repositories, etc.)
- **Composition Root**: Wires up dependencies and creates the application

### Adding New Features

1. Define the entity in \`domain/entities/\`
2. Create port interfaces in \`application/ports/\`
3. Implement use cases in \`application/use-cases/\`
4. Create adapters (HTTP handlers, repositories) in \`adapters/\`
5. Wire dependencies in \`composition/\`

## Testing Strategy

- **Unit Tests**: Test use cases with mock repositories
- **Integration Tests**: Test HTTP handlers with in-memory repositories
- **Repository Tests**: Test repository implementations

## Performance Considerations

- Connection pooling for database connections
- Redis caching for frequently accessed data
- Request timeouts to prevent resource exhaustion
- Graceful shutdown to complete in-flight requests

## License

MIT

## Contributing

Contributions are welcome! Please follow the existing architecture patterns and include tests for new features.
`;
}
