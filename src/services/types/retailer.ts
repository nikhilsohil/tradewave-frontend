import type { BaseResponse, Pagination } from "@/services/types/base";

export interface Retailer {
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface retailerResponse extends BaseResponse {
  data: {
    pagination: Pagination;
    retailers: Retailer[];
  };
}
