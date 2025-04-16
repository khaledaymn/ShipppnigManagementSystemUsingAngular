import { IMeduleData } from "./imedule-data";

export interface IMeduleGetAllData {
    pageSize: number,
    pageIndex: number,
    totalCount: number,
    data:IMeduleData[]
}
