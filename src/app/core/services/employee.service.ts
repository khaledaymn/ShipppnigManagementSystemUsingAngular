import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBranchParams } from '../models/ibranch-params';
import { Observable, retry } from 'rxjs';
import { IGetAllEmployee } from '../models/iget-all-employee';
import { IAddEmployee } from '../models/iadd-employee';
import { ICityToSelectIdForBranch } from '../models/icity-to-select-id-for-branch';
import { IGroupPages } from '../models/igroup-pages';
import { IUpdateEmployee } from '../models/iupdate-employee';
import { GetAllEmpWithPagination } from '../models/get-all-emp-with-pagination';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  BaseUrl:string="http://localhost:5086/api/Employee"
  constructor(private http:HttpClient) { }
  GetAll(params:IBranchParams):Observable<GetAllEmpWithPagination>{
    let httpParams = new HttpParams().
    set('PageSize',params.pageSize).set('PageIndex',params.pageIndex)
    if(params.SearchByName){
      httpParams = httpParams.set('Search',params.SearchByName)
    }
    return this.http.get<GetAllEmpWithPagination>("https://shippingmanagementsystem.runasp.net/Employees/GetAll",{params:httpParams})
  }
  GetById(id:string):Observable<IGetAllEmployee>{
    return this.http.get<IGetAllEmployee>(`https://shippingmanagementsystem.runasp.net/Employees/GetById/${id}`)
  }
  DeleteEmployee(id:string):Observable<IGetAllEmployee>{
    return this.http.delete<IGetAllEmployee>(`https://shippingmanagementsystem.runasp.net/Employees/Delete/${id}`)
  }
  
  AddEmployee(emp:IAddEmployee):Observable<string>{
    return this.http.post<string>("https://shippingmanagementsystem.runasp.net/Employees/Add",emp)
  }
  UpdateEmployee(Emp:IAddEmployee):Observable<IAddEmployee>{
    return this.http.put<IAddEmployee>(`https://shippingmanagementsystem.runasp.net/Employees/Update`,Emp);
  } 
  GetAllGroup():Observable<IGroupPages>{
    return this.http.get<IGroupPages>("https://shippingmanagementsystem.runasp.net/Group/GetAll")
  }
}
