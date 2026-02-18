import type { TemplateData } from '../../../types';

export function generateHonoRoutesTestTemplate(data: TemplateData): string {
  return `import { test, expect, describe, beforeEach } from 'bun:test';
import { Hono } from 'hono';
import { create${data.capitalizedName}Routes } from './${data.name}.routes';
import { ${data.capitalizedName}UseCases } from '../../../application/use-cases/${data.name}.use-case';
import { InMemory${data.capitalizedName}Repository } from '../../out/persistence/in-memory-${data.name}.repository';

describe('${data.capitalizedName} HTTP Routes', () => {
  let app: Hono;

  beforeEach(() => {
    const repository = new InMemory${data.capitalizedName}Repository();
    const useCases = new ${data.capitalizedName}UseCases(repository);
    app = new Hono();
    app.route('/', create${data.capitalizedName}Routes(useCases));
  });

  describe('POST /${data.pluralName}', () => {
    test('creates entity and returns 201', async () => {
      const res = await app.request('/${data.pluralName}', {
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

  describe('GET /${data.pluralName}', () => {
    test('returns empty array initially', async () => {
      const res = await app.request('/${data.pluralName}');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual([]);
    });

    test('returns created entities', async () => {
      await app.request('/${data.pluralName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await app.request('/${data.pluralName}');
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveLength(1);
    });
  });

  describe('GET /${data.pluralName}/:id', () => {
    test('returns entity by id', async () => {
      const createRes = await app.request('/${data.pluralName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const created = await createRes.json();

      const res = await app.request(\`/${data.pluralName}/\${created.id}\`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(created.id);
    });

    test('returns 404 for nonexistent id', async () => {
      const res = await app.request('/${data.pluralName}/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /${data.pluralName}/:id', () => {
    test('updates and returns entity', async () => {
      const createRes = await app.request('/${data.pluralName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const created = await createRes.json();

      const res = await app.request(\`/${data.pluralName}/\${created.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(created.id);
    });

    test('returns 404 for nonexistent id', async () => {
      const res = await app.request('/${data.pluralName}/nonexistent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /${data.pluralName}/:id', () => {
    test('deletes entity and returns success message', async () => {
      const createRes = await app.request('/${data.pluralName}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const created = await createRes.json();

      const res = await app.request(\`/${data.pluralName}/\${created.id}\`, {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.message).toBe('${data.capitalizedName} deleted successfully');
    });

    test('returns 404 for nonexistent id', async () => {
      const res = await app.request('/${data.pluralName}/nonexistent', {
        method: 'DELETE',
      });
      expect(res.status).toBe(404);
    });
  });
});
`;
}
