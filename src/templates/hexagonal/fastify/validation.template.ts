import type { TemplateData } from '../../../types';

export function generateFastifyValidationTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `// JSON Schema definitions for Fastify route validation

export const ${capitalizedName}Schema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    // Add your domain-specific properties here
  },
  required: ['id', 'createdAt', 'updatedAt'],
} as const;

export const Create${capitalizedName}Schema = {
  type: 'object',
  properties: {
    // Add your domain-specific properties here (excluding id, createdAt, updatedAt)
  },
  required: [] as string[],
  additionalProperties: false,
} as const;

export const Update${capitalizedName}Schema = {
  type: 'object',
  properties: {
    // Add your domain-specific properties here (all optional for partial updates)
  },
  additionalProperties: false,
} as const;

export const ${capitalizedName}IdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
  },
  required: ['id'],
} as const;

// TypeScript interfaces derived from the schemas
export interface ${capitalizedName} {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Add your domain-specific fields here
}

export interface Create${capitalizedName}Input {
  // Add your domain-specific fields here (excluding id, createdAt, updatedAt)
}

export interface Update${capitalizedName}Input {
  // Add your domain-specific fields here (all optional)
}

export interface ${capitalizedName}IdParams {
  id: string;
}
`;
}
