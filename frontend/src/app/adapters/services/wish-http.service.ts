/**
 * Wish HTTP Service
 * Handles HTTP communication with the backend wish API
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Wish } from "../../domain/models/wish.model";
import {
  CreateWishDTO,
  UpdateWishDTO,
  WishResponseDTO,
  WishListResponseDTO,
  DeleteWishResponseDTO,
} from "../../application/dto/wish.dto";
import {
  createWishErrorFromCode,
  WishError,
  WishValidationError,
} from "../../domain/errors/wish-errors";

@Injectable({
  providedIn: "root",
})
export class WishHttpService {
  private getApiUrl(groupId: string): string {
    return `${environment.apiUrl}/groups/${groupId}/wishes`;
  }

  constructor(private http: HttpClient) {}

  /**
   * Create a new wish
   */
  createWish(groupId: string, dto: CreateWishDTO): Observable<Wish> {
    return this.http.post<WishResponseDTO>(this.getApiUrl(groupId), dto).pipe(
      map((response) => this.mapToWish(response)),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Get my wishes in a group
   */
  getMyWishes(groupId: string): Observable<Wish[]> {
    return this.http.get<WishListResponseDTO>(this.getApiUrl(groupId)).pipe(
      map((response) => response.wishes.map((w) => this.mapToWish(w))),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Get assigned recipient's wishes (after raffle)
   */
  getAssignedWishes(groupId: string): Observable<Wish[]> {
    return this.http
      .get<WishListResponseDTO>(`${this.getApiUrl(groupId)}/assigned`)
      .pipe(
        map((response) => response.wishes.map((w) => this.mapToWish(w))),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Update a wish
   */
  updateWish(
    groupId: string,
    wishId: string,
    dto: UpdateWishDTO,
  ): Observable<Wish> {
    return this.http
      .put<WishResponseDTO>(`${this.getApiUrl(groupId)}/${wishId}`, dto)
      .pipe(
        map((response) => this.mapToWish(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Delete a wish
   */
  deleteWish(
    groupId: string,
    wishId: string,
  ): Observable<DeleteWishResponseDTO> {
    return this.http
      .delete<DeleteWishResponseDTO>(`${this.getApiUrl(groupId)}/${wishId}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Map API response to Wish model
   */
  private mapToWish(dto: WishResponseDTO): Wish {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error?.code) {
      return throwError(() =>
        createWishErrorFromCode(error.error.code, error.error.message),
      );
    }

    if (error.status === 0) {
      return throwError(
        () => new WishValidationError("Unable to connect to server"),
      );
    }

    return throwError(
      () =>
        new WishValidationError(
          error.message || "An unexpected error occurred",
        ),
    );
  }
}
