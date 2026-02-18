import type { TemplateData } from '../../../types';

export function generateDatabaseRepositoryTemplate(data: TemplateData): string {
  const { capitalizedName, pluralName } = data;

  return `import type { ${capitalizedName}RepositoryPort } from '../../../domain/ports/out/${data.name}.repository.port';
import type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from '../../../domain/entities/${data.name}.entity';

const sql = Bun.sql;

export class Database${capitalizedName}Repository implements ${capitalizedName}RepositoryPort {
  async findAll(): Promise<${capitalizedName}Entity[]> {
    const rows = await sql\`SELECT * FROM ${pluralName}\`;
    return rows.map(this.mapRow);
  }

  async findById(id: string): Promise<${capitalizedName}Entity | null> {
    const rows = await sql\`SELECT * FROM ${pluralName} WHERE id = \${id}\`;
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async create(data: Create${capitalizedName}Data): Promise<${capitalizedName}Entity> {
    const now = new Date();
    const rows = await sql\`
      INSERT INTO ${pluralName} (created_at, updated_at)
      VALUES (\${now}, \${now})
      RETURNING *
    \`;
    return this.mapRow(rows[0]);
  }

  async update(id: string, _data: Update${capitalizedName}Data): Promise<${capitalizedName}Entity | null> {
    const now = new Date();
    const rows = await sql\`
      UPDATE ${pluralName}
      SET updated_at = \${now}
      WHERE id = \${id}
      RETURNING *
    \`;
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const rows = await sql\`DELETE FROM ${pluralName} WHERE id = \${id} RETURNING id\`;
    return rows.length > 0;
  }

  private mapRow(row: Record<string, unknown>): ${capitalizedName}Entity {
    return {
      id: String(row.id),
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    };
  }
}
`;
}
