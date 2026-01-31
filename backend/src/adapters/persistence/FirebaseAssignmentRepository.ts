/**
 * Firebase implementation of IAssignmentRepository
 * Handles assignment persistence using Firestore
 */
import { db } from "../../config/firebase.config";
import { Assignment } from "../../domain/entities/Assignment";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";

/** Firestore collection name for assignments */
const ASSIGNMENTS_COLLECTION = "assignments";

/**
 * Data structure stored in Firestore
 */
interface AssignmentDocument {
  groupId: string;
  receiverId: string;
  secretSantaId: string;
  createdAt: number;
}

/**
 * Firebase Firestore implementation of IAssignmentRepository
 */
export class FirebaseAssignmentRepository implements IAssignmentRepository {
  private readonly collection = db.collection(ASSIGNMENTS_COLLECTION);

  /**
   * Creates a new assignment in Firestore
   */
  async create(assignment: Assignment): Promise<Assignment> {
    const docRef = this.collection.doc(assignment.id);
    const data = this.toDocument(assignment);

    await docRef.set(data);

    return assignment;
  }

  /**
   * Creates multiple assignments atomically using a batch write
   * All assignments are created or none (atomic operation)
   */
  async createBatch(assignments: Assignment[]): Promise<void> {
    if (assignments.length === 0) {
      return;
    }

    const batch = db.batch();

    for (const assignment of assignments) {
      const docRef = this.collection.doc(assignment.id);
      const data = this.toDocument(assignment);
      batch.set(docRef, data);
    }

    await batch.commit();
  }

  /**
   * Finds all assignments for a specific group
   */
  async findByGroupId(groupId: string): Promise<Assignment[]> {
    const snapshot = await this.collection
      .where("groupId", "==", groupId)
      .orderBy("createdAt", "asc")
      .get();

    return snapshot.docs.map((doc) =>
      this.toEntity(doc.id, doc.data() as AssignmentDocument),
    );
  }

  /**
   * Finds all assignments involving a specific user
   * Note: Firestore doesn't support OR queries efficiently,
   * so we need two queries and merge results
   */
  async findByUserId(userId: string): Promise<Assignment[]> {
    // Query for assignments where user is receiver
    const receiverSnapshot = await this.collection
      .where("receiverId", "==", userId)
      .get();

    // Query for assignments where user is secret santa
    const santaSnapshot = await this.collection
      .where("secretSantaId", "==", userId)
      .get();

    // Merge and deduplicate results
    const assignmentMap = new Map<string, Assignment>();

    for (const doc of receiverSnapshot.docs) {
      const assignment = this.toEntity(
        doc.id,
        doc.data() as AssignmentDocument,
      );
      assignmentMap.set(assignment.id, assignment);
    }

    for (const doc of santaSnapshot.docs) {
      const assignment = this.toEntity(
        doc.id,
        doc.data() as AssignmentDocument,
      );
      assignmentMap.set(assignment.id, assignment);
    }

    return Array.from(assignmentMap.values());
  }

  /**
   * Finds assignment for a user in a specific group where they are the secret santa
   */
  async findByGroupAndSecretSanta(
    groupId: string,
    secretSantaId: string,
  ): Promise<Assignment | null> {
    const snapshot = await this.collection
      .where("groupId", "==", groupId)
      .where("secretSantaId", "==", secretSantaId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return this.toEntity(doc.id, doc.data() as AssignmentDocument);
  }

  /**
   * Deletes all assignments for a group
   */
  async deleteByGroupId(groupId: string): Promise<void> {
    const snapshot = await this.collection
      .where("groupId", "==", groupId)
      .get();

    if (snapshot.empty) {
      return;
    }

    const batch = db.batch();
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
    }

    await batch.commit();
  }

  /**
   * Generates a unique identifier using Firestore
   */
  generateId(): string {
    return this.collection.doc().id;
  }

  /**
   * Converts Assignment entity to Firestore document
   */
  private toDocument(assignment: Assignment): AssignmentDocument {
    return {
      groupId: assignment.groupId,
      receiverId: assignment.receiverId,
      secretSantaId: assignment.secretSantaId,
      createdAt: assignment.createdAt,
    };
  }

  /**
   * Converts Firestore document to Assignment entity
   */
  private toEntity(id: string, data: AssignmentDocument): Assignment {
    return Assignment.fromDatabase(
      id,
      data.groupId,
      data.receiverId,
      data.secretSantaId,
      data.createdAt,
    );
  }
}
