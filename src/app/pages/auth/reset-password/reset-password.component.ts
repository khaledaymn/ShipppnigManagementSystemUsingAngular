import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule, ActivatedRoute } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { ResetPasswordRequest } from "../../../core/models/user"

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
  email: string | null = null
  slides = [
    {
      title: "Reset Your Password",
      description: "Create a new secure password for your account.",
    },
    {
      title: "Stay Secure",
      description: "Use a strong password that you don't use elsewhere.",
    },
    {
      title: "Almost Done",
      description: "After resetting, you'll be able to log in with your new password.",
    },
  ]
  currentSlide = 0

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
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
    // Get token and email from URL
    this.token = this.route.snapshot.queryParamMap.get("token")
    this.email = this.route.snapshot.queryParamMap.get("email")

    // In a real app, we would validate the token
    if (!this.token || !this.email) {
      this.errorMessage = "Invalid or expired password reset link."
    }

    // Start slide rotation
    this.startSlideRotation()
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
    if (this.resetPasswordForm.invalid || !this.token || !this.email) {
      return
    }

    this.isLoading = true
    this.errorMessage = ""
    this.successMessage = ""

    const request: ResetPasswordRequest = {
      password: this.resetPasswordForm.value.password,
      email: this.email,
      token: this.token,
    }

    this.authService.resetPassword(request).subscribe({
      next: (response) => {
        this.successMessage = "Your password has been reset successfully."
        setTimeout(() => {
          this.router.navigate(["/auth/login"])
        }, 3000)
      },
      error: (error) => {
        this.errorMessage = error.message || "Failed to reset password. Please try again."
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }

  goToSlide(index: number): void {
    this.currentSlide = index
  }

  private startSlideRotation(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    }, 5000)
  }
}
