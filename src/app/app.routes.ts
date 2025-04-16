import type { Routes } from "@angular/router"
import { BranchComponent } from "./pages/branch/branch.component"
import { BranchFormComponent } from "./pages/branch-form/branch-form.component"
import { EmployeeComponent } from "./pages/employee/employee.component"
import { EmployeeFormComponent } from "./pages/employee-form/employee-form.component"
import { authGuard } from "./core/guards/auth.guard"
import { CityComponent } from "./pages/city/city.component"
import { CityFormComponent } from "./pages/city-form/city-form.component"
import { StandardComponent } from "./pages/standard/standard.component"
import { StandardFormComponent } from "./pages/standard-form/standard-form.component"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full",
  },
  {
    path: "auth",
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      {
        path: "login",
        loadComponent: () => import("./pages/auth/login/login.component").then((m) => m.LoginComponent),
      },
      {
        path: "forgot-password",
        loadComponent: () =>
          import("./pages/auth/forgot-password/forgot-password.component").then((m) => m.ForgotPasswordComponent),
      },
      {
        path: "reset-password",
        loadComponent: () =>
          import("./pages/auth/reset-password/reset-password.component").then((m) => m.ResetPasswordComponent),
      },
    ],
  },
  {
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    // canActivate: [authGuard],
  },
    {path:'Branch',component:BranchComponent},
    {path:'Branch/:id/edit',component:BranchFormComponent},
    {path:'Employee',component:EmployeeComponent},
    {path:'Employee/:id/edit',component:EmployeeFormComponent},
    {path:'City',component:CityComponent},
    {path:'City/:id/edit',component:CityFormComponent},
    {path:'weightSetting',component:StandardComponent},
    {path:'weightSetting/:id/edit',component:StandardFormComponent},
    {
      path: "governorates",
      loadChildren: () => import("./pages/governorate/governorate.module").then((m) => m.GovernorateModule),
    },
    {
      path: "orders",
      canActivate: [authGuard],
      children: [
        {
          path: "",
          loadComponent: () =>
            import("./pages/orders/orders-list/order-list.component").then((m) => m.OrdersListComponent),
        },
        {
          path: "create",
          loadComponent: () =>
            import("./pages/orders/orders-create/order-create.component").then((m) => m.OrderCreateComponent),
        },
        {
          path: "by-status",
          loadComponent: () =>
            import("./pages/orders/orders-by-status/orders-by-status.component").then(
              (m) => m.OrdersByStatusComponent,
            ),
        },
        {
          path: "reports",
          loadComponent: () =>
            import("./pages/orders/orsers-report/orsers-report.component").then((m) => m.OrdersReportComponent),
        },
        {
          path: "edit/:id",
          loadComponent: () =>
            import("./pages/orders/orders-edit/order-edit.component").then((m) => m.OrderEditComponent),
        },
        {
          path: ":id",
          loadComponent: () =>
            import("./pages/orders/orders-details/order-details.component").then((m) => m.OrderDetailComponent),
        },
      ],
    },
    {
      path: "shipping-representatives",
      loadChildren: () =>
        import("./pages/shipping-representative/shipping-representative.module").then(
          (m) => m.ShippingRepresentativeModule,
        ),
    },
  {
    path: "unauthorized",
    loadComponent: () => import("./pages/unauthorized/unauthorized.component").then((m) => m.UnauthorizedComponent),
  },
  // {
  //   path: "admin",
  //   loadChildren: () => import("./features/admin/admin.routes").then((r) => r.ADMIN_ROUTES),
  //   canActivate: [() => roleGuard([Role.ADMIN])],
  // },
  // {
  //   path: "employee",
  //   loadChildren: () => import("./features/employee/employee.routes").then((r) => r.EMPLOYEE_ROUTES),
  //   canActivate: [() => roleGuard([Role.EMPLOYEE])],
  // },
  // {
  //   path: "sales",
  //   loadChildren: () => import("./features/sales-representative/sales.routes").then((r) => r.SALES_ROUTES),
  //   canActivate: [() => roleGuard([Role.SALES_REPRESENTATIVE])],
  // },
  // {
  //   path: "merchant",
  //   loadChildren: () => import("./features/merchant/merchant.routes").then((r) => r.MERCHANT_ROUTES),
  //   canActivate: [() => roleGuard([Role.MERCHANT])],
  // },
  // {
  //   path: "**",
  //   loadComponent: () => import("./pages/not-found/not-found.component").then((m) => m.NotFoundComponent),
  // },
]
