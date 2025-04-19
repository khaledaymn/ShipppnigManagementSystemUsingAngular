export interface IAddEmployee {
    id ?:number
    name: string,
    email: string,
    phoneNumber: string,
    address: string,
    branchIds:number[],
    groupId: number,
    password ?: string       
}
