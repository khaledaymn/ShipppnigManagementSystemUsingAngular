import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, ActivatedRoute, Router } from "@angular/router"
import { OrderService } from "../../../core/services/order.service"
import { Order, OrderState, OrderUpdateRequest } from "../../../core/models/order.model"
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms"
import { DatePipe } from "@angular/common"

@Component({
  selector: "app-order-detail",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
  providers: [DatePipe],
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null
  loading = true
  orderId = 0
  representatives: any[] = []
  orderStates = Object.values(OrderState)
  statusUpdateForm: FormGroup
  showStatusModal = false

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.statusUpdateForm = this.fb.group({
      orderState: [""],
      shippigRepresentativeId: [""],
      amountReceived: [0],
      notes: [""],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = +params["id"]
      this.loadOrderDetails()
    })

    this.loadRepresentatives()
  }

  loadOrderDetails(): void {
    this.loading = true
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading order details", error)
        this.loading = false
      },
    })
  }

  loadRepresentatives(): void {
    this.orderService.getRepresentatives().subscribe((data) => {
      this.representatives = data
    })
  }

  openStatusModal(): void {
    if (!this.order) return

    this.statusUpdateForm.patchValue({
      orderState: this.order.orderState,
      shippigRepresentativeId: this.order.shippigRepresentativeId || "",
      amountReceived: this.order.amountReceived,
      notes: this.order.notes || "",
    })

    this.showStatusModal = true
  }

  closeStatusModal(): void {
    this.showStatusModal = false
  }

  updateOrderStatus(): void {
    if (!this.order) return

    const updateRequest: OrderUpdateRequest = {
      orderState: this.statusUpdateForm.value.orderState,
      shippigRepresentativeId: this.statusUpdateForm.value.shippigRepresentativeId || undefined,
      amountReceived: this.statusUpdateForm.value.amountReceived,
      notes: this.statusUpdateForm.value.notes,
    }

    this.orderService.updateOrderStatus(this.order.id, updateRequest).subscribe({
      next: (response) => {
        this.closeStatusModal()
        this.loadOrderDetails()
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
    return this.datePipe.transform(date, "dd MMM, yyyy hh:mm a") || ""
  }

  calculateTotal(): number {
    if (!this.order) return 0
    return this.order.orderPrice + this.order.chargePrice
  }

  goBack(): void {
    this.router.navigate(["/orders"])
  }
}
