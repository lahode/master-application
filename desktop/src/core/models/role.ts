export interface Role {
    _id: string,
    name: string,
    owner: string,
    permissions: string[],
}
