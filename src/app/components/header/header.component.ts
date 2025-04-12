import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  searchQuery = ""
  notificationCount = 3
  userName = ""
  userRole = ""
  showLogoutConfirm = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`
        this.userRole = user.roleId
      }
    })
  }

  search(): void {
    console.log("Searching for:", this.searchQuery)
    // Implement your search logic here
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
