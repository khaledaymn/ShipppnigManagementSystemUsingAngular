import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"
import { Role } from "../../../core/models/role.enum"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  isLoading = false
  errorMessage = ""

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    })
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole(this.authService.getUserRole())
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return
    }

    this.isLoading = true
    this.errorMessage = ""

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.redirectBasedOnRole(user.roleId)
      },
      error: (error) => {
        this.errorMessage = error.message || "Login failed. Please try again."
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }

  private redirectBasedOnRole(role: string | null): void {
    if (!role) {
      this.router.navigate(["/dashboard"])
      return
    }

    switch (role) {
      case Role.ADMIN:
        this.router.navigate(["/admin/dashboard"])
        break
      case Role.EMPLOYEE:
        this.router.navigate(["/employee/dashboard"])
        break
      case Role.SALES_REPRESENTATIVE:
        this.router.navigate(["/sales/dashboard"])
        break
      case Role.MERCHANT:
        this.router.navigate(["/merchant/dashboard"])
        break
      default:
        this.router.navigate(["/dashboard"])
    }
  }
}
