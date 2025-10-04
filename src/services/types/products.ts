import type { BaseResponse, Pagination } from "./base"

export interface ProductResponse extends BaseResponse {
    data: Data
}

export interface Data {
    products: Product[]
    pagination: Pagination
}

export interface Product {
    id: number
    name: string
    description: string
    categoryId: number
    subCategoryId: number
    secondSubCategoryId: number
    brandId: number;
    manufacturedBy: any
    marketedBy: any
    quantityPerUnit: string
    unitsPerBox: any
    unitType: string
    mrp: number
    retailerPrice: number
    price: number
    mfgDate: any
    inStock: number
    expiryDate: any
    thumbnail: any
    createdAt: string
    updatedAt: string
    category: Category
    subCategory: SubCategory
    secondSubCategory: SecondSubCategory
    brand: Brand
    isActive: boolean
    ProductImages: ProductImage[];
    
}

interface Brand {
    id: number;
    name: string;
    description: string;
    image: string;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

interface ProductImage {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
}


interface Category {
    id: number
    name: string
    description: string
    createdBy: number
    createdAt: string
    updatedAt: string
    isActive: boolean
}

interface SubCategory {
    id: number
    name: string
    description: string
    categoryId: number
    createdBy: number
    createdAt: string
    updatedAt: string
    isActive: boolean
}

interface SecondSubCategory {
    id: number
    name: string
    description: string
    categoryId: number
    subCategoryId: number
    createdAt: string
    updatedAt: string
    isActive: boolean
}

