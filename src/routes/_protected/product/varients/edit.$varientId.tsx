import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
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
import type {
  AddProductVarient,
  ProductVarient,
} from "@/services/types/varient";
import type { Group } from "@/services/types/group";
import { Trash2 } from "lucide-react";
import GroupAPI from "@/services/api/group";
import { useEffect } from "react";
import DiscountSlab from "@/components/products/varient/discount-slab";
import DiscountGroup from "@/components/products/varient/discount-group";

const productIdSchema = z
  .string()
  .regex(/^\d+$/, "Product ID must be a number")
  .transform((val) => Number(val));
export const Route = createFileRoute(
  "/_protected/product/varients/edit/$varientId"
)({
  component: RouteComponent,
  loader: ({ params }) => {
    const { varientId } = params;
    const parsed = productIdSchema.parse(varientId);

    return { varientId: parsed };
  },
});

const varientSchema = z.object({
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
  ProductDiscountByGroup: z
    .array(
      z.object({
        retailerGroupId: z.coerce.number().min(1, "Retailer group is required"),
        discount: z.coerce.number().min(0, "Discount is required"),
      })
    )
    .optional(),
  productDiscountSlab: z
    .array(
      z.object({
        min: z.coerce.number().min(0, "Min is required"),
        max: z.coerce.number().min(0, "Max is required"),
        discount: z.coerce.number().min(0, "Discount is required"),
      })
    )
    .optional(),
});
type VarientFormData = z.infer<typeof varientSchema>;
function RouteComponent() {
  const { varientId } = Route.useLoaderData();
  const { data: varientData, isLoading: isVarientLoading } = useQuery({
    queryKey: ["product", varientId],
    queryFn: () => VarientApi.getVariantById(Number(varientId)),
    enabled: !!varientId,
  });
  const form = useForm({
    resolver: zodResolver(varientSchema),
    defaultValues: {
      elegibleForCredit: false,
      elegibleForGoodWill: false,
      ProductDiscountByGroup: [],
    },
  });

  const { data: retailerGroups, isLoading: areGroupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupAPI.getAll(),
  });

  useEffect(() => {
    if (varientData?.data?.data) {
      requestAnimationFrame(() => {
        const v = varientData?.data?.data || {};
        form.reset({
          name: v.name,
          unit_discription: v.unit_discription,
          bulkPackType: v.bulkPackType,
          unitsPerBulkPack: v.unitsPerBulkPack,
          PurchasedFrom: v.PurchasedFrom,
          sellerGST: v.sellerGST,
          PurchaseType: v.PurchaseType,
          billNo: v.billNo,
          billDate: new Date(v.billDate),
          mfgDate: new Date(v.mfgDate),
          expDate: new Date(v.expDate),
          purchasePriceWithGST: v.purchasePriceWithGST,
          quantityPurchased: v.quantityPurchased,
          mrpWithGST: v.mrpWithGST,
          inStock: v.inStock,
          elegibleForCredit: v.elegibleForCredit,
          elegibleForGoodWill: v.elegibleForGoodWill,
          DiscountOnCOB: v.DiscountOnCOB,
          DiscountOnCOD: v.DiscountOnCOD,
          ProductDiscountByGroup: v.ProductDiscountByGroup,
          // ...
        });
      });
    }
  }, [varientData]);

  const { handleSubmit, control, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ProductDiscountByGroup",
  });

  const mutation = useMutation({
    mutationFn: (data: AddProductVarient) => {
      return VarientApi.updateVarient(varientId, data);
    },

    onSuccess: (data) => {
      toast.success("Product variant added successfully");
      const variantId = data.data.data.id;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product variant");
    },
  });

  const onSubmit = (data: VarientFormData) => {
    mutation.mutate({ ...data, productId });
  };

  if (isVarientLoading) return <div>Loading...</div>;

  return (
    <div className="h-full">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {form.formState.isDirty && (
            <div className="flex justify-end gap-4 space-y-4 mb-4">
              <Button
                variant={"outline"}
                disabled={mutation.isPending}
                onClick={() => reset()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding Variant..." : "Add Variant"}
              </Button>
            </div>
          )}
          <div className="  grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Product Variant</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Input
                            type="number"
                            placeholder="e.g. 12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </CardContent>
            </Card>

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

            <Card className="md:col-span-2">
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

            <DiscountGroup varientId={varientId} />

            {form.watch("elegibleForGoodWill") && (
              <DiscountSlab varientId={varientId} />
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
