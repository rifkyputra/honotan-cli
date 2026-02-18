import type { TemplateData } from "../../../types";

export function generateGoValidationTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `package dto

import (
	"${data.name}/application/ports/in"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

// ${capitalizedName}Response represents the HTTP response for a ${data.name}
type ${capitalizedName}Response struct {
	ID        string \`json:"id"\`
	CreatedAt string \`json:"createdAt"\`
	UpdatedAt string \`json:"updatedAt"\`
	// Add your domain-specific fields here
}

// Create${capitalizedName}Request represents the HTTP request to create a ${data.name}
type Create${capitalizedName}Request struct {
	// Add your domain-specific validation here
	// Example: Name string \`json:"name" validate:"required,min=1,max=255"\`
}

func (r *Create${capitalizedName}Request) Validate() error {
	return validate.Struct(r)
}

func (r *Create${capitalizedName}Request) ToCommand() in.Create${capitalizedName}Command {
	return in.Create${capitalizedName}Command{
		// Map request fields to command
	}
}

// Update${capitalizedName}Request represents the HTTP request to update a ${data.name}
type Update${capitalizedName}Request struct {
	// Add your domain-specific validation here (all fields are optional for updates)
	// Example: Name *string \`json:"name,omitempty" validate:"omitempty,min=1,max=255"\`
}

func (r *Update${capitalizedName}Request) Validate() error {
	return validate.Struct(r)
}

func (r *Update${capitalizedName}Request) ToCommand() in.Update${capitalizedName}Command {
	return in.Update${capitalizedName}Command{
		// Map request fields to command
	}
}
`;
}
