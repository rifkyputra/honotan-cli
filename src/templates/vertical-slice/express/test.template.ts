import type { TemplateData } from '../../../types';

export function generateVsExpressTestTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName, name } = data;

  return `import { test, expect, describe, beforeEach } from 'bun:test';
import express from 'express';
import { ${capitalizedName}Service } from './${name}.service';
import { InMemory${capitalizedName}Repository } from './${name}.in-memory.repository';
import { create${capitalizedName}Routes } from './${name}.routes';

describe('${capitalizedName} Vertical Slice', () => {
  let repository: InMemory${capitalizedName}Repository;
  let service: ${capitalizedName}Service;
  let app: express.Express;
  let baseUrl: string;
  let server: ReturnType<express.Express['listen']>;

  beforeEach(async () => {
    repository = new InMemory${capitalizedName}Repository();
    service = new ${capitalizedName}Service(repository);
    app = express();
    app.use(express.json());
    app.use('/', create${capitalizedName}Routes(service));

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const addr = server.address();
        if (typeof addr === 'object' && addr) {
          baseUrl = \`http://localhost:\${addr.port}\`;
        }
        resolve();
      });
    });
  });

  afterEach(() => {
    server?.close();
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
        const res = await fetch(\`\${baseUrl}/${pluralName}\`, {
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
        const res = await fetch(\`\${baseUrl}/${pluralName}\`);

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toEqual([]);
      });

      test('returns created entities', async () => {
        await fetch(\`\${baseUrl}/${pluralName}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        const res = await fetch(\`\${baseUrl}/${pluralName}\`);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body).toHaveLength(1);
      });
    });

    describe('GET /${pluralName}/:id', () => {
      test('returns entity by id', async () => {
        const createRes = await fetch(\`\${baseUrl}/${pluralName}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const created = await createRes.json();

        const res = await fetch(\`\${baseUrl}/${pluralName}/\${created.id}\`);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.id).toBe(created.id);
      });

      test('returns 404 for nonexistent id', async () => {
        const res = await fetch(\`\${baseUrl}/${pluralName}/nonexistent\`);
        expect(res.status).toBe(404);
      });
    });

    describe('PUT /${pluralName}/:id', () => {
      test('updates and returns entity', async () => {
        const createRes = await fetch(\`\${baseUrl}/${pluralName}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const created = await createRes.json();

        const res = await fetch(\`\${baseUrl}/${pluralName}/\${created.id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.id).toBe(created.id);
      });

      test('returns 404 for nonexistent id', async () => {
        const res = await fetch(\`\${baseUrl}/${pluralName}/nonexistent\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        expect(res.status).toBe(404);
      });
    });

    describe('DELETE /${pluralName}/:id', () => {
      test('deletes entity and returns success message', async () => {
        const createRes = await fetch(\`\${baseUrl}/${pluralName}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const created = await createRes.json();

        const res = await fetch(\`\${baseUrl}/${pluralName}/\${created.id}\`, {
          method: 'DELETE',
        });

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.message).toBe('${capitalizedName} deleted successfully');
      });

      test('returns 404 for nonexistent id', async () => {
        const res = await fetch(\`\${baseUrl}/${pluralName}/nonexistent\`, {
          method: 'DELETE',
        });
        expect(res.status).toBe(404);
      });
    });
  });
});
`;
}
