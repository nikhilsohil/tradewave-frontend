import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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
import { Upload, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  thumbnail: z.any().optional(),
  images: z.any().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

function RouteComponent() {
  const navigate = useNavigate();
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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);

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
    onSuccess: () => {
      toast.success("Product added successfully");
      navigate({ to: "/product" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product");
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];

    setImages(newImages);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();

    // Append text/number fields
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("categoryId", String(data.categoryId));
    formData.append("subCategoryId", String(data.subCategoryId));
    if (data.secondSubCategoryId)
      formData.append("secondSubCategoryId", String(data.secondSubCategoryId));
    formData.append("brandId", String(data.brandId));

    // Append images
    images.forEach((image, index) => {
      formData.append("images", image);
      if (index === mainImageIndex) {
        formData.append("thumbnail", image);
      }
    });

    console.log("formdata", formData);
    mutation.mutate(formData);
  };

  return (
    <Tabs defaultValue="product" className="w-full">
      <TabsList>
        <TabsTrigger value="product">Product</TabsTrigger>
        <TabsTrigger value="varient">Varient</TabsTrigger>
      </TabsList>
      <TabsContent value="product">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Add Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="images">Upload Images</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="images"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {mainImageIndex !== index && (
                          <button
                            type="button"
                            onClick={() => setMainImageIndex(index)}
                            className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded hover:bg-primary/80"
                          >
                            Set as Thumbnail
                          </button>
                        )}
                        {mainImageIndex === index && (
                          <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Thumbnail
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/product" })}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="varient">
        <VarientForm />
      </TabsContent>
    </Tabs>
  );
}
