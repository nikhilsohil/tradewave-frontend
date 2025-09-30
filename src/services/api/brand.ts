import httpClient from "../config";
import type { BaseResponse } from "../types/base";
import type { BrandCreateResponce, BrandsResponse } from "../types/brand";

export default class BrandAPI {
  static getAll() {
    return httpClient.get<BrandsResponse>("/api/brand");
  }
  static update(id: number, payload: any) {
    return httpClient.put<BaseResponse>(`/api/brand/${id}`, payload);
  }
  static create(payload: any) {
    return httpClient.post<BrandCreateResponce>(`/api/brand`, payload);
  }
  static delete(id: number) {
    return httpClient.delete<BaseResponse>(`/api/brand/${id}`);
  }
}
