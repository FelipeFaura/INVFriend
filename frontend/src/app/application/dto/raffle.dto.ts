/**
 * Raffle Data Transfer Objects
 * DTOs for raffle-related operations
 */

/**
 * Response DTO for perform raffle operation
 */
export interface PerformRaffleResponseDTO {
  groupId: string;
  raffleDate: number; // Unix timestamp
  assignmentCount: number;
}

/**
 * Response DTO for get my assignment operation
 */
export interface GetAssignmentResponseDTO {
  id: string;
  groupId: string;
  receiverId: string;
  createdAt: number; // Unix timestamp
}
