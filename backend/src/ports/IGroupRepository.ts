/**
 * IGroupRepository - Group repository port interface
 * Defines the contract for group persistence operations
 */
import { Group } from "../domain/entities/Group";

/**
 * Repository interface for Group entity
 * Implements the Repository pattern for data persistence abstraction
 */
export interface IGroupRepository {
  /**
   * Creates a new group in the database
   * @param group - Group entity to persist
   * @returns The created group with any generated fields
   * @throws Error if persistence fails
   */
  create(group: Group): Promise<Group>;

  /**
   * Finds a group by its unique identifier
   * @param id - Group unique identifier
   * @returns Group entity or null if not found
   */
  findById(id: string): Promise<Group | null>;

  /**
   * Finds all groups where a user is a member
   * @param userId - User unique identifier
   * @returns Array of groups (empty if none found)
   */
  findByMemberId(userId: string): Promise<Group[]>;

  /**
   * Finds all groups administered by a user
   * @param adminId - Admin user unique identifier
   * @returns Array of groups (empty if none found)
   */
  findByAdminId(adminId: string): Promise<Group[]>;

  /**
   * Updates an existing group
   * @param group - Group entity with updated data
   * @throws GroupNotFoundError if group doesn't exist
   */
  update(group: Group): Promise<void>;

  /**
   * Deletes a group by its identifier
   * @param id - Group unique identifier
   * @throws GroupNotFoundError if group doesn't exist
   */
  delete(id: string): Promise<void>;

  /**
   * Generates a unique identifier for a new group
   * @returns A unique string identifier
   */
  generateId(): string;
}
