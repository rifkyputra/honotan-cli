import type { TemplateData } from "../../../types";

export function generateGoUseCaseTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `package usecases

import (
	"context"
	"${data.name}/application/ports/in"
	"${data.name}/application/ports/out"
	"${data.name}/domain/entities"
)

// ${capitalizedName}UseCases implements the ${capitalizedName}UseCasePort interface
type ${capitalizedName}UseCases struct {
	repository out.${capitalizedName}RepositoryPort
}

// New${capitalizedName}UseCases creates a new instance of ${capitalizedName}UseCases
func New${capitalizedName}UseCases(repo out.${capitalizedName}RepositoryPort) in.${capitalizedName}UseCasePort {
	return &${capitalizedName}UseCases{
		repository: repo,
	}
}

// GetAll${capitalizedName}s retrieves all ${data.name} entities
func (uc *${capitalizedName}UseCases) GetAll${capitalizedName}s(ctx context.Context) ([]*entities.${capitalizedName}, error) {
	return uc.repository.FindAll(ctx)
}

// Get${capitalizedName}ByID retrieves a ${data.name} by its ID
func (uc *${capitalizedName}UseCases) Get${capitalizedName}ByID(ctx context.Context, id string) (*entities.${capitalizedName}, error) {
	entity, err := uc.repository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if entity == nil {
		return nil, in.ErrNotFound
	}
	return entity, nil
}

// Create${capitalizedName} creates a new ${data.name} entity
func (uc *${capitalizedName}UseCases) Create${capitalizedName}(ctx context.Context, cmd in.Create${capitalizedName}Command) (*entities.${capitalizedName}, error) {
	entity := entities.New${capitalizedName}()
	
	// Map command to entity fields
	// Example: entity.Name = cmd.Name
	
	return uc.repository.Save(ctx, entity)
}

// Update${capitalizedName} updates an existing ${data.name} entity
func (uc *${capitalizedName}UseCases) Update${capitalizedName}(ctx context.Context, id string, cmd in.Update${capitalizedName}Command) (*entities.${capitalizedName}, error) {
	entity, err := uc.repository.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if entity == nil {
		return nil, in.ErrNotFound
	}

	// Update entity fields from command
	// Example: if cmd.Name != nil { entity.Name = *cmd.Name }
	
	entity.Update()
	
	return uc.repository.Update(ctx, entity)
}

// Delete${capitalizedName} deletes a ${data.name} entity by its ID
func (uc *${capitalizedName}UseCases) Delete${capitalizedName}(ctx context.Context, id string) error {
	entity, err := uc.repository.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if entity == nil {
		return in.ErrNotFound
	}
	
	return uc.repository.Delete(ctx, id)
}
`;
}
