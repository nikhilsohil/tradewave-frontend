import httpClient from "@/services/config";
import type { BaseResponse } from "@/services/types/base";
import type { ProfileResponse, Tax } from "../types/setting";
export default class SettingAPI {
  static profile() {
    return httpClient.get<ProfileResponse>("/api/profile");
  }

  static updateProfile(payload: any) {
    return httpClient.put("/api/profile", payload);
  }

  static changePassword(payload: any) {
    return httpClient.post<BaseResponse>(
      "/api/profile/change-password",
      payload
    );
  }
  static update(id: number, payload: any) {
    return httpClient.put<BaseResponse>(`/api/brand/${id}`, payload);
  }
  static create(payload: any) {
    return httpClient.post(`/api/brand`, payload);
  }
  static delete(id: number) {
    return httpClient.post<BaseResponse>(`/api/brand/${id}`);
  }

  static getTax() {
    return httpClient.get<BaseResponse<Tax>>("/api/admin/system-info");
  }
  static updateTax(payload: any) {
    return httpClient.put<BaseResponse>("/api/admin/system-info", payload);
  }
}
