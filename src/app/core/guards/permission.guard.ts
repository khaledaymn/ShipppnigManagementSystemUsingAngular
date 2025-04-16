import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const permissionGuard = (module: string, permission: string) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  // First check if the user is authenticated
  if (!authService.isAuthenticated()) {
    return router.parseUrl("/auth/login")
  }

  // Then check if the user has the required permission
  if (authService.hasPermission(module, permission)) {
    return true
  }

  // If not authorized, redirect to unauthorized page
  return router.parseUrl("/unauthorized")
}
