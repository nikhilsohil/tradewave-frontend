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
import { useQuery } from "@tanstack/react-query";
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
  const { data } = useQuery({
    queryKey: ["ProductList", payload],
    queryFn: () => ProductApi.get(payload),
  });

  console.log("rsponce", data?.data);
  const pagination = data?.data?.data?.pagination || { page: 1, totalPages: 1 };
  const products = data?.data?.data?.products || [];

  type BadgeResult = {
    text: string;
    badgeVariant: "default" | "secondary" | "destructive";
  };

  const getStackInfo = (input: string | number): BadgeResult => {
    if (typeof input === "number") {
      if (input > 10) return { text: "In Stock", badgeVariant: "default" };
      if (input > 0) return { text: "Low Stock", badgeVariant: "secondary" };
      return { text: "Out of Stock", badgeVariant: "destructive" };
    }

    switch (input) {
      case "In Stock":
        return { text: "In Stock", badgeVariant: "default" };
      case "Low Stock":
        return { text: "Low Stock", badgeVariant: "secondary" };
      case "Out of Stock":
        return { text: "Out of Stock", badgeVariant: "destructive" };
      default:
        return { text: "In Stock", badgeVariant: "default" }; // fallback
    }
  };

  return (
    <Card className="gap-0 h-full">
      <CardHeader className="border-b !pb-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <CardTitle>Products</CardTitle>
            <SearchInput onClear={() => console.log("clear")} />
          </div>
          <div className="flex gap-2 items-center">
            <ProductFilter />
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
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockInfo = getStackInfo(product.inStock || 0);
                return (
                  <TableRow key={product.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <Link
                        to="/product/product-details"
                        search={{ productId: product.id, edit: "true" }}
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    {/* <TableCell className="text-muted-foreground">{product.sku}</TableCell> */}
                    <TableCell className="font-medium">
                      ${product.price}
                    </TableCell>
                    <TableCell>{product.inStock || 0}</TableCell>
                    <TableCell>
                      <Badge variant={stockInfo.badgeVariant}>
                        {stockInfo.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category.name}
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
                                to: "/product/product-details",
                                search: { productId: product.id },
                              })
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.navigate({
                                to: "/product/product-details",
                                search: { productId: product.id, edit: "true" },
                              })
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
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
  );
}
