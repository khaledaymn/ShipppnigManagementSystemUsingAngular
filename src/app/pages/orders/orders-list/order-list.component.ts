import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms"
import { OrderService } from "../../../core/services/order.service"
import {
 Order,
  OrderState,
  OrderType,
  PaymentType,
 OrderFilterParams,
 OrderUpdateRequest,
} from "../../../core/models/order.model"
import { DatePipe } from "@angular/common"
import { debounceTime, distinctUntilChanged } from "rxjs/operators"

@Component({
  selector: "app-orders-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.css"],
  providers: [DatePipe],
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = []
  totalCount = 0
  pageSize = 10
  pageIndex = 1
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

  // For status update modal
  selectedOrder: Order | null = null
  showStatusModal = false
  statusUpdateForm: FormGroup

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [""],
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

    this.statusUpdateForm = this.fb.group({
      orderState: [""],
      shippigRepresentativeId: [""],
      amountReceived: [0],
      notes: [""],
    })
  }

  ngOnInit(): void {
    this.loadOrders()
    this.loadLookupData()

    // Add search debounce
    this.filterForm
      .get("searchTerm")
      ?.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 1
        this.loadOrders()
      })
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
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
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
        console.log(response);

        this.orders = response.data
        this.totalCount = response.totalCount
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading orders", error)
        this.loading = false
      },
    })
  }

  applyFilters(): void {
    this.pageIndex = 1
    this.loadOrders()
  }

  resetFilters(): void {
    this.filterForm.reset()
    this.pageIndex = 1
    this.loadOrders()
  }

  changePage(page: number): void {
    this.pageIndex = page
    this.loadOrders()
  }

  openStatusModal(order: Order): void {
    this.selectedOrder = order
    this.statusUpdateForm.patchValue({
      orderState: order.orderState,
      shippigRepresentativeId: order.shippigRepresentativeId || "",
      amountReceived: order.amountReceived,
      notes: order.notes || "",
    })
    this.showStatusModal = true
  }

  closeStatusModal(): void {
    this.showStatusModal = false
    this.selectedOrder = null
  }

  updateOrderStatus(): void {
    if (!this.selectedOrder) return

    const updateRequest: OrderUpdateRequest = {
      orderState: this.statusUpdateForm.value.orderState,
      shippigRepresentativeId: this.statusUpdateForm.value.shippigRepresentativeId || undefined,
      amountReceived: this.statusUpdateForm.value.amountReceived,
      notes: this.statusUpdateForm.value.notes,
    }

    this.orderService.updateOrderStatus(this.selectedOrder.id, updateRequest).subscribe({
      next: (response) => {
        this.closeStatusModal()
        this.loadOrders()
        // Show success message
        alert("Order status updated successfully")
      },
      error: (error) => {
        console.error("Error updating order status", error)
        // Show error message
        alert("Failed to update order status")
      },
    })
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
    return this.datePipe.transform(date, "dd MMM, hh:mm a") || ""
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize)
  }

  get pages(): number[] {
    const totalPages = this.totalPages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (this.pageIndex <= 3) {
      return [1, 2, 3, 4, 5]
    }

    if (this.pageIndex >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [this.pageIndex - 2, this.pageIndex - 1, this.pageIndex, this.pageIndex + 1, this.pageIndex + 2]
  }
}
