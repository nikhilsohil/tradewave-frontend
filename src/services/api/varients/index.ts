import type {
  AddProductVarient,
  ProductVarient,
} from "@/services/types/varient";

import httpClient from "../../config";
import type { BaseResponse } from "@/services/types/base";
import { add } from "date-fns";

type Varient = {
  id: number;
  productId: number;
  code: string;
  name: string;
  unit_discription: string;
  bulkPackType: string;
  unitsPerBulkPack: number;
  PurchasedFrom: string;
  sellerGST: string;
  PurchaseType: string;
  billNo: string;
  billDate: string; // or Date if you parse it
  mfgDate: string; // or Date
  expDate: string; // or Date
  purchasePriceWithGST: string; // looks like it's stored as string (Decimal)
  quantityPurchased: number;
  mrpWithGST: string; // also Decimal
  inStock: number;
  elegibleForCredit: boolean;
  elegibleForGoodWill: boolean;
  DiscountOnCOB: number;
  DiscountOnCOD: number;
  status: boolean;
  createdAt: string; // or Date
  updateAt: string; // or Date
  ProductDiscountByGroup: any[]; // replace `any` with correct relation type if needed
  productDiscountSlab: any[]; // same here
};

const VarientApi = {
  addVarient: async (data: AddProductVarient) => {
    return await httpClient.post("/api/admin/product-varient", data);
  },
  getVariantsByProductId: async (productId: string | number) => {
    return await httpClient.get<BaseResponse<ProductVarient[]>>(
      `/api/admin/product/varient/${productId}`
    );
  },
  getVariantById: async (variantId: string | number) => {
    return await httpClient.get<BaseResponse<Varient>>(
      `/api/admin/product-varient/get-by-id/${variantId}`
    );
  },
  updateVarient: async (
    id: number,
    data: Omit<ProductVarient, "id" | "code" | "createdAt" | "updateAt">
  ) => {
    return await httpClient.put(`/api/admin/product-varient/${id}`, data);
  },
  deleteVarient: async (id: number) => {
    return await httpClient.delete(`/api/admin/product-varient/${id}`);
  },
  addGroupDiscount: async (
    variantId: number,
    data: { retailerGroupId: number; discount: number }
  ) => {
    return await httpClient.post(
      `/api/admin/product-varient/${variantId}/group-discount`,
      data
    );
  },

  addSlabDiscount: async (
    variantId: number,
    data: {
      minQuantity: number;
      maxQuantity: number;
      discount: number;
    }
  ) => {
    return await httpClient.post(
      `/api/admin/product-varient/slabs/${variantId}`,
      data
    );
  },
};

export default VarientApi;
