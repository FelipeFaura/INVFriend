import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { tap, catchError, switchMap } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { User } from "../../domain/models/user.model";
import {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  GoogleLoginRequestDTO,
  StoredAuthState,
  INITIAL_AUTH_STATE,
} from "../../application/dto/auth.dto";
import { AuthHttpService } from "../../adapters/services/auth-http.service";
import { InvalidTokenError } from "../../domain/errors/auth-errors";

/** Local storage keys for auth data */
const STORAGE_KEYS = {
  ACCESS_TOKEN: "invfriend_access_token",
  REFRESH_TOKEN: "invfriend_refresh_token",
  USER: "invfriend_user",
  EXPIRES_AT: "invfriend_expires_at",
} as const;

/**
 * Application service for authentication state management
 * Manages user session, tokens, and authentication state
 */
@Injectable({
  providedIn: "root",
})
export class AuthApplicationService {
  private readonly authStateSubject = new BehaviorSubject<StoredAuthState>(
    this.loadStoredState(),
  );

  /** Observable of the current authentication state */
  readonly authState$ = this.authStateSubject.asObservable();

  /** Observable of the current user (null if not authenticated) */
  readonly currentUser$: Observable<User | null> =
    new BehaviorSubject<User | null>(this.authStateSubject.value.user);

  constructor(private readonly authHttpService: AuthHttpService) {
    // Sync currentUser$ with authState$
    this.authState$.subscribe((state) => {
      (this.currentUser$ as BehaviorSubject<User | null>).next(state.user);
    });
  }

  /**
   * Check if user is currently authenticated
   * @returns true if user has valid token
   */
  get isAuthenticated(): boolean {
    const state = this.authStateSubject.value;
    return !!state.accessToken && !this.isTokenExpired();
  }

  /**
   * Get current access token
   * @returns Access token or null
   */
  get accessToken(): string | null {
    return this.authStateSubject.value.accessToken;
  }

  /**
   * Get current user
   * @returns User or null
   */
  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Register a new user
   * @param data - Registration data
   * @returns Observable with authenticated user
   */
  register(data: RegisterRequestDTO): Observable<User> {
    return this.authHttpService.register(data).pipe(
      tap((response) => this.handleAuthResponse(response)),
      switchMap(() => of(this.currentUser!)),
    );
  }

  /**
   * Login with email and password
   * @param data - Login credentials
   * @returns Observable with authenticated user
   */
  login(data: LoginRequestDTO): Observable<User> {
    return this.authHttpService.login(data).pipe(
      tap((response) => this.handleAuthResponse(response)),
      switchMap(() => of(this.currentUser!)),
    );
  }

  /**
   * Login with Google OAuth
   * @param googleToken - Google ID token
   * @returns Observable with authenticated user
   */
  loginWithGoogle(googleToken: string): Observable<User> {
    return this.authHttpService.loginWithGoogle({ googleToken }).pipe(
      tap((response) => this.handleAuthResponse(response)),
      switchMap(() => of(this.currentUser!)),
    );
  }

  /**
   * Logout current user and clear session
   * @returns Observable that completes on success
   */
  logout(): Observable<void> {
    return this.authHttpService.logout().pipe(
      tap(() => this.clearAuthState()),
      catchError(() => {
        // Clear local state even if server call fails
        this.clearAuthState();
        return of(undefined);
      }),
    );
  }

  /**
   * Refresh the access token if needed
   * @returns Observable with new token or error
   */
  refreshTokenIfNeeded(): Observable<string> {
    const state = this.authStateSubject.value;

    if (!state.refreshToken) {
      return throwError(
        () => new InvalidTokenError("No refresh token available"),
      );
    }

    if (!this.shouldRefreshToken()) {
      return of(state.accessToken!);
    }

    return this.authHttpService
      .refreshToken({ refreshToken: state.refreshToken })
      .pipe(
        tap((response) => {
          const expiresAt = response.expiresIn
            ? Date.now() + response.expiresIn * 1000
            : null;

          const newState: StoredAuthState = {
            ...state,
            accessToken: response.accessToken,
            expiresAt,
          };

          this.updateAuthState(newState);
        }),
        switchMap((response) => of(response.accessToken)),
      );
  }

  /**
   * Initialize auth state from storage on app startup
   */
  initializeFromStorage(): void {
    const state = this.loadStoredState();
    this.authStateSubject.next(state);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    const expiresAt = this.authStateSubject.value.expiresAt;
    if (!expiresAt) return false;
    return Date.now() >= expiresAt;
  }

  /**
   * Check if token should be refreshed (within threshold)
   */
  private shouldRefreshToken(): boolean {
    const expiresAt = this.authStateSubject.value.expiresAt;
    if (!expiresAt) return false;
    const threshold = environment.tokenRefreshThreshold * 1000;
    return Date.now() >= expiresAt - threshold;
  }

  /**
   * Handle successful auth response
   */
  private handleAuthResponse(response: AuthResponseDTO): void {
    const expiresAt = response.expiresIn
      ? Date.now() + response.expiresIn * 1000
      : null;

    const state: StoredAuthState = {
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || null,
      expiresAt,
    };

    this.updateAuthState(state);
  }

  /**
   * Update auth state and persist to storage
   */
  private updateAuthState(state: StoredAuthState): void {
    this.authStateSubject.next(state);
    this.persistState(state);
  }

  /**
   * Clear auth state and storage
   */
  private clearAuthState(): void {
    this.authStateSubject.next(INITIAL_AUTH_STATE);
    this.clearStorage();
  }

  /**
   * Load auth state from localStorage
   */
  private loadStoredState(): StoredAuthState {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const userJson = localStorage.getItem(STORAGE_KEYS.USER);
      const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

      if (!accessToken) {
        return INITIAL_AUTH_STATE;
      }

      return {
        accessToken,
        refreshToken,
        user: userJson ? JSON.parse(userJson) : null,
        expiresAt: expiresAtStr ? parseInt(expiresAtStr, 10) : null,
      };
    } catch {
      return INITIAL_AUTH_STATE;
    }
  }

  /**
   * Persist auth state to localStorage
   */
  private persistState(state: StoredAuthState): void {
    if (state.accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, state.accessToken);
    }
    if (state.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken);
    }
    if (state.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    }
    if (state.expiresAt) {
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, state.expiresAt.toString());
    }
  }

  /**
   * Clear all auth data from localStorage
   */
  private clearStorage(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  }
}
