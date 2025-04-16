import { Component, type OnInit } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { GovernorateDTO, GovernorateParams, PaginationForCount } from "../../../core/models/governorate.model";
import { GovernorateService } from "../../../core/services/governorate.service";
@Component({
  selector: "app-governorate-list",
  templateUrl: "./governorate-list.component.html",
  styleUrls: ["./governorate-list.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],

})
export class GovernorateListComponent implements OnInit {
  governorates!: PaginationForCount<GovernorateDTO> 
  totalCount = 0
  pageSize = 10
  pageIndex = 1
  searchTerm = ""
  sortOption = ""
  loading = false
  Math = Math;

  constructor(private governorateService: GovernorateService) {}

  ngOnInit(): void {
    this.loadGovernorates()
  }

  loadGovernorates(): void {
    this.loading = true
    const params: GovernorateParams = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      search: this.searchTerm,
      sort: this.sortOption,
    }

    this.governorateService.getGovernorates(params).subscribe({
      next: (response: PaginationForCount<GovernorateDTO>) => {
        console.log(response);
        
        this.governorates = response
        this.totalCount = response.count
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading governorates", error)
        this.loading = false
      },
    })
  }

  onPageChange(page: number): void {
    this.pageIndex = page
    this.loadGovernorates()
  }

  onSearch(): void {
    this.pageIndex = 1
    this.loadGovernorates()
  }

  onSort(sort: string): void {
    this.sortOption = sort
    this.loadGovernorates()
  }
  deleteGovernorate(id: number): void {
    if (confirm("Are you sure you want to delete this governorate?")) {
      this.governorateService.deleteGovernorate(id).subscribe({
        next: () => {
          this.loadGovernorates()
        },
        error: (error) => {
          console.error("Error deleting governorate", error)
        },
      });
    }
  }
}
