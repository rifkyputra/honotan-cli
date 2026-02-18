import type { TemplateData } from '../../../types';

export function generateExpressRoutesTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName } = data;

  return `import { Router } from 'express';
import { ${capitalizedName}Controller } from './${data.name}.controller';
import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${data.name}.use-case.port';

export function create${capitalizedName}Routes(useCases: ${capitalizedName}UseCasePort): Router {
  const ${camelCaseName}Controller = new ${capitalizedName}Controller(useCases);
  const router = Router();

  router.get('/${pluralName}', ${camelCaseName}Controller.getAll);
  router.get('/${pluralName}/:id', ${camelCaseName}Controller.getById);
  router.post('/${pluralName}', ${camelCaseName}Controller.create);
  router.put('/${pluralName}/:id', ${camelCaseName}Controller.update);
  router.delete('/${pluralName}/:id', ${camelCaseName}Controller.delete);

  return router;
}
`;
}
