// types/auth.ts
export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  userType: number;
  isActive: boolean;
  token: string;
}

export interface LoginData {
  user: User;
}

export interface LoginResponse extends BaseResponse {
  data: LoginData;
}

export interface LoginPayload {
  email: string;
  password: string;
}