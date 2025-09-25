import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
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
} from "../ui/alert-dialog";
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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSubCategory, useCategory } from "@/hooks/common";
import SecSubCategoriesApi from "@/services/api/sec-sub-categories";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const categorySchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  description: z.string().optional(),
  // categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().min(1, "Plese select a subcategory"),
});

function SecSubCategories() {
  const [open, setOpen] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["sec-sub-categories", open],
    queryFn: () => SecSubCategoriesApi.get({}),
  });

  const items = data?.data?.data || [];

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      subCategoryId: "",
    },
  });

  const [edit, setEdit] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      const api = edit
        ? SecSubCategoriesApi.update
        : SecSubCategoriesApi.create;
      const response = await api(formData);
      toast.success(
        response?.data?.message ||
          `Secondary SubCategory ${edit ? "updated" : "created"} successfully`
      );
      handleClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Operation failed. Please try again.";
      toast.error(message);
    } finally {
      refetch();
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await SecSubCategoriesApi.delete(id);
      toast.success(
        response?.data?.message || "Secondary SubCategory deleted successfully"
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete category.";
      toast.error(message);
    } finally {
      refetch();
    }
  };

  const handelEdit = (category: any) => {
    setEdit(true);
    setOpen(true);
    requestAnimationFrame(() => {
      form.reset({
        id: category.id,
        name: category.name,
        description: category.description,
        subCategoryId: category.subCategoryId.toString(),
      });
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
    form.reset();
  };

  const { subCategories, isLoading: subCategoriesLoading } = useSubCategory();

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Secondary Sub Categories</CardTitle>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Second Subcategory
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
                  {/* <TableHead>Category</TableHead> */}
                  <TableHead>Subcategory</TableHead>
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
                    {/* <TableCell>
                      <Badge variant="outline">
                        {item?.category?.name || "-"}
                      </Badge>
                    </TableCell> */}
                    <TableCell>
                      <Badge variant={"outline"}>
                        {item?.subCategory?.name || "-"}
                      </Badge>
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
                              <AlertDialogTitle>
                                Delete Second Subcategory
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.name}"?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCategory(item.id)}
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
                No subcategories yet. Click the button above to add one.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {edit ? `Edit Category: ` : `Add New Category`}
            </DialogTitle>
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
                name="subCategoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Sub Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a sub category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=" ">None</SelectItem>
                        {subCategories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value.toString()}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {edit
                    ? form.formState.isSubmitting
                      ? "Saving..."
                      : "Save"
                    : form.formState.isSubmitting
                      ? "Adding..."
                      : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SecSubCategories;
