import type { TemplateData } from "../../../types";

export function generateGoCacheRepositoryTemplate(
  data: TemplateData,
): string {
  const { capitalizedName } = data;

  return `package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"${data.name}/application/ports/out"
	"${data.name}/domain/entities"
	"github.com/redis/go-redis/v9"
)

// Cached${capitalizedName}Repository provides a cached wrapper for ${capitalizedName}RepositoryPort
type Cached${capitalizedName}Repository struct {
	baseRepo out.${capitalizedName}RepositoryPort
	redis    *redis.Client
	ttl      time.Duration
}

// NewCached${capitalizedName}Repository creates a new instance with cache support
func NewCached${capitalizedName}Repository(
	baseRepo out.${capitalizedName}RepositoryPort,
	redisClient *redis.Client,
) out.${capitalizedName}RepositoryPort {
	return &Cached${capitalizedName}Repository{
		baseRepo: baseRepo,
		redis:    redisClient,
		ttl:      15 * time.Minute,
	}
}

func (r *Cached${capitalizedName}Repository) cacheKey(id string) string {
	return fmt.Sprintf("${data.name}:%s", id)
}

func (r *Cached${capitalizedName}Repository) allCacheKey() string {
	return "${data.pluralName}:all"
}

// FindAll retrieves all entities with caching
func (r *Cached${capitalizedName}Repository) FindAll(ctx context.Context) ([]*entities.${capitalizedName}, error) {
	// Try cache first
	cached, err := r.redis.Get(ctx, r.allCacheKey()).Result()
	if err == nil {
		var result []*entities.${capitalizedName}
		if err := json.Unmarshal([]byte(cached), &result); err == nil {
			return result, nil
		}
	}

	// Cache miss - fetch from base repository
	result, err := r.baseRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	// Cache the result
	data, _ := json.Marshal(result)
	r.redis.Set(ctx, r.allCacheKey(), data, r.ttl)

	return result, nil
}

// FindByID retrieves an entity by ID with caching
func (r *Cached${capitalizedName}Repository) FindByID(ctx context.Context, id string) (*entities.${capitalizedName}, error) {
	// Try cache first
	cached, err := r.redis.Get(ctx, r.cacheKey(id)).Result()
	if err == nil {
		var result entities.${capitalizedName}
		if err := json.Unmarshal([]byte(cached), &result); err == nil {
			return &result, nil
		}
	}

	// Cache miss - fetch from base repository
	result, err := r.baseRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if result == nil {
		return nil, nil
	}

	// Cache the result
	data, _ := json.Marshal(result)
	r.redis.Set(ctx, r.cacheKey(id), data, r.ttl)

	return result, nil
}

// Save creates a new entity and invalidates cache
func (r *Cached${capitalizedName}Repository) Save(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error) {
	result, err := r.baseRepo.Save(ctx, entity)
	if err != nil {
		return nil, err
	}

	// Invalidate cache
	r.redis.Del(ctx, r.allCacheKey())

	return result, nil
}

// Update modifies an entity and invalidates cache
func (r *Cached${capitalizedName}Repository) Update(ctx context.Context, entity *entities.${capitalizedName}) (*entities.${capitalizedName}, error) {
	result, err := r.baseRepo.Update(ctx, entity)
	if err != nil {
		return nil, err
	}

	// Invalidate cache
	r.redis.Del(ctx, r.cacheKey(entity.ID), r.allCacheKey())

	return result, nil
}

// Delete removes an entity and invalidates cache
func (r *Cached${capitalizedName}Repository) Delete(ctx context.Context, id string) error {
	if err := r.baseRepo.Delete(ctx, id); err != nil {
		return err
	}

	// Invalidate cache
	r.redis.Del(ctx, r.cacheKey(id), r.allCacheKey())

	return nil
}
`;
}
