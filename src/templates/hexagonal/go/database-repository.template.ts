import type { TemplateData } from "../../../types";

export function generateGoDatabaseRepositoryTemplate(
  data: TemplateData,
): string {
  const { capitalizedName } = data;

  return `package persistence

import (
	"context"
	"database/sql"
	"time"

	"${data.name}/application/ports/out"
	"${data.name}/domain/entities"
)

// Database${capitalizedName}Repository provides a database implementation of ${capitalizedName}RepositoryPort
type Database${capitalizedName}Repository struct {
	db *sql.DB
}

// NewDatabase${capitalizedName}Repository creates a new instance of Database${capitalizedName}Repository
func NewDatabase${capitalizedName}Repository(db *sql.DB) out.${capitalizedName}RepositoryPort {
	return &Database${capitalizedName}Repository{
		db: db,
	}
}

// FindAll retrieves all ${data.name} entities from the database
func (r *Database${capitalizedName}Repository) FindAll(ctx context.Context) ([]*entities.${capitalizedName}, error) {
	query := \`
		SELECT id, created_at, updated_at
		FROM ${data.pluralName}
		ORDER BY created_at DESC
	\`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*entities.${capitalizedName}
	for rows.Next() {
		entity := &entities.${capitalizedName}{}
		if err := rows.Scan(&entity.ID, &entity.CreatedAt, &entity.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, entity)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

// FindByID retrieves a ${data.name} entity by its ID from the database
func (r *Database${capitalizedName}Repository) FindByID(ctx context.Context, id string) (*entities.${capitalizedName}, error) {
	query := \`
		SELECT id, created_at, updated_at
		FROM ${data.pluralName}
		WHERE id = $1
	\`

	entity := &entities.${capitalizedName}{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&entity.ID,
		&entity.CreatedAt,
		&entity.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return entity, nil
}

// Save stores a new ${data.name} entity in the database
func (r *Database${capitalizedName}Repository) Save(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error) {
	query := \`
		INSERT INTO ${data.pluralName} (id, created_at, updated_at)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at
	\`

	err := r.db.QueryRowContext(
		ctx,
		query,
		entity.ID,
		entity.CreatedAt,
		entity.UpdatedAt,
	).Scan(&entity.ID, &entity.CreatedAt, &entity.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return entity, nil
}

// Update modifies an existing ${data.name} entity in the database
func (r *Database${capitalizedName}Repository) Update(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error) {
	query := \`
		UPDATE ${data.pluralName}
		SET updated_at = $1
		WHERE id = $2
		RETURNING id, created_at, updated_at
	\`

	err := r.db.QueryRowContext(
		ctx,
		query,
		time.Now(),
		entity.ID,
	).Scan(&entity.ID, &entity.CreatedAt, &entity.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return entity, nil
}

// Delete removes a ${data.name} entity from the database by its ID
func (r *Database${capitalizedName}Repository) Delete(ctx context.Context, id string) error {
	query := \`DELETE FROM ${data.pluralName} WHERE id = $1\`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return nil
	}

	return nil
}
`;
}
