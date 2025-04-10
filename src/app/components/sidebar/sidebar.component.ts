import { Component, Input, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { SidebarService } from "../../core/services/sidebar.service"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  @Input() userName : string = "User Name"
  @Input() userRole = "User"

  isCollapsed = false

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isCollapsed = isCollapsed
    })
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed
    this.sidebarService.setSidebarState(this.isCollapsed)
  }
}
