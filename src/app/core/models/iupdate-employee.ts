export interface IUpdateEmployee {
    name: string,
    userName: string,
    email: string,
    phoneNumber: string,
    branchIds:number[],
    groupId: number,  
    isDeleted?:boolean
}
