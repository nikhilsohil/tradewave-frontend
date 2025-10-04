import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Eye, FilePenLine, MoreHorizontal, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import VarientApi from "@/services/api/varients";
import type { ProductVarient } from "@/services/types/varient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoDataFound from "@/components/common/no-data-found";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
export const Route = createFileRoute("/_protected/product/varients/$productId")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { productId } = Route.useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () => VarientApi.getVariantsByProductId(productId),
    enabled: !!productId,
  });

  const [itemId, setItemId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => VarientApi.deleteVarient(id),
    onSuccess: () => {
      toast.success("Variant deleted successfully");
      handleClose();
      refetch();
      // Optionally, refetch the product list or update the UI accordingly
    },
    onError: () => {
      toast.error("Failed to delete the variant. Please try again.");
    },
  });
  const handleDelete = (id: number) => {
    setItemId(id);
    setShowDeleteDialog(true);
  };
  const handleClose = () => {
    setShowDeleteDialog(false);
    setItemId(null);
  };
  const handelActivate = async (id: number) => {
    try {
      const response = await VarientApi.activate(id);
      toast.success(
        response?.data?.message || "Product Variant activated successfully"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to activate product variant . Please try again.";
      toast.error(message);
    } finally {
      refetch();
    }
  };
  const variants = data?.data?.data || [];

  return (
    <>
      <Card className="h-full">
        <CardHeader className=" flex flex-row items-center justify-between">
          <CardTitle>Product Details</CardTitle>
          <Link
            to="/product/varients/add/$productId"
            params={{ productId }}
            //  onClick={() => setShowAddForm(true)}
          >
            <Button>Add Details</Button>
          </Link>
        </CardHeader>
        <CardContent className="flex-grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>MRP</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Pack Type</TableHead>
                <TableHead>Units/Pack</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                variants?.map((variant: ProductVarient) => (
                  <TableRow key={variant.id}>
                    <TableCell>
                      <Link
                        to="/product/varients/edit/$varientId"
                        params={{ varientId: variant.id.toString() }}
                      >
                        {variant.code}
                      </Link>
                    </TableCell>
                    <TableCell>{variant.name}</TableCell>
                    <TableCell>{variant.mrpWithGST}</TableCell>
                    <TableCell>{variant.purchasePriceWithGST}</TableCell>
                    <TableCell>{variant.inStock}</TableCell>
                    <TableCell>{variant.bulkPackType}</TableCell>
                    <TableCell>{variant.unitsPerBulkPack}</TableCell>
                    <TableCell>
                      <Badge
                        variant={variant.isActive ? "default" : "destructive"}
                      >
                        {variant.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.navigate({
                                to: "/product/varients/edit/$varientId",
                                params: { varientId: variant.id.toString() },
                              })
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          {variant.isActive ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(variant.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                              Inacitve
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => handelActivate(variant.id)}
                            >
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              Acitvate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {!isLoading && variants.length === 0 && (
            <NoDataFound className="h-full" />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Varient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(itemId!)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
