import httpClient from "../../config";
import type { OrdersResponse } from "@/services/types/orders";

export default class ordersApi {
  static fetchOrders(payload: any) {
    return httpClient.post<OrdersResponse>("/api/order", payload);
  }
}
