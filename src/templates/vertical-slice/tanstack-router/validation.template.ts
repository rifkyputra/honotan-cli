import type { TemplateData } from '../../../types';

export function generateVsTanStackValidationTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `import { z } from 'zod';

export const ${capitalizedName}SearchSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(10),
  sort: z.enum(['asc', 'desc']).optional().default('asc'),
  filter: z.string().optional(),
});

export type ${capitalizedName}Search = z.infer<typeof ${capitalizedName}SearchSchema>;

export const Create${capitalizedName}Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type Create${capitalizedName}Input = z.infer<typeof Create${capitalizedName}Schema>;

export const Update${capitalizedName}Schema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
});

export type Update${capitalizedName}Input = z.infer<typeof Update${capitalizedName}Schema>;

export const ${capitalizedName}IdSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
`;
}
