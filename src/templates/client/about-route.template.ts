export function generateAboutRoute(): string {
  return `import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  const features = [
    'TanStack Router for file-based routing',
    'TanStack Query for server data fetching',
    'TanStack Store for client-side state management',
    'Headless UI components',
    'Heroicons for beautiful icons',
    'React 19 with TypeScript',
    'Vite for build tooling',
    'Tailwind CSS for styling',
  ]

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          About This Application
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This is a modern web application built with the latest tools and best practices.
        </p>
        
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Tech Stack
        </h3>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
`
}
