export type ProjectInfo = {
    project_id: string,
    project_name: string,
    description: string,
}

export type DataInfo = {
    project: string,
    user_id: string,
    ip: string,
    time: string,
    [key: string]: string
}
