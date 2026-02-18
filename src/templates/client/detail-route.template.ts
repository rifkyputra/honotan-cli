import type { ClientTemplateData } from '../../types'

export function generateDetailRoute(data: ClientTemplateData): string {
  const { resourceName, ResourceName, pluralName } = data

  return `import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tantml:parameter> '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ${resourceName}sApi } from '../../../api/${resourceName}s'

export const Route = createFileRoute('/${pluralName}/$id')({
  component: ${ResourceName}DetailComponent,
  loader: async ({ params, context }: any) => {
    return context.queryClient?.ensureQueryData({
      queryKey: ['${resourceName}s', params.id],
      queryFn: () => ${resourceName}sApi.getById(params.id),
    })
  },
})

function ${ResourceName}DetailComponent() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: ${resourceName}, isLoading, error } = useQuery({
    queryKey: ['${resourceName}s', id],
    queryFn: () => ${resourceName}sApi.getById(id),
  })

  const deleteMutation = useMutation({
    mutationFn: ${resourceName}sApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${resourceName}s'] })
      navigate({ to: '/${pluralName}' })
    },
  })

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this ${resourceName}?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!${resourceName}) return <div>${ResourceName} not found</div>

  return (
    <div>
      <div className="mb-4">
        <Link to="/${pluralName}" className="text-blue-500 hover:underline">
          ← Back to ${resourceName}s
        </Link>
      </div>

      <div className="border rounded p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{${resourceName}.name}</h2>
          <div className="flex gap-2">
            <Link
              to="/${pluralName}/$id/edit"
              params={{ id }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-semibold text-gray-700">Description:</label>
            <p>{${resourceName}.description}</p>
          </div>

          <div>
            <label className="font-semibold text-gray-700">ID:</label>
            <p className="text-gray-600">{${resourceName}.id}</p>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Created:</label>
            <p className="text-gray-600">
              {new Date(${resourceName}.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Updated:</label>
            <p className="text-gray-600">
              {new Date(${resourceName}.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
`
}
