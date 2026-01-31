/**
 * Firebase implementation of IGroupRepository
 * Handles group persistence using Firestore
 */
import { db } from "../../config/firebase.config";
import { Group, RaffleStatus } from "../../domain/entities/Group";
import { GroupNotFoundError } from "../../domain/errors/GroupErrors";
import { IGroupRepository } from "../../ports/IGroupRepository";

/** Firestore collection name for groups */
const GROUPS_COLLECTION = "groups";

/**
 * Data structure stored in Firestore
 */
interface GroupDocument {
  name: string;
  description: string | null;
  adminId: string;
  members: string[];
  budgetLimit: number;
  raffleStatus: RaffleStatus;
  raffleDate: number | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * Firebase Firestore implementation of IGroupRepository
 */
export class FirebaseGroupRepository implements IGroupRepository {
  private readonly collection = db.collection(GROUPS_COLLECTION);

  /**
   * Creates a new group in Firestore
   */
  async create(group: Group): Promise<Group> {
    const docRef = this.collection.doc(group.id);
    const data = this.toDocument(group);

    await docRef.set(data);

    return group;
  }

  /**
   * Finds a group by its unique identifier
   */
  async findById(id: string): Promise<Group | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    return this.toEntity(doc.id, doc.data() as GroupDocument);
  }

  /**
   * Finds all groups where a user is a member
   */
  async findByMemberId(userId: string): Promise<Group[]> {
    const snapshot = await this.collection
      .where("members", "array-contains", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) =>
      this.toEntity(doc.id, doc.data() as GroupDocument),
    );
  }

  /**
   * Finds all groups administered by a user
   */
  async findByAdminId(adminId: string): Promise<Group[]> {
    const snapshot = await this.collection
      .where("adminId", "==", adminId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) =>
      this.toEntity(doc.id, doc.data() as GroupDocument),
    );
  }

  /**
   * Updates an existing group
   */
  async update(group: Group): Promise<void> {
    const docRef = this.collection.doc(group.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new GroupNotFoundError(group.id);
    }

    const data = this.toDocument(group);
    await docRef.update(data as FirebaseFirestore.UpdateData<GroupDocument>);
  }

  /**
   * Deletes a group by its identifier
   */
  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new GroupNotFoundError(id);
    }

    await docRef.delete();
  }

  /**
   * Generates a unique identifier for a new group
   */
  generateId(): string {
    return this.collection.doc().id;
  }

  /**
   * Converts a Group entity to Firestore document format
   */
  private toDocument(group: Group): GroupDocument {
    return {
      name: group.name,
      description: group.description,
      adminId: group.adminId,
      members: [...group.members],
      budgetLimit: group.budgetLimit,
      raffleStatus: group.raffleStatus,
      raffleDate: group.raffleDate,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  /**
   * Converts a Firestore document to Group entity
   */
  private toEntity(id: string, data: GroupDocument): Group {
    return Group.fromDatabase(
      id,
      data.name,
      data.description,
      data.adminId,
      data.members,
      data.budgetLimit,
      data.raffleStatus,
      data.raffleDate,
      data.createdAt,
      data.updatedAt,
    );
  }
}
