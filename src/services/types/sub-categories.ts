import type { BaseResponse, Pagination } from "@/services/types/base";
import type { Categories } from "./categories";

export interface SubCategories {
    id: number;
    name: string;
    description: string;
    categoryId: number;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
    category: Categories
}

export interface SubCategoriesResponse extends BaseResponse {
    data: SubCategories[]

}

export interface CreateResponce extends BaseResponse {
    data: SubCategories

}