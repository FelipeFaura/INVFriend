/**
 * Assignment entity - Represents a Secret Santa assignment
 * Links a receiver (who gets a gift) with their secret santa (who gives the gift)
 * This is an immutable entity following domain-driven design principles
 */
export declare class Assignment {
    /** Unique identifier for this assignment */
    readonly id: string;
    /** ID of the group this assignment belongs to */
    readonly groupId: string;
    /** User ID of the person who receives the gift */
    readonly receiverId: string;
    /** User ID of the secret santa (who gives the gift) */
    readonly secretSantaId: string;
    /** Timestamp when assignment was created */
    readonly createdAt: number;
    private constructor();
    /**
     * Factory method to create a new assignment
     * @param id - Unique identifier for this assignment
     * @param groupId - ID of the group this assignment belongs to
     * @param receiverId - User ID of the person who receives the gift
     * @param secretSantaId - User ID of the secret santa
     * @returns New Assignment instance
     * @throws Error if receiverId equals secretSantaId
     */
    static create(id: string, groupId: string, receiverId: string, secretSantaId: string): Assignment;
    /**
     * Creates an Assignment from existing data (used when loading from database)
     * @param id - Assignment unique identifier
     * @param groupId - Group ID
     * @param receiverId - Receiver user ID
     * @param secretSantaId - Secret santa user ID
     * @param createdAt - Creation timestamp
     * @returns Assignment instance with provided data
     */
    static fromDatabase(id: string, groupId: string, receiverId: string, secretSantaId: string, createdAt: number): Assignment;
    /**
     * Check if this assignment involves a specific user (either as receiver or santa)
     * @param userId - User ID to check
     * @returns true if user is involved in this assignment
     */
    involvesUser(userId: string): boolean;
    /**
     * Check if a user is the secret santa in this assignment
     * @param userId - User ID to check
     * @returns true if user is the secret santa
     */
    isSecretSanta(userId: string): boolean;
    /**
     * Check if a user is the receiver in this assignment
     * @param userId - User ID to check
     * @returns true if user is the receiver
     */
    isReceiver(userId: string): boolean;
}
//# sourceMappingURL=Assignment.d.ts.map