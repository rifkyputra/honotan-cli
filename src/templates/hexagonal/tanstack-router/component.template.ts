import type { TemplateData } from '../../../types';

export function generateTanStackComponentTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { Route } from './${name}.route';

export function ${capitalizedName}Component() {
  const { ${pluralName} } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    // TODO: Implement create logic using use case
    console.log('Create ${name}:', data);
  };

  const handleUpdate = async (id: string, data: any) => {
    // TODO: Implement update logic using use case
    console.log('Update ${name}:', id, data);
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete logic using use case
    console.log('Delete ${name}:', id);
  };

  return (
    <div className="${name}-container">
      <h1>${capitalizedName}s</h1>
      
      <div className="${name}-list">
        {${pluralName}.map((${camelCaseName}) => (
          <div key={${camelCaseName}.id} className="${name}-item">
            <h3>{${camelCaseName}.name}</h3>
            <button onClick={() => handleUpdate(${camelCaseName}.id, ${camelCaseName})}>
              Edit
            </button>
            <button onClick={() => handleDelete(${camelCaseName}.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => handleCreate({})}>
        Create New ${capitalizedName}
      </button>
    </div>
  );
}
`;
}
