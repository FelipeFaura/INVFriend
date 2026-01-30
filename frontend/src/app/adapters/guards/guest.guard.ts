import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthApplicationService } from '../../application/services/auth-application.service';

/**
 * Guard to prevent authenticated users from accessing login/register pages
 * Redirects to /dashboard if user is already authenticated
 */
@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(
    private readonly authService: AuthApplicationService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | boolean | UrlTree {
    // If authenticated, redirect to dashboard
    if (this.authService.isAuthenticated) {
      return this.router.createUrlTree(['/dashboard']);
    }

    // Check async state
    return this.authService.authState$.pipe(
      take(1),
      map((state) => {
        if (state.accessToken && state.user) {
          return this.router.createUrlTree(['/dashboard']);
        }
        return true;
      })
    );
  }
}
