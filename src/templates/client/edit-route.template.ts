import type { ClientTemplateData } from '../../types'

export function generateEditRoute(data: ClientTemplateData): string {
  const { resourceName, ResourceName, pluralName } = data

  return `import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ${resourceName}sApi, Update${ResourceName}Dto } from '../../../api/${resourceName}s'

export const Route = createFileRoute('/${pluralName}/$id/edit')({
  component: Edit${ResourceName}Component,
  loader: async ({ params, context }: any) => {
    return context.queryClient?.ensureQueryData({
      queryKey: ['${resourceName}s', params.id],
      queryFn: () => ${resourceName}sApi.getById(params.id),
    })
  },
})

function Edit${ResourceName}Component() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: ${resourceName}, isLoading } = useQuery({
    queryKey: ['${resourceName}s', id],
    queryFn: () => ${resourceName}sApi.getById(id),
  })

  const [formData, setFormData] = React.useState<Update${ResourceName}Dto>({
    name: '',
    description: '',
  })

  React.useEffect(() => {
    if (${resourceName}) {
      setFormData({
        name: ${resourceName}.name,
        description: ${resourceName}.description,
      })
    }
  }, [${resourceName}])

  const updateMutation = useMutation({
    mutationFn: (data: Update${ResourceName}Dto) => ${resourceName}sApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${resourceName}s'] })
      queryClient.invalidateQueries({ queryKey: ['${resourceName}s', id] })
      navigate({ to: '/${pluralName}/$id', params: { id } })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isLoading) return <div>Loading...</div>
  if (!${resourceName}) return <div>${ResourceName} not found</div>

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/${pluralName}/$id"
          params={{ id }}
          className="text-blue-500 hover:underline"
        >
          ← Back to ${resourceName}
        </Link>
      </div>

      <div className="border rounded p-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Edit ${ResourceName}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {updateMutation.error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              Error: {updateMutation.error.message}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              to="/${pluralName}/$id"
              params={{ id }}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
`
}
