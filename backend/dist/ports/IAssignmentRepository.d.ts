/**
 * IAssignmentRepository - Assignment repository port interface
 * Defines the contract for assignment persistence operations
 */
import { Assignment } from "../domain/entities/Assignment";
/**
 * Repository interface for Assignment entity
 * Implements the Repository pattern for data persistence abstraction
 */
export interface IAssignmentRepository {
    /**
     * Creates a new assignment in the database
     * @param assignment - Assignment entity to persist
     * @returns The created assignment
     * @throws Error if persistence fails
     */
    create(assignment: Assignment): Promise<Assignment>;
    /**
     * Creates multiple assignments atomically (for raffle results)
     * @param assignments - Array of assignments to persist
     * @throws Error if batch persistence fails (all or nothing)
     */
    createBatch(assignments: Assignment[]): Promise<void>;
    /**
     * Finds all assignments for a specific group
     * @param groupId - Group unique identifier
     * @returns Array of assignments (empty if none found)
     */
    findByGroupId(groupId: string): Promise<Assignment[]>;
    /**
     * Finds all assignments involving a specific user
     * This includes assignments where user is either receiver or secret santa
     * @param userId - User unique identifier
     * @returns Array of assignments (empty if none found)
     */
    findByUserId(userId: string): Promise<Assignment[]>;
    /**
     * Finds assignment for a specific user in a specific group
     * Returns the assignment where the user is the SECRET SANTA
     * (i.e., who they need to give a gift to)
     * @param groupId - Group unique identifier
     * @param secretSantaId - User who is the secret santa
     * @returns Assignment or null if not found
     */
    findByGroupAndSecretSanta(groupId: string, secretSantaId: string): Promise<Assignment | null>;
    /**
     * Deletes all assignments for a group
     * Used when resetting a raffle or deleting a group
     * @param groupId - Group unique identifier
     */
    deleteByGroupId(groupId: string): Promise<void>;
    /**
     * Generates a unique identifier for a new assignment
     * @returns Unique identifier string
     */
    generateId(): string;
}
//# sourceMappingURL=IAssignmentRepository.d.ts.map