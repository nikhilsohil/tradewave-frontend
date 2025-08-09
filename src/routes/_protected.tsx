import { createFileRoute } from '@tanstack/react-router'

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
    return <div>Hello "/_protected"!</div>
}

