import type { BaseResponse, Pagination } from "@/services/types/base";
import type { Categories } from "./categories";
import type { SubCategories } from "./sub-categories";

export interface SecondSubCategories {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    subCategoryId: number;  // Foreign key to SubCategoryId
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
    category: Categories
    subCategory: SubCategories
}

export interface SecondSubCategoriesResponse extends BaseResponse {
    data: SecondSubCategories[]
}

export interface CreateResponce extends BaseResponse {
    data: SecondSubCategories

}