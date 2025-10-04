import type {
  AddProductVarient,
  ProductVarient,
} from "@/services/types/varient";

import httpClient from "../../config";
import type { BaseResponse } from "@/services/types/base";

class VarientApi {
  static async addVarient(data: AddProductVarient) {
    return await httpClient.post("/api/admin/product-varient", data);
  }
  static async getVariantsByProductId(productId: string | number) {
    return await httpClient.get<BaseResponse<ProductVarient[]>>(
      `/api/admin/product/varient/${productId}`
    );
  }
  static async getVariantById(variantId: string | number) {
    return await httpClient.get<BaseResponse<ProductVarient>>(
      `/api/admin/product-varient/get-by-id/${variantId}`
    );
  }
  static async updateVarient(
    id: number,
    data: Omit<ProductVarient, "id" | "code" | "createdAt" | "updateAt">
  ) {
    return await httpClient.put(`/api/admin/product-varient/${id}`, data);
  }
  static async deleteVarient(id: number) {
    return await httpClient.delete(`/api/admin/product-varient/${id}`);
  }
  static activate(id: number) {
    return httpClient.put<BaseResponse>(
      `/api/admin/product-varient/active/${id}`
    );
  }
  static async addGroupDiscount(
    variantId: number,
    data: { retailerGroupId: number; discount: number }
  ) {
    return await httpClient.post(
      `/api/admin/product-varient/${variantId}/group-discount`,
      data
    );
  }
  static async addSlabDiscount(
    variantId: number,
    data: {
      minQuantity: number;
      maxQuantity: number;
      discount: number;
    }
  ) {
    return await httpClient.post(
      `/api/admin/product-varient/slabs/${variantId}`,
      data
    );
  }
}

export default VarientApi;
