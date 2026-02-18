import type { TemplateData } from '../../../types';

export function generateFastifyRoutesTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName } = data;

  return `import type { FastifyInstance } from 'fastify';
import { ${capitalizedName}Handler } from './${data.name}.handler';
import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${data.name}.use-case.port';
import {
  Create${capitalizedName}Schema,
  Update${capitalizedName}Schema,
  ${capitalizedName}IdParamsSchema,
} from './${data.name}.validation';

export function create${capitalizedName}Routes(useCases: ${capitalizedName}UseCasePort) {
  const ${camelCaseName}Handler = new ${capitalizedName}Handler(useCases);

  return async function (fastify: FastifyInstance): Promise<void> {
    fastify.get('/${pluralName}', ${camelCaseName}Handler.getAll);

    fastify.get('/${pluralName}/:id', {
      schema: {
        params: ${capitalizedName}IdParamsSchema,
      },
    }, ${camelCaseName}Handler.getById);

    fastify.post('/${pluralName}', {
      schema: {
        body: Create${capitalizedName}Schema,
      },
    }, ${camelCaseName}Handler.create);

    fastify.put('/${pluralName}/:id', {
      schema: {
        params: ${capitalizedName}IdParamsSchema,
        body: Update${capitalizedName}Schema,
      },
    }, ${camelCaseName}Handler.update);

    fastify.delete('/${pluralName}/:id', {
      schema: {
        params: ${capitalizedName}IdParamsSchema,
      },
    }, ${camelCaseName}Handler.delete);
  };
}
`;
}
