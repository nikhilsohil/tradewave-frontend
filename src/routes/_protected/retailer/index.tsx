import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Eye, Trash, Users } from "lucide-react";
import RetailerApi from "@/services/api/retailer";
import { toast } from "sonner";
import NoDataFound from "@/components/common/no-data-found";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GroupAPI from "@/services/api/group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Retailer } from "@/services/api/retailer";

export const Route = createFileRoute("/_protected/retailer/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isAssignGroupOpen, setIsAssignGroupOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(
    null
  );

  const payload = {
    page: 1,
    perPage: 10,
  };
  const { data, refetch } = useQuery({
    queryKey: ["retailer"],
    queryFn: () => RetailerApi.get(payload),
  });

  const retailers = data?.data?.data?.retailers || [];

  const handelApprove = async (id: number) => {
    try {
      const response = await RetailerApi.approve(id);
      toast.success(response?.data?.message || "Staff approved successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to approve staff. Please try again.";
      toast.error(message);
    } finally {
      refetch();
    }
  };

  const handleAssignGroupClick = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setIsAssignGroupOpen(true);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="!pb-2 border-b">
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
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retailers.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item?.id}</TableCell>
                  <TableCell>{item?.entityName}</TableCell>
                  <TableCell>{item?.contactPersonName}</TableCell>
                  <TableCell>{item?.mobile}</TableCell>
                  <TableCell>{item?.email}</TableCell>
                  <TableCell>{item?.RetailerGroup?.name || "N/A"}</TableCell>
                  <TableCell>
                    {item.isApproved ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant={"destructive"}>In Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center items-center ">
                      {!item.isApproved && (
                        <span
                          className="rounded-md p-1 border text-green-600 bg-green-200/50"
                          onClick={() => handelApprove(item.id)}
                        >
                          <Check
                            className="cursor-pointer hover:scale-125 transition duration-300"
                            size={18}
                          />
                        </span>
                      )}
                      <span
                        className="rounded-md p-1 border text-blue-600 bg-blue-200/50"
                        onClick={() => handleAssignGroupClick(item)}
                      >
                        <Users
                          className="cursor-pointer hover:scale-125 transition duration-300"
                          size={18}
                        />
                      </span>
                      <span className="rounded-md p-1 border text-yellow-600 bg-yellow-200/50">
                        <Eye
                          className="cursor-pointer hover:scale-125 transition duration-300"
                          size={18}
                        />
                      </span>
                      <span className="rounded-md p-1 border text-red-600 bg-red-200/50">
                        <Trash
                          className="cursor-pointer hover:scale-125 transition duration-300"
                          size={18}
                        />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {retailers.length === 0 && <NoDataFound className="h-full" />}
        </CardContent>
      </Card>
      {selectedRetailer && (
        <AssignGroupDialog
          isOpen={isAssignGroupOpen}
          setIsOpen={setIsAssignGroupOpen}
          retailer={selectedRetailer}
        />
      )}
    </>
  );
}

const AssignGroupDialog = ({
  isOpen,
  setIsOpen,
  retailer,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  retailer: Retailer;
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const { data: groupsData } = useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupAPI.getAll(),
  });

  const groups = groupsData?.data?.data || [];

  const mutation = useMutation({
    mutationFn: (groupId: number) =>
      RetailerApi.assignGroup(retailer.id, groupId),
    onSuccess: () => {
      toast.success("Retailer assigned to group successfully");
      setIsOpen(false);
    },
    onError: (error: any) => {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        "Failed to assign group. Please try again.";
      toast.error(message);
    },
  });

  const handleAssign = () => {
    if (selectedGroup) {
      mutation.mutate(parseInt(selectedGroup, 10));
    } else {
      toast.error("Please select a group");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Group to {retailer.entityName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={mutation.isPending}>
            {mutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
