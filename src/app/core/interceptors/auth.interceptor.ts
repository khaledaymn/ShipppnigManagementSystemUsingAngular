import { Injectable } from "@angular/core"
import {
 HttpRequest,
 HttpHandler,
 HttpEvent,
 HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken()

    if (token) {
      request = this.addToken(request, token)
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token is invalid or expired
          this.authService.logout()
          this.router.navigate(["/auth/login"], {
            queryParams: { returnUrl: this.router.url },
          })
        }
        return throwError(() => error)
      }),
    )
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}
