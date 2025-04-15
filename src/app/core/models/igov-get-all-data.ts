import { IGovData } from "./igov-data";

export interface IGovGetAllData {
      pageSize: number,
      pageIndex: number,
      totalCount: number,
      data: IGovData[]
}
