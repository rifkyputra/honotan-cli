import type { TemplateData } from '../../../types';

export function generateVsFastifyPluginTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, pluralName, name } = data;

  return `import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { ${capitalizedName}Service } from './${name}.service';
import {
  Create${capitalizedName}Schema,
  Update${capitalizedName}Schema,
  ${capitalizedName}IdParamsSchema,
} from './${name}.validation';

export function create${capitalizedName}Plugin(service: ${capitalizedName}Service) {
  return async function ${camelCaseName}Plugin(fastify: FastifyInstance): Promise<void> {
    fastify.get('/${pluralName}', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const ${pluralName} = await service.getAll${capitalizedName}s();
        return reply.send(${pluralName});
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to fetch ${pluralName}' });
      }
    });

    fastify.get('/${pluralName}/:id', {
      schema: {
        params: ${capitalizedName}IdParamsSchema,
      },
    }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const ${camelCaseName} = await service.get${capitalizedName}ById(id);
        return reply.send(${camelCaseName});
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return reply.code(404).send({ error: error.message });
        }
        return reply.code(500).send({ error: 'Failed to fetch ${name}' });
      }
    });

    fastify.post('/${pluralName}', {
      schema: {
        body: Create${capitalizedName}Schema,
      },
    }, async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = request.body as Record<string, unknown>;
        const ${camelCaseName} = await service.create${capitalizedName}(data);
        return reply.code(201).send(${camelCaseName});
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to create ${name}' });
      }
    });

    fastify.put('/${pluralName}/:id', {
      schema: {
        params: ${capitalizedName}IdParamsSchema,
        body: Update${capitalizedName}Schema,
      },
    }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        const data = request.body as Record<string, unknown>;
        const ${camelCaseName} = await service.update${capitalizedName}(id, data);
        return reply.send(${camelCaseName});
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return reply.code(404).send({ error: error.message });
        }
        return reply.code(500).send({ error: 'Failed to update ${name}' });
      }
    });

    fastify.delete('/${pluralName}/:id', {
      schema: {
        params: ${capitalizedName}IdParamsSchema,
      },
    }, async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;
        await service.delete${capitalizedName}(id);
        return reply.send({ message: '${capitalizedName} deleted successfully' });
      } catch (error) {
        if (error instanceof Error && error.message.includes('not found')) {
          return reply.code(404).send({ error: error.message });
        }
        return reply.code(500).send({ error: 'Failed to delete ${name}' });
      }
    });
  };
}
`;
}
