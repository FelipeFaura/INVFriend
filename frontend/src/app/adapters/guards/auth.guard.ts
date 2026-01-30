import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthApplicationService } from '../../application/services/auth-application.service';

/**
 * Guard to protect routes that require authentication
 * Redirects to /login if user is not authenticated
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly authService: AuthApplicationService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }

  canActivateChild(): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }

  private checkAuthentication(): Observable<boolean | UrlTree> | boolean | UrlTree {
    // First check synchronous state
    if (this.authService.isAuthenticated) {
      return true;
    }

    // Check async state for edge cases (token refresh, etc.)
    return this.authService.authState$.pipe(
      take(1),
      map((state) => {
        if (state.accessToken && state.user) {
          return true;
        }
        // Redirect to login with return URL
        return this.router.createUrlTree(['/login'], {
          queryParams: { returnUrl: this.router.url },
        });
      })
    );
  }
}
