import AppSidebar from '@/components/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
    component: RouteComponent,
    loader: async ({ context }) => {
        if (!context.auth?.isAuthenticated) {
            context.auth?.logout()
            throw new Error('Not authenticated')
        }
    }
})

function RouteComponent() {

    return (<SidebarProvider>
        <AppSidebar />
        <main className='p-4 flex-grow'>
            <Outlet />
        </main>
    </SidebarProvider>)

}

