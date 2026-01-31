/**
 * Assignment Domain Model
 * Represents a Secret Santa assignment
 */

/**
 * Assignment model - represents who a user gives a gift to
 */
export interface Assignment {
  /** Unique identifier */
  id: string;
  /** Group this assignment belongs to */
  groupId: string;
  /** User ID of who receives the gift (who you give a gift to) */
  receiverId: string;
  /** When the assignment was created */
  createdAt: Date;
}

/**
 * Result of performing a raffle
 */
export interface RaffleResult {
  /** Group ID */
  groupId: string;
  /** Timestamp when raffle was performed */
  raffleDate: Date;
  /** Number of assignments created */
  assignmentCount: number;
}
