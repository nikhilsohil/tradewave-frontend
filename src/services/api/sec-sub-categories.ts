import httpClient from "@/services/config";
import type { BaseResponse } from "@/services/types/base";
import type {
  CreateResponce,
  SecondSubCategoriesResponse,
} from "@/services/types/sec-sub-categories";

export default class SecSubCategoriesApi {
  static get(payload: any) {
    return httpClient.get<SecondSubCategoriesResponse>(
      "/api/secsubcategory",
      payload
    );
  }

  static create(payload: any) {
    return httpClient.post<CreateResponce>(`/api/secsubcategory`, payload);
  }

  static update(payload: any) {
    const { id } = payload;
    return httpClient.post(`/api/secsubcategory/${id}`, payload);
  }

  static delete(id: number) {
    return httpClient.post<BaseResponse>(`/api/secsubcategory/${id}`);
  }
}
