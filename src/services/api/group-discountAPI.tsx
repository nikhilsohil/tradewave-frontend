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
  elegibleForCredit: boolean;

  discount: string; // Prisma Decimal usually comes as string
  retailerGroup: any;
  createdAt: string; // could be Date if you parse
  updatedAt: string; // could be Date if you parse
};
export default class GroupDiscountAPi {
  static getAll(variantId: number | string) {
    return httpClient.get<BaseResponse<DiscountSlab[]>>(
      `/api/admin/product-varient/group-discounts/${variantId}`
    );
  }
  static get(payload: any) {
    return httpClient.get<SubCategoriesResponse>(
      "/api/group-discounts",
      payload
    );
  }

  static create(variantId: number | string, payload: any) {
    return httpClient.post<CreateResponce>(
      `/api/admin/product-varient/group-discounts/${variantId}`,
      payload
    );
  }

  static update(id: number | string, payload: any) {
    return httpClient.put(`/api/admin/group-discounts/${id}`, payload);
  }

  static delete(id: number) {
    return httpClient.delete<BaseResponse>(`/api/admin/group-discounts/${id}`);
  }
}