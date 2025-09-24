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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import GroupAPI from "@/services/api/group";
import GroupDiscountAPi from "@/services/api/group-discountAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { FilePenLine, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const Schema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  retailerGroupId: z.coerce
    .number("Please select a group")
    .int("Please select a group"),
  discount: z.coerce.number().min(1, "Discount is required"),
  elegibleForCredit: z.boolean().default(false),
});

type SchemaType = z.infer<typeof Schema>;
function DiscountGroup({ varientId }: { varientId: number }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const form = useForm({
    resolver: zodResolver(Schema),
    defaultValues: {
      id: "",
      retailerGroupId: "",
      discount: "",
      elegibleForCredit: false,
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["group-discount", varientId],
    queryFn: () => GroupDiscountAPi.getAll(varientId),
    enabled: !!varientId,
  });
  const handleSubmit = async (data: SchemaType) => {
    try {
      let response;
      const payload = {
        retailerGroupId: data.retailerGroupId,
        discount: data.discount,
        elegibleForCredit: data.elegibleForCredit,
      };

      if (edit) {
        response = await GroupDiscountAPi.update(data.id, payload);
      } else {
        console.log("payloadcreate", payload);
        response = await GroupDiscountAPi.create(varientId, payload);
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
      const response = await GroupDiscountAPi.delete(id);
      toast.success(
        response?.data?.message || "Group Discount deleted successfully"
      );
      refetch();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete Discount Group.";
      toast.error(message);
    }
  };

  const handelEdit = (slab: SchemaType) => {
    form.setValue("id", slab.id);
    form.setValue("retailerGroupId", slab.retailerGroupId);
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

  const { data: retailerGroups, isLoading: areGroupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupAPI.getAll(),
  });
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Group Discount</CardTitle>
            <Plus onClick={() => setOpen(true)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Credit Elegiblety</TableHead>
                <TableHead ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slabs.map((slab) => (
                <TableRow key={slab.id}>
                  <TableCell>{slab?.retailerGroup?.name || "-"}</TableCell>
                  <TableCell>{slab.discount || "-"}</TableCell>
                  <TableCell>
                    {slab?.elegibleForCredit ? "Yes" : "No"}
                  </TableCell>
                  <TableCell >
                    <div className="flex justify-end items-center gap-2">
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
            <DialogTitle>Add Discount</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name={"retailerGroupId"}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Retailer Group</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {retailerGroups?.data.data.map((group: any) => (
                            <SelectItem
                              key={group.id}
                              value={group.id.toString()}
                            >
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

              {/* <div className="flex justify-between space-x-2"> */}
              <FormField
                control={form.control}
                name="elegibleForCredit"
                render={({ field }) => (
                  <FormItem className="grid-cols-2">
                    <FormLabel>Elegible For Credit</FormLabel>
                    <FormControl>
                      <Switch
                        className="justify-self-end"
                        ref={field.ref}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* </div> */}

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

export default DiscountGroup;
