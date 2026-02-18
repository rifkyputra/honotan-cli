import type { ClientTemplateData } from '../../types'

export function generateCreateRoute(data: ClientTemplateData): string {
  const { resourceName, ResourceName, pluralName } = data

  return `import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ${resourceName}sApi, Create${ResourceName}Dto } from '../../../api/${resourceName}s'

export const Route = createFileRoute('/${pluralName}/new')({
  component: Create${ResourceName}Component,
})

function Create${ResourceName}Component() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = React.useState<Create${ResourceName}Dto>({
    name: '',
    description: '',
  })

  const createMutation = useMutation({
    mutationFn: ${resourceName}sApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['${resourceName}s'] })
      navigate({ to: '/${pluralName}/$id', params: { id: data.id } })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div>
      <div className="mb-4">
        <Link to="/${pluralName}" className="text-blue-500 hover:underline">
          ← Back to ${resourceName}s
        </Link>
      </div>

      <div className="border rounded p-6 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Create ${ResourceName}</h2>

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

          {createMutation.error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              Error: {createMutation.error.message}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create ${ResourceName}'}
            </button>
            <Link
              to="/${pluralName}"
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
