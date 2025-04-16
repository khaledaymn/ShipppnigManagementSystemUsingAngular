import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { ForgotPasswordRequest } from "../../../core/models/user"

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup
  isLoading = false
  errorMessage = ""
  successMessage = ""

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    })
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return
    }

    this.isLoading = true
    this.errorMessage = ""
    this.successMessage = ""

    const request: ForgotPasswordRequest = {
      email: this.forgotPasswordForm.value.email,
    }

    this.authService.forgotPassword(request).subscribe({
      next: (response) => {
        this.successMessage = "Password reset instructions have been sent to your email."
        setTimeout(() => {
          this.router.navigate(["/auth/login"])
        }, 3000)
      },
      error: (error) => {
        this.errorMessage = error.message || "Failed to process your request. Please try again."
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }
}
