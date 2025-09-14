import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import VarientApi from "@/services/api/varients";
import ProductApi from "@/services/api/products";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/common/date-picker";
import type { Product } from "@/services/types/products";
import type { AddProductVarient } from "@/services/types/varient";

const varientSchema = z.object({
  productId: z.coerce.number().min(1, "Product is required"),
  name: z.string().min(2, "Variant name must be at least 2 characters"),
  unit_discription: z.string().optional(),
  bulkPackType: z.string().min(1, "Bulk pack type is required"),
  unitsPerBulkPack: z.coerce.number().min(1, "Units per bulk pack is required"),
  PurchasedFrom: z.string().optional(),
  sellerGST: z.string().optional(),
  PurchaseType: z.string().optional(),
  billNo: z.string().optional(),
  billDate: z.date().optional(),
  mfgDate: z.date().optional(),
  expDate: z.date().optional(),
  purchasePriceWithGST: z.coerce.number().min(0, "Purchase price is required"),
  quantityPurchased: z.coerce.number().optional(),
  mrpWithGST: z.coerce.number().min(0, "MRP is required"),
  inStock: z.coerce.number().optional(),
  elegibleForCredit: z.boolean().optional(),
  elegibleForGoodWill: z.boolean().optional(),
  DiscountOnCOB: z.coerce.number().optional(),
  DiscountOnCOD: z.coerce.number().optional(),
});

type VarientFormData = z.infer<typeof varientSchema>;

export function VarientForm() {
  const form = useForm({
    resolver: zodResolver(varientSchema),
    defaultValues: {
      elegibleForCredit: false,
      elegibleForGoodWill: false,
    },
  });
  const { handleSubmit } = form;

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductApi.get({}),
  });

  const mutation = useMutation({
    mutationFn: (data: AddProductVarient) => {
      return VarientApi.addVarient(data);
    },
    onSuccess: () => {
      toast.success("Product variant added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product variant");
    },
  });

  const onSubmit = (data: VarientFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Product Variant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product *</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.data.data.products?.map(
                          (product: Product) => (
                            <SelectItem
                              key={product.id}
                              value={product.id.toString()}
                            >
                              {product.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 500g" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit_discription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. grams, ml" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bulkPackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bulk Pack Type *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Box, Carton" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bulkPackType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bulk Pack Type *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Box, Carton" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitsPerBulkPack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units Per Bulk Pack *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="PurchasedFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchased From</FormLabel>
                        <FormControl>
                          <Input placeholder="Supplier Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sellerGST"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seller GST</FormLabel>
                        <FormControl>
                          <Input placeholder="GST Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="PurchaseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select purchase type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Credit">Credit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill No</FormLabel>
                        <FormControl>
                          <Input placeholder="Bill Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="billDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Bill Date</FormLabel>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mfgDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>MFG Date</FormLabel>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>EXP Date</FormLabel>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="purchasePriceWithGST"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Price (with GST)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantityPurchased"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity Purchased</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mrpWithGST"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP (with GST)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Discounts & Eligibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="DiscountOnCOB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount on COB (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="DiscountOnCOD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount on COD (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name="elegibleForCredit"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Eligible for Credit</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="elegibleForGoodWill"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Eligible for Goodwill</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Adding Variant..." : "Add Variant"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
