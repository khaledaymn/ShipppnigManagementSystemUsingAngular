import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICityGetAllData } from '../models/icity-get-all-data';
import { IBranch } from '../models/ibranch';
import { IBranchParams } from '../models/ibranch-params';
import { ICityData } from '../models/icity-data';
import { ICityToSelectIdForBranch } from '../models/icity-to-select-id-for-branch';
import { IGovGetAllData } from '../models/igov-get-all-data';



@Injectable({
  providedIn: 'root'
})
export class CityService {
  constructor(private http:HttpClient) { }
  GetAll(param:IBranchParams):Observable<ICityGetAllData>{
    let httpParams = new HttpParams().set('PageSize',param.pageSize).set('PageIndex',param.pageIndex)
    return this.http.get<ICityGetAllData>("https://shippingmanagementsystem.runasp.net/Cities/GetAll",{params:httpParams})
  }
  GetById(id:number):Observable<ICityData>{
    return this.http.get<ICityData>(`https://shippingmanagementsystem.runasp.net/Cities/GetCityById/${id}`)
  }
  DeleteCity(id:number){
    return this.http.delete(`https://shippingmanagementsystem.runasp.net/Cities/DeleteCity/${id}`, { responseType: 'text' })
  }
  UpdateCity(city:ICityData):Observable<ICityData>{         
    return this.http.put<ICityData>(`https://shippingmanagementsystem.runasp.net/Cities/Edit`,city)
  }
  AddCity(city:ICityData){
    return this.http.post("https://shippingmanagementsystem.runasp.net/Cities/CreateCity",city,{responseType:'text'})
  }
  GetAllGov():Observable<IGovGetAllData>{
    return this.http.get<IGovGetAllData>("https://shippingmanagementsystem.runasp.net/Governorates/GetAll")
  }
}
