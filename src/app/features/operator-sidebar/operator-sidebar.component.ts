import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { SidebarComponent } from "../../components/sidebar/sidebar.component"

@Component({
  selector: "app-operator-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: "./operator-sidebar.component.html",
  styleUrls: ["./operator-sidebar.component.css"],
})
export class OperatorSidebarComponent {
  user: any = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",

  }

  
}
