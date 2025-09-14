import httpClient from "@/services/config";
import type { ProductResponse } from "@/services/types/products";

export default class ProductApi {
  static get(payload: any) {
    return httpClient.post<ProductResponse>("/api/products", payload);
  }

  static addProduct(payload: any) {
    console.log("payload", payload);

    return httpClient.post<ProductResponse>(
      "api/admin/product/create",
      payload
    );
  }
}
