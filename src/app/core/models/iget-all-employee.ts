import { IBranch } from "./ibranch"

export interface IGetAllEmployee {
    id:string
    name: string,
    email: string,
    phoneNumber: string,
    branches: IBranch[],
    creationDate:Date
    permission: string,
    isDeleted: boolean
}
