import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';

import { AuthApplicationService } from '../../application/services/auth-application.service';

/**
 * Guard to protect routes that require admin privileges
 * Checks if user is authenticated and is admin of the specified group
 * Note: Full admin check will be implemented when Group entity is available (Sprint 3)
 * For now, just checks authentication
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly authService: AuthApplicationService,
    private readonly router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    // First check if authenticated
    if (!this.authService.isAuthenticated) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: route.url.toString() },
      });
    }

    // Get the group ID from route params
    const groupId = route.paramMap.get('groupId') || route.params['groupId'];

    if (!groupId) {
      // No group context, just check authentication
      return true;
    }

    // Check if user is authenticated
    // Note: Admin check against group.adminIds will be implemented in Sprint 3
    return this.authService.authState$.pipe(
      take(1),
      map((state) => {
        const user = state.user;

        if (!user) {
          return this.router.createUrlTree(['/login']);
        }

        // For now, allow access if authenticated
        // Full admin check will compare user.id with group.adminIds
        return true;
      })
    );
  }
}
