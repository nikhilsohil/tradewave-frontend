import httpClient from "../../config";
import type { BaseResponse, Pagination } from "../../types/base";

interface Retailer {
    id: number;
    userId: number;
    entityName: string;
    entityType: string;
    govtId: string;
    email: string;
    mobile: string;
    contactPersonName: string;
    alternateMobile: string;
    shopAddress: string;
    shopPhoto: string;
    contactPersonPhoto: string;
    isApproved: boolean;
    approvedBy: number;
    approvedAt: string; // ISO date string
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
}



interface retailerResponse extends BaseResponse {
    data: {
        pagination: Pagination
        retailers: Retailer[]
    }
}
export default class RetailerApi {
    static get(payload: any) {
        return httpClient.post<retailerResponse>('/api/admin/retailers', payload)
    }

    static approve(id: number) {
        return httpClient.post(`/api/admin/approve/retailer/${id}`)
    }
}