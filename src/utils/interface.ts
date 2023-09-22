
export interface ProjectInfoParams {
    project_id: string
}

export interface ProjectInfoResponse {
    project_id: string,
    project_name: string,
    description: string
}

export interface ProjectInfoPutParams {
    project_id: string,
    project_name: string,
    description: string
}

export interface DataParams {
    project: string,
    page_size: number,
    current_page: number,
}

export interface DataResponse {
    count: number,
    next: string | null,
    previous: string | null,
    results: Array<{
        project: string,
        user_id: string,
        answer: Array<{
            [key: string]: string
        }>,
        ip: string,
        time: string
    }>,
    total: number
}

