import { Component, Input, OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SidebarService } from "../../core/services/sidebar.service"
import { AuthService } from "../../core/services/auth.service"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() userName = "User Name"
  @Input() userRole = "User"

  isCollapsed = false
  showLogoutConfirm = false
  private subscriptions: Subscription[] = []

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const sidebarSub = this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isCollapsed = isCollapsed
    })
    this.subscriptions.push(sidebarSub)

    // Get user data if not provided via inputs
    if (this.userName === "User Name") {
      const userSub = this.authService.currentUser$.subscribe((user) => {
        if (user) {
          this.userName = `${user.firstName} ${user.lastName}`
          this.userRole = user.roleId.charAt(0).toUpperCase() + user.roleId.slice(1)
        }
      })
      this.subscriptions.push(userSub)
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed
    this.sidebarService.setSidebarState(this.isCollapsed)
  }

  confirmLogout(): void {
    this.showLogoutConfirm = true
  }

  cancelLogout(): void {
    this.showLogoutConfirm = false
  }

  logout(): void {
    this.showLogoutConfirm = false
    this.authService.logout()
    this.router.navigate(["/auth/login"])
  }
}
