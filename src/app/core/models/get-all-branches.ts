import { IBranch } from "./ibranch";

export interface GetAllBranches {
  pageSize: number,
  pageIndex: number,
  totalCount: number,
  data:IBranch[]
}
