/**
 * Wish Repository Interface
 * Port for wish persistence operations
 */
import { Wish } from "../domain/entities/Wish";

export interface IWishRepository {
  /**
   * Save a new wish
   */
  save(wish: Wish): Promise<void>;

  /**
   * Find a wish by ID
   */
  findById(id: string): Promise<Wish | null>;

  /**
   * Find all wishes for a user in a group
   */
  findByUserInGroup(userId: string, groupId: string): Promise<Wish[]>;

  /**
   * Find all wishes in a group
   */
  findByGroup(groupId: string): Promise<Wish[]>;

  /**
   * Update a wish
   */
  update(wish: Wish): Promise<void>;

  /**
   * Delete a wish
   */
  delete(id: string): Promise<void>;

  /**
   * Delete all wishes for a user in a group
   */
  deleteAllByUserInGroup(userId: string, groupId: string): Promise<void>;
}
