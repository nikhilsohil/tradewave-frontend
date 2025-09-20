import type { BaseResponse } from "@/services/types/base";

export interface ProfileResponse extends BaseResponse {
  data: Profile;
}
export interface Profile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  image: string;
  userType: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  retailer: any;
  staff: any;
}

export interface Tax {
  id: number;
  igst: number;
  cgst: number;
  sgst: number;
}
