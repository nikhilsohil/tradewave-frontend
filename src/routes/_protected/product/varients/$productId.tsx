import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePenLine, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
export const Route = createFileRoute("/_protected/product/varients/$productId")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { productId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () => VarientApi.getVariantsByProductId(productId),
    enabled: !!productId,
  });

  const variants = data?.data?.data || [];

  return (
    <Card className="h-full">
      <CardHeader className=" flex flex-row items-center justify-between">
        <CardTitle>Product Variants</CardTitle>
        <Link
          to="/product/varients/add/$productId"
          //  onClick={() => setShowAddForm(true)}
        >
          <Button>Add Variant</Button>
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
              <TableHead className="w-[100px]">Actions</TableHead>
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
                  <TableCell>{variant.code}</TableCell>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell>{variant.mrpWithGST}</TableCell>
                  <TableCell>{variant.purchasePriceWithGST}</TableCell>
                  <TableCell>{variant.inStock}</TableCell>
                  <TableCell>{variant.bulkPackType}</TableCell>
                  <TableCell>{variant.unitsPerBulkPack}</TableCell>
                  <TableCell>
                    {variant.status ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingVariant(variant)}
                      >
                        <FilePenLine className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this variant?"
                            )
                          ) {
                            deleteMutation.mutate(variant.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
  );
}
