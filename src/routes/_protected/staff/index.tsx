import staffApi from "@/services/api/staff";
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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Eye, MoreHorizontal, Trash, Trash2 } from "lucide-react";
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
import type { Staff } from "@/services/types/staff";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_protected/staff/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const payload = {
    page: 1,
    perPage: 10,
  };
  const { data, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: () => staffApi.getStaff(payload),
  });

  const pagination = data?.data?.data?.pagination || {};
  const staff = data?.data?.data?.staff || [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => staffApi.reject(id),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Staff removed successfully");
      refetch();
      setIsDeleteConfirmationOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "failed to delete staff");
    },
  });

  const handelApprove = async (id: number) => {
    try {
      const response = await staffApi.approve(id);
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
    if (selectedStaff) {
      deleteMutation.mutate(selectedStaff.id);
    }
  };

  const handleDeleteClick = (staff: Staff) => {
    setSelectedStaff(staff);
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
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item?.id}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.mobile}</TableCell>
                  <TableCell>{item?.email}</TableCell>
                  <TableCell>
                    {item.isApproved ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant={"destructive"}>In Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({ to: `/retailer//retailer/${item.id}` })
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>

                        {item.isApproved ? (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            Inacitve
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-600"
                            onClick={() => handelApprove(item.id)}
                          >
                            <Check className="mr-2 h-4 w-4 text-green-600" />
                            Acitvate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {staff.length === 0 && <NoDataFound className="h-full" />}
        </CardContent>
      </Card>
      {selectedStaff && (
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
          <p>Are you sure you want to deactivate this staff?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "processing..." : "Deactivate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
