import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, filter, take, switchMap } from "rxjs/operators";

import { AuthApplicationService } from "../../application/services/auth-application.service";

/**
 * HTTP interceptor that adds Authorization header to requests
 * and handles 401 errors with automatic token refresh
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private readonly authService: AuthApplicationService) {}

  /**
   * Intercept HTTP requests to add auth header and handle 401 errors
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Skip auth header for auth endpoints (except /me and /logout)
    if (this.isAuthEndpoint(request) && !this.requiresAuth(request)) {
      return next.handle(request);
    }

    // Add auth header if token exists
    const token = this.authService.accessToken;
    if (token) {
      request = this.addAuthHeader(request, token);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      }),
    );
  }

  /**
   * Add Authorization header to request
   */
  private addAuthHeader(
    request: HttpRequest<unknown>,
    token: string,
  ): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Handle 401 Unauthorized errors with token refresh
   */
  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshTokenIfNeeded().pipe(
        switchMap((token) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addAuthHeader(request, token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          // Token refresh failed, user needs to re-login
          this.authService.logout().subscribe();
          return throwError(() => error);
        }),
      );
    }

    // Wait for token refresh to complete
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addAuthHeader(request, token!))),
    );
  }

  /**
   * Check if request is to an auth endpoint
   */
  private isAuthEndpoint(request: HttpRequest<unknown>): boolean {
    return request.url.includes("/auth/");
  }

  /**
   * Check if auth endpoint requires authentication
   */
  private requiresAuth(request: HttpRequest<unknown>): boolean {
    return (
      request.url.includes("/auth/me") || request.url.includes("/auth/logout")
    );
  }
}
