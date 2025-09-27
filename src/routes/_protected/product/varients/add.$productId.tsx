import { createFileRoute } from "@tanstack/react-router";
import { useFieldArray, useForm } from "react-hook-form";
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

const productIdSchema = z
  .string()
  .regex(/^\d+$/, "Product ID must be a number")
  .transform((val) => Number(val));
export const Route = createFileRoute(
  "/_protected/product/varients/add/$productId"
)({
  component: RouteComponent,
  loader: ({ params }) => {
    const { productId } = params;
    const parsed = productIdSchema.parse(productId);

    return { productId: parsed };
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
  groupDiscounts: z
    .array(
      z.object({
        retailerGroupId: z.coerce.number().min(1, "Retailer group is required"),
        discount: z.coerce.number().min(0, "Discount is required"),
      })
    )
    .optional(),
});
type VarientFormData = z.infer<typeof varientSchema>;
function RouteComponent() {
  const { productId } = Route.useLoaderData();
  const form = useForm({
    resolver: zodResolver(varientSchema),
    defaultValues: {
      elegibleForCredit: false,
      elegibleForGoodWill: false,
      groupDiscounts: [],
    },
  });

  const { handleSubmit, control, reset } = form;

  const mutation = useMutation({
    mutationFn: (data: AddProductVarient) => {
      return VarientApi.addVarient(data);
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

  return (
    <div className="h-full">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-end gap-4 space-y-4 mb-4">
            <Button
              variant={"outline"}
              type="button"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding Variant..." : "Add Variant"}
            </Button>
          </div>
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

            {/* <Card>
              <CardHeader>
                <CardTitle>Group Discounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-4">
                        <FormField
                          control={control}
                          name={`groupDiscounts.${index}.retailerGroupId`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Retailer Group</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a group" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {retailerGroups?.data.data.map(
                                    (group: Group) => (
                                      <SelectItem
                                        key={group.id}
                                        value={group.id.toString()}
                                      >
                                        {group.name}
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
                          control={control}
                          name={`groupDiscounts.${index}.discount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        append({ retailerGroupId: 0, discount: 0 })
                      }
                    >
                      Add Group Discount
                    </Button>
                  </CardContent>
            </Card> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
