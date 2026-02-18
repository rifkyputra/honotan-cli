import type { TemplateData } from '../../../types';

export function generateVsExpressHandlerTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import type { Request, Response, NextFunction } from 'express';
import type { ${capitalizedName}Service } from './${name}.service';
import { z } from 'zod';
import { Create${capitalizedName}Schema, Update${capitalizedName}Schema, ${capitalizedName}IdSchema } from './${name}.validation';

export class ${capitalizedName}Handler {
  constructor(private readonly ${camelCaseName}Service: ${capitalizedName}Service) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ${pluralName} = await this.${camelCaseName}Service.getAll${capitalizedName}s();
      res.json(${pluralName});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ${pluralName}' });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ${capitalizedName}IdSchema.parse({ id: req.params.id });
      const ${camelCaseName} = await this.${camelCaseName}Service.get${capitalizedName}ById(id);
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
      res.status(500).json({ error: 'Failed to fetch ${name}' });
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = Create${capitalizedName}Schema.parse(req.body);
      const ${camelCaseName} = await this.${camelCaseName}Service.create${capitalizedName}(data);
      res.status(201).json(${camelCaseName});
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation failed', issues: error.issues });
        return;
      }
      res.status(500).json({ error: 'Failed to create ${name}' });
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ${capitalizedName}IdSchema.parse({ id: req.params.id });
      const data = Update${capitalizedName}Schema.parse(req.body);
      const ${camelCaseName} = await this.${camelCaseName}Service.update${capitalizedName}(id, data);
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
      res.status(500).json({ error: 'Failed to update ${name}' });
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ${capitalizedName}IdSchema.parse({ id: req.params.id });
      await this.${camelCaseName}Service.delete${capitalizedName}(id);
      res.json({ message: '${capitalizedName} deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to delete ${name}' });
    }
  };
}
`;
}
