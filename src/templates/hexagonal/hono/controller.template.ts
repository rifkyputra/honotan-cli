import type { TemplateData } from '../../../types';

export function generateHonoControllerTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName } = data;

  return `import type { Context } from 'hono';
import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${data.name}.use-case.port';
import * as v from 'valibot';
import { Create${capitalizedName}Schema, Update${capitalizedName}Schema, ${capitalizedName}IdSchema } from './${data.name}.validation';

export class ${capitalizedName}Controller {
  constructor(private readonly ${camelCaseName}UseCases: ${capitalizedName}UseCasePort) {}

  getAll = async (c: Context) => {
    try {
      const ${data.pluralName} = await this.${camelCaseName}UseCases.getAll${capitalizedName}s();
      return c.json(${data.pluralName});
    } catch (error) {
      return c.json({ error: 'Failed to fetch ${data.pluralName}' }, 500);
    }
  };

  getById = async (c: Context) => {
    try {
      const { id } = v.parse(${capitalizedName}IdSchema, { id: c.req.param('id') });
      const ${camelCaseName} = await this.${camelCaseName}UseCases.get${capitalizedName}ById(id);
      return c.json(${camelCaseName});
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to fetch ${data.name}' }, 500);
    }
  };

  create = async (c: Context) => {
    try {
      const body = await c.req.json();
      const data = v.parse(Create${capitalizedName}Schema, body);
      const ${camelCaseName} = await this.${camelCaseName}UseCases.create${capitalizedName}(data);
      return c.json(${camelCaseName}, 201);
    } catch (error) {
      if (error instanceof v.ValiError) {
        return c.json({ error: 'Validation failed', issues: error.issues }, 400);
      }
      return c.json({ error: 'Failed to create ${data.name}' }, 500);
    }
  };

  update = async (c: Context) => {
    try {
      const { id } = v.parse(${capitalizedName}IdSchema, { id: c.req.param('id') });
      const body = await c.req.json();
      const data = v.parse(Update${capitalizedName}Schema, body);
      const ${camelCaseName} = await this.${camelCaseName}UseCases.update${capitalizedName}(id, data);
      return c.json(${camelCaseName});
    } catch (error) {
      if (error instanceof v.ValiError) {
        return c.json({ error: 'Validation failed', issues: error.issues }, 400);
      }
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to update ${data.name}' }, 500);
    }
  };

  delete = async (c: Context) => {
    try {
      const { id } = v.parse(${capitalizedName}IdSchema, { id: c.req.param('id') });
      await this.${camelCaseName}UseCases.delete${capitalizedName}(id);
      return c.json({ message: '${capitalizedName} deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to delete ${data.name}' }, 500);
    }
  };
}
`;
}
