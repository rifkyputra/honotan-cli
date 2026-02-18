import type { TemplateData } from '../../../types';

export function generateVsHonoTestTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName, name } = data;

  return `import { test, expect, describe, beforeEach } from 'bun:test';
import { Hono } from 'hono';
import { ${capitalizedName}Service } from './${name}.service';
import { InMemory${capitalizedName}Repository } from './${name}.in-memory.repository';
import { create${capitalizedName}Routes } from './${name}.routes';

describe('${capitalizedName} Vertical Slice', () => {
  let repository: InMemory${capitalizedName}Repository;
  let service: ${capitalizedName}Service;
  let app: Hono;

  beforeEach(() => {
    repository = new InMemory${capitalizedName}Repository();
    service = new ${capitalizedName}Service(repository);
    app = new Hono();
    app.route('/', create${capitalizedName}Routes(service));
  });

  // ── Service Tests ──────────────────────────────────────────────────

  describe('${capitalizedName}Service', () => {
    test('creates a ${name}', async () => {
      const ${camelCaseName} = await service.create${capitalizedName}({});
      expect(${camelCaseName}.id).toBeDefined();
      expect(${camelCaseName}.createdAt).toBeInstanceOf(Date);
      expect(${camelCaseName}.updatedAt).toBeInstanceOf(Date);
    });

    test('gets all ${pluralName}', async () => {
      await service.create${capitalizedName}({});
      await service.create${capitalizedName}({});
      const ${pluralName} = await service.getAll${capitalizedName}s();
      expect(${pluralName}).toHaveLength(2);
    });

    test('gets a ${name} by id', async () => {
      const created = await service.create${capitalizedName}({});
      const found = await service.get${capitalizedName}ById(created.id);
      expect(found.id).toBe(created.id);
    });

    test('throws on get non-existent ${name}', async () => {
      expect(service.get${capitalizedName}ById('nonexistent')).rejects.toThrow('not found');
    });

    test('updates a ${name}', async () => {
      const created = await service.create${capitalizedName}({});
      const updated = await service.update${capitalizedName}(created.id, {});
      expect(updated.id).toBe(created.id);
    });

    test('throws on update non-existent ${name}', async () => {
      expect(service.update${capitalizedName}('nonexistent', {})).rejects.toThrow('not found');
    });

    test('deletes a ${name}', async () => {
      const created = await service.create${capitalizedName}({});
      await service.delete${capitalizedName}(created.id);
      expect(service.get${capitalizedName}ById(created.id)).rejects.toThrow('not found');
    });

    test('throws on delete non-existent ${name}', async () => {
      expect(service.delete${capitalizedName}('nonexistent')).rejects.toThrow('not found');
    });
  });

  // ── HTTP Route Tests ───────────────────────────────────────────────

  describe('HTTP Routes', () => {
    describe('POST /${pluralName}', () => {
      test('creates entity and returns 201', async () => {
        const res = await app.request('/${pluralName}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        expect(res.status).toBe(201);
        const body = await res.json();
        expect(body.id).toBeDefined();
        expect(body.createdAt).toBeDefined();
      });
    });

    describe('GET /${pluralName}', () => {
      test('returns empty array initially', async () => {
        const res = await app.request('/${pluralName}');

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual([]);
      });

      test('returns created entities', async () => {
        await app.request('/${pluralName}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        const res = await app.request('/${pluralName}');
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toHaveLength(1);
      });
    });

    describe('GET /${pluralName}/:id', () => {
      test('returns entity by id', async () => {
        const createRes = await app.request('/${pluralName}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const created = await createRes.json();

        const res = await app.request(\`/${pluralName}/\${created.id}\`);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.id).toBe(created.id);
      });

      test('returns 404 for nonexistent id', async () => {
        const res = await app.request('/${pluralName}/nonexistent');
        expect(res.status).toBe(404);
      });
    });

    describe('PUT /${pluralName}/:id', () => {
      test('updates and returns entity', async () => {
        const createRes = await app.request('/${pluralName}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const created = await createRes.json();

        const res = await app.request(\`/${pluralName}/\${created.id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.id).toBe(created.id);
      });

      test('returns 404 for nonexistent id', async () => {
        const res = await app.request('/${pluralName}/nonexistent', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        expect(res.status).toBe(404);
      });
    });

    describe('DELETE /${pluralName}/:id', () => {
      test('deletes entity and returns success message', async () => {
        const createRes = await app.request('/${pluralName}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const created = await createRes.json();

        const res = await app.request(\`/${pluralName}/\${created.id}\`, {
          method: 'DELETE',
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.message).toBe('${capitalizedName} deleted successfully');
      });

      test('returns 404 for nonexistent id', async () => {
        const res = await app.request('/${pluralName}/nonexistent', {
          method: 'DELETE',
        });
        expect(res.status).toBe(404);
      });
    });
  });
});
`;
}
