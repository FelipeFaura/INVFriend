/**
 * User DTOs - Data Transfer Objects for user-related API responses
 */

/** Backend response DTO for public profile */
export interface UserPublicProfileDTO {
  id: string;
  name: string;
  photoUrl: string | null;
}

/** Backend response DTO for all my assignments */
export interface MyAssignmentSummaryDTO {
  assignmentId: string;
  groupId: string;
  groupName: string;
  budgetLimit: number;
  receiverId: string;
  createdAt: number;
}

/** Wrapper for assignments list response */
export interface GetAllMyAssignmentsResponseDTO {
  assignments: MyAssignmentSummaryDTO[];
}
