import httpClient from "../config";

interface Staff {
    id: number;
    userId: number;
    name: string;
    gender: string;
    govtId: string;
    email: string;
    mobile: string;
    careOf: string;
    alternateMobile: string;
    employeePhoto: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}
export default class staffApi {
    static async getStaff(payload: any) {
        return httpClient.post<>('/api/admin/staff',payload)
    }
}