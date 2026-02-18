import type { ClientTemplateData } from '../../types'

export function generateApi(data: ClientTemplateData): string {
  const { resourceName, ResourceName } = data

  return `export interface ${ResourceName} {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type Create${ResourceName}Dto = Omit<${ResourceName}, 'id' | 'createdAt' | 'updatedAt'>
export type Update${ResourceName}Dto = Partial<Create${ResourceName}Dto>

const API_URL = '/api/${resourceName}s'

export const ${resourceName}sApi = {
  async getAll(): Promise<${ResourceName}[]> {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch ${resourceName}s')
    return response.json()
  },

  async getById(id: string): Promise<${ResourceName}> {
    const response = await fetch(\`\${API_URL}/\${id}\`)
    if (!response.ok) throw new Error('Failed to fetch ${resourceName}')
    return response.json()
  },

  async create(data: Create${ResourceName}Dto): Promise<${ResourceName}> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create ${resourceName}')
    return response.json()
  },

  async update(id: string, data: Update${ResourceName}Dto): Promise<${ResourceName}> {
    const response = await fetch(\`\${API_URL}/\${id}\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update ${resourceName}')
    return response.json()
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(\`\${API_URL}/\${id}\`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete ${resourceName}')
  },
}
`
}
