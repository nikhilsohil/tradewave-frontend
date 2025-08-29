import AppHeader from '@/components/common/app-header'
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

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-col flex-grow">
                <AppHeader topNav={<div></div>} />
                <section className="flex-grow p-4">
                    <Outlet />
                </section>
            </main>
        </SidebarProvider>
    )

}

