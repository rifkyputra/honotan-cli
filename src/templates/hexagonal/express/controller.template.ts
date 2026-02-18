import type { TemplateData } from '../../../types';

export function generateExpressControllerTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName } = data;

  return `import type { Request, Response, NextFunction } from 'express';
import type { ${capitalizedName}UseCasePort } from '../../../domain/ports/in/${data.name}.use-case.port';
import { z } from 'zod';
import { Create${capitalizedName}Schema, Update${capitalizedName}Schema, ${capitalizedName}IdSchema } from './${data.name}.validation';

export class ${capitalizedName}Controller {
  constructor(private readonly ${camelCaseName}UseCases: ${capitalizedName}UseCasePort) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ${data.pluralName} = await this.${camelCaseName}UseCases.getAll${capitalizedName}s();
      res.json(${data.pluralName});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ${data.pluralName}' });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ${capitalizedName}IdSchema.parse({ id: req.params.id });
      const ${camelCaseName} = await this.${camelCaseName}UseCases.get${capitalizedName}ById(id);
      res.json(${camelCaseName});
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', issues: error.issues });
        return;
      }
      res.status(500).json({ error: 'Failed to fetch ${data.name}' });
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = Create${capitalizedName}Schema.parse(req.body);
      const ${camelCaseName} = await this.${camelCaseName}UseCases.create${capitalizedName}(data);
      res.status(201).json(${camelCaseName});
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', issues: error.issues });
        return;
      }
      res.status(500).json({ error: 'Failed to create ${data.name}' });
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ${capitalizedName}IdSchema.parse({ id: req.params.id });
      const data = Update${capitalizedName}Schema.parse(req.body);
      const ${camelCaseName} = await this.${camelCaseName}UseCases.update${capitalizedName}(id, data);
      res.json(${camelCaseName});
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', issues: error.issues });
        return;
      }
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to update ${data.name}' });
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ${capitalizedName}IdSchema.parse({ id: req.params.id });
      await this.${camelCaseName}UseCases.delete${capitalizedName}(id);
      res.json({ message: '${capitalizedName} deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to delete ${data.name}' });
    }
  };
}
`;
}
