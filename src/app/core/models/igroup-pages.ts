import { IGroup } from "./igroup";

export interface IGroupPages {
    pageSize: number,
    pageIndex: number,
    totalCount: number,
    data:IGroup[]
}
