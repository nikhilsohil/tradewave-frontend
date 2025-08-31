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
import { CalendarIcon, Upload, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import CategoriesApi from "@/services/api/categories";
import SubCategoriesApi from "@/services/api/sub-categories";
import SecSubCategoriesApi from "@/services/api/sec-sub-categories";
import ProductApi from "@/services/api/products/index";
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

export const Route = createFileRoute("/_protected/product/add")({
  component: RouteComponent,
});

const productSchema = z.object({
  name: z
    .string("Product name is required")
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name is too long"),

  description: z
    .string()
    // .min(10, "Description must be at least 10 characters")
    // .max(1000, "Description is too long")
    .optional(),
  categoryId: z.coerce
    .number("Category ID is required")
    .min(1, "Invalid Category ID")
    .int("Category ID must be an integer"),
  subCategoryId: z.coerce
    .number("Subcategory ID is required")
    .int("Subcategory ID must be an integer"),
  secondSubCategoryId: z.string().optional(),

  brand: z.string().max(100).optional(),
  manufacturedBy: z.string().max(100).optional(),
  marketedBy: z.string().max(100).optional(),
  quantityPerUnit: z.string().max(50).optional(),
  unitsPerBox: z.string().optional(),
  unitType: z.string().optional(),
  inStock: z.string("Quentity is required").min(1, "Quentity must be at least 1"),

  mrp: z.string("MRP is required").min(1, "MRP must be at least 1"),

  retailerPrice: z
    .string()
    .min(1, "Retailer Price must be positive")
    .optional(),

  price: z.string("Price is required").min(1, "Price must be at least 1"),

  mfgDate: z.date().optional(),
  expiryDate: z.date().optional(),
});
type ProductFormData = z.infer<typeof productSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      manufacturedBy: "",
      marketedBy: "",
      quantityPerUnit: "",
      categoryId: "",
      subCategoryId: "",
      secondSubCategoryId: "",
      unitsPerBox: "",
      inStock: "1", 
      unitType: "",
      mrp: "",
      retailerPrice: "",
      price: "",
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0); // first image as default

  const watchedValues = watch();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoriesApi.getAll(),
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
    mutationFn: (formData: any) => {
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
  console.log("form.getValues", form.getValues());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files];

    setImages(newImages);

    // Create previews
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
  console.log(images);

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString()); // send date as ISO string
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    // Append images
    images.forEach((image, index) => {
      formData.append("images", image);
      if (index === mainImageIndex) {
        formData.append("thumbnail", image); // or send index to backend
      }
    });

    // Trigger mutation with FormData
    mutation.mutate(formData);
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="manufacturedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufactured By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter manufacturer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="marketedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marketed By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter marketer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Information */}
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
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
                          <SelectItem value=" ">Select</SelectItem>
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
              </div>

              <div className="space-y-2">
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
                          <SelectItem value=" ">Select</SelectItem>
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
              </div>

              <div className="space-y-2">
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
                          <SelectItem value=" ">Select</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter stock quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="quantityPerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity Per Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500ml, 1kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="unitsPerBox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units Per Box</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of units"
                          {...field}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="unitType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Type</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select unit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="piece">Piece</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="liter">Liter</SelectItem>
                          <SelectItem value="meter">Meter</SelectItem>
                          <SelectItem value="box">Box</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter MRP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="retailerPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Retailer Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter retailer price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter selling price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Information */}
        <Card>
          <CardHeader>
            <CardTitle>Date Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Manufacturing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedValues.mfgDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedValues.mfgDate
                        ? format(watchedValues.mfgDate, "PPP")
                        : "Pick manufacturing date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchedValues.mfgDate}
                      onSelect={(date) => setValue("mfgDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedValues.expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedValues.expiryDate
                        ? format(watchedValues.expiryDate, "PPP")
                        : "Pick expiry date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchedValues.expiryDate}
                      onSelect={(date) => setValue("expiryDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
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

        {/* Submit Button */}
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
  );
}
