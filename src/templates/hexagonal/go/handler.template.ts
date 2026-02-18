import type { TemplateData } from "../../../types";

export function generateGoHandlerTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName } = data;

  return `package http

import (
	"encoding/json"
	"errors"
	"net/http"

	"${data.name}/application/ports/in"
	"${data.name}/adapters/in/http/dto"
	"github.com/go-chi/chi/v5"
)

type ${capitalizedName}Handler struct {
	useCases in.${capitalizedName}UseCasePort
}

func New${capitalizedName}Handler(useCases in.${capitalizedName}UseCasePort) *${capitalizedName}Handler {
	return &${capitalizedName}Handler{
		useCases: useCases,
	}
}

// GetAll${capitalizedName}s handles GET /${pluralName}
func (h *${capitalizedName}Handler) GetAll${capitalizedName}s(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	${pluralName}, err := h.useCases.GetAll${capitalizedName}s(ctx)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to fetch ${pluralName}")
		return
	}

	respondWithJSON(w, http.StatusOK, ${pluralName})
}

// Get${capitalizedName}ByID handles GET /${pluralName}/:id
func (h *${capitalizedName}Handler) Get${capitalizedName}ByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := chi.URLParam(r, "id")

	if id == "" {
		respondWithError(w, http.StatusBadRequest, "ID is required")
		return
	}

	${camelCaseName}, err := h.useCases.Get${capitalizedName}ByID(ctx, id)
	if err != nil {
		if errors.Is(err, in.ErrNotFound) {
			respondWithError(w, http.StatusNotFound, err.Error())
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Failed to fetch ${data.name}")
		return
	}

	respondWithJSON(w, http.StatusOK, ${camelCaseName})
}

// Create${capitalizedName} handles POST /${pluralName}
func (h *${capitalizedName}Handler) Create${capitalizedName}(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req dto.Create${capitalizedName}Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := req.Validate(); err != nil {
		respondWithValidationError(w, err)
		return
	}

	${camelCaseName}, err := h.useCases.Create${capitalizedName}(ctx, req.ToCommand())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to create ${data.name}")
		return
	}

	respondWithJSON(w, http.StatusCreated, ${camelCaseName})
}

// Update${capitalizedName} handles PUT /${pluralName}/:id
func (h *${capitalizedName}Handler) Update${capitalizedName}(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := chi.URLParam(r, "id")

	if id == "" {
		respondWithError(w, http.StatusBadRequest, "ID is required")
		return
	}

	var req dto.Update${capitalizedName}Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := req.Validate(); err != nil {
		respondWithValidationError(w, err)
		return
	}

	${camelCaseName}, err := h.useCases.Update${capitalizedName}(ctx, id, req.ToCommand())
	if err != nil {
		if errors.Is(err, in.ErrNotFound) {
			respondWithError(w, http.StatusNotFound, err.Error())
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Failed to update ${data.name}")
		return
	}

	respondWithJSON(w, http.StatusOK, ${camelCaseName})
}

// Delete${capitalizedName} handles DELETE /${pluralName}/:id
func (h *${capitalizedName}Handler) Delete${capitalizedName}(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := chi.URLParam(r, "id")

	if id == "" {
		respondWithError(w, http.StatusBadRequest, "ID is required")
		return
	}

	if err := h.useCases.Delete${capitalizedName}(ctx, id); err != nil {
		if errors.Is(err, in.ErrNotFound) {
			respondWithError(w, http.StatusNotFound, err.Error())
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Failed to delete ${data.name}")
		return
	}

	respondWithJSON(w, http.StatusOK, map[string]string{
		"message": "${capitalizedName} deleted successfully",
	})
}

// Helper functions for consistent JSON responses
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithValidationError(w http.ResponseWriter, err error) {
	respondWithJSON(w, http.StatusBadRequest, map[string]interface{}{
		"error":  "Validation failed",
		"issues": err.Error(),
	})
}
`;
}
