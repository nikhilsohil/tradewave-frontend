import { createFileRoute } from '@tanstack/react-router'
import type React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Upload, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export const Route = createFileRoute('/_protected/product/add')({
    component: RouteComponent,
})

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    subCategoryId: z.string().min(1, "Sub category is required"),
    secondSubCategoryId: z.string().optional(),
    brand: z.string().optional(),
    manufacturedBy: z.string().optional(),
    marketedBy: z.string().optional(),
    quantityPerUnit: z.string().optional(),
    unitsPerBox: z.coerce.number().int().positive().optional(),
    unitType: z.string().optional(),
    mrp: z.coerce.number().positive("MRP must be a positive number"),
    retailerPrice: z.coerce.number().positive().optional(),
    price: z.coerce.number().positive("Price must be a positive number"),
    mfgDate: z.date().optional(),
    expiryDate: z.date().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

function RouteComponent() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            categoryId: "",
            subCategoryId: "",
            secondSubCategoryId: "",
            brand: "",
            manufacturedBy: "",
            marketedBy: "",
            quantityPerUnit: "",
            unitType: "",
        },
    })
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const watchedValues = watch()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newImages = [...images, ...files]

        setImages(newImages)

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreviews((prev) => [...prev, e.target?.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = imagePreviews.filter((_, i) => i !== index)

        setImages(newImages)
        setImagePreviews(newPreviews)
    }

    const onSubmit = (data: ProductFormData) => {
        console.log("Product data:", { ...data, images })
        // Handle form submission here
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input id="name" {...register("name")} placeholder="Enter product name" />
                            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" {...register("brand")} placeholder="Enter brand name" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} placeholder="Enter product description" rows={3} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manufacturedBy">Manufactured By</Label>
                            <Input id="manufacturedBy" {...register("manufacturedBy")} placeholder="Enter manufacturer" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="marketedBy">Marketed By</Label>
                            <Input id="marketedBy" {...register("marketedBy")} placeholder="Enter marketer" />
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
                            <Label htmlFor="categoryId">Category *</Label>
                            <Select value={watchedValues.categoryId} onValueChange={(value) => setValue("categoryId", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Electronics</SelectItem>
                                    <SelectItem value="2">Clothing</SelectItem>
                                    <SelectItem value="3">Food & Beverages</SelectItem>
                                    <SelectItem value="4">Health & Beauty</SelectItem>
                                    <SelectItem value="5">Home & Garden</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subCategoryId">Sub Category *</Label>
                            <Select value={watchedValues.subCategoryId} onValueChange={(value) => setValue("subCategoryId", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select sub category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Smartphones</SelectItem>
                                    <SelectItem value="2">Laptops</SelectItem>
                                    <SelectItem value="3">Accessories</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.subCategoryId && <p className="text-sm text-destructive">{errors.subCategoryId.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="secondSubCategoryId">Second Sub Category</Label>
                            <Select
                                value={watchedValues.secondSubCategoryId}
                                onValueChange={(value) => setValue("secondSubCategoryId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select second sub category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Android</SelectItem>
                                    <SelectItem value="2">iOS</SelectItem>
                                    <SelectItem value="3">Gaming</SelectItem>
                                </SelectContent>
                            </Select>
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
                            <Label htmlFor="quantityPerUnit">Quantity Per Unit</Label>
                            <Input id="quantityPerUnit" {...register("quantityPerUnit")} placeholder="e.g., 500ml, 1kg" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unitsPerBox">Units Per Box</Label>
                            <Input id="unitsPerBox" type="number" {...register("unitsPerBox")} placeholder="Enter number of units" />
                            {errors.unitsPerBox && <p className="text-sm text-destructive">{errors.unitsPerBox.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="unitType">Unit Type</Label>
                            <Select value={watchedValues.unitType} onValueChange={(value) => setValue("unitType", value)}>
                                <SelectTrigger>
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
                            <Label htmlFor="mrp">MRP *</Label>
                            <Input id="mrp" type="number" step="0.01" {...register("mrp")} placeholder="Enter MRP" />
                            {errors.mrp && <p className="text-sm text-destructive">{errors.mrp.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="retailerPrice">Retailer Price</Label>
                            <Input
                                id="retailerPrice"
                                type="number"
                                step="0.01"
                                {...register("retailerPrice")}
                                placeholder="Enter retailer price"
                            />
                            {errors.retailerPrice && <p className="text-sm text-destructive">{errors.retailerPrice.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Selling Price *</Label>
                            <Input id="price" type="number" step="0.01" {...register("price")} placeholder="Enter selling price" />
                            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
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
                                            !watchedValues.mfgDate && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {watchedValues.mfgDate ? format(watchedValues.mfgDate, "PPP") : "Pick manufacturing date"}
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
                                            !watchedValues.expiryDate && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {watchedValues.expiryDate ? format(watchedValues.expiryDate, "PPP") : "Pick expiry date"}
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
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
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
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">
                    Cancel
                </Button>
                <Button type="submit">Add Product</Button>
            </div>
        </form>
    )
}
