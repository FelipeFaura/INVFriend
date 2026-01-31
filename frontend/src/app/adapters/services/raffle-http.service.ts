/**
 * Raffle HTTP Service
 * Handles HTTP communication with the backend raffle API
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Assignment, RaffleResult } from "../../domain/models/assignment.model";
import {
  PerformRaffleResponseDTO,
  GetAssignmentResponseDTO,
} from "../../application/dto/raffle.dto";
import {
  createRaffleErrorFromCode,
  RaffleError,
  UnknownRaffleError,
} from "../../domain/errors/raffle-errors";

@Injectable({
  providedIn: "root",
})
export class RaffleHttpService {
  private readonly apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  /**
   * Perform raffle for a group (admin only)
   * @param groupId - ID of the group to perform raffle for
   * @returns RaffleResult with raffle date and assignment count
   */
  performRaffle(groupId: string): Observable<RaffleResult> {
    return this.http
      .post<PerformRaffleResponseDTO>(`${this.apiUrl}/${groupId}/raffle`, {})
      .pipe(
        map((response) => this.mapToRaffleResult(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Get the current user's assignment in a group
   * @param groupId - ID of the group
   * @returns Assignment showing who to give a gift to
   */
  getMyAssignment(groupId: string): Observable<Assignment> {
    return this.http
      .get<GetAssignmentResponseDTO>(`${this.apiUrl}/${groupId}/my-assignment`)
      .pipe(
        map((response) => this.mapToAssignment(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Map API response to RaffleResult model
   */
  private mapToRaffleResult(dto: PerformRaffleResponseDTO): RaffleResult {
    return {
      groupId: dto.groupId,
      raffleDate: new Date(dto.raffleDate),
      assignmentCount: dto.assignmentCount,
    };
  }

  /**
   * Map API response to Assignment model
   */
  private mapToAssignment(dto: GetAssignmentResponseDTO): Assignment {
    return {
      id: dto.id,
      groupId: dto.groupId,
      receiverId: dto.receiverId,
      createdAt: new Date(dto.createdAt),
    };
  }

  /**
   * Handle HTTP errors and convert to domain errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let raffleError: RaffleError;

    if (error.error && error.error.code) {
      raffleError = createRaffleErrorFromCode(
        error.error.code,
        error.error.message,
      );
    } else if (error.status === 0) {
      raffleError = new UnknownRaffleError(
        "Unable to connect to server. Please check your connection.",
      );
    } else {
      raffleError = new UnknownRaffleError(
        error.message || "An unexpected error occurred",
      );
    }

    return throwError(() => raffleError);
  }
}
