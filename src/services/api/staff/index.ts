import httpClient from "../../config";
import type { staffResponse } from "@/services/types/staff";

export default class staffApi {
  static getStaff(payload: any) {
    return httpClient.post<staffResponse>("/api/admin/staff", payload);
  }

  static getById(id: number) {
    return httpClient.get(`/api/admin/staff/${id}`);
  }

  static approve(id: number) {
    return httpClient.put(`/api/admin/staff/approve/${id}`);
  }
  static reject(id: number) {
    return httpClient.put(`/api/admin/staff/reject/${id}`);
  }

  
}
