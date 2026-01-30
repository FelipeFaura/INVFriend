/**
 * User entity - Represents a user in the system
 * This is an immutable entity following domain-driven design principles
 */
export declare class User {
    readonly id: string;
    readonly email: string;
    readonly name: string;
    readonly photoUrl: string | null;
    readonly createdAt: number;
    readonly updatedAt: number;
    private constructor();
    /**
     * Factory method to create a new user
     * @param id - User unique identifier (Firebase UID)
     * @param email - User email address
     * @param name - User full name
     * @param photoUrl - Optional user photo URL
     * @returns New User instance
     */
    static create(id: string, email: string, name: string, photoUrl?: string | null): User;
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
    static fromDatabase(id: string, email: string, name: string, photoUrl: string | null, createdAt: number, updatedAt: number): User;
    /**
     * Updates the user information
     * @param name - Optional new name
     * @param photoUrl - Optional new photo URL
     * @returns New User instance with updated data
     */
    update(name?: string, photoUrl?: string | null): User;
    /**
     * Converts the entity to a serializable object
     * @returns Plain object representation of the user
     */
    toJSON(): {
        id: string;
        email: string;
        name: string;
        photoUrl: string | null;
        createdAt: number;
        updatedAt: number;
    };
}
//# sourceMappingURL=User.d.ts.map