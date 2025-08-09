import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Eye, Trash } from 'lucide-react'

export const Route = createFileRoute('/_protected/staff/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data } = useQuery({
        queryKey: ['staff'],
        queryFn: () => fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json())
    })


    return <Card className='h-full'>
        <CardHeader className='!pb-2 border-b'>
            <CardTitle>Staff</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow >
                        <TableCell>1</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>zA2j7@example.com</TableCell>
                        <TableCell><Badge>Active</Badge></TableCell>
                        <TableCell>
                            <div className='flex gap-2 justify-center items-center '>
                                <span className="rounded-md p-1 border text-green-600 bg-green-200/50">
                                    <Check
                                        className="cursor-pointer hover:scale-125 transition duration-300"
                                        size={18} />
                                </span>
                                <span className="rounded-md p-1 border text-yellow-600 bg-yellow-200/50">
                                    <Eye
                                        className="cursor-pointer hover:scale-125 transition duration-300"
                                        size={18} />
                                </span>
                                <span className="rounded-md p-1 border text-red-600 bg-red-200/50">
                                    <Trash
                                        className="cursor-pointer hover:scale-125 transition duration-300"
                                        size={18} />
                                </span>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
}
