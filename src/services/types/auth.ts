// types/auth.ts

import type { BaseResponse } from "@/api/types/base";



export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  userType: number;
  isActive: boolean;
}

export interface LoginData {
  user: User;
  token: string;
}

export interface LoginResponse extends BaseResponse {
  data: LoginData;
}

export interface LoginPayload {
  email: string;
  password: string;
}