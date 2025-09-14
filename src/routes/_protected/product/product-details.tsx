import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
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
import { Upload, X } from "lucide-react";
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

export const Route = createFileRoute("/_protected/product/product-details")({
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
});

type ProductFormData = z.infer<typeof productSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const { productId, edit } = useSearch({ from: "/_protected/product/product-details" });
  const [isEditing, setIsEditing] = useState(edit === "true");
  const [activeTab, setActiveTab] = useState("product");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const {
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form;

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => ProductApi.getById(Number(productId)),
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      reset(product.data.data);
    }
  }, [product, reset]);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
      return ProductApi.updateProduct(Number(productId), formData);
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    formData.append("categoryId", String(data.categoryId));
    formData.append("subCategoryId", String(data.subCategoryId));
    if (data.secondSubCategoryId)
      formData.append("secondSubCategoryId", String(data.secondSubCategoryId));
    formData.append("brandId", String(data.brandId));

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    images.forEach((image) => {
      formData.append("images", image);
    });

    mutation.mutate(formData);
  };

  if (isProductLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList>
        <TabsTrigger value="product">Product</TabsTrigger>
        <TabsTrigger value="varient">Varient</TabsTrigger>
      </TabsList>
      <TabsContent value="product">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Details</CardTitle>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Product Name</Label>
                        <p>{product?.data.data.name}</p>
                      </div>
                      <div>
                        <Label>Brand</Label>
                        <p>{product?.data.data.brand.name}</p>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <p>{product?.data.data.description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Category</Label>
                        <p>{product?.data.data.category.name}</p>
                      </div>
                      <div>
                        <Label>Sub Category</Label>
                        <p>{product?.data.data.subCategory.name}</p>
                      </div>
                      <div>
                        <Label>Second Sub Category</Label>
                        <p>{product?.data.data.secondSubCategory?.name}</p>
                      </div>
                    </div>
                    <div>
                      <Label>Product Images</Label>
                      <div className="grid grid-cols-4 gap-4 pt-2">
                        {product?.data.data.ProductImages.map((image: any) => (
                          <img
                            key={image.id}
                            src={image.imageUrl}
                            alt="Product Image"
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
                        name="brandId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value?.toString()}
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
                              disabled={!isEditing}
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
                            <Select
                              onValueChange={field.onChange}
                              value={field.value?.toString()}
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
                        control={form.control}
                        name="subCategoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub Category *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value?.toString()}
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
                        control={form.control}
                        name="secondSubCategoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Second Sub Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value?.toString()}
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
                  </>
                )}
              </CardContent>
            </Card>

            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label>Thumbnail Image</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="thumbnail"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                      >
                        {thumbnailPreview ? (
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload
                              className="w-8 h-8 mb-4 text-muted-foreground"
                            />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        )}
                        <input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Images</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="images"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload
                            className="w-8 h-8 mb-4 text-muted-foreground"
                          />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            You can upload multiple images
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
                </CardContent>
                {imagePreviews.length > 0 && (
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border transition-all group-hover:brightness-50"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    reset(product.data.data);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </TabsContent>
      <TabsContent value="varient">
        <VarientManagement newlyCreatedProductId={Number(productId)} />
      </TabsContent>
    </Tabs>
  );
}

function VarientManagement({ newlyCreatedProductId }: { newlyCreatedProductId: number | null }) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    newlyCreatedProductId
  );

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => ProductApi.get({}),
  });

  useEffect(() => {
    if (newlyCreatedProductId) {
      setSelectedProductId(newlyCreatedProductId);
    }
  }, [newlyCreatedProductId]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(value) => setSelectedProductId(Number(value))}
            value={selectedProductId?.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products?.data.data.products?.map((product: Product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {selectedProductId && <VariantView productId={selectedProductId} />}
    </div>
  );
}

function VariantView({ productId }: { productId: number }) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const { data: variants, isLoading } = useQuery({
    queryKey: ["variants", productId],
    queryFn: () => VarientApi.getVariantsByProductId(productId),
    enabled: !!productId,
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["variants", productId] });
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add New Variant</CardTitle>
        </CardHeader>
        <CardContent>
          <VarientForm productId={productId} onSuccess={handleSuccess} />
          <Button
            variant="outline"
            onClick={() => setShowAddForm(false)}
            className="mt-4"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Variants</CardTitle>
        <Button onClick={() => setShowAddForm(true)}>Add Variant</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>MRP</TableHead>
              <TableHead>Purchase Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Pack Type</TableHead>
              <TableHead>Units/Pack</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              variants.data.data?.map((variant: ProductVarient) => (
                <TableRow key={variant.id}>
                  <TableCell>{variant.code}</TableCell>
                  <TableCell>{variant.name}</TableCell>
                  <TableCell>{variant.mrpWithGST}</TableCell>
                  <TableCell>{variant.purchasePriceWithGST}</TableCell>
                  <TableCell>{variant.inStock}</TableCell>
                  <TableCell>{variant.bulkPackType}</TableCell>
                  <TableCell>{variant.unitsPerBulkPack}</TableCell>
                  <TableCell>
                    {variant.status ? "Active" : "Inactive"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
