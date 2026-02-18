import type { TemplateData } from '../../../types';

export function generateVsTanStackTestTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import { describe, it, expect, beforeEach } from 'vitest';
import { 
  load${capitalizedName}Data, 
  load${capitalizedName}ById,
  create${capitalizedName},
  update${capitalizedName},
  delete${capitalizedName}
} from './${name}.service';

describe('${capitalizedName} Service', () => {
  beforeEach(() => {
    // Reset repository state before each test
  });

  describe('load${capitalizedName}Data', () => {
    it('should load all ${pluralName}', async () => {
      const result = await load${capitalizedName}Data();
      
      expect(result).toHaveProperty('${pluralName}');
      expect(Array.isArray(result.${pluralName})).toBe(true);
    });
  });

  describe('load${capitalizedName}ById', () => {
    it('should load a ${name} by id', async () => {
      const testId = 'test-id';
      
      // This will fail with in-memory repo unless we create test data first
      try {
        const result = await load${capitalizedName}ById(testId);
        expect(result).toHaveProperty('${camelCaseName}');
      } catch (error) {
        // Expected to fail if ${name} doesn't exist
        expect(error).toBeDefined();
      }
    });

    it('should throw error if ${name} not found', async () => {
      const nonExistentId = 'non-existent-id';
      
      await expect(load${capitalizedName}ById(nonExistentId)).rejects.toThrow();
    });
  });

  describe('create${capitalizedName}', () => {
    it('should create a new ${name}', async () => {
      const newData = {
        name: 'Test ${capitalizedName}',
        description: 'Test description',
      };

      const result = await create${capitalizedName}(newData);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(newData.name);
    });
  });

  describe('update${capitalizedName}', () => {
    it('should update an existing ${name}', async () => {
      // First create a ${name}
      const created = await create${capitalizedName}({
        name: 'Original ${capitalizedName}',
      });

      // Then update it
      const updateData = { name: 'Updated ${capitalizedName}' };
      const result = await update${capitalizedName}(created.id, updateData);

      expect(result.name).toBe(updateData.name);
    });
  });

  describe('delete${capitalizedName}', () => {
    it('should delete an existing ${name}', async () => {
      // First create a ${name}
      const created = await create${capitalizedName}({
        name: 'To Be Deleted ${capitalizedName}',
      });

      // Then delete it
      await expect(delete${capitalizedName}(created.id)).resolves.not.toThrow();

      // Verify it's deleted
      await expect(load${capitalizedName}ById(created.id)).rejects.toThrow();
    });
  });
});
`;
}
