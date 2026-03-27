/**
 * Assignment HTTP Service
 * Handles HTTP communication with the backend assignment API
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { MyAssignmentSummary } from "../../domain/models/assignment.model";
import { GetAllMyAssignmentsResponseDTO } from "../../application/dto/user.dto";

@Injectable({
  providedIn: "root",
})
export class AssignmentHttpService {
  private readonly apiUrl = `${environment.apiUrl}/assignments`;

  constructor(private http: HttpClient) {}

  /**
   * Get all of the current user's Secret Santa assignments across groups
   * @returns Array of assignment summaries with group info
   */
  getAllMyAssignments(): Observable<MyAssignmentSummary[]> {
    return this.http
      .get<GetAllMyAssignmentsResponseDTO>(`${this.apiUrl}/mine`)
      .pipe(
        map((response) => response.assignments),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string;

    if (error.status === 0) {
      message = "Unable to connect to server. Please check your connection.";
    } else {
      message = error.error?.message || "An unexpected error occurred";
    }

    return throwError(() => new Error(message));
  }
}
