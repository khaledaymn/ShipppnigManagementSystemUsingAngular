export interface ICityData {
    id?: number,
    name: string,
    chargePrice: number,
    pickUpPrice: number,
    governorateId: number,
    governorateName?:string,
    isDeleted?: boolean 
}