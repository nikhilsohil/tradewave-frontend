import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProductApi from "@/services/api/products";
import SlabDiscountAPI from "@/services/api/slabDiscountAPI";
import VarientApi from "@/services/api/varients";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { FilePenLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const groupSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  minQuantity: z.coerce.number().min(1, "Min quantity is required"),
  maxQuantity: z.coerce.number().optional(),
  discount: z.coerce.number().min(1, "Discount is required"),
});

type SchemaType = z.infer<typeof groupSchema>;
function DiscountSlab({ varientId }: { varientId: number }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const form = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      id: "",
      minQuantity: "",
      maxQuantity: "",
      discount: "",
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["slab-discount", varientId],
    queryFn: () => SlabDiscountAPI.getAll(varientId),
    enabled: !!varientId,
  });
  const handleSubmit = async (data: SchemaType) => {
    try {
      let response;
      const payload = {
        minQuantity: data.minQuantity,
        maxQuantity: data.maxQuantity || null,
        discount: data.discount,
      };

      if (edit) {
        response = await SlabDiscountAPI.update(data.id, payload);
      } else {
        console.log("payloadcreate", payload);
        response = await VarientApi.addSlabDiscount(varientId, payload);
        toast.success(response?.data?.message || "Group created successfully");
      }
      refetch();
      setOpen(false);
      form.reset();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Operation failed. Please try again.";
      toast.error(message);
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      const response = await SlabDiscountAPI.delete(id);
      toast.success(response?.data?.message || "Group deleted successfully");
      refetch();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete group.";
      toast.error(message);
    }
  };

  const handelEdit = (slab: SchemaType) => {
    form.setValue("id", slab.id);
    form.setValue("minQuantity", slab.minQuantity);
    form.setValue("maxQuantity", slab.maxQuantity);
    form.setValue("discount", slab.discount);
    setEdit(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    form.reset();
  };

  const isSubmitting = form.formState.isSubmitting;
  const slabs = data?.data?.data || [];
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Good Will Discount Slab</CardTitle>
            <Plus onClick={() => setOpen(true)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Min</TableHead>
                <TableHead>Max</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="max-w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slabs.map((slab) => (
                <TableRow key={slab.id}>
                  <TableCell>{slab.minQuantity || "-"}</TableCell>
                  <TableCell>{slab.maxQuantity || "-"}</TableCell>
                  <TableCell>{slab.discount || "-"}</TableCell>
                  <TableCell className="max-w-10">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handelEdit(slab)}
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
                            deleteGroup(slab.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Group</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="minQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Min Quantity..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Max Quantity..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>discount $</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter discount % "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? edit
                      ? "Updating..."
                      : "Creating..."
                    : edit
                      ? "Update"
                      : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DiscountSlab;
