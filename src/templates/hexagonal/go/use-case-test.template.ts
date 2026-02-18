import type { TemplateData } from "../../../types";

export function generateGoUseCaseTestTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `package usecases_test

import (
	"context"
	"testing"

	"${data.name}/application/ports/in"
	"${data.name}/application/use-cases"
	"${data.name}/adapters/out/persistence"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setup${capitalizedName}Test() in.${capitalizedName}UseCasePort {
	repository := persistence.NewInMemory${capitalizedName}Repository()
	return usecases.New${capitalizedName}UseCases(repository)
}

func TestCreate${capitalizedName}(t *testing.T) {
	useCases := setup${capitalizedName}Test()
	ctx := context.Background()

	t.Run("creates successfully", func(t *testing.T) {
		cmd := in.Create${capitalizedName}Command{
			// Add test data
		}

		result, err := useCases.Create${capitalizedName}(ctx, cmd)

		require.NoError(t, err)
		assert.NotEmpty(t, result.ID)
		assert.NotZero(t, result.CreatedAt)
		assert.NotZero(t, result.UpdatedAt)
	})
}

func TestGetAll${capitalizedName}s(t *testing.T) {
	useCases := setup${capitalizedName}Test()
	ctx := context.Background()

	t.Run("returns empty list initially", func(t *testing.T) {
		result, err := useCases.GetAll${capitalizedName}s(ctx)

		require.NoError(t, err)
		assert.Empty(t, result)
	})

	t.Run("returns created entities", func(t *testing.T) {
		// Create an entity
		cmd := in.Create${capitalizedName}Command{}
		_, err := useCases.Create${capitalizedName}(ctx, cmd)
		require.NoError(t, err)

		result, err := useCases.GetAll${capitalizedName}s(ctx)

		require.NoError(t, err)
		assert.Len(t, result, 1)
	})
}

func TestGet${capitalizedName}ByID(t *testing.T) {
	useCases := setup${capitalizedName}Test()
	ctx := context.Background()

	t.Run("returns entity by id", func(t *testing.T) {
		// Create an entity
		cmd := in.Create${capitalizedName}Command{}
		created, err := useCases.Create${capitalizedName}(ctx, cmd)
		require.NoError(t, err)

		result, err := useCases.Get${capitalizedName}ByID(ctx, created.ID)

		require.NoError(t, err)
		assert.Equal(t, created.ID, result.ID)
	})

	t.Run("returns error for nonexistent id", func(t *testing.T) {
		result, err := useCases.Get${capitalizedName}ByID(ctx, "nonexistent")

		assert.Error(t, err)
		assert.Nil(t, result)
		assert.Equal(t, in.ErrNotFound, err)
	})
}

func TestUpdate${capitalizedName}(t *testing.T) {
	useCases := setup${capitalizedName}Test()
	ctx := context.Background()

	t.Run("updates successfully", func(t *testing.T) {
		// Create an entity
		createCmd := in.Create${capitalizedName}Command{}
		created, err := useCases.Create${capitalizedName}(ctx, createCmd)
		require.NoError(t, err)

		// Update the entity
		updateCmd := in.Update${capitalizedName}Command{
			// Add update data
		}
		result, err := useCases.Update${capitalizedName}(ctx, created.ID, updateCmd)

		require.NoError(t, err)
		assert.Equal(t, created.ID, result.ID)
		assert.True(t, result.UpdatedAt.After(result.CreatedAt))
	})

	t.Run("returns error for nonexistent id", func(t *testing.T) {
		cmd := in.Update${capitalizedName}Command{}
		result, err := useCases.Update${capitalizedName}(ctx, "nonexistent", cmd)

		assert.Error(t, err)
		assert.Nil(t, result)
		assert.Equal(t, in.ErrNotFound, err)
	})
}

func TestDelete${capitalizedName}(t *testing.T) {
	useCases := setup${capitalizedName}Test()
	ctx := context.Background()

	t.Run("deletes successfully", func(t *testing.T) {
		// Create an entity
		cmd := in.Create${capitalizedName}Command{}
		created, err := useCases.Create${capitalizedName}(ctx, cmd)
		require.NoError(t, err)

		// Delete the entity
		err = useCases.Delete${capitalizedName}(ctx, created.ID)
		require.NoError(t, err)

		// Verify it's deleted
		result, err := useCases.Get${capitalizedName}ByID(ctx, created.ID)
		assert.Error(t, err)
		assert.Nil(t, result)
		assert.Equal(t, in.ErrNotFound, err)
	})

	t.Run("returns error for nonexistent id", func(t *testing.T) {
		err := useCases.Delete${capitalizedName}(ctx, "nonexistent")

		assert.Error(t, err)
		assert.Equal(t, in.ErrNotFound, err)
	})
}
`;
}
