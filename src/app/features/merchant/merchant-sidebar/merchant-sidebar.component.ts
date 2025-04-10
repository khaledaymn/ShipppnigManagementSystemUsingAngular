import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { SidebarComponent } from "../../../components/sidebar/sidebar.component"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-merchant-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./merchant-sidebar.component.html",
  styleUrls: ["./merchant-sidebar.component.css"],
})
export class MerchantSidebarComponent {
  user: any

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user
    })
  }
}
