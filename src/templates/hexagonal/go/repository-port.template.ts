import type { TemplateData } from "../../../types";

export function generateGoRepositoryPortTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `package out

import (
	"context"
	"${data.name}/domain/entities"
)

// ${capitalizedName}RepositoryPort defines the contract for ${data.name} persistence
type ${capitalizedName}RepositoryPort interface {
	// FindAll retrieves all ${data.name} entities
	FindAll(ctx context.Context) ([]*entities.${capitalizedName}, error)
	
	// FindByID retrieves a ${data.name} by its ID
	FindByID(ctx context.Context, id string) (*entities.${capitalizedName}, error)
	
	// Save creates a new ${data.name} entity
	Save(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error)
	
	// Update modifies an existing ${data.name} entity
	Update(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error)
	
	// Delete removes a ${data.name} entity by its ID
	Delete(ctx context.Context, id string) error
}
`;
}
