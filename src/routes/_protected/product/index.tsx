import { createFileRoute, useRouter } from "@tanstack/react-router";
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
import {
  Check,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Router,
  Trash,
  Trash2,
} from "lucide-react";
import NoDataFound from "@/components/common/no-data-found";
import ProductApi from "@/services/api/products";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/common/search-input";
import ProductFilter from "@/components/products/product-filter";
import AppPagination from "@/components/common/app-paginationn";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
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
import { toast } from "sonner";
export const Route = createFileRoute("/_protected/product/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const payload = {
    page: currentPage,
    perPage: 10,
  };
  const { data, refetch } = useQuery({
    queryKey: ["ProductList", payload],
    queryFn: () => ProductApi.get(payload),
  });
  const pagination = data?.data?.data?.pagination || { page: 1, totalPages: 1 };
  const products = data?.data?.data?.products || [];

  const [itemId, setItemId] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ProductApi.delete(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      handleClose();
      refetch();
      // Optionally, refetch the product list or update the UI accordingly
    },
    onError: () => {
      toast.error("Failed to delete the product. Please try again.");
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
      const response = await ProductApi.activate(id);
      toast.success(response?.data?.message || "Product activated successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to activate product. Please try again.";
      toast.error(message);
    } finally {
      refetch();
    }
  };
  return (
    <>
      <Card className="gap-0 h-full">
        <CardHeader className="border-b !pb-1">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <CardTitle>Products</CardTitle>
            </div>
            <div className="flex gap-2 items-center">
              {/* <ProductFilter /> */}
              <Button
                variant={"link"}
                onClick={() => router.navigate({ to: "/product/add" })}
              >
                <Plus /> Add Products
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grow flex flex-col ">
          <div className="grow">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Product Name</TableHead>

                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Sub Category</TableHead>
                  <TableHead className="font-semibold">
                    Second Sub Category
                  </TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  return (
                    <TableRow key={product.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">
                        <Link
                          to="/product/$productId"
                          params={{ productId: product.id.toString() }}
                          search={{ productId: product.id, edit: "true" }}
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product?.category?.name || "-"}
                      </TableCell>
                      <TableCell>{product?.subCategory?.name || "-"}</TableCell>
                      <TableCell>
                        {product?.secondSubCategory?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={product.isActive ? "default" : "destructive"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
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
                                  to: "/product/$productId",
                                  params: { productId: product.id.toString() },
                                })
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.navigate({
                                  to: "/product/$productId",
                                  params: { productId: product.id.toString() },
                                  search: {
                                    productId: product.id,
                                    edit: "true",
                                  },
                                })
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            {product.isActive ? (
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                Inacitve
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-green-600"
                                onClick={() => handelActivate(product.id)}
                              >
                                <Check className="mr-2 h-4 w-4 text-green-600" />
                                Acitvate
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {products.length === 0 && (
              <div className="py-12">
                <NoDataFound title="No Products Found" />
              </div>
            )}
          </div>
          <AppPagination
            className=""
            paginationData={pagination}
            setCurrentPage={setCurrentPage}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
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
