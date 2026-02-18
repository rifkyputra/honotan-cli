export function generateHelloApi(): string {
  return `const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

export interface HelloResponse {
  message: string
  [key: string]: unknown
}

export async function fetchHello(): Promise<HelloResponse> {
  const response = await fetch(\`\${SERVER_URL}/api/hellos\`)
  if (!response.ok) {
    throw new Error('Server might not be running')
  }
  return response.json()
}
`
}

export function generateUseHello(): string {
  return `import { useQuery } from '@tanstack/react-query'
import { fetchHello } from './hello-api'

export function useHello() {
  return useQuery({
    queryKey: ['hello'],
    queryFn: fetchHello,
    enabled: false,
  })
}
`
}
