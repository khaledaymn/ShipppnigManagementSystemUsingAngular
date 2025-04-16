import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGroupPages } from '../models/igroup-pages';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  
  constructor(private http:HttpClient) { }
  GetAll():Observable<IGroupPages>{
    return this.http.get<IGroupPages>("https://shippingmanagementsystem.runasp.net/Group/GetAll")
  }
}
