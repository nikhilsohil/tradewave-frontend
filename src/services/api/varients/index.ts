import type { AddProductVarient, ProductVarient } from "@/services/types/varient";

import httpClient from "../../config";
import type { BaseResponse } from "@/services/types/base";

const VarientApi = {
  addVarient: async (data: AddProductVarient) => {
    return await httpClient.post("/api/admin/product-varient", data);
  },
  getVariantsByProductId: async (productId: string|number) => {
    return await httpClient.get<BaseResponse<ProductVarient[]>>(`/api/admin/product/varient/${productId}`);
  },
  updateVarient: async (id: number, data: ProductVarient) => {
    return await httpClient.put(`/api/admin/product-varient/${id}`, data);
  },
  deleteVarient: async (id: number) => {
    return await httpClient.delete(`/api/admin/product-varient/${id}`);
  },
  addGroupDiscount: async (variantId: number, data: { retailerGroupId: number; discount: number }) => {
    return await httpClient.post(`/api/admin/product-varient/${variantId}/group-discount`, data);
  },
};

export default VarientApi;
