export interface Governorate {
    id: number
    name: string
    isDeleted: boolean
  }
  
  export interface GovernorateDTO {
    id?: number
    name: string
    isDeleted?: boolean
  }
  
  export interface PaginationForCount<T> {
    pageSize: number
    pageIndex: number
    count: number
    data: T[]
  }
  
  export interface GovernorateParams {
    pageSize: number
    pageIndex: number
    search?: string
    sort?: string
  }
  