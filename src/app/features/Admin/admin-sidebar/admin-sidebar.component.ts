import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SidebarComponent } from "../../../components/sidebar/sidebar.component"
import { Router, RouterModule } from "@angular/router"


@Component({
  selector: "app-admin-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./admin-sidebar.component.html",
  styleUrls: ["./admin-sidebar.component.css"],
})
export class AdminSidebarComponent {
  user: any
  expandedSubmenu: string | null = null

  constructor(
    private router: Router,
  ) {

    this.user = {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin"
    }
  }

  toggleSubmenu(menu: string): void {
    if (this.expandedSubmenu === menu) {
      this.expandedSubmenu = null
    } else {
      this.expandedSubmenu = menu
    }
  }

  isSubmenuActive(menu: string): boolean {
    const url = this.router.url

    switch (menu) {
      case "settings":
        return url.includes("/admin/settings/")
      case "users":
        return url.includes("/admin/users/")
      case "places":
        return url.includes("/admin/places/")
      default:
        return false
    }
  }
}

