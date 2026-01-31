"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
/**
 * Assignment entity - Represents a Secret Santa assignment
 * Links a receiver (who gets a gift) with their secret santa (who gives the gift)
 * This is an immutable entity following domain-driven design principles
 */
class Assignment {
    constructor(
    /** Unique identifier for this assignment */
    id, 
    /** ID of the group this assignment belongs to */
    groupId, 
    /** User ID of the person who receives the gift */
    receiverId, 
    /** User ID of the secret santa (who gives the gift) */
    secretSantaId, 
    /** Timestamp when assignment was created */
    createdAt) {
        this.id = id;
        this.groupId = groupId;
        this.receiverId = receiverId;
        this.secretSantaId = secretSantaId;
        this.createdAt = createdAt;
    }
    /**
     * Factory method to create a new assignment
     * @param id - Unique identifier for this assignment
     * @param groupId - ID of the group this assignment belongs to
     * @param receiverId - User ID of the person who receives the gift
     * @param secretSantaId - User ID of the secret santa
     * @returns New Assignment instance
     * @throws Error if receiverId equals secretSantaId
     */
    static create(id, groupId, receiverId, secretSantaId) {
        // Validate that someone isn't their own secret santa
        if (receiverId === secretSantaId) {
            throw new Error("A person cannot be their own secret santa");
        }
        return new Assignment(id, groupId, receiverId, secretSantaId, Date.now());
    }
    /**
     * Creates an Assignment from existing data (used when loading from database)
     * @param id - Assignment unique identifier
     * @param groupId - Group ID
     * @param receiverId - Receiver user ID
     * @param secretSantaId - Secret santa user ID
     * @param createdAt - Creation timestamp
     * @returns Assignment instance with provided data
     */
    static fromDatabase(id, groupId, receiverId, secretSantaId, createdAt) {
        return new Assignment(id, groupId, receiverId, secretSantaId, createdAt);
    }
    /**
     * Check if this assignment involves a specific user (either as receiver or santa)
     * @param userId - User ID to check
     * @returns true if user is involved in this assignment
     */
    involvesUser(userId) {
        return this.receiverId === userId || this.secretSantaId === userId;
    }
    /**
     * Check if a user is the secret santa in this assignment
     * @param userId - User ID to check
     * @returns true if user is the secret santa
     */
    isSecretSanta(userId) {
        return this.secretSantaId === userId;
    }
    /**
     * Check if a user is the receiver in this assignment
     * @param userId - User ID to check
     * @returns true if user is the receiver
     */
    isReceiver(userId) {
        return this.receiverId === userId;
    }
}
exports.Assignment = Assignment;
//# sourceMappingURL=Assignment.js.map