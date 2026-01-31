/**
 * Group Domain Model
 * Represents a Secret Santa group in the application
 */

export type RaffleStatus = "pending" | "completed";

/**
 * Full Group model with all properties
 */
export interface Group {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  members: string[];
  budgetLimit: number;
  raffleStatus: RaffleStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Summary view for group lists
 * Reduces payload size for list views
 */
export interface GroupSummary {
  id: string;
  name: string;
  memberCount: number;
  isAdmin: boolean;
  raffleStatus: RaffleStatus;
}

/**
 * Group member info for display
 */
export interface GroupMember {
  userId: string;
  displayName?: string;
  email?: string;
  isAdmin: boolean;
}
