import { GovernorateModule } from './../../governorate/governorate.module';
import { Component,  OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { GovernorateService } from "../../../core/services/governorate.service"
import { Branch, DiscountType } from '../../../core/models/shipping-representative.model';
import { GovernorateDTO, GovernorateParams } from '../../../core/models/governorate.model';
import { ShippingRepresentativeService } from '../../../core/services/shipping-representative.service';
import { BranchServives } from '../../../core/services/branch-servives.service';
import { IBranch } from '../../../core/models/ibranch';

@Component({
  selector: "app-add-shipping-representative",
  templateUrl: "./add-shipping-representative.component.html",
  styleUrls: ["./add-shipping-representative.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddShippingRepresentativeComponent implements OnInit {
  representativeForm!: FormGroup
  branches: IBranch[] = []
  governorates: GovernorateDTO[] = []
  discountTypes = Object.values(DiscountType)
  loading = false
  submitted = false
  errorMessage = ""

  constructor(
    private formBuilder: FormBuilder,
    private representativeService: ShippingRepresentativeService,
    private branchService: BranchServives,
    private governorateService: GovernorateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.loadBranches()
    this.loadGovernorates()
  }

  initForm(): void {
    this.representativeForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required]],
      address: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      branchIds: [[], [Validators.required]],
      governorateIds: [[], [Validators.required]],
      discountType: [DiscountType.Percentage, [Validators.required]],
      companyPersentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    })
  }

  loadBranches(): void {
    this.branchService.GetAllWithOutPagination().subscribe({
      next: (branches) => {
        this.branches = branches
      },
      error: (error) => {
        console.error("Error loading branches", error)
        this.errorMessage = "Failed to load branches"
      },
    })
  }

  loadGovernorates(): void {

    const params: GovernorateParams = {
      pageSize: 100,
      pageIndex: 1
    };
    this.governorateService.getGovernorates(params).subscribe({
  next: (governorates) => {
    this.governorates = governorates.data;
  },
  error: (error) => {
    console.error("Error loading governorates", error);
    this.errorMessage = "Failed to load governorates";
  },
});
  }


  onSubmit(): void {
    this.submitted = true

    if (this.representativeForm.invalid) {
      return
    }

    this.loading = true

    this.representativeService.createShippingRepresentative(this.representativeForm.value).subscribe({
      next: () => {
        this.router.navigate(["/shipping-representatives"])
      },
      error: (error) => {
        console.error("Error creating shipping representative", error)
        this.errorMessage = error.error || "Failed to create shipping representative"
        this.loading = false
      },
    })
  }

  get f() {
    return this.representativeForm.controls
  }

  onBranchChange(event: any, branchId: number): void {
    const branchIds = (this.representativeForm.get("branchIds")?.value as number[]) || []

    if (event.target.checked) {
      branchIds.push(branchId)
    } else {
      const index = branchIds.indexOf(branchId)
      if (index !== -1) {
        branchIds.splice(index, 1)
      }
    }

    this.representativeForm.get("branchIds")?.setValue(branchIds)
  }


  onGovernorateChange(event: any, governorateId: number): void {
    const governorateIds = (this.representativeForm.get("governorateIds")?.value as number[]) || []

    if (event.target.checked) {
      governorateIds.push(governorateId)
    } else {
      const index = governorateIds.indexOf(governorateId)
      if (index !== -1) {
        governorateIds.splice(index, 1)
      }
    }

    this.representativeForm.get("governorateIds")?.setValue(governorateIds)
  }
}
