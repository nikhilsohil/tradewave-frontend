import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { Check, Eye, Trash } from 'lucide-react'
import RetailerApi from "@/services/api/retailer"
import { toast } from 'sonner'

export const Route = createFileRoute('/_protected/retailer/')({
  component: RouteComponent,
})

function RouteComponent() {

  const payload = {
    page: 1,
    perPage: 10,
  }
  const { data, refetch } = useQuery({
    queryKey: ['retailer'],
    queryFn: () => RetailerApi.get(payload)
  })

  console.log("rsponce", data?.data);
  const pagination = data?.data?.data?.pagination || {}
  const retailers = data?.data?.data?.retailers || []

  const handelApprove = async (id: number) => {
    try {
      const response = await RetailerApi.approve(id);
      toast.success(response?.data?.message || "Staff approved successfully");
    } catch (error: any) {
      console.error("error", error);
      const message =
        error?.response?.data?.message || "Failed to approve staff. Please try again.";
      toast.error(message);
    } finally {
      refetch()
    }
  };



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
            <TableHead>Owner</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            retailers.map(item =>
              <TableRow >
                <TableCell>{item?.id}</TableCell>
                <TableCell>{item?.entityName}</TableCell>
                <TableCell>{item?.contactPersonName}</TableCell>
                <TableCell>{item?.mobile}</TableCell>
                <TableCell>{item?.email}</TableCell>
                <TableCell>
                  {
                    item.isApproved ? <Badge>Active</Badge>
                      : <Badge variant={'destructive'}>In Active</Badge>
                  }
                </TableCell>
                <TableCell>
                  <div className='flex gap-2 justify-center items-center '>
                    {!item.isApproved &&
                      <span className="rounded-md p-1 border text-green-600 bg-green-200/50"
                        onClick={() => handelApprove(item.id)}>

                        <Check
                          className="cursor-pointer hover:scale-125 transition duration-300"
                          size={18} />
                      </span>
                    }
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
            )
          }

        </TableBody>
      </Table>
    </CardContent>
  </Card>
}
