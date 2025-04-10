import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, type Observable, of, throwError } from "rxjs"
import { map, tap, delay } from "rxjs/operators"
import { AuthResponse, User, UserCredentials } from "../models/user"
import { Role } from "../models/role.enum"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Static mock data
   mockUsers: User[] = [
    {
      id: "1",
      username: "admin",
      email: "admin@shipdash.com",
      firstName: "Admin",
      lastName: "User",
      roleId: Role.ADMIN,
      isActive: true,
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
    },
    {
      id: "2",
      username: "employee",
      email: "employee@shipdash.com",
      firstName: "Employee",
      lastName: "User",
      roleId: Role.EMPLOYEE,
      isActive: true,
      createdAt: new Date("2023-01-02"),
      updatedAt: new Date("2023-01-02"),
    },
    {
      id: "3",
      username: "sales",
      email: "sales@shipdash.com",
      firstName: "Sales",
      lastName: "Representative",
      roleId: Role.SALES_REPRESENTATIVE,
      isActive: true,
      createdAt: new Date("2023-01-03"),
      updatedAt: new Date("2023-01-03"),
    },
    {
      id: "4",
      username: "merchant",
      email: "merchant@shipdash.com",
      firstName: "Merchant",
      lastName: "User",
      roleId: Role.MERCHANT,
      isActive: true,
      createdAt: new Date("2023-01-04"),
      updatedAt: new Date("2023-01-04"),
    },
  ]

  private readonly API_URL = "/api/auth"
  private readonly TOKEN_KEY = "auth_token"
  private readonly REFRESH_TOKEN_KEY = "refresh_token"
  private readonly USER_KEY = "user_data"

  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY)
    if (userData) {
      try {
        const user = JSON.parse(userData)
        this.currentUserSubject.next(user)
      } catch (e) {
        localStorage.removeItem(this.USER_KEY)
        localStorage.removeItem(this.TOKEN_KEY)
        localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      }
    }
  }

  login(credentials: UserCredentials): Observable<User> {
    // Static implementation
    const user = this.mockUsers.find((u) => u.email === credentials.email && credentials.password.length >= 6)

    if (user) {
      const response: AuthResponse = {
        user,
        token: "mock-jwt-token-" + user.id,
        refreshToken: "mock-refresh-token-" + user.id,
      }

      // Simulate network delay
      return of(response).pipe(
        delay(800),
        tap((response) => this.handleAuthResponse(response)),
        map((response) => response.user),
      )
    } else {
      return throwError(() => new Error("Invalid credentials"))
    }

    // Previous API implementation
    /*
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => this.handleAuthResponse(response)),
      map((response) => response.user),
      catchError((error) => {
        console.error("Login failed", error)
        return throwError(() => new Error("Invalid credentials"))
      }),
    )
    */
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    this.currentUserSubject.next(null)
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      return throwError(() => new Error("No refresh token available"))
    }

    // Static implementation
    const userId = refreshToken.split("-").pop()
    const user = this.mockUsers.find((u) => u.id === userId)

    if (user) {
      const newToken = "mock-jwt-token-refreshed-" + user.id

      // Simulate network delay
      return of(newToken).pipe(
        delay(500),
        tap((token) => {
          localStorage.setItem(this.TOKEN_KEY, token)
        }),
      )
    } else {
      return throwError(() => new Error("Invalid refresh token"))
    }

    // Previous API implementation
    /*
    return this.http.post<{ token: string }>(`${this.API_URL}/refresh-token`, { refreshToken }).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token)
      }),
      map((response) => response.token),
      catchError((error) => {
        console.error("Token refresh failed", error)
        this.logout()
        return throwError(() => new Error("Session expired. Please login again."))
      }),
    )
    */
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

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken)
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user))
    this.currentUserSubject.next(response.user)
  }
}
