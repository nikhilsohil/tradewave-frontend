import RetailerApi from "@/services/api/retailer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_protected/retailer/retailer/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const {
    data: retailer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["retailer", id],
    queryFn: () => RetailerApi.getById(Number(id)).then((res) => res.data),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !retailer) {
    return <div>Error fetching retailer data.</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={retailer.data.image ?? ""} alt={retailer.data.name} />
              <AvatarFallback>{retailer.data.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{retailer.data.name}</CardTitle>
              <CardDescription>{retailer.data.type}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Email:</p>
              <p>{retailer.data.email}</p>
            </div>
            <div>
              <p className="font-semibold">Mobile:</p>
              <p>{retailer.data.mobile}</p>
            </div>
            <div>
              <p className="font-semibold">Contact Person:</p>
              <p>{retailer.data.contactPersonName}</p>
            </div>
            {retailer.data.alternateMobile && (
              <div>
                <p className="font-semibold">Alternate Mobile:</p>
                <p>{retailer.data.alternateMobile}</p>
              </div>
            )}
            <div>
              <p className="font-semibold">Address:</p>
              <p>{retailer.data.shopAddress}</p>
            </div>
            <div>
              <p className="font-semibold">Govt ID:</p>
              <p>{retailer.data.govtId}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <p>{retailer.data.isApproved ? "Approved" : "Pending"}</p>
            </div>
            {retailer.data.RetailerGroup && (
              <div>
                <p className="font-semibold">Group:</p>
                <p>{retailer.data.RetailerGroup.name}</p>
              </div>
            )}
             {retailer.data.RetailerGroup && (
              <div>
                <p className="font-semibold">Discount Rate:</p>
                <p>{retailer.data.RetailerGroup.discountRate}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}