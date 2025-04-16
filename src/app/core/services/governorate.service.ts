import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { environment } from "../../../enviroments/environment"
import { Governorate, GovernorateDTO, GovernorateParams, PaginationForCount } from "../models/governorate.model"

@Injectable({
  providedIn: "root",
})
export class GovernorateService {
  private baseUrl = `${environment.apiUrl}Governorates`

  constructor(private http: HttpClient) {}

  getGovernorates(governorateParams: GovernorateParams): Observable<PaginationForCount<GovernorateDTO>> {
    let params = new HttpParams()
      .set("pageSize", governorateParams.pageSize.toString())
      .set("pageIndex", governorateParams.pageIndex.toString())

    if (governorateParams.search) {
      params = params.set("search", governorateParams.search)
    }

    if (governorateParams.sort) {
      params = params.set("sort", governorateParams.sort)
    }

    return this.http.get<PaginationForCount<GovernorateDTO>>(this.baseUrl + '/GetAll', { params })
  }
 
  getGovernorateById(id: number): Observable<Governorate> {
    return this.http.get<Governorate>(`${this.baseUrl}/GetById/${id}`)
  }

  addGovernorate(governorate: GovernorateDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/Create`, governorate)
  }

  updateGovernorate(id: number, governorate: GovernorateDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/Update/${id}`, governorate)
  }

  deleteGovernorate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Delete/${id}`)
  }
}
