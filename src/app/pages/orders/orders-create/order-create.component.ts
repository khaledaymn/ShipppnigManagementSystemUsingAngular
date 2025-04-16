import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from "@angular/forms"
import { OrderService } from "../../../core/services/order.service"
import { OrderType, PaymentType, OrderCreateRequest } from "../../../core/models/order.model"

@Component({
  selector: "app-order-create",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./order-create.component.html",
  styleUrls: ["./order-create.component.css"],
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup
  loading = false
  submitting = false
  errorMessage = ""

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
      products: this.fb.array([this.createProductFormGroup()]),
    })
  }

  ngOnInit(): void {
    this.loadLookupData()
  }

  loadLookupData(): void {
    this.loading = true

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
        this.loading = false
      })
      .catch((error) => {
        console.error("Error loading lookup data", error)
        this.errorMessage = "Failed to load necessary data. Please try again."
        this.loading = false
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

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        this.submitting = false
        // Extract order ID from response message
        const orderId = response.match(/ID: (\d+)/)?.[1]

        if (orderId) {
          // Navigate to the order detail page
          this.router.navigate(["/orders", orderId])
        } else {
          // Navigate to orders list
          this.router.navigate(["/orders"])
        }

        // Show success message
        alert("Order created successfully!")
      },
      error: (error) => {
        console.error("Error creating order", error)
        this.errorMessage = error.message || "Failed to create order. Please try again."
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
    this.router.navigate(["/orders"])
  }
}
