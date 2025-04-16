import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import {
  Order,
  OrdersResponse,
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderFilterParams,
  OrderProduct,
  OrderState,
} from "../models/order.model"
import { environment } from "../../../enviroments/environment.development"

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/Orders`

  constructor(private http: HttpClient) {}

  getOrders(params: OrderFilterParams = {}): Observable<OrdersResponse> {
    let httpParams = new HttpParams()

    Object.keys(params).forEach((key) => {
      if (params[key as keyof OrderFilterParams] !== undefined && params[key as keyof OrderFilterParams] !== null) {
        httpParams = httpParams.set(key, params[key as keyof OrderFilterParams]!.toString())
      }
    })

    return this.http.get<OrdersResponse>(`${this.apiUrl}/GetAll`, { params: httpParams })
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/GetById/${id}`)
  }

  getOrdersByStatus(status: OrderState): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/GetByStatus/${status}`)
  }

  getOrderByProductId(productId: number): Observable<OrderProduct[]> {
    return this.http.get<OrderProduct[]>(`${this.apiUrl}/GetProductByOrderId/${productId}`)
  }

  createOrder(order: OrderCreateRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/CreateOrder`, order)
  }

  updateOrderStatus(id: number, updateRequest: OrderUpdateRequest): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, updateRequest)
  }

  updateOrder(id: number, order: OrderCreateRequest): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/UpdateOrder/${id}`, order)
  }

  deleteOrder(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/DeleteOrder${id}`)
  }

  // Additional methods for lookup data
  getCities(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Cities/GetAll`)
  }

  getBranches(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Branches/GetAll`)
  }

  getChargeTypes(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ChargeTypes/GetAll`)
  }

  getRepresentatives(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/ShippingRepresentatives/GetAll`)
  }

  getMerchants(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/Merchant/Get`)
  }
}
