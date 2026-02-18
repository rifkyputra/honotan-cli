import type { TemplateData } from '../../../types';

export function generateVsExpressRoutesTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName, name } = data;

  return `import { Router } from 'express';
import { ${capitalizedName}Handler } from './${name}.handler';
import type { ${capitalizedName}Service } from './${name}.service';

export function create${capitalizedName}Routes(service: ${capitalizedName}Service): Router {
  const ${camelCaseName}Handler = new ${capitalizedName}Handler(service);
  const router = Router();

  router.get('/${pluralName}', ${camelCaseName}Handler.getAll);
  router.get('/${pluralName}/:id', ${camelCaseName}Handler.getById);
  router.post('/${pluralName}', ${camelCaseName}Handler.create);
  router.put('/${pluralName}/:id', ${camelCaseName}Handler.update);
  router.delete('/${pluralName}/:id', ${camelCaseName}Handler.delete);

  return router;
}
`;
}
