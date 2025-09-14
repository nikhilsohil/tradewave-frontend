import type { AddProductVarient } from "@/services/types/varient";

import httpClient from "../../config";

const VarientApi = {
  addVarient: async (data: AddProductVarient) => {
    return await httpClient.post("/api/admin/product-varient", data);
  },
};

export default VarientApi;
