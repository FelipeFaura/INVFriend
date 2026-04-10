/**
 * Group Data Transfer Objects
 * DTOs for group-related operations
 */

import { RaffleStatus } from "../../domain/entities/Group";

/**
 * Input DTO for creating a new group
 */
export interface CreateGroupDTO {
  name: string;
  adminId: string;
  budgetLimit: number;
  description?: string;
}

/**
 * Input DTO for updating a group
 */
export interface UpdateGroupDTO {
  name?: string;
  description?: string | null;
  budgetLimit?: number;
}

/**
 * Input DTO for adding a member to a group
 */
export interface AddMemberDTO {
  groupId: string;
  userId: string;
  requesterId: string; // User making the request (must be admin)
}

/**
 * Input DTO for adding a member to a group by email
 */
export interface AddMemberByEmailDTO {
  groupId: string;
  email: string;
  requesterId: string;
}

/**
 * Input DTO for removing a member from a group
 */
export interface RemoveMemberDTO {
  groupId: string;
  userId: string;
  requesterId: string; // User making the request (must be admin)
}

/**
 * DTO representing a group member's details
 */
export interface MemberDetailDTO {
  id: string;
  name: string;
  email: string;
}

/**
 * Output DTO representing a group
 */
export interface GroupResponseDTO {
  id: string;
  name: string;
  description: string | null;
  adminId: string;
  members: string[];
  pendingMembers: string[];
  budgetLimit: number;
  raffleStatus: RaffleStatus;
  raffleDate: number | null;
  createdAt: number;
  updatedAt: number;
  memberDetails?: MemberDetailDTO[];
}

/**
 * Summary DTO for group lists
 */
export interface GroupSummaryDTO {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  budgetLimit: number;
  raffleStatus: RaffleStatus;
  isAdmin: boolean;
  isPending: boolean;
}
