import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { NotificationService } from "../services/notification.service";

const AUTH_EXCLUDED_ENDPOINTS = ["/auth/login", "/auth/register"];

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!this.isExcludedAuthEndpoint(request)) {
          this.handleError(error);
        }
        return throwError(() => error);
      }),
    );
  }

  private handleError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 0:
        this.notificationService.error(
          "Unable to connect to the server. Check your internet connection.",
          "Connection Error",
        );
        break;
      case 401:
        this.notificationService.error(
          "Session expired. Please log in again.",
          "Session Expired",
        );
        this.router.navigate(["/login"]);
        break;
      case 403:
        this.notificationService.error(
          "You do not have permission to perform this action",
          "Access Denied",
        );
        break;
      case 404:
        this.notificationService.warning(
          "The requested resource was not found",
          "Not Found",
        );
        break;
      default:
        if (error.status >= 500) {
          this.notificationService.error(
            "Something went wrong. Please try again later.",
            "Server Error",
          );
        }
        break;
    }
  }

  private isExcludedAuthEndpoint(request: HttpRequest<unknown>): boolean {
    return AUTH_EXCLUDED_ENDPOINTS.some((endpoint) =>
      request.url.includes(endpoint),
    );
  }
}
