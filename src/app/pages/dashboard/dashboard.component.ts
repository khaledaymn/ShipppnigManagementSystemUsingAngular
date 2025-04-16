import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"

interface StatusCard {
  title: string
  count: number
  icon: string
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  statusCards: StatusCard[] = [
    {
      title: "New",
      count: 124,
      icon: "bi-plus-circle-fill",
    },
    {
      title: "Pending",
      count: 85,
      icon: "bi-hourglass-top",
    },
    {
      title: "Assigned to Delivery Agent",
      count: 67,
      icon: "bi-truck",
    },
    {
      title: "Delivered to Customer",
      count: 203,
      icon: "bi-check-circle-fill",
    },
    {
      title: "Unreachable",
      count: 18,
      icon: "bi-telephone-x-fill",
    },
    {
      title: "Postponed",
      count: 32,
      icon: "bi-calendar-plus",
    },
    {
      title: "Partially Delivered",
      count: 45,
      icon: "bi-box",
    },
    {
      title: "Canceled by Recipient",
      count: 29,
      icon: "bi-x-circle-fill",
    },
    {
      title: "Rejected with Full Payment",
      count: 12,
      icon: "bi-cash-coin",
    },
    {
      title: "Rejected with Partial Payment",
      count: 8,
      icon: "bi-cash",
    },
    {
      title: "Rejected with No Payment",
      count: 15,
      icon: "bi-cash-slash",
    },
  ]

  constructor() {}

  ngOnInit(): void {
    // You would typically fetch real data here
    this.loadDashboardData()
  }

  loadDashboardData(): void {
    // In a real application, you would call your service to get the data
    // For example:
    // this.dashboardService.getStatusCounts().subscribe(data => {
    //   this.statusCards = data;
    // });
  }
}