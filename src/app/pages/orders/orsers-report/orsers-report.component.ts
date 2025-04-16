import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule } from "@angular/forms"
import  { OrderService } from "../../../core/services/order.service"
import {
   OrderType,
  OrderState,
  Order,
  PaymentType,
   OrderFilterParams,
} from "../../../core/models/order.model"
import { DatePipe } from "@angular/common"

@Component({
  selector: "app-orders-report",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./orsers-report.component.html",
  styleUrls: ["./orsers-report.component.css"],
  providers: [DatePipe],
})
export class OrdersReportComponent implements OnInit {
  orders: Order[] = []
  loading = false
  filterForm: FormGroup

  // Lookup data
  cities: any[] = []
  branches: any[] = []
  representatives: any[] = []
  merchants: any[] = []

  // Enums for dropdowns
  orderStates = Object.values(OrderState)
  orderTypes = Object.values(OrderType)
  paymentTypes = Object.values(PaymentType)

  // Report summary
  totalOrders = 0
  totalOrderValue = 0
  totalShippingValue = 0
  totalWeight = 0
  statusCounts: { [key: string]: number } = {}
  paymentTypeCounts: { [key: string]: number } = {}
  orderTypeCounts: { [key: string]: number } = {}
  cityCounts: { [key: string]: number } = {}
  branchCounts: { [key: string]: number } = {}

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.filterForm = this.fb.group({
      orderState: [""],
      orderType: [""],
      paymentType: [""],
      fromDate: [""],
      toDate: [""],
      merchantId: [""],
      branchId: [""],
      cityId: [""],
      representativeId: [""],
    })
  }

  ngOnInit(): void {
    this.loadLookupData()
    this.loadOrders()
  }

  loadLookupData(): void {
    this.orderService.getCities().subscribe((data) => (this.cities = data))
    this.orderService.getBranches().subscribe((data) => (this.branches = data))
    this.orderService.getRepresentatives().subscribe((data) => (this.representatives = data))
    this.orderService.getMerchants().subscribe((data) => (this.merchants = data))
  }

  loadOrders(): void {
    this.loading = true

    const filters: OrderFilterParams = {
      pageSize: 1000, // Get a large number of orders for reporting
      pageIndex: 1,
      ...this.filterForm.value,
    }

    // Remove empty filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof OrderFilterParams] === "" || filters[key as keyof OrderFilterParams] === null) {
        delete filters[key as keyof OrderFilterParams]
      }
    })

    this.orderService.getOrders(filters).subscribe({
      next: (response) => {
        this.orders = response.data
        this.generateReportSummary()
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading orders", error)
        this.loading = false
      },
    })
  }

  generateReportSummary(): void {
    // Reset counters
    this.totalOrders = this.orders.length
    this.totalOrderValue = 0
    this.totalShippingValue = 0
    this.totalWeight = 0
    this.statusCounts = {}
    this.paymentTypeCounts = {}
    this.orderTypeCounts = {}
    this.cityCounts = {}
    this.branchCounts = {}

    // Calculate totals and counts
    this.orders.forEach((order) => {
      this.totalOrderValue += order.orderPrice
      this.totalShippingValue += order.chargePrice
      this.totalWeight += order.totalWeight

      // Count by status
      this.statusCounts[order.orderState] = (this.statusCounts[order.orderState] || 0) + 1

      // Count by payment type
      this.paymentTypeCounts[order.paymentType] = (this.paymentTypeCounts[order.paymentType] || 0) + 1

      // Count by order type
      this.orderTypeCounts[order.orderType] = (this.orderTypeCounts[order.orderType] || 0) + 1

      // Count by city
      this.cityCounts[order.cityName] = (this.cityCounts[order.cityName] || 0) + 1

      // Count by branch
      this.branchCounts[order.branchName] = (this.branchCounts[order.branchName] || 0) + 1
    })
  }

  applyFilters(): void {
    this.loadOrders()
  }

  resetFilters(): void {
    this.filterForm.reset()
    this.loadOrders()
  }

  getStatusClass(status: string): string {
    switch (status) {
      case OrderState.Delivered:
        return "status-delivered"
      case OrderState.PartiallyDelivered:
        return "status-partially-delivered"
      case OrderState.Pendding:
      case OrderState.New:
        return "status-pending"
      case OrderState.DeliveredToTheRepresentative:
        return "status-in-transit"
      case OrderState.CannotBeReached:
      case OrderState.PostPoned:
        return "status-postponed"
      case OrderState.CanceledByCustomer:
      case OrderState.RejectedWithPayment:
      case OrderState.RejectedWithPartialPayment:
      case OrderState.RejectedWithoutPayment:
        return "status-rejected"
      default:
        return ""
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, "dd MMM, yyyy") || ""
  }

  exportToCsv(): void {
    if (this.orders.length === 0) return

    // Create CSV header
    const headers = [
      "Order ID",
      "Creation Date",
      "Customer Name",
      "Customer Phone",
      "City",
      "Address",
      "Status",
      "Order Type",
      "Payment Type",
      "Order Price",
      "Shipping Price",
      "Total Weight",
      "Branch",
      "Merchant",
    ]

    // Create CSV rows
    const rows = this.orders.map((order) => [
      order.id,
      this.formatDate(order.creationDate),
      order.customerName,
      order.customerPhone1,
      order.cityName,
      order.villageAndStreet,
      order.orderState,
      order.orderType,
      order.paymentType,
      order.orderPrice,
      order.chargePrice,
      order.totalWeight,
      order.branchName,
      order.merchantName,
    ])

    // Combine header and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `orders-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
