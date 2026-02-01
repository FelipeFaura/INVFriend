import { Injectable, inject } from "@angular/core";
import { Observable, from, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from "@angular/fire/auth";

import {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
} from "../../application/dto/auth.dto";
import {
  AuthError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  NetworkError,
  AUTH_ERROR_CODES,
} from "../../domain/errors/auth-errors";

/**
 * Firebase Authentication service
 * Handles direct communication with Firebase Auth SDK
 */
@Injectable({
  providedIn: "root",
})
export class FirebaseAuthService {
  private readonly auth = inject(Auth);
  private readonly googleProvider = new GoogleAuthProvider();

  /**
   * Register a new user with email and password
   * @param data - Registration data (email, password, name)
   * @returns Observable with auth response containing user and tokens
   */
  register(data: RegisterRequestDTO): Observable<AuthResponseDTO> {
    return from(
      createUserWithEmailAndPassword(this.auth, data.email, data.password),
    ).pipe(
      map((credential) => this.mapCredentialToResponse(credential, data.name)),
      catchError((error) => this.handleFirebaseError(error)),
    );
  }

  /**
   * Update user profile after registration
   */
  private async updateUserProfile(
    user: FirebaseUser,
    displayName: string,
  ): Promise<void> {
    await updateProfile(user, { displayName });
  }

  /**
   * Login with email and password
   * @param data - Login credentials (email, password)
   * @returns Observable with auth response containing user and tokens
   */
  login(data: LoginRequestDTO): Observable<AuthResponseDTO> {
    return from(
      signInWithEmailAndPassword(this.auth, data.email, data.password),
    ).pipe(
      map((credential) => this.mapCredentialToResponse(credential)),
      catchError((error) => this.handleFirebaseError(error)),
    );
  }

  /**
   * Login with Google OAuth popup
   * @returns Observable with auth response containing user and tokens
   */
  loginWithGoogle(): Observable<AuthResponseDTO> {
    return from(signInWithPopup(this.auth, this.googleProvider)).pipe(
      map((credential) => this.mapCredentialToResponse(credential)),
      catchError((error) => this.handleFirebaseError(error)),
    );
  }

  /**
   * Logout the current user
   * @returns Observable that completes on success
   */
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  /**
   * Get ID token for authenticated requests
   * @returns Observable with current ID token
   */
  getIdToken(): Observable<string | null> {
    const user = this.auth.currentUser;
    if (!user) {
      return from(Promise.resolve(null));
    }
    return from(user.getIdToken());
  }

  /**
   * Get current Firebase user
   */
  get currentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * Observable of auth state changes
   */
  get authState$(): Observable<FirebaseUser | null> {
    return new Observable((subscriber) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => subscriber.next(user),
        (error) => subscriber.error(error),
      );
      return () => unsubscribe();
    });
  }

  /**
   * Map Firebase credential to AuthResponseDTO
   */
  private mapCredentialToResponse(
    credential: UserCredential,
    displayName?: string,
  ): AuthResponseDTO {
    const user = credential.user;

    // Update display name if provided (for registration)
    if (displayName && !user.displayName) {
      this.updateUserProfile(user, displayName);
    }

    return {
      user: {
        id: user.uid,
        email: user.email || "",
        name: displayName || user.displayName || "User",
        createdAt: user.metadata.creationTime || new Date().toISOString(),
      },
      accessToken: "", // Will be fetched separately
      refreshToken: user.refreshToken,
      expiresIn: 3600,
    };
  }

  /**
   * Handle Firebase Auth errors and convert to domain errors
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
