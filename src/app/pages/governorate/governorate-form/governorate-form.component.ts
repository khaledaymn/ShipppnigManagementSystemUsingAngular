import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { GovernorateService } from "../../../core/services/governorate.service";
import { GovernorateDTO } from "../../../core/models/governorate.model";

@Component({
  selector: "app-governorate-form",
  templateUrl: "./governorate-form.component.html",
  styleUrls: ["./governorate-form.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class GovernorateFormComponent implements OnInit {
    governorateForm!: FormGroup;
  isEditMode = false
  governorateId!: number
  loading = false
  submitted = false
  errorMessage = ""

  constructor(
    private formBuilder: FormBuilder,
    private governorateService: GovernorateService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true
        this.governorateId = +params["id"]
        this.loadGovernorate(this.governorateId)
      }
    })
  }

  initForm(): void {
    this.governorateForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    })
  }

  loadGovernorate(id: number): void {
    this.loading = true
    this.governorateService.getGovernorateById(id).subscribe({
      next: (governorate) => {
        this.governorateForm.patchValue({
          name: governorate.name,
        })
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading governorate", error)
        this.errorMessage = "Failed to load governorate details."
        this.loading = false
      },
    })
  }

  onSubmit(): void {
    this.submitted = true

    if (this.governorateForm.invalid) {
      return
    }

    this.loading = true
    const governorateData: GovernorateDTO = {
      name: this.governorateForm.value.name,
    }

    if (this.isEditMode) {
      governorateData.id = this.governorateId
      this.governorateService.updateGovernorate(this.governorateId, governorateData).subscribe({
        next: () => {
          this.router.navigate(["/governorates"])
        },
        error: (error) => {
          console.error("Error updating governorate", error)
          this.errorMessage = "Failed to update governorate."
          this.loading = false
        },
      })
    } else {
      this.governorateService.addGovernorate(governorateData).subscribe({
        next: () => {
          this.router.navigate(["/governorates"])
        },
        error: (error) => {
          console.error("Error adding governorate", error)
          this.errorMessage = "Failed to add governorate."
          this.loading = false
        },
      })
    }
  }

  // Getter for easy access to form fields
  get f() {
    return this.governorateForm.controls
  }
}
