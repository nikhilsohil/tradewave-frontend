import staffApi from "@/services/api/staff";
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

export const Route = createFileRoute("/_protected/staff/staff/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const {
    data: staffResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["staff", id],
    queryFn: () => staffApi.getById(Number(id)).then((res) => res.data),
  });
  const staff = staffResponse?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !staff) {
    return <div>Error fetching staff data.</div>;
  }

  if (!staff) {
    return <div>Staff not found.</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={staff.image ?? ""} alt={staff.name} />
              <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{staff.name}</CardTitle>
              <CardDescription>Staff Member</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Email:</p>
              <p>{staff.email}</p>
            </div>
            <div>
              <p className="font-semibold">Mobile:</p>
              <p>{staff.mobile}</p>
            </div>
            <div>
              <p className="font-semibold">Gender:</p>
              <p>{staff.gender}</p>
            </div>
            <div>
              <p className="font-semibold">Care Of:</p>
              <p>{staff.careOf}</p>
            </div>
            {staff.alternateMobile && (
              <div>
                <p className="font-semibold">Alternate Mobile:</p>
                <p>{staff.alternateMobile}</p>
              </div>
            )}
            <div>
              <p className="font-semibold">Govt ID:</p>
              <p>{staff.govtId}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <p>{staff.isApproved ? "Approved" : "Pending"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
