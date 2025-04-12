import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"

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
  currentSlide = 0
  slides = [
    {
      title: "Forgot Password?",
      description: "Don't worry, we'll help you recover your account access.",
    },
    {
      title: "Secure Recovery",
      description: "Our secure process ensures only you can reset your password.",
    },
    {
      title: "Quick & Easy",
      description: "Get back to managing your shipments in just a few minutes.",
    },
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
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

    // Simulate API call with timeout
    setTimeout(() => {
      const { email } = this.forgotPasswordForm.value

      // Static validation - in a real app this would be an API call
      if (
        email === "admin@example.com" ||
        email === "employee@example.com" ||
        email === "merchant@example.com" ||
        email === "sales@example.com"
      ) {
        this.successMessage = "Password reset instructions have been sent to your email."
        // In a real app, we would redirect after some time
        setTimeout(() => {
          this.router.navigate(["/auth/login"])
        }, 3000)
      } else {
        this.errorMessage = "Email not found in our records."
      }

      this.isLoading = false
    }, 1000)
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length
  }

  goToSlide(index: number): void {
    this.currentSlide = index
  }
}
