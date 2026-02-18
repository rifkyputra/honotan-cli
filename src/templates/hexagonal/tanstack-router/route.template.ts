import type { TemplateData } from '../../../types';

export function generateTanStackRouteTemplate(data: TemplateData): string {
  const { capitalizedName, name, pluralName } = data;

  return `import { createFileRoute } from '@tanstack/react-router';
import { ${capitalizedName}Component } from './${name}.component';
import { load${capitalizedName}Data } from './${name}.loader';
import { ${capitalizedName}SearchSchema } from './${name}.validation';

export const Route = createFileRoute('/${pluralName}')({
  component: ${capitalizedName}Component,
  validateSearch: (search) => ${capitalizedName}SearchSchema.parse(search),
  loader: async ({ context }) => {
    return load${capitalizedName}Data(context);
  },
});
`;
}
