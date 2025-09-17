import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePenLine, Trash2, Upload, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoriesApi from "@/services/api/categories";
import SubCategoriesApi from "@/services/api/sub-categories";
import ProductApi from "@/services/api/products";
import { toast } from "sonner";
import type { Categories } from "@/services/types/categories";
import type { SubCategories } from "@/services/types/sub-categories";
import type { SecondSubCategories } from "@/services/types/sec-sub-categories";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BrandAPI from "@/services/api/brand";
import type { Brand } from "@/services/types/brand";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VarientForm } from "@/components/products/varient-form";
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
import type { Product } from "@/services/types/products";

export const Route = createFileRoute("/_protected/product/$productId/varients")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Variants</CardTitle>
        <Button
        //  onClick={() => setShowAddForm(true)}
         >Add Variant</Button>
      </CardHeader>
      <CardContent>
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
            {/* {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              variants.data.data?.map((variant: ProductVarient) => (
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
            )} */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
