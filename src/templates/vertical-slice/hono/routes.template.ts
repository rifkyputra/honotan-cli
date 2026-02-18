import type { TemplateData } from '../../../types';

export function generateVsHonoRoutesTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName, name } = data;

  return `import { Hono } from 'hono';
import { ${capitalizedName}Handler } from './${name}.handler';
import type { ${capitalizedName}Service } from './${name}.service';

export function create${capitalizedName}Routes(service: ${capitalizedName}Service): Hono {
  const ${camelCaseName}Handler = new ${capitalizedName}Handler(service);
  const router = new Hono();

  router.get('/${pluralName}', ${camelCaseName}Handler.getAll);
  router.get('/${pluralName}/:id', ${camelCaseName}Handler.getById);
  router.post('/${pluralName}', ${camelCaseName}Handler.create);
  router.put('/${pluralName}/:id', ${camelCaseName}Handler.update);
  router.delete('/${pluralName}/:id', ${camelCaseName}Handler.delete);

  return router;
}
`;
}
