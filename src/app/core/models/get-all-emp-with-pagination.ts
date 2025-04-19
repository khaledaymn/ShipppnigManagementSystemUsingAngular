import { IGetAllEmployee } from "./iget-all-employee";

export interface GetAllEmpWithPagination {
    pageSize: number,
    pageIndex: number,
    totalCount: number,
    data:IGetAllEmployee[]
}
