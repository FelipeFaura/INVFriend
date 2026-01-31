/**
 * Group HTTP Service
 * Handles HTTP communication with the backend group API
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Group, GroupSummary } from "../../domain/models/group.model";
import {
  CreateGroupDTO,
  UpdateGroupDTO,
  AddMemberDTO,
  GroupResponseDTO,
  GroupListResponseDTO,
  DeleteGroupResponseDTO,
} from "../../application/dto/group.dto";
import {
  createGroupErrorFromCode,
  GroupError,
} from "../../domain/errors/group-errors";

@Injectable({
  providedIn: "root",
})
export class GroupHttpService {
  private readonly apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new group
   */
  createGroup(dto: CreateGroupDTO): Observable<Group> {
    return this.http.post<GroupResponseDTO>(this.apiUrl, dto).pipe(
      map((response) => this.mapToGroup(response)),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Get all groups for the current user
   */
  getGroups(): Observable<GroupSummary[]> {
    return this.http.get<GroupListResponseDTO>(this.apiUrl).pipe(
      map((response) => response.groups),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Get a specific group by ID
   */
  getGroupById(id: string): Observable<Group> {
    return this.http.get<GroupResponseDTO>(`${this.apiUrl}/${id}`).pipe(
      map((response) => this.mapToGroup(response)),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Update a group
   */
  updateGroup(id: string, dto: UpdateGroupDTO): Observable<Group> {
    return this.http.put<GroupResponseDTO>(`${this.apiUrl}/${id}`, dto).pipe(
      map((response) => this.mapToGroup(response)),
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Delete a group
   */
  deleteGroup(id: string): Observable<DeleteGroupResponseDTO> {
    return this.http
      .delete<DeleteGroupResponseDTO>(`${this.apiUrl}/${id}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Add a member to a group
   */
  addMember(groupId: string, userId: string): Observable<Group> {
    const dto: AddMemberDTO = { userId };
    return this.http
      .post<GroupResponseDTO>(`${this.apiUrl}/${groupId}/members`, dto)
      .pipe(
        map((response) => this.mapToGroup(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Remove a member from a group
   */
  removeMember(groupId: string, userId: string): Observable<Group> {
    return this.http
      .delete<GroupResponseDTO>(`${this.apiUrl}/${groupId}/members/${userId}`)
      .pipe(
        map((response) => this.mapToGroup(response)),
        catchError((error) => this.handleError(error)),
      );
  }

  /**
   * Map API response to domain model
   */
  private mapToGroup(dto: GroupResponseDTO): Group {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      adminId: dto.adminId,
      members: dto.members,
      budgetLimit: dto.budgetLimit,
      raffleStatus: dto.raffleStatus,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  /**
   * Handle HTTP errors and convert to domain errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error && error.error.code) {
      const groupError: GroupError = createGroupErrorFromCode(
        error.error.code,
        error.error.message,
      );
      return throwError(() => groupError);
    }

    // Network or other errors
    return throwError(
      () => new Error(error.message || "An unexpected error occurred"),
    );
  }
}
