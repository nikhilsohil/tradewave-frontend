import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Trash2 } from "lucide-react";
import type { useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import BrandAPI from "@/services/api/brand";

export const Route = createFileRoute("/_protected/brand/")({
  component: RouteComponent,
});

const categorySchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z.string().optional(),
  image: z
    .union([
      z
        .instanceof(File, { message: "Image is required" })
        .refine((file) => !file || file.size !== 0 || file.size <= 5000000, {
          message: "Max size exceeded",
        })
        .refine(
          (file) => {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            return allowedTypes.includes(file.type);
          },
          {
            message: "Only JPEG, PNG, or WEBP images are allowed",
          }
        ),
      z.string().trim().optional(), // to hold default image
    ])
    .optional(),
});
 function RouteComponent() {
  const [open, setOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["Brand", open],
    queryFn: () => BrandAPI.getAll(),
  });

  const items = data?.data?.data || [];

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      image: "",
    },
  });

  const [edit, setEdit] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      let response;
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("image", data.image);

      if (edit) {
        // Update category
        response = await BrandAPI.update(data.id, formData);
        toast.success(
          response?.data?.message || "Category updated successfully"
        );
      } else {
        // Create category
        response = await BrandAPI.create(formData);
        toast.success(
          response?.data?.message || "Category created successfully"
        );
      }

      setOpen(false);
      form.reset();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Operation failed. Please try again.";
      toast.error(message);
    } finally {
      refetch();
    }
  };

  const deleteBrand = async (id: number) => {
    try {
      const response = await BrandAPI.delete(id);
      toast.success(response?.data?.message || "Brand deleted successfully");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete Brand.";
      toast.error(message);
    }
  };

  const handelEdit = (brand: any) => {
    form.setValue("id", brand.id);
    form.setValue("name", brand.name);
    form.setValue("description", brand.description);
    form.setValue("image", brand.image || "");
    setEdit(true);
    setOpen(true);
  };

  const handleCLose = () => {
    setOpen(false);
    setEdit(false);
    form.reset();
  };
  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Brands</CardTitle>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" />
              Create Brand
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.description}
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
                              <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.name}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBrand(item.id)}
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
                No Brand yet. Click the button above to add one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleCLose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{edit ? `Edit Brand: ` : `Add New Brand`}</DialogTitle>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file ? file : "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCLose}>
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
