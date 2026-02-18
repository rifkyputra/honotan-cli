import type { TemplateData } from "../../../types";

export function generateGoRoutesTemplate(data: TemplateData): string {
  const { capitalizedName, pluralName } = data;

  return `package http

import (
	"${data.name}/application/ports/in"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

// Create${capitalizedName}Routes sets up all routes for ${data.name} resource
func Create${capitalizedName}Routes(useCases in.${capitalizedName}UseCasePort) chi.Router {
	handler := New${capitalizedName}Handler(useCases)
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)

	// Routes
	r.Get("/${pluralName}", handler.GetAll${capitalizedName}s)
	r.Get("/${pluralName}/{id}", handler.Get${capitalizedName}ByID)
	r.Post("/${pluralName}", handler.Create${capitalizedName})
	r.Put("/${pluralName}/{id}", handler.Update${capitalizedName})
	r.Delete("/${pluralName}/{id}", handler.Delete${capitalizedName})

	return r
}
`;
}
