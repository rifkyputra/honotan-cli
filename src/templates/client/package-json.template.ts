export function generatePackageJson(projectName: string = 'tanstack-router-app'): string {
  return `{
  "name": "${projectName}",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@headlessui/react": "^2.2.0",
    "@heroicons/react": "^2.2.0",
    "@tanstack/react-router": "^1.117.1",
    "@tanstack/router-devtools": "^1.117.1",
    "@tanstack/react-query": "^5.62.11",
    "@tanstack/react-query-devtools": "^5.62.11",
    "@tanstack/react-store": "^0.5.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@tanstack/router-plugin": "^1.117.2",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  }
}
`
}
