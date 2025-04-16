import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMeduleGetAllData } from '../models/imedule-get-all-data';
import { IGroupPayload } from '../models/igroup-payload';

@Injectable({
  providedIn: 'root'
})
export class MeduleService {

  constructor(private http:HttpClient) { }
  GetAll():Observable<IMeduleGetAllData>{
    return this.http.get<IMeduleGetAllData>("https://shippingmanagementsystem.runasp.net/Medule/GetAll")
  }
  AddGroup(group:IGroupPayload){
    return this.http.post("https://shippingmanagementsystem.runasp.net/Group/Create",group)
  }
}
