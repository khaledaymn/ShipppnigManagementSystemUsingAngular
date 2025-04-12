import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { Role } from "../models/role.enum"

export const roleGuard = (allowedRoles: Role[]) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  // First check if the user is authenticated
  if (!authService.isAuthenticated()) {
    return router.parseUrl("/auth/login")
  }

  // Then check if the user has any of the allowed roles
  const hasRole = allowedRoles.some((role) => authService.hasRole(role))

  if (hasRole) {
    return true
  }

  // If not authorized, redirect to unauthorized page
  return router.parseUrl("/unauthorized")
}
