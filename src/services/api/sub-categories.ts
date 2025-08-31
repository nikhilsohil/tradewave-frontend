import httpClient from "@/services/config";
import type {
  CreateResponce,
  SubCategoriesResponse,
} from "@/services/types/sub-categories";
import type { BaseResponse } from "@/services/types/base";
import type { SecondSubCategoriesResponse } from "../types/sec-sub-categories";

export default class SubCategoriesApi {
  static get(payload: any) {
    return httpClient.get<SubCategoriesResponse>("/api/subcategory", payload);
  }

  static create(payload: any) {
    return httpClient.post<CreateResponce>(`/api/subcategory`, payload);
  }

  static update(payload: any) {
    const { id } = payload;
    return httpClient.put(`/api/subcategory/${id}`, payload);
  }

  static delete(id: number) {
    return httpClient.post<BaseResponse>(`/api/subcategory/${id}`);
  }

  static getSecSubCategories(payload: any) {
    return httpClient.post<SecondSubCategoriesResponse>(
      `/api/subcategory/getSecSubCategory/`,
      payload
    );
  }
}
