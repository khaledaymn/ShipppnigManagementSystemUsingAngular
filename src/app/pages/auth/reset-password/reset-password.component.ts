import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule, ActivatedRoute } from "@angular/router"

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup
  isLoading = false
  errorMessage = ""
  successMessage = ""
  token: string | null = null

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  ngOnInit(): void {
    // Get token from URL
    this.token = this.route.snapshot.queryParamMap.get("token")

    // In a real app, we would validate the token
    if (!this.token) {
      this.errorMessage = "Invalid or expired password reset link."
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (password !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return
    }

    this.isLoading = true
    this.errorMessage = ""
    this.successMessage = ""

    // Simulate API call with timeout
    setTimeout(() => {
      // Static validation - in a real app this would be an API call
      if (this.token) {
        this.successMessage = "Your password has been reset successfully."
        // In a real app, we would redirect after some time
        setTimeout(() => {
          this.router.navigate(["/auth/login"])
        }, 3000)
      } else {
        this.errorMessage = "Invalid or expired token. Please request a new password reset link."
      }

      this.isLoading = false
    }, 1000)
  }
}
