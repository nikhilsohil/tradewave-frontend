import type { BaseResponse, Pagination } from "@/services/types/base";

export interface Group {
  id: number;
  name: string;
  discountRate: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupsResponse extends BaseResponse {
  data: Group[];
  pagination?: Pagination;
}

export interface CreateGroupResponse extends BaseResponse {
  data: Group;
}
