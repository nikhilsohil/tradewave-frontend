import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import type { AuthContextType } from '@/providers/auth.tsx'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContextType|null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position='bottom-left'/>
      <TanStackQueryLayout />
    </>
  ),
})
