import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, of, throwError } from "rxjs"
import { map, tap, catchError } from "rxjs/operators"

import { Role } from "../models/role.enum"
import { environment } from "../../../enviroments/environment.development"
import { AuthResponse, ForgotPasswordRequest, ResetPasswordRequest, User, UserCredentials } from "../models/user"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/Account`
  private readonly TOKEN_KEY = "auth_token"
  private readonly USER_KEY = "user_data"
  private readonly PERMISSIONS_KEY = "user_permissions"

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  private permissionsSubject = new BehaviorSubject<{ [moduleName: string]: string[] } | null>(null)
  public permissions$ = this.permissionsSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY)
    const permissionsData = localStorage.getItem(this.PERMISSIONS_KEY)

    if (userData) {
      try {
        const user = JSON.parse(userData)
        this.currentUserSubject.next(user)
      } catch (e) {
        this.clearAuthData()
      }
    }

    if (permissionsData) {
      try {
        const permissions = JSON.parse(permissionsData)
        this.permissionsSubject.next(permissions)
      } catch (e) {
        localStorage.removeItem(this.PERMISSIONS_KEY)
        this.permissionsSubject.next(null)
      }
    }
  }

  login(credentials: UserCredentials): Observable<User> {
    console.log(credentials);
    return this.http.post<AuthResponse>(`${this.API_URL}/Login`, credentials).pipe(
      tap((response) => this.handleAuthResponse(response)),
      map((response) => {
        // Create a user object from the response
        const user: User = {
          id: response.id,
          email: credentials.email,
          roleId: response.role,
        }
        return user
      }),
      catchError((error) => {
        console.error("Login failed", error)
        if (error.status === 401) {
          return throwError(() => new Error("Invalid credentials"))
        }
        return throwError(() => new Error("An error occurred during login. Please try again."))
      }),
    )
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/ForgetPassword`, request).pipe(
      catchError((error) => {
        console.error("Forgot password request failed", error)
        if (error.status === 404) {
          return throwError(() => new Error("Email not found in our records."))
        }
        return throwError(() => new Error("An error occurred. Please try again later."))
      }),
    )
  }

  resetPassword(request: ResetPasswordRequest): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/ResetPassword`, request).pipe(
      catchError((error) => {
        console.error("Reset password request failed", error)
        if (error.status === 400) {
          return throwError(() => new Error("Invalid or expired token."))
        }
        return throwError(() => new Error("An error occurred. Please try again later."))
      }),
    )
  }

  logout(): void {
    // Optionally call the logout endpoint if your API requires it
    this.http
      .post(`${this.API_URL}/logout`, {})
      .pipe(
        catchError((error) => {
          console.error("Logout API call failed", error)
          return of(null)
        }),
      )
      .subscribe(() => {
        this.clearAuthData()
      })
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  hasRole(role: Role): boolean {
    const user = this.currentUserSubject.value
    return !!user && user.roleId === role
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value
    return user ? user.roleId : null
  }

  hasPermission(module: string, permission: string): boolean {
    const permissions = this.permissionsSubject.value
    if (!permissions) return false

    return !!permissions[module] && permissions[module].includes(permission)
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token)

    // Create and store user data
    const user: User = {
      id: response.id,
      roleId: response.role,
      email: "", // Email is not returned in the response, but we need it for the User interface
    }
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    this.currentUserSubject.next(user)

    // Store permissions
    localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(response.permissions))
    this.permissionsSubject.next(response.permissions)
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.PERMISSIONS_KEY)
    this.currentUserSubject.next(null)
    this.permissionsSubject.next(null)
  }
}
