import type { TemplateData } from '../../../types';

export function generateVsTanStackComponentTemplate(data: TemplateData): string {
  const { capitalizedName, camelCaseName, name, pluralName } = data;

  return `import { useNavigate } from '@tanstack/react-router';
import { Route } from './${name}.route';
import { create${capitalizedName}, update${capitalizedName}, delete${capitalizedName} } from './${name}.service';

export function ${capitalizedName}Component() {
  const { ${pluralName} } = Route.useLoaderData();
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    try {
      await create${capitalizedName}(data);
      navigate({ to: '/${pluralName}', replace: true });
    } catch (error) {
      console.error('Failed to create ${name}:', error);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await update${capitalizedName}(id, data);
      navigate({ to: '/${pluralName}', replace: true });
    } catch (error) {
      console.error('Failed to update ${name}:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await delete${capitalizedName}(id);
      navigate({ to: '/${pluralName}', replace: true });
    } catch (error) {
      console.error('Failed to delete ${name}:', error);
    }
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
