import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { ShippingRepresentativeService } from "../../../core/services/shipping-representative.service"

@Component({
  selector: "app-shipping-representative-list",
  templateUrl: "./shipping-representative-list.component.html",
  styleUrls: ["./shipping-representative-list.component.css"],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class ShippingRepresentativeListComponent implements OnInit {
  representatives: any[] = []
  filteredRepresentatives: any[] = []
  loading = false
  errorMessage = ""
  searchTerm = ""
  entriesPerPage = 10

  constructor(private representativeService: ShippingRepresentativeService) {}

  ngOnInit(): void {
    this.loadRepresentatives()
  }

  loadRepresentatives(): void {
    this.loading = true
    this.representativeService.getAllShippingRepresentatives().subscribe({
      next: (data) => {
        console.log(data);
        
        this.representatives = data
        this.filteredRepresentatives = [...data]
        this.loading = true
      },
      error: (error) => {
        console.error("Error loading representatives", error)
        this.errorMessage = "  Failed to load ShippingRepresentatives data"
        this.loading = false
      },
    })
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRepresentatives = [...this.representatives]
      return
    }

    const term = this.searchTerm.toLowerCase().trim()
    this.filteredRepresentatives = this.representatives.filter(
      (rep) =>
        rep.name.toLowerCase().includes(term) ||
        rep.email.toLowerCase().includes(term) ||
        rep.phoneNumber.includes(term),
    )
  }

  updateStatus(representative: any, event: any): void {
    const isActive = event.target.checked

    // هنا يمكن إضافة منطق لتحديث حالة المندوب في الباك إند
    // على سبيل المثال:
    // this.representativeService.updateStatus(representative.id, isActive).subscribe(...)

    console.log(`Change ShippingRepresentatives status${representative.name} To ${isActive ? "Active" : "inactive"}`)
  }

  deleteRepresentative(id: string): void {
    if (confirm("Are you sure you want to delete this ShippingRepresentatives?")) {
      this.representativeService.deleteShippingRepresentative(id).subscribe({
        next: () => {
          this.loadRepresentatives()
        },
        error: (error) => {
          console.error("Error deleting representative", error)
          this.errorMessage = "Failed to delete ShippingRepresentatives"
        },
      })
    }
  }

  onEntriesPerPageChange(event: any): void {
    this.entriesPerPage = Number.parseInt(event.target.value)
  }
}
