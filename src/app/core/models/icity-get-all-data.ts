import { ICityData } from "./icity-data";

export interface ICityGetAllData {
  pageSize: number,
  pageIndex: number,
  totalCount: number,
  data: ICityData[]
}
