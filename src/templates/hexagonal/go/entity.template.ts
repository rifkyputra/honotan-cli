import type { TemplateData } from "../../../types";

export function generateGoEntityTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `package entities

import (
	"time"
	"github.com/google/uuid"
)

// ${capitalizedName} represents a ${data.name} domain entity
type ${capitalizedName} struct {
	ID        string    \`json:"id"\`
	CreatedAt time.Time \`json:"createdAt"\`
	UpdatedAt time.Time \`json:"updatedAt"\`
	// Add your domain-specific properties here
}

// New${capitalizedName} creates a new ${capitalizedName} instance with generated ID and timestamps
func New${capitalizedName}() *${capitalizedName} {
	now := time.Now()
	return &${capitalizedName}{
		ID:        uuid.New().String(),
		CreatedAt: now,
		UpdatedAt: now,
	}
}

// Update marks the entity as updated
func (e *${capitalizedName}) Update() {
	e.UpdatedAt = time.Now()
}
`;
}
