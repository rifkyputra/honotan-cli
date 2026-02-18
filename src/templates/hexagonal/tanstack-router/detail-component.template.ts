import type { TemplateData } from '../../../types';

export function generateTanStackDetailComponentTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import { useNavigate } from '@tanstack/react-router';
import { Route } from './${name}.detail-route';

export function ${capitalizedName}DetailComponent() {
  const { ${camelCaseName} } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleUpdate = async (data: any) => {
    // TODO: Implement update logic using use case
    console.log('Update ${name}:', ${camelCaseName}.id, data);
  };

  const handleDelete = async () => {
    // TODO: Implement delete logic using use case
    console.log('Delete ${name}:', ${camelCaseName}.id);
    navigate({ to: '/${pluralName}' });
  };

  return (
    <div className="${name}-detail">
      <h1>${capitalizedName} Details</h1>
      
      <div className="${name}-info">
        <p><strong>ID:</strong> {${camelCaseName}.id}</p>
        <p><strong>Name:</strong> {${camelCaseName}.name}</p>
        {/* Add more fields as needed */}
      </div>

      <div className="${name}-actions">
        <button onClick={() => handleUpdate(${camelCaseName})}>
          Edit
        </button>
        <button onClick={handleDelete}>
          Delete
        </button>
        <button onClick={() => navigate({ to: '/${pluralName}' })}>
          Back to List
        </button>
      </div>
    </div>
  );
}
`;
}
