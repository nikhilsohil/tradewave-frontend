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
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => RetailerApi.remove(id),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Staff removed successfully");
      refetch();
      setIsDeleteConfirmationOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "failed to delete retailer");
    },
  });

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

  const handleRemove = () => {
    if (selectedRetailer) {
      deleteMutation.mutate(selectedRetailer.id);
    }
  };

  const handleAssignGroupClick = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setIsAssignGroupOpen(true);
  };

  const handleDeleteClick = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setIsDeleteConfirmationOpen(true);
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
                <TableHead className="text-center">Id</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Owner</TableHead>
                <TableHead className="text-center">Mobile</TableHead>
                <TableHead className="text-center">E-mail</TableHead>
                <TableHead className="text-center">Group</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retailers.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{item?.id}</TableCell>
                  <TableCell className="text-center">
                    {item?.entityName}
                  </TableCell>
                  <TableCell className="text-center">
                    {item?.contactPersonName}
                  </TableCell>
                  <TableCell className="text-center">{item?.mobile}</TableCell>
                  <TableCell className="text-center">{item?.email}</TableCell>
                  <TableCell className="text-center">
                    {item?.RetailerGroup?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.isApproved ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant={"destructive"}>In Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
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
                      <span
                        className="rounded-md p-1 border text-red-600 bg-red-200/50"
                        onClick={() => handleDeleteClick(item)}
                      >
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
      {selectedRetailer && (
        <DeleteConfirmationDialog
          isOpen={isDeleteConfirmationOpen}
          setIsOpen={setIsDeleteConfirmationOpen}
          onConfirm={handleRemove}
          isPending={deleteMutation.isPending}
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

const DeleteConfirmationDialog = ({
  isOpen,
  setIsOpen,
  onConfirm,
  isPending,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            This action cannot be undone. Are you sure you want to delete this
            retailer?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
