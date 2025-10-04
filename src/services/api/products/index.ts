import httpClient from "@/services/config";
import type { BaseResponse } from "@/services/types/base";
import type { Product, ProductResponse } from "@/services/types/products";

export default class ProductApi {
  static get(payload: any) {
    return httpClient.post<ProductResponse>("/api/admin/product", payload);
  }

  static addProduct(payload: any) {
    return httpClient.post<BaseResponse<Product>>(
      "api/admin/product/create",
      payload
    );
  }

  static getById(id: number) {
    return httpClient.get<BaseResponse<Product>>(`/api/admin/product/${id}`);
  }

  static updateProduct(id: number, payload: any) {
    return httpClient.put<ProductResponse>(`/api/admin/product/${id}`, payload);
  }

  static delete(id: number) {
    return httpClient.delete<BaseResponse>(`/api/admin/product/${id}`);
  }

  static activate(id: number) {
    return httpClient.put<BaseResponse>(`/api/admin/product/active/${id}`);
  }
}
