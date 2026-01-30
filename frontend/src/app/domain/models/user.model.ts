/**
 * User model - Represents a user in the frontend application
 * Aligned with backend User entity structure
 */

/**
 * User interface representing the authenticated user data
 */
export interface User {
  /** User unique identifier (Firebase UID) */
  readonly id: string;
  /** User email address */
  readonly email: string;
  /** User display name */
  readonly name: string;
  /** Optional user photo URL */
  readonly photoUrl: string | null;
  /** Timestamp when user was created */
  readonly createdAt: number;
  /** Timestamp when user was last updated */
  readonly updatedAt: number;
}

/**
 * Type for creating a new user (without timestamps)
 */
export type CreateUserData = Pick<User, "id" | "email" | "name"> & {
  photoUrl?: string | null;
};

/**
 * Type for updating user profile
 */
export type UpdateUserData = Partial<Pick<User, "name" | "photoUrl">>;

/**
 * Utility function to create a User object with default values
 * @param data - Partial user data
 * @returns Complete User object
 */
export function createUser(data: CreateUserData): User {
  const now = Date.now();
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    photoUrl: data.photoUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };
}
