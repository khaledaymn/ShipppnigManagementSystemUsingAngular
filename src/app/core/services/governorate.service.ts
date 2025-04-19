import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../../enviroments/environment"
import { Governorate, GovernorateDTO, GovernorateParams, PaginationForCount } from "../models/governorate.model"
import { IGovGetAllData } from "../models/igov-get-all-data"
import { IGovData } from "../models/igov-data"

@Injectable({
  providedIn: "root",
})
export class GovernorateService {
  private baseUrl = `${environment.apiUrl}Governorates`    

  constructor(private http: HttpClient) {}

  getGovernorates(governorateParams: GovernorateParams): Observable<IGovGetAllData> {
    let params = new HttpParams()
      .set("pageSize", governorateParams.pageSize)
      .set("pageIndex", governorateParams.pageIndex)
    if (governorateParams.search) {
      params = params.set("Search", governorateParams.search)
    }
    if (governorateParams.sort) {
      params = params.set("sort", governorateParams.sort)
    }
    return this.http.get<IGovGetAllData>("https://shippingmanagementsystem.runasp.net/Governorates/GetAll", { params })
  }
  getGovernorateById(id: number): Observable<IGovData> {
    return this.http.get<IGovData>(`https://shippingmanagementsystem.runasp.net/Governorates/GetById/${id}`)
  }

  addGovernorate(governorate: IGovData) { 
    return this.http.post(`https://shippingmanagementsystem.runasp.net/Governorates/Create`, governorate,{responseType:'text'})
  }

  updateGovernorate(id: number, governorate: IGovData) {
    return this.http.put(`https://shippingmanagementsystem.runasp.net/Governorates/Update/${id}`, governorate,{responseType:'text'})
  } 
  deleteGovernorate(id: number){
    return this.http.delete(`https://shippingmanagementsystem.runasp.net/Governorates/Delete/${id}`,{responseType:'text'})
  }
}
