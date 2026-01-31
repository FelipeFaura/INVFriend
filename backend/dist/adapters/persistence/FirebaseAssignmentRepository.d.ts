import { Assignment } from "../../domain/entities/Assignment";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";
/**
 * Firebase Firestore implementation of IAssignmentRepository
 */
export declare class FirebaseAssignmentRepository implements IAssignmentRepository {
    private readonly collection;
    /**
     * Creates a new assignment in Firestore
     */
    create(assignment: Assignment): Promise<Assignment>;
    /**
     * Creates multiple assignments atomically using a batch write
     * All assignments are created or none (atomic operation)
     */
    createBatch(assignments: Assignment[]): Promise<void>;
    /**
     * Finds all assignments for a specific group
     */
    findByGroupId(groupId: string): Promise<Assignment[]>;
    /**
     * Finds all assignments involving a specific user
     * Note: Firestore doesn't support OR queries efficiently,
     * so we need two queries and merge results
     */
    findByUserId(userId: string): Promise<Assignment[]>;
    /**
     * Finds assignment for a user in a specific group where they are the secret santa
     */
    findByGroupAndSecretSanta(groupId: string, secretSantaId: string): Promise<Assignment | null>;
    /**
     * Deletes all assignments for a group
     */
    deleteByGroupId(groupId: string): Promise<void>;
    /**
     * Generates a unique identifier using Firestore
     */
    generateId(): string;
    /**
     * Converts Assignment entity to Firestore document
     */
    private toDocument;
    /**
     * Converts Firestore document to Assignment entity
     */
    private toEntity;
}
//# sourceMappingURL=FirebaseAssignmentRepository.d.ts.map