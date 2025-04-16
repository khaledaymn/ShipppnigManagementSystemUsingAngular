export interface Order {
  id: number
  creationDate: string
  customerName: string
  customerPhone1: string
  customerPhone2?: string
  villageAndStreet: string
  notes?: string
  chargePrice: number
  orderState: OrderState
  orderType: OrderType
  paymentType: PaymentType
  orderPrice: number
  totalWeight: number
  isDeleted: boolean
  shippingToVillage: boolean
  amountReceived: number
  cityId: number
  cityName: string
  chargeTypeId: number
  chargeTypeName: string
  branchId: number
  branchName: string
  merchantId: string
  merchantName: string
  shippigRepresentativeId?: string
  shippigRepresentativeName?: string
  products: OrderProduct[]
}

export interface OrderProduct {
  id: number
  name: string
  weight: number
  quantity: number
  orderId: number
}

export enum OrderState {
  New = "New",
  Pendding = "Pendding",
  DeliveredToTheRepresentative = "DeliveredToTheRepresentative",
  Delivered = "Delivered",
  CannotBeReached = "CannotBeReached",
  PostPoned = "PostPoned",
  PartiallyDelivered = "PartiallyDelivered",
  CanceledByCustomer = "CanceledByCustomer",
  RejectedWithPayment = "RejectedWithPayment",
  RejectedWithPartialPayment = "RejectedWithPartialPayment",
  RejectedWithoutPayment = "RejectedWithoutPayment",
}

export enum OrderType {
  DeliveryAtBranch = "DeliveryAtBranch",
  PickupFromTheMerchant = "PickupFromTheMerchant",
}

export enum PaymentType {
  CashOnDelivery = "CashOnDelivery",
  PaidInAdvance = "PaidInAdvance",
  ExchangeOrder = "ExchangeOrder",
}

export interface OrdersResponse {
  pageSize: number
  pageIndex: number
  totalCount: number
  data: Order[]
}

export interface OrderCreateRequest {
  customerName: string
  customerPhone1: string
  customerPhone2?: string
  villageAndStreet: string
  notes?: string
  orderPrice: number
  shippingToVillage: boolean
  cityId: number
  chargeTypeId: number
  branchId: number
  merchantId: string
  orderType: string
  paymentType: string
  products: OrderProductCreate[]
}

export interface OrderProductCreate {
  id?: number
  name: string
  weight: number
  quantity: number
  orderId?: number
}

export interface OrderUpdateRequest {
  orderState: OrderState
  shippigRepresentativeId?: string
  amountReceived?: number
  notes?: string
}

export interface OrderFilterParams {
  pageSize?: number
  pageIndex?: number
  orderState?: OrderState
  orderType?: OrderType
  paymentType?: PaymentType
  fromDate?: string
  toDate?: string
  merchantId?: string
  branchId?: number
  cityId?: number
  representativeId?: string
  searchTerm?: string
}

export interface City {
  id: number
  name: string
}

export interface Branch {
  id: number
  name: string
}

export interface ChargeType {
  id: number
  name: string
}

export interface Representative {
  id: string
  name: string
}

export interface Merchant {
  id: string
  name: string
}
