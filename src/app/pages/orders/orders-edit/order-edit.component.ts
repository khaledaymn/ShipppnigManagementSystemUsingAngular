import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms"
import { OrderService } from "../../../core/services/order.service"
import { OrderType, PaymentType, OrderCreateRequest, Order } from "../../../core/models/order.model"

@Component({
  selector: "app-order-edit",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./order-edit.component.html",
  styleUrls: ["./order-edit.component.css"],
})
export class OrderEditComponent implements OnInit {
  orderForm: FormGroup
  loading = false
  submitting = false
  errorMessage = ""
  orderId = 0
  order: Order | null = null

  // Lookup data
  cities: any[] | undefined = []
  branches: any[] | undefined = []
  chargeTypes: any[] | undefined = []
  merchants: any[] | undefined = []

  // Enums for dropdowns
  orderTypes = Object.values(OrderType)
  paymentTypes = Object.values(PaymentType)

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.orderForm = this.fb.group({
      customerName: ["", [Validators.required]],
      customerPhone1: ["", [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]],
      customerPhone2: ["", [Validators.pattern(/^01[0-9]{9}$/)]],
      villageAndStreet: ["", [Validators.required]],
      notes: [""],
      orderPrice: [0, [Validators.required, Validators.min(0)]],
      shippingToVillage: [false],
      cityId: [null, [Validators.required]],
      chargeTypeId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      merchantId: [null, [Validators.required]],
      orderType: [OrderType.DeliveryAtBranch, [Validators.required]],
      paymentType: [PaymentType.CashOnDelivery, [Validators.required]],
      products: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = +params["id"]
      this.loadOrderDetails()
    })

    this.loadLookupData()
  }

  loadOrderDetails(): void {
    this.loading = true
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data
        this.populateForm(data)
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading order details", error)
        this.errorMessage = "Failed to load order details"
        this.loading = false
      },
    })
  }

  loadLookupData(): void {
    Promise.all([
      this.orderService.getCities().toPromise(),
      this.orderService.getBranches().toPromise(),
      this.orderService.getChargeTypes().toPromise(),
      this.orderService.getMerchants().toPromise(),
    ])
      .then(([cities, branches, chargeTypes, merchants]) => {
        this.cities = cities
        this.branches = branches
        this.chargeTypes = chargeTypes
        this.merchants = merchants
      })
      .catch((error) => {
        console.error("Error loading lookup data", error)
        this.errorMessage = "Failed to load necessary data. Please try again."
      })
  }

  populateForm(order: Order): void {
    // Clear existing products
    while (this.productsFormArray.length) {
      this.productsFormArray.removeAt(0)
    }

    // Add products from order
    order.products.forEach((product) => {
      this.productsFormArray.push(
        this.fb.group({
          id: [product.id],
          name: [product.name, [Validators.required]],
          weight: [product.weight, [Validators.required, Validators.min(0.1)]],
          quantity: [product.quantity, [Validators.required, Validators.min(1)]],
          orderId: [product.orderId],
        }),
      )
    })

    // Set form values
    this.orderForm.patchValue({
      customerName: order.customerName,
      customerPhone1: order.customerPhone1,
      customerPhone2: order.customerPhone2 || "",
      villageAndStreet: order.villageAndStreet,
      notes: order.notes || "",
      orderPrice: order.orderPrice,
      shippingToVillage: order.shippingToVillage,
      cityId: order.cityId,
      chargeTypeId: order.chargeTypeId,
      branchId: order.branchId,
      merchantId: order.merchantId,
      orderType: order.orderType,
      paymentType: order.paymentType,
    })
  }

  get productsFormArray(): FormArray {
    return this.orderForm.get("products") as FormArray
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required]],
      weight: [1, [Validators.required, Validators.min(0.1)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    })
  }

  addProduct(): void {
    this.productsFormArray.push(this.createProductFormGroup())
  }

  removeProduct(index: number): void {
    if (this.productsFormArray.length > 1) {
      this.productsFormArray.removeAt(index)
    }
  }

  calculateTotalWeight(): number {
    return this.productsFormArray.controls.reduce((total, control) => {
      const weight = control.get("weight")?.value || 0
      const quantity = control.get("quantity")?.value || 0
      return total + weight * quantity
    }, 0)
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.orderForm)
      return
    }

    this.submitting = true
    this.errorMessage = ""

    const orderData: OrderCreateRequest = this.orderForm.value

    this.orderService.updateOrder(this.orderId, orderData).subscribe({
      next: () => {
        this.submitting = false
        alert("Order updated successfully!")
        this.router.navigate(["/orders", this.orderId])
      },
      error: (error) => {
        console.error("Error updating order", error)
        this.errorMessage = error.message || "Failed to update order. Please try again."
        this.submitting = false
      },
    })
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control)
      } else if (control instanceof FormArray) {
        control.controls.forEach((c) => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c)
          } else {
            c.markAsTouched()
          }
        })
      }
    })
  }

  cancel(): void {
    this.router.navigate(["/orders", this.orderId])
  }
}
