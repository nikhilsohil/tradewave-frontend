import type { BaseResponse, Pagination } from "@/api/types/base";

export interface Staff {
    id: number;
    userId: number;
    name: string;
    gender: string;
    govtId: string;
    email: string;
    mobile: string;
    careof: string;
    alternateMobile: string;
    employeePhoto: string;
    isApproved: boolean;
    approvedBy: number;
    approvedAt: string; // ISO date string
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
}

export interface staffResponse extends BaseResponse {
    data: {
        pagination: Pagination
        staff: Staff[]
    }
}