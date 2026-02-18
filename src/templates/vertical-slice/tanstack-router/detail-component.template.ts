import type { TemplateData } from '../../../types';

export function generateVsTanStackDetailComponentTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import { useNavigate } from '@tanstack/react-router';
import { Route } from './${name}.detail-route';
import { update${capitalizedName}, delete${capitalizedName} } from './${name}.service';

export function ${capitalizedName}DetailComponent() {
  const { ${camelCaseName} } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleUpdate = async (data: any) => {
    try {
      await update${capitalizedName}(${camelCaseName}.id, data);
      navigate({ to: '/${pluralName}' });
    } catch (error) {
      console.error('Failed to update ${name}:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await delete${capitalizedName}(${camelCaseName}.id);
      navigate({ to: '/${pluralName}' });
    } catch (error) {
      console.error('Failed to delete ${name}:', error);
    }
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
