export function generateRootRoute(): string {
  return `import { Outlet, createRootRoute, Link, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '../lib/query-client'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-rows-[auto_1fr] min-h-svh bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex h-16 items-center gap-6">
              <span className="text-xl font-bold">App</span>
              <div className="flex items-center gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={
                      isActive(item.href)
                        ? 'text-foreground font-medium text-sm'
                        : 'text-muted-foreground hover:text-foreground text-sm transition-colors'
                    }
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
`
}
