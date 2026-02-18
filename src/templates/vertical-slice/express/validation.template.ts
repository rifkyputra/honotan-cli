import type { TemplateData } from '../../../types';

export function generateVsExpressValidationTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `import { z } from 'zod';

export const ${capitalizedName}Schema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Add your domain-specific validation here
});

export const Create${capitalizedName}Schema = ${capitalizedName}Schema.omit({ id: true, createdAt: true, updatedAt: true });

export const Update${capitalizedName}Schema = Create${capitalizedName}Schema.partial();

export const ${capitalizedName}IdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export type ${capitalizedName}Input = z.input<typeof ${capitalizedName}Schema>;
export type ${capitalizedName}Output = z.output<typeof ${capitalizedName}Schema>;
export type Create${capitalizedName}Input = z.input<typeof Create${capitalizedName}Schema>;
export type Update${capitalizedName}Input = z.input<typeof Update${capitalizedName}Schema>;
`;
}
