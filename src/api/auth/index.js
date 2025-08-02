import axiosInstance from "../config";

const authAPI = {
    login: (payload) => axiosInstance.post('/auth/login', payload)
}