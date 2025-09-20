import httpClient from "@/services/config";
import type {
  CreateResponce,
  SubCategoriesResponse,
} from "@/services/types/sub-categories";
import type { BaseResponse } from "@/services/types/base";
import type { SecondSubCategoriesResponse } from "../types/sec-sub-categories";

type DiscountSlab = {
  id: number;
  productVarientsId: number;
  minQuantity: number;
  maxQuantity: number;
  discount: string; // Prisma Decimal usually comes as string
  createdAt: string; // could be Date if you parse
  updatedAt: string; // could be Date if you parse
};
export default class SlabDiscountAPI {
  static getAll(variantId: number | string) {
    return httpClient.get<BaseResponse<DiscountSlab[]>>(
      `/api/admin/product-varient/slabs/${variantId}`
    );
  }
  static get(payload: any) {
    return httpClient.get<SubCategoriesResponse>("/api/subcategory", payload);
  }

  static create(payload: any) {
    return httpClient.post<CreateResponce>(`/api/subcategory`, payload);
  }

  static update(id: number | string, payload: any) {
    return httpClient.put(`/api/admin/discount-slabs/${id}`, payload);
  }

  static delete(id: number) {
    return httpClient.delete<BaseResponse>(`/api/admin/discount-slabs/${id}`);
  }
}
