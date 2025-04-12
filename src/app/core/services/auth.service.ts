// import { Injectable } from "@angular/core"
// import { HttpClient } from "@angular/common/http"
// import { BehaviorSubject, Observable, of, throwError } from "rxjs"
// import { map, tap, catchError } from "rxjs/operators"
// import { Role } from "../models/role.enum"
// import { environment } from "../../../enviroments/environment.development"
// import { AuthResponse, User, UserCredentials } from "../models/user"


// @Injectable({
//   providedIn: "root",
// })
// export class AuthService {

//   private readonly API_URL = `${environment.apiUrl}/auth`
//   private readonly TOKEN_KEY = "auth_token"
//   private readonly REFRESH_TOKEN_KEY = "refresh_token"
//   private readonly USER_KEY = "user_data"

//   private currentUserSubject = new BehaviorSubject<User | null>(null)
//   public currentUser$ = this.currentUserSubject.asObservable()

//   constructor(private http: HttpClient) {
//     this.loadUserFromStorage()
//   }

//   private loadUserFromStorage(): void {
//     const userData = localStorage.getItem(this.USER_KEY)
//     if (userData) {
//       try {
//         const user = JSON.parse(userData)
//         this.currentUserSubject.next(user)
//       } catch (e) {
//         this.clearAuthData()
//       }
//     }
//   }

//   login(credentials: UserCredentials): Observable<User> {
//     return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
//       tap((response) => this.handleAuthResponse(response)),
//       map((response) => response.user),
//       catchError((error) => {
//         console.error("Login failed", error)
//         if (error.status === 401) {
//           return throwError(() => new Error("Invalid credentials"))
//         }
//         return throwError(() => new Error("An error occurred during login. Please try again."))
//       }),
//     )
//   }

//   logout(): void {
//     // Optionally call the logout endpoint if your API requires it
//     this.http
//       .post(`${this.API_URL}/logout`, {})
//       .pipe(
//         catchError((error) => {
//           console.error("Logout API call failed", error)
//           return of(null)
//         }),
//       )
//       .subscribe(() => {
//         this.clearAuthData()
//       })
//   }

//   refreshToken(): Observable<string> {
//     const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
//     if (!refreshToken) {
//       return throwError(() => new Error("No refresh token available"))
//     }

//     return this.http.post<{ token: string }>(`${this.API_URL}/refresh-token`, { refreshToken }).pipe(
//       tap((response) => {
//         localStorage.setItem(this.TOKEN_KEY, response.token)
//       }),
//       map((response) => response.token),
//       catchError((error) => {
//         console.error("Token refresh failed", error)
//         this.clearAuthData()
//         return throwError(() => new Error("Session expired. Please login again."))
//       }),
//     )
//   }

//   getToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY)
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken()
//   }

//   hasRole(role: Role): boolean {
//     const user = this.currentUserSubject.value
//     return !!user && user.roleId === role
//   }

//   getUserRole(): string | null {
//     const user = this.currentUserSubject.value
//     return user ? user.roleId : null
//   }

//   private handleAuthResponse(response: AuthResponse): void {
//     localStorage.setItem(this.TOKEN_KEY, response.token)
//     localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken)
//     localStorage.setItem(this.USER_KEY, JSON.stringify(response.user))
//     this.currentUserSubject.next(response.user)
//   }

//   private clearAuthData(): void {
//     localStorage.removeItem(this.TOKEN_KEY)
//     localStorage.removeItem(this.REFRESH_TOKEN_KEY)
//     localStorage.removeItem(this.USER_KEY)
//     this.currentUserSubject.next(null)
//   }
// }


import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Role } from "../models/role.enum";
import { environment } from "../../../enviroments/environment.development";
import { AuthResponse, User, UserCredentials } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  users: User[] = [
    {
      id: "1",
      username: "adminUser",
      email: "admin@example.com",
      firstName: "Ali",
      lastName: "Mostafa",
      roleId: Role.ADMIN,
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-06-01"),
    },
    {
      id: "2",
      username: "employeeUser",
      email: "employee@example.com",
      firstName: "Sara",
      lastName: "Mahmoud",
      roleId: Role.EMPLOYEE,
      isActive: true,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-06-15"),
    },
    {
      id: "3",
      username: "salesUser",
      email: "sales@example.com",
      firstName: "Khaled",
      lastName: "Ibrahim",
      roleId: Role.SALES_REPRESENTATIVE,
      isActive: false,
      createdAt: new Date("2024-03-10"),
      updatedAt: new Date("2024-06-20"),
    },
    {
      id: "4",
      username: "merchantUser",
      email: "merchant@example.com",
      firstName: "Nour",
      lastName: "Adel",
      roleId: Role.MERCHANT,
      isActive: true,
      createdAt: new Date("2024-04-05"),
      updatedAt: new Date("2024-06-25"),
    },
  ];

  // Mock password storage (in a real app, passwords would be hashed in the backend)
  private mockPasswords: { [email: string]: string } = {
    adminUser: "admin123",
    employeeUser: "employee123",
    salesUser: "sales123",
    merchantUser: "merchant123",
  };

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly USER_KEY = "user_data";

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  login(credentials: UserCredentials): Observable<User> {
    // Simulate API login with users array
    console.log(this.mockPasswords);

    const user = this.users.find(
      (u) =>
        (u.email === credentials.email) &&
        this.mockPasswords[
          credentials.email == "admin@example.com" ? "adminUser" :
          credentials.email == "employee@example.com" ? "employeeUser":
          credentials.email == "sales@example.com" ? "salesUser" :
          credentials.email == "merchant@example.com" ? "merchantUser" : "notFound"
        ] === credentials.password
    );

    if (!user) {
      return throwError(() => new Error("Invalid credentials"));
    }

    if (!user.isActive) {
      return throwError(() => new Error("Account is not active"));
    }

    // Generate mock tokens
    const mockToken = `mock-token-${user.id}-${Date.now()}`;
    const mockRefreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;
    const authResponse: AuthResponse = {
      user,
      token: mockToken,
      refreshToken: mockRefreshToken,
    };

    return of(authResponse).pipe(
      tap((response) => this.handleAuthResponse(response)),
      map((response) => response.user)
    );
  }

  logout(): void {
    // Simulate logout by clearing auth data
    this.clearAuthData();
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.clearAuthData();
      return throwError(() => new Error("No refresh token available"));
    }

    // Simulate token refresh
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) {
      this.clearAuthData();
      return throwError(() => new Error("No user data available"));
    }

    // Validate refresh token (basic check for simulation)
    if (!refreshToken.startsWith("mock-refresh-token")) {
      this.clearAuthData();
      return throwError(() => new Error("Invalid refresh token"));
    }

    // Generate new mock token
    const newToken = `mock-token-${JSON.parse(userData).id}-${Date.now()}`;
    return of({ token: newToken }).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
      }),
      map((response) => response.token)
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: Role): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.roleId === role;
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.roleId : null;
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }
}
