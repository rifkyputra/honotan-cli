import type { ClientTemplateData } from '../../types'

export function generateListRoute(data: ClientTemplateData): string {
  const { resourceName, ResourceName, pluralName } = data

  return `import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ${resourceName}sApi, ${ResourceName} } from '../../../api/${resourceName}s'

export const Route = createFileRoute('/${pluralName}/')({
  component: ${ResourceName}ListComponent,
  loader: ({ context }: any) => {
    // Prefetch data if queryClient is available in context
    return context.queryClient?.ensureQueryData({
      queryKey: ['${resourceName}s'],
      queryFn: ${resourceName}sApi.getAll,
    })
  },
})

function ${ResourceName}ListComponent() {
  const queryClient = useQueryClient()
  
  const { data: ${resourceName}s = [], isLoading, error } = useQuery({
    queryKey: ['${resourceName}s'],
    queryFn: ${resourceName}sApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: ${resourceName}sApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${resourceName}s'] })
    },
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ${resourceName}?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">${ResourceName}s</h2>
        <Link
          to="/${pluralName}/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create ${ResourceName}
        </Link>
      </div>

      <div className="space-y-2">
        {${resourceName}s.map((${resourceName}: ${ResourceName}) => (
          <div
            key={${resourceName}.id}
            className="p-4 border rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{${resourceName}.name}</h3>
              <p className="text-gray-600">{${resourceName}.description}</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/${pluralName}/$id"
                params={{ id: ${resourceName}.id }}
                className="px-3 py-1 text-blue-500 hover:underline"
              >
                View
              </Link>
              <Link
                to="/${pluralName}/$id/edit"
                params={{ id: ${resourceName}.id }}
                className="px-3 py-1 text-green-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(${resourceName}.id)}
                className="px-3 py-1 text-red-500 hover:underline"
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {${resourceName}s.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No ${resourceName}s found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  )
}
`
}
