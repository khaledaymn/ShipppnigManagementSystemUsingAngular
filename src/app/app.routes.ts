import type { Routes } from "@angular/router"

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
  // {
  //   path: "dashboard",
  //   loadComponent: () => import("./features/dashboard/dashboard.component").then((m) => m.DashboardComponent),
  //   canActivate: [authGuard],
  // },
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
  {
    path: "**",
    loadComponent: () => import("./pages/not-found/not-found.component").then((m) => m.NotFoundComponent),
  },
]
