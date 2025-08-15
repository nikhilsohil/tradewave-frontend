import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '../ui/button'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import type { useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import CategoriesApi from '@/services/api/categories'
import { AlertDialog, AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'


const categorySchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string("Name is required").min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
    description: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(200, "Description must be less than 200 characters"),
})


function Categories() {
    const [open, setOpen] = useState(false)

    const { data } = useQuery({
        queryKey: ["categories", open],
        queryFn: () => CategoriesApi.getCategories({}),
    })



    const items = data?.data?.data || []

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            id: "",
            name: "",
            description: ""
        }
    })

    const [edit, setEdit] = useState(false)


    const handleSubmit = async (formData: any) => {
        try {
            let response;
            if (edit) {
                // Update category
                response = await CategoriesApi.update(formData.id, {
                    name: formData.name,
                    description: formData.description,
                });
                toast.success(response?.data?.message || "Category updated successfully");
            } else {
                // Create category
                response = await CategoriesApi.create({
                    name: formData.name,
                    description: formData.description,
                });
                toast.success(response?.data?.message || "Category created successfully");
            }

            setOpen(false);
            form.reset();
        } catch (error: any) {
            const message = error?.response?.data?.message || "Operation failed. Please try again.";
            toast.error(message);
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            const response = await CategoriesApi.delete(id);
            toast.success(response?.data?.message || "Category deleted successfully");
        } catch (error: any) {
            const message = error?.response?.data?.message || "Failed to delete category.";
            toast.error(message);
        }
    };

    const handelEdit = (category: any) => {
        form.setValue("id", category.id);
        form.setValue("name", category.name);
        form.setValue("description", category.description);
        setEdit(true);
        setOpen(true);
    };

    console.log("formState.errors", form.formState.errors);
    console.log("formState", form.getValues());


    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Categories</CardTitle>
                        <Button onClick={() => setOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add  Category
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
                                        <TableCell className="text-muted-foreground">{item.description}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => handelEdit(item)}>
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
                                                            <AlertDialogTitle>Delete Second Subcategory</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{item.name}"? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => deleteCategory(item.id)}>
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
                                No categories yet. Click the button above to add one.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>



            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {edit
                                ? `Edit Category: ` : `Add New Category`}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

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
                                            <Textarea placeholder="Enter description..." rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">{edit ? "Save" : "Add"}</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default Categories