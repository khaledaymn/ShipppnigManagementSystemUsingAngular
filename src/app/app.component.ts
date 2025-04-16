import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { HeaderComponent } from "./components/header/header.component"
import { EmployeeSidebarComponent } from "./features/employee/employee-sidebar/employee-sidebar.component"
import { MerchantSidebarComponent } from "./features/merchant/merchant-sidebar/merchant-sidebar.component"
import { SalesSidebarComponent } from "./features/sales-representative/sales-sidebar/sales-sidebar.component"
import { AuthService } from "./core/services/auth.service"
import { SidebarService } from "./core/services/sidebar.service"
import { Role } from "./core/models/role.enum"
import { AdminSidebarComponent } from "./features/Admin/admin-sidebar/admin-sidebar.component"
import { OperatorSidebarComponent } from "./features/operator-sidebar/operator-sidebar.component"
import { LoginComponent } from "./pages/auth/login/login.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    AdminSidebarComponent,
    EmployeeSidebarComponent,
    MerchantSidebarComponent,
    OperatorSidebarComponent,
    SalesSidebarComponent,
],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  isAuthenticated = false
  userRole: string | null = null
  isSidebarCollapsed = false

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService,
  ) {

  }
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user
      this.userRole = user?.roleId || null
      console.log(this.userRole);
      
    })
    
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed
    })

  }

  get isAdmin(): boolean {
    return this.userRole === Role.ADMIN
  }

  get isEmployee(): boolean {
    return this.userRole === Role.EMPLOYEE
  }

  get isSalesRep(): boolean {
    return this.userRole === Role.SALES_REPRESENTATIVE
  }

  get isMerchant(): boolean {
    return this.userRole === Role.MERCHANT
  }
}
