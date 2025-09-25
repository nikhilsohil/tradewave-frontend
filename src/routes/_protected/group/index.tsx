import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import GroupAPI from "@/services/api/group";
import type { Group } from "@/services/types/group";

export const Route = createFileRoute("/_protected/group/")({
  component: RouteComponent,
});

const groupSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  creditLimit: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Credi limit must be a number",
  }),
});

export default function RouteComponent({
  className,
}: React.ComponentProps<"div">) {
  const [open, setOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: () => GroupAPI.getAll(),
  });

  const items = data?.data?.data || [];

  const form = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      id: "",
      name: "",
      creditLimit: "0",
    },
  });

  const [edit, setEdit] = useState(false);

  const handleSubmit = async (data: z.infer<typeof groupSchema>) => {
    try {
      let response;
      const payload = {
        name: data.name,
        creditLimit: data.creditLimit,
      };

      if (edit) {
        response = await GroupAPI.update(data.id as number, payload);
        toast.success(response?.data?.message || "Group updated successfully");
      } else {
        console.log("payloadcreate", payload);
        response = await GroupAPI.create(payload);
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
      const response = await GroupAPI.delete(id);
      toast.success(response?.data?.message || "Group deleted successfully");
      refetch();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete group.";
      toast.error(message);
    }
  };

  const handelEdit = (group: Group) => {
    form.setValue("id", group.id);
    form.setValue("name", group.name);
    form.setValue("creditLimit", group.creditLimit.toString());
    setEdit(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    form.reset();
  };
  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Card className='h-full'>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Groups</CardTitle>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.creditLimit || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handelEdit(item)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Group</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.name}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteGroup(item.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No Group yet. Click the button above to add one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit ? `Edit Group: ` : `Add New Group`}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter credit limit..."
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
