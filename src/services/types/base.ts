export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
