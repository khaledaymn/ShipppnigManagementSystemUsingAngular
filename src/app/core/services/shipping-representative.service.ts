import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"
import { ShippingRepresentative } from "../models/shipping-representative.model"
import { environment } from "../../../enviroments/environment"

@Injectable({
  providedIn: "root",
})
export class ShippingRepresentativeService {
  private baseUrl = environment.apiUrl

  constructor(private http: HttpClient) {}

  createShippingRepresentative(representative: ShippingRepresentative): Observable<any> {
    return this.http.post(`${this.baseUrl}ShippingRepresentatives/Create`, representative)
  }

  updateShippingRepresentative(representative: ShippingRepresentative): Observable<any> {
    return this.http.put(`${this.baseUrl}ShippingRepresentatives/Update`, representative)
  }

  deleteShippingRepresentative(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}ShippingRepresentatives/Delete/${id}`)
  }

  getShippingRepresentativeById(id: string): Observable<ShippingRepresentative> {
    return this.http.get<ShippingRepresentative>(`${this.baseUrl}ShippingRepresentatives/GetById/${id}`)
  }

  getAllShippingRepresentatives(): Observable<ShippingRepresentative[]> {
    return this.http.get<ShippingRepresentative[]>(`${this.baseUrl}ShippingRepresentatives/GetAll`)
  }
}
