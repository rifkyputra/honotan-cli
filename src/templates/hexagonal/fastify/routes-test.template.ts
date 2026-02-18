import type { TemplateData } from '../../../types';

export function generateFastifyRoutesTestTemplate(data: TemplateData): string {
  return `import { test, expect, describe, beforeEach } from 'bun:test';
import Fastify, { type FastifyInstance } from 'fastify';
import { create${data.capitalizedName}Routes } from './${data.name}.routes';
import { ${data.capitalizedName}UseCases } from '../../../application/use-cases/${data.name}.use-case';
import { InMemory${data.capitalizedName}Repository } from '../../out/persistence/in-memory-${data.name}.repository';

describe('${data.capitalizedName} HTTP Routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    const repository = new InMemory${data.capitalizedName}Repository();
    const useCases = new ${data.capitalizedName}UseCases(repository);
    app = Fastify();
    app.register(create${data.capitalizedName}Routes(useCases));
    await app.ready();
  });

  describe('POST /${data.pluralName}', () => {
    test('creates entity and returns 201', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/${data.pluralName}',
        headers: { 'content-type': 'application/json' },
        payload: {},
      });

      expect(res.statusCode).toBe(201);
      const body = res.json();
      expect(body.id).toBeDefined();
      expect(body.createdAt).toBeDefined();
    });
  });

  describe('GET /${data.pluralName}', () => {
    test('returns empty array initially', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/${data.pluralName}',
      });

      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body).toEqual([]);
    });

    test('returns created entities', async () => {
      await app.inject({
        method: 'POST',
        url: '/${data.pluralName}',
        headers: { 'content-type': 'application/json' },
        payload: {},
      });

      const res = await app.inject({
        method: 'GET',
        url: '/${data.pluralName}',
      });
      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body).toHaveLength(1);
    });
  });

  describe('GET /${data.pluralName}/:id', () => {
    test('returns entity by id', async () => {
      const createRes = await app.inject({
        method: 'POST',
        url: '/${data.pluralName}',
        headers: { 'content-type': 'application/json' },
        payload: {},
      });
      const created = createRes.json();

      const res = await app.inject({
        method: 'GET',
        url: \`/${data.pluralName}/\${created.id}\`,
      });
      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body.id).toBe(created.id);
    });

    test('returns 404 for nonexistent id', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/${data.pluralName}/nonexistent',
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /${data.pluralName}/:id', () => {
    test('updates and returns entity', async () => {
      const createRes = await app.inject({
        method: 'POST',
        url: '/${data.pluralName}',
        headers: { 'content-type': 'application/json' },
        payload: {},
      });
      const created = createRes.json();

      const res = await app.inject({
        method: 'PUT',
        url: \`/${data.pluralName}/\${created.id}\`,
        headers: { 'content-type': 'application/json' },
        payload: {},
      });

      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body.id).toBe(created.id);
    });

    test('returns 404 for nonexistent id', async () => {
      const res = await app.inject({
        method: 'PUT',
        url: '/${data.pluralName}/nonexistent',
        headers: { 'content-type': 'application/json' },
        payload: {},
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /${data.pluralName}/:id', () => {
    test('deletes entity and returns success message', async () => {
      const createRes = await app.inject({
        method: 'POST',
        url: '/${data.pluralName}',
        headers: { 'content-type': 'application/json' },
        payload: {},
      });
      const created = createRes.json();

      const res = await app.inject({
        method: 'DELETE',
        url: \`/${data.pluralName}/\${created.id}\`,
      });

      expect(res.statusCode).toBe(200);
      const body = res.json();
      expect(body.message).toBe('${data.capitalizedName} deleted successfully');
    });

    test('returns 404 for nonexistent id', async () => {
      const res = await app.inject({
        method: 'DELETE',
        url: '/${data.pluralName}/nonexistent',
      });
      expect(res.statusCode).toBe(404);
    });
  });
});
`;
}
