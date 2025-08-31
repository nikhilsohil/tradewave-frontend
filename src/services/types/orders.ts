import type { BaseResponse, Pagination } from "@/services/types/base";

export interface Order {
  id: string; // changed from number → string to match API and table
  customer: string;
  email: string;
  status: "paid" | "pending" | "failed" | "refunded";
  total: number;
  date: string; // ISO date string
}

export interface OrdersResponse extends BaseResponse {
  data: Order[];
  pagination?: Pagination;
}

export interface CreateOrderResponse extends BaseResponse {
  data: Order;
}
