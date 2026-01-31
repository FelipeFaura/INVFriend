/**
 * Group DTOs
 * Data Transfer Objects for group API communication
 */

import { RaffleStatus } from "../../domain/models/group.model";

/**
 * DTO for creating a new group
 */
export interface CreateGroupDTO {
  name: string;
  description?: string;
  budgetLimit: number;
}

/**
 * DTO for updating a group
 */
export interface UpdateGroupDTO {
  name?: string;
  description?: string;
  budgetLimit?: number;
}

/**
 * DTO for adding a member to a group
 */
export interface AddMemberDTO {
  userId: string;
}

/**
 * Response DTO for a full group
 */
export interface GroupResponseDTO {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  members: string[];
  budgetLimit: number;
  raffleStatus: RaffleStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response DTO for group summaries (list view)
 */
export interface GroupSummaryDTO {
  id: string;
  name: string;
  memberCount: number;
  isAdmin: boolean;
  raffleStatus: RaffleStatus;
}

/**
 * Response DTO for list of groups
 */
export interface GroupListResponseDTO {
  groups: GroupSummaryDTO[];
}

/**
 * Response DTO for delete operation
 */
export interface DeleteGroupResponseDTO {
  success: boolean;
  message: string;
}

/**
 * Error response from backend
 */
export interface GroupErrorResponseDTO {
  error: string;
  code: string;
  message: string;
}
