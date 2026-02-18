import type { TemplateData } from "../../../types";

export function generateGoRoutesTestTemplate(data: TemplateData): string {
  const { capitalizedName, pluralName } = data;

  return `package http_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	httpAdapter "${data.name}/adapters/in/http"
	"${data.name}/adapters/out/persistence"
	"${data.name}/application/use-cases"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCreate${capitalizedName}(t *testing.T) {
	// Setup
	repository := persistence.NewInMemory${capitalizedName}Repository()
	useCases := usecases.New${capitalizedName}UseCases(repository)
	router := httpAdapter.Create${capitalizedName}Routes(useCases)

	t.Run("creates entity and returns 201", func(t *testing.T) {
		payload := map[string]interface{}{
			// Add test data here
		}
		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPost, "/${pluralName}", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusCreated, w.Code)
		
		var response map[string]interface{}
		err := json.NewDecoder(w.Body).Decode(&response)
		require.NoError(t, err)
		assert.NotEmpty(t, response["id"])
		assert.NotEmpty(t, response["createdAt"])
	})

	t.Run("returns 400 for invalid request", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/${pluralName}", bytes.NewBufferString("invalid json"))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})
}

func TestGetAll${capitalizedName}s(t *testing.T) {
	repository := persistence.NewInMemory${capitalizedName}Repository()
	useCases := usecases.New${capitalizedName}UseCases(repository)
	router := httpAdapter.Create${capitalizedName}Routes(useCases)

	t.Run("returns empty array initially", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/${pluralName}", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response []interface{}
		err := json.NewDecoder(w.Body).Decode(&response)
		require.NoError(t, err)
		assert.Empty(t, response)
	})

	t.Run("returns created entities", func(t *testing.T) {
		// Create an entity first
		payload := map[string]interface{}{}
		body, _ := json.Marshal(payload)
		createReq := httptest.NewRequest(http.MethodPost, "/${pluralName}", bytes.NewBuffer(body))
		createReq.Header.Set("Content-Type", "application/json")
		createW := httptest.NewRecorder()
		router.ServeHTTP(createW, createReq)

		// Get all entities
		req := httptest.NewRequest(http.MethodGet, "/${pluralName}", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response []interface{}
		err := json.NewDecoder(w.Body).Decode(&response)
		require.NoError(t, err)
		assert.Len(t, response, 1)
	})
}

func TestGet${capitalizedName}ByID(t *testing.T) {
	repository := persistence.NewInMemory${capitalizedName}Repository()
	useCases := usecases.New${capitalizedName}UseCases(repository)
	router := httpAdapter.Create${capitalizedName}Routes(useCases)

	t.Run("returns entity by id", func(t *testing.T) {
		// Create an entity first
		payload := map[string]interface{}{}
		body, _ := json.Marshal(payload)
		createReq := httptest.NewRequest(http.MethodPost, "/${pluralName}", bytes.NewBuffer(body))
		createReq.Header.Set("Content-Type", "application/json")
		createW := httptest.NewRecorder()
		router.ServeHTTP(createW, createReq)

		var created map[string]interface{}
		json.NewDecoder(createW.Body).Decode(&created)
		id := created["id"].(string)

		// Get entity by ID
		req := httptest.NewRequest(http.MethodGet, "/${pluralName}/"+id, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.NewDecoder(w.Body).Decode(&response)
		require.NoError(t, err)
		assert.Equal(t, id, response["id"])
	})

	t.Run("returns 404 for nonexistent id", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/${pluralName}/nonexistent", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestUpdate${capitalizedName}(t *testing.T) {
	repository := persistence.NewInMemory${capitalizedName}Repository()
	useCases := usecases.New${capitalizedName}UseCases(repository)
	router := httpAdapter.Create${capitalizedName}Routes(useCases)

	t.Run("updates and returns entity", func(t *testing.T) {
		// Create an entity first
		payload := map[string]interface{}{}
		body, _ := json.Marshal(payload)
		createReq := httptest.NewRequest(http.MethodPost, "/${pluralName}", bytes.NewBuffer(body))
		createReq.Header.Set("Content-Type", "application/json")
		createW := httptest.NewRecorder()
		router.ServeHTTP(createW, createReq)

		var created map[string]interface{}
		json.NewDecoder(createW.Body).Decode(&created)
		id := created["id"].(string)

		// Update entity
		updatePayload := map[string]interface{}{}
		updateBody, _ := json.Marshal(updatePayload)
		req := httptest.NewRequest(http.MethodPut, "/${pluralName}/"+id, bytes.NewBuffer(updateBody))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.NewDecoder(w.Body).Decode(&response)
		require.NoError(t, err)
		assert.Equal(t, id, response["id"])
	})

	t.Run("returns 404 for nonexistent id", func(t *testing.T) {
		payload := map[string]interface{}{}
		body, _ := json.Marshal(payload)
		req := httptest.NewRequest(http.MethodPut, "/${pluralName}/nonexistent", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func TestDelete${capitalizedName}(t *testing.T) {
	repository := persistence.NewInMemory${capitalizedName}Repository()
	useCases := usecases.New${capitalizedName}UseCases(repository)
	router := httpAdapter.Create${capitalizedName}Routes(useCases)

	t.Run("deletes entity and returns success message", func(t *testing.T) {
		// Create an entity first
		payload := map[string]interface{}{}
		body, _ := json.Marshal(payload)
		createReq := httptest.NewRequest(http.MethodPost, "/${pluralName}", bytes.NewBuffer(body))
		createReq.Header.Set("Content-Type", "application/json")
		createW := httptest.NewRecorder()
		router.ServeHTTP(createW, createReq)

		var created map[string]interface{}
		json.NewDecoder(createW.Body).Decode(&created)
		id := created["id"].(string)

		// Delete entity
		req := httptest.NewRequest(http.MethodDelete, "/${pluralName}/"+id, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var response map[string]interface{}
		err := json.NewDecoder(w.Body).Decode(&response)
		require.NoError(t, err)
		assert.Equal(t, "${capitalizedName} deleted successfully", response["message"])
	})

	t.Run("returns 404 for nonexistent id", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodDelete, "/${pluralName}/nonexistent", nil)
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}
`;
}
