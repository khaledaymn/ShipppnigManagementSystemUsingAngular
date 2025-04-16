import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { OrderService } from "../../../core/services/order.service"
import { Order, OrderState } from "../../../core/models/order.model"
import { DatePipe } from "@angular/common"

@Component({
  selector: "app-orders-by-status",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./orders-by-status.component.html",
  styleUrls: ["./orders-by-status.component.css"],
  providers: [DatePipe],
})
export class OrdersByStatusComponent implements OnInit {
  orders: Order[] = []
  loading = false
  selectedStatus: OrderState = OrderState.New
  orderStates = Object.values(OrderState)

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.loadOrdersByStatus()
  }

  loadOrdersByStatus(): void {
    this.loading = true
    this.orderService.getOrdersByStatus(this.selectedStatus).subscribe({
      next: (data) => {
        this.orders = data
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading orders by status", error)
        this.loading = false
      },
    })
  }

  onStatusChange(): void {
    this.loadOrdersByStatus()
  }

  deleteOrder(id: number): void {
    if (confirm("Are you sure you want to delete this order?")) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter((order) => order.id !== id)
          alert("Order deleted successfully")
        },
        error: (error) => {
          console.error("Error deleting order", error)
          alert("Failed to delete order")
        },
      })
    }
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
}
