import type { TemplateData } from '../../../types';

export function generateUseCaseTestTemplate(data: TemplateData): string {
  return `import { test, expect, describe, beforeEach } from 'bun:test';
import { ${data.capitalizedName}UseCases } from './${data.name}.use-case';
import { InMemory${data.capitalizedName}Repository } from '../../adapters/out/persistence/in-memory-${data.name}.repository';

describe('${data.capitalizedName}UseCases', () => {
  let repository: InMemory${data.capitalizedName}Repository;
  let useCases: ${data.capitalizedName}UseCases;

  beforeEach(() => {
    repository = new InMemory${data.capitalizedName}Repository();
    useCases = new ${data.capitalizedName}UseCases(repository);
  });

  describe('create${data.capitalizedName}', () => {
    test('creates and returns entity with id and timestamps', async () => {
      const result = await useCases.create${data.capitalizedName}({});

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getAll${data.capitalizedName}s', () => {
    test('returns empty array when no entities exist', async () => {
      const result = await useCases.getAll${data.capitalizedName}s();
      expect(result).toEqual([]);
    });

    test('returns all created entities', async () => {
      await useCases.create${data.capitalizedName}({});
      await useCases.create${data.capitalizedName}({});

      const result = await useCases.getAll${data.capitalizedName}s();
      expect(result).toHaveLength(2);
    });
  });

  describe('get${data.capitalizedName}ById', () => {
    test('returns entity by id', async () => {
      const created = await useCases.create${data.capitalizedName}({});
      const result = await useCases.get${data.capitalizedName}ById(created.id);

      expect(result.id).toBe(created.id);
    });

    test('throws when entity not found', async () => {
      await expect(useCases.get${data.capitalizedName}ById('nonexistent')).rejects.toThrow(
        '${data.capitalizedName} with id nonexistent not found',
      );
    });
  });

  describe('update${data.capitalizedName}', () => {
    test('updates and returns entity', async () => {
      const created = await useCases.create${data.capitalizedName}({});
      const result = await useCases.update${data.capitalizedName}(created.id, {});

      expect(result.id).toBe(created.id);
      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    test('throws when entity not found', async () => {
      await expect(useCases.update${data.capitalizedName}('nonexistent', {})).rejects.toThrow(
        '${data.capitalizedName} with id nonexistent not found',
      );
    });
  });

  describe('delete${data.capitalizedName}', () => {
    test('deletes entity successfully', async () => {
      const created = await useCases.create${data.capitalizedName}({});
      await useCases.delete${data.capitalizedName}(created.id);

      const all = await useCases.getAll${data.capitalizedName}s();
      expect(all).toHaveLength(0);
    });

    test('throws when entity not found', async () => {
      await expect(useCases.delete${data.capitalizedName}('nonexistent')).rejects.toThrow(
        '${data.capitalizedName} with id nonexistent not found',
      );
    });
  });
});
`;
}
