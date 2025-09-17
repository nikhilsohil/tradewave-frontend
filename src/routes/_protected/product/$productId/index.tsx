import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/product/$productId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/product/$productId/"!</div>
}
