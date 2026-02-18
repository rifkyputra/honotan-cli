import type { TemplateData } from '../../../types';

export function generateFastifyHandlerTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName } = data;

  return `import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${data.name}.use-case.port';

export class ${capitalizedName}Handler {
  constructor(private readonly ${camelCaseName}UseCases: ${capitalizedName}UseCasePort) {}

  getAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const ${data.pluralName} = await this.${camelCaseName}UseCases.getAll${capitalizedName}s();
      return reply.send(${data.pluralName});
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to fetch ${data.pluralName}' });
    }
  };

  getById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const ${camelCaseName} = await this.${camelCaseName}UseCases.get${capitalizedName}ById(id);
      return reply.send(${camelCaseName});
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Failed to fetch ${data.name}' });
    }
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = request.body as Record<string, unknown>;
      const ${camelCaseName} = await this.${camelCaseName}UseCases.create${capitalizedName}(data);
      return reply.code(201).send(${camelCaseName});
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to create ${data.name}' });
    }
  };

  update = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const data = request.body as Record<string, unknown>;
      const ${camelCaseName} = await this.${camelCaseName}UseCases.update${capitalizedName}(id, data);
      return reply.send(${camelCaseName});
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Failed to update ${data.name}' });
    }
  };

  delete = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      await this.${camelCaseName}UseCases.delete${capitalizedName}(id);
      return reply.send({ message: '${capitalizedName} deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Failed to delete ${data.name}' });
    }
  };
}
`;
}
