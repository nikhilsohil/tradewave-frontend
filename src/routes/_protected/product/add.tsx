import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { FilePenLine, Plus, Trash2, Upload, X } from "lucide-react";
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

export const Route = createFileRoute("/_protected/product/add")({
  component: RouteComponent,
});

const productSchema = z.object({
  name: z
    .string("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name is too long"),
  description: z.string().optional(),
  categoryId: z.coerce
    .number("Category is required")
    .min(1, "Category is required"),
  subCategoryId: z.coerce
    .number("Sub Category is required")
    .min(1, "Sub Category is required"),
  secondSubCategoryId: z.coerce.number().optional(),
  brandId: z.coerce.number().min(1, "Brand is required"),
  thumbnail: z.union([
    z
      .instanceof(File, { message: "Image is required" })
      .refine((file) => !file || file.size !== 0 || file.size <= 5000000, {
        message: "Max size exceeded",
      }),
    z.string().trim().min(1, "Image is required"), // to hold default image
  ]),
  images: z.any().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const [newProductId, setNewProductId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("product");

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const watchedValues = watch();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesApi.getAll(),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => BrandAPI.getAll(),
  });

  const { data: subCategories } = useQuery({
    queryKey: ["subCategories", watchedValues.categoryId],
    queryFn: () =>
      CategoriesApi.getSubCategories({ categoryId: watchedValues.categoryId }),
    enabled: !!watchedValues.categoryId,
  });

  const { data: secSubCategories } = useQuery({
    queryKey: ["secSubCategories", watchedValues.subCategoryId],
    queryFn: () =>
      SubCategoriesApi.getSecSubCategories({
        subCategoryId: watchedValues.subCategoryId,
      }),
    enabled: !!watchedValues.subCategoryId,
  });

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return ProductApi.addProduct(formData);
    },
    onSuccess: (data) => {
      toast.success("Product added successfully");
      setNewProductId(data.data.data.id);
      setActiveTab("varient");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add product");
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("categoryId", String(data.categoryId));
    formData.append("subCategoryId", String(data.subCategoryId));
    if (data.secondSubCategoryId)
      formData.append("secondSubCategoryId", String(data.secondSubCategoryId));
    formData.append("brandId", String(data.brandId));

    mutation.mutate(formData);
  };
  const getImageSrc = (image: string | File | null) => {
    console.log("image",image);
    
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image; // URL string
  };

  return (
    <>
      <div className="h-full ">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-4 pt-0 flex gap-4 justify-between items-center h-fit ">
              <div>Add Product</div>
              <div className="flex justify-end gap-4">
                <Button>Cancle</Button>
                <Button type="submit" disabled={mutation.isPending}>
                  Save
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>General Infomations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Product 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand *</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands?.data?.data.map((brand: Brand) => (
                                <SelectItem
                                  key={brand.id}
                                  value={brand.id.toString()}
                                >
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="test product"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories?.data?.data.map(
                                (category: Categories) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                  >
                                    {category.name}
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
                      name="subCategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub Category *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            disabled={!watchedValues.categoryId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select sub category" />
                            </SelectTrigger>
                            <SelectContent>
                              {subCategories?.data?.data.map(
                                (subCategory: SubCategories) => (
                                  <SelectItem
                                    key={subCategory.id}
                                    value={subCategory.id.toString()}
                                  >
                                    {subCategory.name}
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
                      name="secondSubCategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Second Sub Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            disabled={!watchedValues.subCategoryId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select second sub category" />
                            </SelectTrigger>
                            <SelectContent>
                              {secSubCategories?.data?.data.map(
                                (secSubCategory: SecondSubCategories) => (
                                  <SelectItem
                                    key={secSubCategory.id}
                                    value={secSubCategory.id.toString()}
                                  >
                                    {secSubCategory.name}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Main Image Upload Area */}
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            {/* Main Image Upload/Display Area */}
                            <div className="relative">
                              <div
                                className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
                                  field.value
                                    ? "border-gray-300 bg-white"
                                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                                }`}

                                // onDragOver={(e) => handleDragOver(e, "main")}
                                // onDragLeave={(e) => handleDragLeave(e, "main")}
                                // onDrop={(e) => handleDrop(e, "main")}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 h-full"
                                  ref={field.ref}
                                  onChange={(e)=>form.setValue("thumbnail",e.target.files[0])}
                                />
                                {field.value ? (
                                  <div className="relative">
                                    <img
                                      src={getImageSrc(field.value) || ""}
                                      alt="Main image"
                                      className="w-full h-48 object-cover rounded-lg"
                                    />

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        form.setValue("thumbnail", "");
                                      }}
                                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <Upload className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="text-center">
                                      <p className="text-sm text-gray-600 mb-1">
                                        Click to upload or drag and drop
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* URL Input Toggle and Field */}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Additional Images
                    </label>

                    {/* Image Grid/List */}
                    <div className="grid grid-cols-6 gap-3 mb-4">
                      {/* Skeleton placeholders for additional images */}
                      {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square bg-gray-200 rounded-lg  flex items-center justify-center border-2 border-dashed border-gray-300">
                            <div className="w-6 h-6 bg-gray-300 rounded "></div>
                          </div>
                          <div className="absolute top-1 right-1 w-5 h-5 bg-gray-300 rounded-full "></div>
                        </div>
                      ))}

                      {/* Add More Images Button */}
                      <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 cursor-pointer bg-gray-50 transition-colors">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>

                      {/* Empty slots */}
                      <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg bg-gray-25"></div>
                    </div>

                    {/* Helper Text */}
                    <p className="text-xs mt-3">
                      You can upload up to 10 additional images. Supported
                      formats: PNG, JPG, GIF
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
