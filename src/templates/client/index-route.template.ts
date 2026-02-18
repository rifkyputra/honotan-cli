export function generateIndexRoute(): string {
  return `import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@headlessui/react'
import { MinusIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { counterStore, increment, decrement, reset } from '../lib/counter-store'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const count = useStore(counterStore)
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      const response = await fetch('/hello')
      if (!response.ok) {
        throw new Error('Server might not be running')
      }
      return response.json()
    },
    enabled: false, // Don't auto-fetch on mount
  })

  return (
    <div className="space-y-12">
      {/* Counter Section */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Counter with TanStack Store
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Client-side state management example
          </p>
          <div className="flex items-center gap-4">
            <Button
              onClick={decrement}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <MinusIcon className="h-4 w-4" />
              Decrement
            </Button>
            <div className="flex flex-col items-center px-6">
              <span className="text-5xl font-bold text-gray-900 dark:text-white tabular-nums">
                {count}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Current Count
              </span>
            </div>
            <Button
              onClick={increment}
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <PlusIcon className="h-4 w-4" />
              Increment
            </Button>
            <Button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Fetch Section */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Fetch with TanStack Query
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Server data fetching and caching example
          </p>
          <Button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              'Fetch /hello'
            )}
          </Button>
          
          {error && (
            <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error fetching data
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {error.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {data && (
            <div className="mt-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Success
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <pre className="overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
`
}
