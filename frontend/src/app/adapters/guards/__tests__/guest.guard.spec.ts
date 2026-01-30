import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { GuestGuard } from '../guest.guard';
import { AuthApplicationService } from '../../../application/services/auth-application.service';
import { StoredAuthState, INITIAL_AUTH_STATE } from '../../../application/dto/auth.dto';
import { User } from '../../../domain/models/user.model';

describe('GuestGuard', () => {
  let guard: GuestGuard;
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

    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        { provide: AuthApplicationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(GuestGuard);
  });

  describe('canActivate', () => {
    it('should return true when user is not authenticated (sync check)', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: false });
      authStateSubject.next(INITIAL_AUTH_STATE);

      const result = guard.canActivate();

      if (result instanceof Observable) {
        result.subscribe((value) => {
          expect(value).toBeTrue();
          done();
        });
      } else {
        expect(result).toBeTrue();
        done();
      }
    });

    it('should redirect to dashboard when user is authenticated (sync check)', () => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: true });

      guard.canActivate();

      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should redirect to dashboard when async state shows authenticated', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: false });
      authStateSubject.next(authenticatedState);

      const result = guard.canActivate();

      if (result instanceof Observable) {
        result.subscribe(() => {
          expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
          done();
        });
      } else {
        fail('Expected Observable');
      }
    });

    it('should allow access for guests (async check)', (done) => {
      Object.defineProperty(authServiceSpy, 'isAuthenticated', { value: false });
      authStateSubject.next(INITIAL_AUTH_STATE);

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
});
