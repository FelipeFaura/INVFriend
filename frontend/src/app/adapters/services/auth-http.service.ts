import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  GoogleLoginRequestDTO,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
} from "../../application/dto/auth.dto";
import {
  AuthError,
  InvalidCredentialsError,
  UserAlreadyExistsError,
  NetworkError,
  AUTH_ERROR_CODES,
} from "../../domain/errors/auth-errors";

/**
 * HTTP service for authentication API calls
 * Handles communication with the backend auth endpoints
 */
@Injectable({
  providedIn: "root",
})
export class AuthHttpService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  /**
   * Register a new user with email and password
   * @param data - Registration data (email, password, name)
   * @returns Observable with auth response containing user and tokens
   */
  register(data: RegisterRequestDTO): Observable<AuthResponseDTO> {
    return this.http
      .post<AuthResponseDTO>(`${this.baseUrl}/register`, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Login with email and password
   * @param data - Login credentials (email, password)
   * @returns Observable with auth response containing user and tokens
   */
  login(data: LoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http
      .post<AuthResponseDTO>(`${this.baseUrl}/login`, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Login with Google OAuth token
   * @param data - Google token data
   * @returns Observable with auth response containing user and tokens
   */
  loginWithGoogle(data: GoogleLoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http
      .post<AuthResponseDTO>(`${this.baseUrl}/google`, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Refresh the access token using refresh token
   * @param data - Refresh token data
   * @returns Observable with new access token
   */
  refreshToken(
    data: RefreshTokenRequestDTO,
  ): Observable<RefreshTokenResponseDTO> {
    return this.http
      .post<RefreshTokenResponseDTO>(`${this.baseUrl}/refresh`, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Logout the current user (invalidate tokens on server)
   * @returns Observable that completes on success
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/logout`, {})
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Get current user profile
   * @returns Observable with user data
   */
  getCurrentUser(): Observable<AuthResponseDTO["user"]> {
    return this.http
      .get<{ user: AuthResponseDTO["user"] }>(`${this.baseUrl}/me`)
      .pipe(
        map((response) => response.user),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Handle HTTP errors and convert to domain errors
   * @param error - HTTP error response
   * @returns Observable that throws appropriate domain error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      return throwError(() => new NetworkError("Unable to connect to server"));
    }

    const errorCode = error.error?.code;
    const errorMessage = error.error?.message || "An unexpected error occurred";

    switch (errorCode) {
      case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
        return throwError(() => new InvalidCredentialsError(errorMessage));
      case AUTH_ERROR_CODES.USER_ALREADY_EXISTS:
        return throwError(
          () => new UserAlreadyExistsError(error.error?.email || "unknown"),
        );
      default:
        return throwError(
          () => new AuthError(errorMessage, errorCode || "UNKNOWN_ERROR"),
        );
    }
  }
}
