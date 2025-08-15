
import httpClient from "@/services/config";
import type { LoginPayload, LoginResponse } from "@/services/types/auth";

export default class AuthApi {

    static login(payload: LoginPayload) {
        return httpClient.post<LoginResponse>('/auth/login', payload)
    }
}