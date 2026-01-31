import { Group } from "../../domain/entities/Group";
import { IGroupRepository } from "../../ports/IGroupRepository";
/**
 * Firebase Firestore implementation of IGroupRepository
 */
export declare class FirebaseGroupRepository implements IGroupRepository {
    private readonly collection;
    /**
     * Creates a new group in Firestore
     */
    create(group: Group): Promise<Group>;
    /**
     * Finds a group by its unique identifier
     */
    findById(id: string): Promise<Group | null>;
    /**
     * Finds all groups where a user is a member
     */
    findByMemberId(userId: string): Promise<Group[]>;
    /**
     * Finds all groups administered by a user
     */
    findByAdminId(adminId: string): Promise<Group[]>;
    /**
     * Updates an existing group
     */
    update(group: Group): Promise<void>;
    /**
     * Deletes a group by its identifier
     */
    delete(id: string): Promise<void>;
    /**
     * Generates a unique identifier for a new group
     */
    generateId(): string;
    /**
     * Converts a Group entity to Firestore document format
     */
    private toDocument;
    /**
     * Converts a Firestore document to Group entity
     */
    private toEntity;
}
//# sourceMappingURL=FirebaseGroupRepository.d.ts.map