import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  searchQuery = ""
  notificationCount = 2

  search(): void {
    console.log("Searching for:", this.searchQuery)
    // Implement your search logic here
  }
}
