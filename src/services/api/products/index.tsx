import httpClient from "@/services/config";
import type { ProductResponse } from "@/services/types/products";

export default class ProductApi {
    static get(payload: any) {
        return httpClient.post<ProductResponse>('/api/products', payload)
    }

}