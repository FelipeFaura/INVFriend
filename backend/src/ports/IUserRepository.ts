/**
 * IUserRepository - User repository port interface
 * Defines the contract for user data access
 */
import { User } from "../domain/entities/User";

export interface IUserRepository {
  /**
   * Finds a user by their unique identifier
   * @param id - User unique identifier
   * @returns User entity or null if not found
   */
  findById(id: string): Promise<User | null>;
}
