import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { SidebarComponent } from "../../../components/sidebar/sidebar.component"
import { AuthService } from "../../../core/services/auth.service"
import { User } from "../../../core/models/user"

@Component({
  selector: "app-employee-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./employee-sidebar.component.html",
  styleUrls: ["./employee-sidebar.component.css"],
})
export class EmployeeSidebarComponent {
  user! : User | null
  username : any
  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user
    })
    // this.user = this.authService.mockUsers[1];
    this.username = this.user?.firstName;
  }
}
