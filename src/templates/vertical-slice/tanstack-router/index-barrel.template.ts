import type { TemplateData } from '../../../types';

export function generateVsTanStackIndexTemplate(data: TemplateData): string {
  const { name } = data;

  return `export * from './${name}.route';
export * from './${name}.component';
export * from './${name}.service';
export * from './${name}.validation';
export * from './${name}.entity';
export * from './${name}.repository';
export * from './${name}.detail-route';
export * from './${name}.detail-component';
`;
}
