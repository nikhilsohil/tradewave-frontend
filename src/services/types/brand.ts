import type { BaseResponse, Pagination } from "@/services/types/base";

export interface Brand {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface BrandsResponse extends BaseResponse {
  data: Brand[];
}

export interface BrandCreateResponce extends BaseResponse {
  data: Brand;
}
