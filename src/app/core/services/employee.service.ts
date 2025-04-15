import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBranchParams } from '../models/ibranch-params';
import { Observable, retry } from 'rxjs';
import { IGetAllEmployee } from '../models/iget-all-employee';
import { IAddEmployee } from '../models/iadd-employee';
import { ICityToSelectIdForBranch } from '../models/icity-to-select-id-for-branch';
import { IGroupPages } from '../models/igroup-pages';
import { IUpdateEmployee } from '../models/iupdate-employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  BaseUrl:string="http://localhost:5086/api/Employee"
  constructor(private http:HttpClient) { }
  GetAll(params:IBranchParams):Observable<IGetAllEmployee[]>{
    let httpParams = new HttpParams().
    set('PageSize',params.pageSize).set('PageIndex',params.pageIndex)
    if(params.SearchByName){
      httpParams = httpParams.set('SearchByName',params.SearchByName)
    }
    return this.http.get<IGetAllEmployee[]>(this.BaseUrl,{params:httpParams})
  }
  GetById(id:string):Observable<IUpdateEmployee>{
    return this.http.get<IUpdateEmployee>(`${this.BaseUrl}/${id}`)
  }
  DeleteEmployee(id:string):Observable<IGetAllEmployee>{
    return this.http.delete<IGetAllEmployee>(`${this.BaseUrl}?id=${id}`)
  }
  AddEmployee(emp:IAddEmployee):Observable<string>{
    return this.http.post<string>(this.BaseUrl,emp)
  } 
  UpdateEmployee(id:string,Emp:IUpdateEmployee):Observable<IUpdateEmployee>{
    return this.http.put<IUpdateEmployee>(`${this.BaseUrl}?id=${id}`,Emp);
  }
  GetAllGroup():Observable<IGroupPages>{
    return this.http.get<IGroupPages>("https://shippingmanagementsystem.runasp.net/Group/GetAll")
  }
}
