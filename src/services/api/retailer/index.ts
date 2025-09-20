import httpClient from "@/services/config";
import type { retailerResponse } from "@/services/types/retailer";

export default class RetailerApi {
  static get(payload: any) {
    return httpClient.post<retailerResponse>("/api/admin/retailers", payload);
  }

  static getById(id: number) {
    return httpClient.get(`/api/admin/retailers/${id}`);
  }

  static approve(id: number) {
    return httpClient.post(`/api/admin/retailers/approve/${id}`);
  }

  static reject(id: number) {
    return httpClient.post(`/api/admin/retailers/reject/${id}`);
  }
}
