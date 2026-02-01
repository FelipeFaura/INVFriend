import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError, from } from "rxjs";
import { tap, catchError, switchMap, map } from "rxjs/operators";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";

import { User } from "../../domain/models/user.model";
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  StoredAuthState,
  INITIAL_AUTH_STATE,
} from "../../application/dto/auth.dto";
import {
  AuthError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  NetworkError,
  InvalidTokenError,
  AUTH_ERROR_CODES,
} from "../../domain/errors/auth-errors";

/**
 * Application service for authentication state management
 * Uses Firebase Auth SDK directly for authentication
 */
@Injectable({
  providedIn: "root",
})
export class AuthApplicationService {
  private readonly googleProvider = new firebase.auth.GoogleAuthProvider();
  private readonly authStateSubject = new BehaviorSubject<StoredAuthState>(
    INITIAL_AUTH_STATE,
  );

  /** Observable of the current authentication state */
  readonly authState$ = this.authStateSubject.asObservable();

  /** Observable of the current user (null if not authenticated) */
  readonly currentUser$: Observable<User | null>;

  constructor(private readonly afAuth: AngularFireAuth) {
    // Initialize currentUser$ observable
    this.currentUser$ = this.authState$.pipe(map((state) => state.user));

    // Listen to Firebase auth state changes
    this.afAuth.authState.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const user = this.mapFirebaseUser(firebaseUser);
        this.updateAuthState({
          user,
          accessToken: token,
          refreshToken: firebaseUser.refreshToken,
          expiresAt: Date.now() + 3600 * 1000, // 1 hour
        });
      } else {
        this.updateAuthState(INITIAL_AUTH_STATE);
      }
    });
  }

  /**
   * Check if user is currently authenticated
   */
  get isAuthenticated(): boolean {
    return !!this.authStateSubject.value.accessToken;
  }

  /**
   * Get current access token
   */
  get accessToken(): string | null {
    return this.authStateSubject.value.accessToken;
  }

  /**
   * Get current user
   */
  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequestDTO): Observable<User> {
    return from(
      this.afAuth.createUserWithEmailAndPassword(data.email, data.password),
    ).pipe(
      switchMap(async (credential) => {
        if (credential.user) {
          // Update display name
          await credential.user.updateProfile({ displayName: data.name });
          // Force refresh to get updated profile
          await credential.user.reload();
          return this.mapFirebaseUser(credential.user);
        }
        throw new Error("No user returned");
      }),
      catchError((error) => this.handleFirebaseError(error)),
    );
  }

  /**
   * Login with email and password
   */
  login(data: LoginRequestDTO): Observable<User> {
    return from(
      this.afAuth.signInWithEmailAndPassword(data.email, data.password),
    ).pipe(
      map((credential) => {
        if (credential.user) {
          return this.mapFirebaseUser(credential.user);
        }
        throw new Error("No user returned");
      }),
      catchError((error) => this.handleFirebaseError(error)),
    );
  }

  /**
   * Login with Google OAuth
   */
  loginWithGoogle(_googleToken?: string): Observable<User> {
    return from(this.afAuth.signInWithPopup(this.googleProvider)).pipe(
      map((credential) => {
        if (credential.user) {
          return this.mapFirebaseUser(credential.user);
        }
        throw new Error("No user returned");
      }),
      catchError((error) => this.handleFirebaseError(error)),
    );
  }

  /**
   * Logout current user
   */
  logout(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(
      tap(() => this.updateAuthState(INITIAL_AUTH_STATE)),
      catchError(() => {
        this.updateAuthState(INITIAL_AUTH_STATE);
        return of(undefined);
      }),
    );
  }

  /**
   * Refresh the access token if needed
   */
  refreshTokenIfNeeded(): Observable<string> {
    return from(this.afAuth.currentUser).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(
            () => new InvalidTokenError("No user authenticated"),
          );
        }
        return from(user.getIdToken(true));
      }),
      tap((token) => {
        const state = this.authStateSubject.value;
        this.updateAuthState({
          ...state,
          accessToken: token,
          expiresAt: Date.now() + 3600 * 1000,
        });
      }),
    );
  }

  /**
   * Initialize auth state (called on app startup)
   */
  initializeFromStorage(): void {
    // Firebase handles persistence automatically
  }

  /**
   * Map Firebase user to domain User model
   */
  private mapFirebaseUser(firebaseUser: firebase.User): User {
    const createdAt = firebaseUser.metadata.creationTime
      ? new Date(firebaseUser.metadata.creationTime).getTime()
      : Date.now();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || "User",
      photoUrl: firebaseUser.photoURL || null,
      createdAt,
      updatedAt: createdAt,
    };
  }

  /**
   * Update auth state
   */
  private updateAuthState(state: StoredAuthState): void {
    this.authStateSubject.next(state);
  }

  /**
   * Handle Firebase Auth errors
   */
  private handleFirebaseError(error: unknown): Observable<never> {
    const firebaseError = error as { code?: string; message?: string };

    switch (firebaseError.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return throwError(
          () => new InvalidCredentialsError("Invalid email or password"),
        );
      case "auth/email-already-in-use":
        return throwError(
          () => new UserAlreadyExistsError(firebaseError.message || "Email"),
        );
      case "auth/weak-password":
        return throwError(
          () =>
            new AuthError(
              "Password should be at least 6 characters",
              AUTH_ERROR_CODES.WEAK_PASSWORD,
            ),
        );
      case "auth/invalid-email":
        return throwError(
          () =>
            new AuthError(
              "Invalid email format",
              AUTH_ERROR_CODES.INVALID_EMAIL,
            ),
        );
      case "auth/network-request-failed":
        return throwError(() => new NetworkError("Network error occurred"));
      case "auth/popup-closed-by-user":
        return throwError(
          () => new AuthError("Sign-in cancelled", "POPUP_CLOSED"),
        );
      default:
        return throwError(
          () =>
            new AuthError(
              firebaseError.message || "Authentication failed",
              "UNKNOWN_ERROR",
            ),
        );
    }
  }
}
