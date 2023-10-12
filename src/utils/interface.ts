export interface LoginParams {
    username: string,
    password: string
}

export interface LoginResponse {
    username: string,
    token: string
}

export interface ProjectIdParams {
    project_id: string
}

export interface ProjectInfoResponse {
    project_id: string,
    project_name: string,
    description: string
}

export interface ProjectInfoParams {
    project_id: string,
    project_name: string,
    description: string
}

export interface DataParams {
    project: string,
    page_size: number,
    current_page: number,
}

export interface DataResults {
    project: string,
    user_id: string,
    answer: {
        [key: string]: string
    },
    ip: string,
    time: string
}

export interface DataResponse {
    count: number,
    next: string | null,
    previous: string | null,
    results: {
        project: string,
        user_id: string,
        answer: {
            [key: string]: string
        },
        ip: string,
        time: string
    }[],
    total: number
}

