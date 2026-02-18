import type { TemplateData } from '../../../types';

export function generateVsTanStackDetailRouteTemplate(data: TemplateData): string {
  const { capitalizedName, name, pluralName } = data;

  return `import { createFileRoute } from '@tanstack/react-router';
import { ${capitalizedName}DetailComponent } from './${name}.detail-component';
import { load${capitalizedName}ById } from './${name}.service';

export const Route = createFileRoute('/${pluralName}/$id')({
  component: ${capitalizedName}DetailComponent,
  loader: async ({ params }) => {
    return load${capitalizedName}ById(params.id);
  },
});
`;
}
