import httpClient from "@/services/config";
import type {
  CreateResponce,
  CategoriesResponse,
} from "@/services/types/categories";
import type { BaseResponse } from "@/services/types/base";
import type { SubCategoriesResponse } from "../types/sub-categories";

export default class CategoriesApi {
  static getCategories(payload: any) {
    return httpClient.get<CategoriesResponse>("/api/category", payload);
  }
  static getAll() {
    return httpClient.get<CategoriesResponse>("/api/category");
  }

  static create(payload: any) {
    return httpClient.post<CreateResponce>(`/api/category`, payload);
  }

  static update(id: number, payload: any) {
    return httpClient.put(`/api/category/${id}`, payload);
  }

  static delete(id: number) {
    return httpClient.delete<BaseResponse>(`/api/category/${id}`);
  }

  static getSubCategories(payload: any) {
    return httpClient.post<SubCategoriesResponse>(
      "/api/category/getsubcategory",
      payload
    );
  }
}
