import httpClient from "../../config";
import type { GroupsResponse } from "@/services/types/group";

export default class GroupAPI {
  static getAll() {
    return httpClient.get<GroupsResponse>("/api/admin/retailer-group");
  }
  static create(payload: any) {
    return httpClient.post("/api/admin/retailer-group", payload);
  }
  static update(id: number, payload: any) {
    return httpClient.put(`/api/admin/retailer-group/${id}`, payload);
  }
  static delete(id: number) {
    return httpClient.delete(`/api/admin/retailer-group/${id}`);
  }
}

