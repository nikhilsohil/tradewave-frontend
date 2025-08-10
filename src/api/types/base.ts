export interface BaseResponse {
    success: boolean;
    message: string;
}

export interface Pagination {
    page: number
    perPage: number
    total: number
    totalPage: number
}