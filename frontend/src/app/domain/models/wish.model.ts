/**
 * Wish Domain Model
 * Represents a gift wish in the application
 */

/**
 * Full Wish model with all properties
 */
export interface Wish {
  id: string;
  groupId: string;
  userId: string;
  title: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Summary view for wish lists
 */
export interface WishSummary {
  id: string;
  title: string;
  description?: string;
  url?: string;
  estimatedPrice?: number;
  priority?: number;
}
