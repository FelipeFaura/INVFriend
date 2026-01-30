import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthGuard } from '../auth.guard';
import { AuthApplicationService } from '../../../application/services/auth-application.service';
import { StoredAuthState, INITIAL_AUTH_STATE } from '../../../application/dto/auth.dto';
import { User } from '../../../domain/models/user.model';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthApplicationService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authStateSubject: BehaviorSubject<StoredAuthState>;

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    photoUrl: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const authenticatedState: StoredAuthState = {
    user: mockUser,
    accessToken: 'valid-token',
    refreshToken: 'refresh-token',
    expiresAt: Date.now() + 3600000,
  };

  beforeEach(() => {
    authStateSubject = new BehaviorSubject<StoredAuthState>(INITIAL_AUTH_STATE);

    authServiceSpy = jasmine.createSpyObj('AuthApplicationService', [], {
      isAuthenticated: false,
      authState$: authStateSubject.asObservable(),
    });

    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree'], {
      url: '/protected',
    });
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthApplicationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  describe('canActivate', () => {
    it('should return true when user is authenticated (sync check)', () => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: true });

      const result = guard.canActivate();

      expect(result).toBeTrue();
    });

    it('should redirect to login when user is not authenticated', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: false });
      authStateSubject.next(INITIAL_AUTH_STATE);

      const result = guard.canActivate();

      if (result instanceof Observable) {
        result.subscribe((value) => {
          expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], {
            queryParams: { returnUrl: '/protected' },
          });
          done();
        });
      } else {
        fail('Expected Observable');
      }
    });

    it('should return true when async state shows authenticated', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: false });
      authStateSubject.next(authenticatedState);

      const result = guard.canActivate();

      if (result instanceof Observable) {
        result.subscribe((value) => {
          expect(value).toBeTrue();
          done();
        });
      } else {
        fail('Expected Observable');
      }
    });
  });

  describe('canActivateChild', () => {
    it('should use the same logic as canActivate', () => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: true });

      const result = guard.canActivateChild();

      expect(result).toBeTrue();
    });

    it('should redirect to login for child routes when not authenticated', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: false });
      authStateSubject.next(INITIAL_AUTH_STATE);

      const result = guard.canActivateChild();

      if (result instanceof Observable) {
        result.subscribe(() => {
          expect(routerSpy.createUrlTree).toHaveBeenCalled();
          done();
        });
      } else {
        fail('Expected Observable');
      }
    });
  });
});
