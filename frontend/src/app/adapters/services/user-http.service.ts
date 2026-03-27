/**
 * User HTTP Service
 * Handles HTTP communication with the backend user API
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { UserPublicProfile } from "../../domain/models/user.model";
import { UserPublicProfileDTO } from "../../application/dto/user.dto";

@Injectable({
  providedIn: "root",
})
export class UserHttpService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get a user's public profile by ID
   * @param userId - ID of the user to fetch
   * @returns UserPublicProfile with name and photoUrl
   */
  getUserPublicProfile(userId: string): Observable<UserPublicProfile> {
    return this.http
      .get<UserPublicProfileDTO>(`${this.apiUrl}/${userId}/public-profile`)
      .pipe(
        map((dto) => this.mapToUserPublicProfile(dto)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Map API response to UserPublicProfile model
   */
  private mapToUserPublicProfile(dto: UserPublicProfileDTO): UserPublicProfile {
    return {
      id: dto.id,
      name: dto.name,
      photoUrl: dto.photoUrl,
    };
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string;

    if (error.status === 0) {
      message = "Unable to connect to server. Please check your connection.";
    } else if (error.status === 404) {
      message = "User not found.";
    } else {
      message = error.error?.message || "An unexpected error occurred";
    }

    return throwError(() => new Error(message));
  }
}
