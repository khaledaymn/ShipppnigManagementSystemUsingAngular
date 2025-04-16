import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBranchParams } from '../models/ibranch-params';
import { Observable, retry } from 'rxjs';
import { IBranch } from '../models/ibranch';
import { ICityToSelectIdForBranch } from '../models/icity-to-select-id-for-branch';

@Injectable({
  providedIn: 'root'
})
export class BranchServives {
  baseUrl = "http://localhost:5086/api/Branches"
  constructor(private http:HttpClient) { }
  GetAll(params:IBranchParams):Observable<IBranch[]>{
      let httpParams = new HttpParams()
      .set('pageSize',params.pageSize)
      .set('pageIndex',params.pageIndex)
      if(params.SearchByName){
        httpParams =  httpParams.set('SearchByName',params.SearchByName)
      }
      return  this.http.get<IBranch[]>(this.baseUrl,{params:httpParams});
  }
  DeleteBranch(id:number):Observable<IBranch>{
    return this.http.delete<IBranch>(`${this.baseUrl}/?id=${id}`);
  }
  AddBranch(branch:IBranch):Observable<IBranch>{
    return this.http.post<IBranch>(this.baseUrl,branch)
  }
  GetCity():Observable<ICityToSelectIdForBranch[]>{
    return this.http.get<ICityToSelectIdForBranch[]>("http://localhost:5086/api/Cities")
  }
  GetBranchById(id:number):Observable<IBranch>{
   return this.http.get<IBranch>(`${this.baseUrl}/${id}`)
  }
  UpdateBranch(id:number,branch:IBranch):Observable<IBranch>{
      return this.http.put<IBranch>(`${this.baseUrl}/${id}`,branch)
  }
  GetAllWithOutPagination():Observable<IBranch[]>{
    return this.http.get<IBranch[]>(`${this.baseUrl}/withOutPagination`)
  }
}
