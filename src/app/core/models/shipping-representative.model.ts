export interface ShippingRepresentative {
    id?: string
    name: string
    email: string
    phoneNumber: string
    address: string
    password?: string
    branchIds: number[]
    governorateIds: number[]
    discountType: string
    companyPersentage: number
  }
  
  export interface Branch {
    id: number
    name: string
  }
  
  export interface Governorate {
    id: number
    name: string
  }
  
  export enum DiscountType {
    Percentage = "percentage",
    FixedAmount = "fixedamount",
  }
  