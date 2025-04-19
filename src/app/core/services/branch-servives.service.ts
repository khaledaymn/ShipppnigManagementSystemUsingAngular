import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBranchParams } from '../models/ibranch-params';
import { Observable, retry } from 'rxjs';
import { IBranch } from '../models/ibranch';
import { ICityToSelectIdForBranch } from '../models/icity-to-select-id-for-branch';
import { GetAllBranches } from '../models/get-all-branches';

@Injectable({
  providedIn: 'root'
})
export class BranchServives {
  baseUrl = "http://localhost:5086/api/Branches"
  constructor(private http:HttpClient) { }
  GetAll(params:IBranchParams):Observable<GetAllBranches>{
      let httpParams = new HttpParams()
      .set('pageSize',params.pageSize)
      .set('pageIndex',params.pageIndex)
      if(params.SearchByName){
        httpParams =  httpParams.set('Search',params.SearchByName)   
      }
      return  this.http.get<GetAllBranches>("https://shippingmanagementsystem.runasp.net/Branches/GetAll",{params:httpParams});
  }
  
  DeleteBranch(id:number){
    return this.http.delete(`https://shippingmanagementsystem.runasp.net/Branches/Delete/${id}`,{responseType:'text'});
  }
  AddBranch(branch:IBranch){
    return this.http.post("https://shippingmanagementsystem.runasp.net/Branches/Create",branch,{responseType:'text'})
  }

  // GetCity():Observable<ICityToSelectIdForBranch[]>{
  //   return this.http.get<ICityToSelectIdForBranch[]>("http://localhost:5086/api/Cities")
  // }
  GetBranchById(id:number):Observable<IBranch>{
   return this.http.get<IBranch>(`https://shippingmanagementsystem.runasp.net/Branches/GetById/${id}`)
  }
  UpdateBranch(id:number,branch:IBranch){
      return this.http.put(`https://shippingmanagementsystem.runasp.net/Branches/Update/${id}`,branch,{responseType:'text'})
  } 







  GetAllWithOutPagination():Observable<IBranch[]>{
    return this.http.get<IBranch[]>(`${this.baseUrl}/withOutPagination`)
  }
}
