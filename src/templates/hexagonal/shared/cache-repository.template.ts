import type { TemplateData } from '../../../types';

export function generateCacheRepositoryTemplate(data: TemplateData): string {
  const { capitalizedName } = data;

  return `import type { ${capitalizedName}RepositoryPort } from '../../../domain/ports/out/${data.name}.repository.port';
import type { ${capitalizedName}Entity, Create${capitalizedName}Data, Update${capitalizedName}Data } from '../../../domain/entities/${data.name}.entity';

export class Cached${capitalizedName}Repository implements ${capitalizedName}RepositoryPort {
  private static readonly PREFIX = '${data.name}';
  private static readonly TTL = 300; // 5 minutes

  constructor(
    private readonly inner: ${capitalizedName}RepositoryPort,
    private readonly redis: ReturnType<typeof Bun.redis>,
  ) {}

  async findAll(): Promise<${capitalizedName}Entity[]> {
    const key = \`\${Cached${capitalizedName}Repository.PREFIX}:all\`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const result = await this.inner.findAll();
    await this.redis.set(key, JSON.stringify(result), { ex: Cached${capitalizedName}Repository.TTL });
    return result;
  }

  async findById(id: string): Promise<${capitalizedName}Entity | null> {
    const key = \`\${Cached${capitalizedName}Repository.PREFIX}:\${id}\`;
    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const result = await this.inner.findById(id);
    if (result) {
      await this.redis.set(key, JSON.stringify(result), { ex: Cached${capitalizedName}Repository.TTL });
    }
    return result;
  }

  async create(data: Create${capitalizedName}Data): Promise<${capitalizedName}Entity> {
    const result = await this.inner.create(data);
    await this.redis.del(\`\${Cached${capitalizedName}Repository.PREFIX}:all\`);
    return result;
  }

  async update(id: string, data: Update${capitalizedName}Data): Promise<${capitalizedName}Entity | null> {
    const result = await this.inner.update(id, data);
    await this.redis.del(\`\${Cached${capitalizedName}Repository.PREFIX}:\${id}\`);
    await this.redis.del(\`\${Cached${capitalizedName}Repository.PREFIX}:all\`);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.inner.delete(id);
    await this.redis.del(\`\${Cached${capitalizedName}Repository.PREFIX}:\${id}\`);
    await this.redis.del(\`\${Cached${capitalizedName}Repository.PREFIX}:all\`);
    return result;
  }
}
`;
}
