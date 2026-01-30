"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/**
 * User entity - Represents a user in the system
 * This is an immutable entity following domain-driven design principles
 */
class User {
    constructor(id, email, name, photoUrl, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.photoUrl = photoUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    /**
     * Factory method to create a new user
     * @param id - User unique identifier (Firebase UID)
     * @param email - User email address
     * @param name - User full name
     * @param photoUrl - Optional user photo URL
     * @returns New User instance
     */
    static create(id, email, name, photoUrl) {
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
    static fromDatabase(id, email, name, photoUrl, createdAt, updatedAt) {
        return new User(id, email, name, photoUrl, createdAt, updatedAt);
    }
    /**
     * Updates the user information
     * @param name - Optional new name
     * @param photoUrl - Optional new photo URL
     * @returns New User instance with updated data
     */
    update(name, photoUrl) {
        return new User(this.id, this.email, name || this.name, photoUrl !== undefined ? photoUrl : this.photoUrl, this.createdAt, Date.now());
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
exports.User = User;
//# sourceMappingURL=User.js.map