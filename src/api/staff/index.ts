import httpClient from "../config";
import type { staffResponse } from "@/api/types/staff";

export default class staffApi {
    static getStaff(payload: any) {
        return httpClient.post<staffResponse>('/api/admin/staff', payload)
    }

    static approve(id: number) {
        return httpClient.post(`/api/admin/approve/staff/${id}`)
    }
}