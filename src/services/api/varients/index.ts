import type { AddProductVarient } from "@/services/types/varient";

import httpClient from "../../config";

const VarientApi = {
  addVarient: async (data: AddProductVarient) => {
    return await httpClient.post("/api/admin/product-varient", data);
  },
  getVariantsByProductId: async (productId: number) => {
    return await httpClient.get(`/api/admin/product/varient/${productId}`);
  },
};

export default VarientApi;
