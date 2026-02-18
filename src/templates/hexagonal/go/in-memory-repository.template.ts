import type { TemplateData } from "../../../types";

export function generateGoInMemoryRepositoryTemplate(
  data: TemplateData,
): string {
  const { capitalizedName } = data;

  return `package persistence

import (
	"context"
	"sync"
	
	"${data.name}/application/ports/out"
	"${data.name}/domain/entities"
)

// InMemory${capitalizedName}Repository provides an in-memory implementation of ${capitalizedName}RepositoryPort
type InMemory${capitalizedName}Repository struct {
	mu    sync.RWMutex
	store map[string]*entities.${capitalizedName}
}

// NewInMemory${capitalizedName}Repository creates a new instance of InMemory${capitalizedName}Repository
func NewInMemory${capitalizedName}Repository() out.${capitalizedName}RepositoryPort {
	return &InMemory${capitalizedName}Repository{
		store: make(map[string]*entities.${capitalizedName}),
	}
}

// FindAll retrieves all ${data.name} entities from memory
func (r *InMemory${capitalizedName}Repository) FindAll(ctx context.Context) ([]*entities.${capitalizedName}, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]*entities.${capitalizedName}, 0, len(r.store))
	for _, entity := range r.store {
		result = append(result, entity)
	}
	return result, nil
}

// FindByID retrieves a ${data.name} entity by its ID from memory
func (r *InMemory${capitalizedName}Repository) FindByID(ctx context.Context, id string) (*entities.${capitalizedName}, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	entity, exists := r.store[id]
	if !exists {
		return nil, nil
	}
	return entity, nil
}

// Save stores a new ${data.name} entity in memory
func (r *InMemory${capitalizedName}Repository) Save(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.store[entity.ID] = entity
	return entity, nil
}

// Update modifies an existing ${data.name} entity in memory
func (r *InMemory${capitalizedName}Repository) Update(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.store[entity.ID] = entity
	return entity, nil
}

// Delete removes a ${data.name} entity from memory by its ID
func (r *InMemory${capitalizedName}Repository) Delete(ctx context.Context, id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.store, id)
	return nil
}
`;
}
