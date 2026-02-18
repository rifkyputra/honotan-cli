import type { TemplateData } from '../../../types';

export function generateHonoValidationTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `import * as v from 'valibot';

export const ${capitalizedName}Schema = v.object({
  id: v.string(),
  createdAt: v.date(),
  updatedAt: v.date(),
  // Add your domain-specific validation here
});

export const Create${capitalizedName}Schema = v.omit(${capitalizedName}Schema, ['id', 'createdAt', 'updatedAt']);

export const Update${capitalizedName}Schema = v.partial(Create${capitalizedName}Schema);

export const ${capitalizedName}IdSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1, 'ID is required')),
});

export type ${capitalizedName}Input = v.InferInput<typeof ${capitalizedName}Schema>;
export type ${capitalizedName}Output = v.InferOutput<typeof ${capitalizedName}Schema>;
export type Create${capitalizedName}Input = v.InferInput<typeof Create${capitalizedName}Schema>;
export type Update${capitalizedName}Input = v.InferInput<typeof Update${capitalizedName}Schema>;
`;
}
