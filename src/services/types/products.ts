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
    brand: string
    manufacturedBy: any
    marketedBy: any
    quantityPerUnit: string
    unitsPerBox: any
    unitType: string
    mrp: number
    retailerPrice: number
    price: number
    mfgDate: any
    stock: number
    expiryDate: any
    thumbnail: any
    createdAt: string
    updatedAt: string
    category: Category
    subCategory: SubCategory
    secondSubCategory: SecondSubCategory
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

