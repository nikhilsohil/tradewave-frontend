import { createFileRoute, useSearch } from "@tanstack/react-router";
import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState, useCallback } from "react";
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

export const Route = createFileRoute("/_protected/product/$productId")({
  component: RouteComponent,
});

const productSchema = z.object({
  name: z
    .string("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name is too long"),
  description: z.string().optional(),
  categoryId: z.coerce.number().min(1, "Category is required"),
  subCategoryId: z.coerce.number().min(1, "Sub Category is required"),
  secondSubCategoryId: z.coerce.number().optional(),
  brandId: z.coerce.number().min(1, "Brand is required"),
  thumbnail: z.any(),
});

type ProductFormData = z.infer<typeof productSchema>;

function RouteComponent() {
  const { productId } = Route.useParams();
  const queryClient = useQueryClient();
  const { edit }: any = useSearch({ from: "/_protected/product/$productId" });
  const [isEditing, setIsEditing] = useState(edit === "true");
  const [activeTab, setActiveTab] = useState("product");
  const [images, setImages] = useState<(File | string)[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: undefined,
    },
  });
  const { handleSubmit, watch, reset, control, setValue } = form;

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductApi.getById(Number(productId)),
    enabled: !!productId,
  });

  const watchedValues = watch();

  const { data: categories, isLoading: areCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesApi.getAll(),
  });
  const { data: brands, isLoading: areBrandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => BrandAPI.getAll(),
  });

  // Get product's categoryId for loading subcategories
  const productCategoryId = product?.data?.data?.categoryId;
  const productSubCategoryId = product?.data?.data?.subCategoryId;

  const { data: subCategories } = useQuery({
    queryKey: ["subCategories", productCategoryId || watchedValues.categoryId],
    queryFn: () =>
      CategoriesApi.getSubCategories({
        categoryId: productCategoryId || watchedValues.categoryId,
      }),
    enabled: !!(productCategoryId || watchedValues.categoryId),
  });

  const { data: secSubCategories } = useQuery({
    queryKey: [
      "secSubCategories",
      productSubCategoryId || watchedValues.subCategoryId,
    ],
    queryFn: () =>
      SubCategoriesApi.getSecSubCategories({
        subCategoryId: productSubCategoryId || watchedValues.subCategoryId,
      }),
    enabled: !!(productSubCategoryId || watchedValues.subCategoryId),
  });

  const resetForm = useCallback(() => {
    if (product?.data?.data && !hasInitialized) {
      const p = product.data.data;

      // Set basic form data immediately
      reset({
        name: p.name ?? "",
        description: p.description ?? "",
        brandId: p.brandId ?? undefined,
        categoryId: p.categoryId ?? undefined,
        subCategoryId: p.subCategoryId ?? undefined,
        secondSubCategoryId: p.secondSubCategoryId ?? undefined,
        thumbnail: p.thumbnail,
      });

      setImages(p.ProductImages?.map((img: any) => img.imageUrl) ?? []);
      setHasInitialized(true);
    }
  }, [product, reset, hasInitialized]);

  // Reset hasInitialized when product changes
  useEffect(() => {
    if (product?.data?.data) {
      setHasInitialized(false);
    }
  }, [product?.data?.data?.id]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  // Additional effect to ensure select fields are properly set after data loads
  useEffect(() => {
    if (product?.data?.data && subCategories?.data?.data && hasInitialized) {
      const p = product.data.data;

      requestAnimationFrame(() =>
        form.reset({
          name: p.name ?? "",
          description: p.description ?? "",
          brandId: p.brandId ?? undefined,
          categoryId: p.categoryId ?? undefined,
          subCategoryId: p.subCategoryId ?? undefined,
          secondSubCategoryId: p.secondSubCategoryId ?? undefined,
          thumbnail: p.thumbnail,
        })
      );
      // Ensure all select values are properly set
      //   setTimeout(() => {
      //     setValue("categoryId", p.categoryId);
      //     setValue("subCategoryId", p.subCategoryId);
      //     if (p.secondSubCategoryId) {
      //       setValue("secondSubCategoryId", p.secondSubCategoryId);
      //     }
      //     setValue("brandId", p.brandId);
      //   }, 100);
    }
  }, [product, subCategories, secSubCategories, hasInitialized, setValue]);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      ProductApi.updateProduct(Number(productId), formData),
    onSuccess: () => {
      toast.success("Product updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to update product"),
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("categoryId", String(data.categoryId));
    formData.append("subCategoryId", String(data.subCategoryId));
    if (data.secondSubCategoryId)
      formData.append("secondSubCategoryId", String(data.secondSubCategoryId));
    formData.append("brandId", String(data.brandId));

    if (data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    updateMutation.mutate(formData);
  };

  const getImageSrc = (image: string | File | null) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image;
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHasInitialized(false); // Reset initialization flag
    resetForm();
  };

  if (isProductLoading || areCategoriesLoading || areBrandsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4 pt-0 flex gap-4 justify-between items-center h-fit ">
          <CardTitle>Product Details</CardTitle>
          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>General Infomations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product 1"
                          {...field}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() ?? ""}
                        disabled={!isEditing}
                      >
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
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="test product"
                        rows={3}
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() ?? ""}
                        disabled={!isEditing}
                      >
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
                  control={control}
                  name="subCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() ?? ""}
                        disabled={!isEditing || !watchedValues.categoryId}
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
                  control={control}
                  name="secondSubCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second Sub Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value?.toString() ?? ""}
                        disabled={!isEditing || !watchedValues.subCategoryId}
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
              <FormField
                control={control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Image</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="relative">
                          <div
                            className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${field.value ? "border-gray-300 bg-white" : "border-gray-300 bg-gray-50 hover:border-gray-400"}`}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              ref={field.ref}
                              onChange={(e) =>
                                form.setValue("thumbnail", e.target.files?.[0])
                              }
                              disabled={!isEditing}
                            />
                            {field.value ? (
                              <div className="relative">
                                <img
                                  src={getImageSrc(field.value) || ""}
                                  alt="Main image"
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                {isEditing && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      form.setValue("thumbnail", null);
                                    }}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-4">
                <Label>Additional Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageSrc(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border transition-all group-hover:brightness-50"
                      />
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <label
                      htmlFor="images-upload"
                      className="flex items-center justify-center w-full h-24 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <input
                        id="images-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
