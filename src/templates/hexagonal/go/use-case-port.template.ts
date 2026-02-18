import type { TemplateData } from "../../../types";

export function generateGoUseCasePortTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `package in

import (
	"context"
	"errors"
	"${data.name}/domain/entities"
)

// Common errors
var (
	ErrNotFound      = errors.New("${data.name} not found")
	ErrAlreadyExists = errors.New("${data.name} already exists")
	ErrInvalidInput  = errors.New("invalid input")
)

// Commands represent the input for use cases
type Create${capitalizedName}Command struct {
	// Add your domain-specific fields here
}

type Update${capitalizedName}Command struct {
	// Add your domain-specific fields here (all optional)
}

// ${capitalizedName}UseCasePort defines the contract for ${data.name} use cases
type ${capitalizedName}UseCasePort interface {
	GetAll${capitalizedName}s(ctx context.Context) ([]*entities.${capitalizedName}, error)
	Get${capitalizedName}ByID(ctx context.Context, id string) (*entities.${capitalizedName}, error)
	Create${capitalizedName}(ctx context.Context, cmd Create${capitalizedName}Command) (*entities.${capitalizedName}, error)
	Update${capitalizedName}(ctx context.Context, id string, cmd Update${capitalizedName}Command) (*entities.${capitalizedName}, error)
	Delete${capitalizedName}(ctx context.Context, id string) error
}
`;
}
