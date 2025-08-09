import httpClient from "@/api/config";
import type { LoginPayload, LoginResponse } from "@/api/types/auth";

export default class AuthApi {

    static login(payload: LoginPayload) {
        return httpClient.post<LoginResponse>('/auth/login', payload)
    }
}