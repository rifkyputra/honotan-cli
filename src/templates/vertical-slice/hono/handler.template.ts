import type { TemplateData } from '../../../types';

export function generateVsHonoHandlerTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import type { Context } from 'hono';
import type { ${capitalizedName}Service } from './${name}.service';
import * as v from 'valibot';
import { Create${capitalizedName}Schema, Update${capitalizedName}Schema, ${capitalizedName}IdSchema } from './${name}.validation';

export class ${capitalizedName}Handler {
  constructor(private readonly ${camelCaseName}Service: ${capitalizedName}Service) {}

  getAll = async (c: Context) => {
    try {
      const ${pluralName} = await this.${camelCaseName}Service.getAll${capitalizedName}s();
      return c.json(${pluralName});
    } catch (error) {
      return c.json({ error: 'Failed to fetch ${pluralName}' }, 500);
    }
  };

  getById = async (c: Context) => {
    try {
      const { id } = v.parse(${capitalizedName}IdSchema, { id: c.req.param('id') });
      const ${camelCaseName} = await this.${camelCaseName}Service.get${capitalizedName}ById(id);
      return c.json(${camelCaseName});
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to fetch ${name}' }, 500);
    }
  };

  create = async (c: Context) => {
    try {
      const body = await c.req.json();
      const data = v.parse(Create${capitalizedName}Schema, body);
      const ${camelCaseName} = await this.${camelCaseName}Service.create${capitalizedName}(data);
      return c.json(${camelCaseName}, 201);
    } catch (error) {
      if (error instanceof v.ValiError) {
        return c.json({ error: 'Validation failed', issues: error.issues }, 400);
      }
      return c.json({ error: 'Failed to create ${name}' }, 500);
    }
  };

  update = async (c: Context) => {
    try {
      const { id } = v.parse(${capitalizedName}IdSchema, { id: c.req.param('id') });
      const body = await c.req.json();
      const data = v.parse(Update${capitalizedName}Schema, body);
      const ${camelCaseName} = await this.${camelCaseName}Service.update${capitalizedName}(id, data);
      return c.json(${camelCaseName});
    } catch (error) {
      if (error instanceof v.ValiError) {
        return c.json({ error: 'Validation failed', issues: error.issues }, 400);
      }
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to update ${name}' }, 500);
    }
  };

  delete = async (c: Context) => {
    try {
      const { id } = v.parse(${capitalizedName}IdSchema, { id: c.req.param('id') });
      await this.${camelCaseName}Service.delete${capitalizedName}(id);
      return c.json({ message: '${capitalizedName} deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return c.json({ error: error.message }, 404);
      }
      return c.json({ error: 'Failed to delete ${name}' }, 500);
    }
  };
}
`;
}
