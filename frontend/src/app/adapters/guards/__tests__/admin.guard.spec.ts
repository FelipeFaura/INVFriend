import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { AdminGuard } from '../admin.guard';
import { AuthApplicationService } from '../../../application/services/auth-application.service';
import { StoredAuthState, INITIAL_AUTH_STATE } from '../../../application/dto/auth.dto';
import { User } from '../../../domain/models/user.model';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceSpy: jasmine.SpyObj<AuthApplicationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authStateSubject: BehaviorSubject<StoredAuthState>;

  const mockUser: User = {
    id: 'user-123',
    email: 'user@example.com',
    name: 'Test User',
    photoUrl: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const createAuthState = (user: User | null): StoredAuthState => ({
    user,
    accessToken: user ? 'valid-token' : null,
    refreshToken: user ? 'refresh-token' : null,
    expiresAt: user ? Date.now() + 3600000 : null,
  });

  const createMockRoute = (groupId?: string): ActivatedRouteSnapshot => {
    const route = {
      paramMap: convertToParamMap(groupId ? { groupId } : {}),
      params: groupId ? { groupId } : {},
      url: [{ path: 'groups' }],
    } as unknown as ActivatedRouteSnapshot;
    return route;
  };

  beforeEach(() => {
    authStateSubject = new BehaviorSubject<StoredAuthState>(INITIAL_AUTH_STATE);

    authServiceSpy = jasmine.createSpyObj('AuthApplicationService', [], {
      isAuthenticated: false,
      authState$: authStateSubject.asObservable(),
    });

    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthApplicationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AdminGuard);
  });

  describe('canActivate', () => {
    it('should redirect to login when user is not authenticated', () => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: false });
      const route = createMockRoute('group-123');

      guard.canActivate(route);

      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: jasmine.any(String) },
      });
    });

    it('should return true for authenticated user with group context', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: true });
      authStateSubject.next(createAuthState(mockUser));
      const route = createMockRoute('group-123');

      const result = guard.canActivate(route);

      if (result instanceof Observable) {
        result.subscribe((value) => {
          expect(value).toBeTrue();
          done();
        });
      } else {
        fail('Expected Observable');
      }
    });

    it('should return true when no groupId in route for authenticated user', () => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: true });
      authStateSubject.next(createAuthState(mockUser));
      const route = createMockRoute(); // No groupId

      const result = guard.canActivate(route);

      expect(result).toBeTrue();
    });

    it('should redirect to login when async state has no user', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: true });
      authStateSubject.next(createAuthState(null));
      const route = createMockRoute('group-123');

      const result = guard.canActivate(route);

      if (result instanceof Observable) {
        result.subscribe(() => {
          expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
          done();
        });
      } else {
        fail('Expected Observable');
      }
    });
  });
});
