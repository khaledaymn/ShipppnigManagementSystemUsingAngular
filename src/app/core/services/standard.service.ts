import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBranchParams } from '../models/ibranch-params';
import { Observable } from 'rxjs';
import { IStandrdData } from '../models/istandrd-data';

@Injectable({
  providedIn: 'root'
})
export class StandardService {

  constructor(private http:HttpClient) { } 
  GetStandard():Observable<IStandrdData[]>{
    return this.http.get<IStandrdData[]>("https://shippingmanagementsystem.runasp.net/Standard/GetAll")      
  }       
  Update(id:number,setting:IStandrdData){
    return this.http.put(`https://shippingmanagementsystem.runasp.net/Standard/Update/${id}`,setting,{responseType:'text'})
  }                                       
}
