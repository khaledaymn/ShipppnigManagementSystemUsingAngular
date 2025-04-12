import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"

@Component({
  selector: "app-unauthorized",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./unauthorized.component.html",
  styleUrls: ["./unauthorized.component.css"],
})
export class UnauthorizedComponent {
  constructor(private authService: AuthService) {}

  get userRole(): string | null {
    return this.authService.getUserRole()
  }

  get dashboardLink(): string {
    const role = this.userRole
    if (!role) return "/dashboard"

    return `/${role}/dashboard`
  }
}
