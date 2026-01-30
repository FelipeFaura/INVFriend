/**
 * User entity - Represents a user in the system
 * This is an immutable entity following domain-driven design principles
 */
export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly photoUrl: string | null,
    readonly createdAt: number,
    readonly updatedAt: number,
  ) {}

  /**
   * Factory method to create a new user
   * @param id - User unique identifier (Firebase UID)
   * @param email - User email address
   * @param name - User full name
   * @param photoUrl - Optional user photo URL
   * @returns New User instance
   */
  static create(
    id: string,
    email: string,
    name: string,
    photoUrl?: string | null,
  ): User {
    const now = Date.now();
    return new User(id, email, name, photoUrl || null, now, now);
  }

  /**
   * Creates a User from existing data (used when loading from database)
   * @param id - User unique identifier
   * @param email - User email
   * @param name - User name
   * @param photoUrl - User photo URL
   * @param createdAt - Creation timestamp
   * @param updatedAt - Update timestamp
   * @returns User instance
   */
  static fromDatabase(
    id: string,
    email: string,
    name: string,
    photoUrl: string | null,
    createdAt: number,
    updatedAt: number,
  ): User {
    return new User(id, email, name, photoUrl, createdAt, updatedAt);
  }

  /**
   * Updates the user information
   * @param name - Optional new name
   * @param photoUrl - Optional new photo URL
   * @returns New User instance with updated data
   */
  update(name?: string, photoUrl?: string | null): User {
    return new User(
      this.id,
      this.email,
      name || this.name,
      photoUrl !== undefined ? photoUrl : this.photoUrl,
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Converts the entity to a serializable object
   * @returns Plain object representation of the user
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      photoUrl: this.photoUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
