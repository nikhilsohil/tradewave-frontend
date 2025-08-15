import type { BaseResponse, Pagination } from "@/services/types/base";

export interface Categories {
    id: number;
    name: string;
    description: string;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
}

export interface CategoriesResponse extends BaseResponse {
    data: Categories[]

}

export interface CreateResponce extends BaseResponse {
    data: Categories

}