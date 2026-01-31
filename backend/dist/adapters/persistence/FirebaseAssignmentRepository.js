"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAssignmentRepository = void 0;
/**
 * Firebase implementation of IAssignmentRepository
 * Handles assignment persistence using Firestore
 */
const firebase_config_1 = require("../../config/firebase.config");
const Assignment_1 = require("../../domain/entities/Assignment");
/** Firestore collection name for assignments */
const ASSIGNMENTS_COLLECTION = "assignments";
/**
 * Firebase Firestore implementation of IAssignmentRepository
 */
class FirebaseAssignmentRepository {
    constructor() {
        this.collection = firebase_config_1.db.collection(ASSIGNMENTS_COLLECTION);
    }
    /**
     * Creates a new assignment in Firestore
     */
    async create(assignment) {
        const docRef = this.collection.doc(assignment.id);
        const data = this.toDocument(assignment);
        await docRef.set(data);
        return assignment;
    }
    /**
     * Creates multiple assignments atomically using a batch write
     * All assignments are created or none (atomic operation)
     */
    async createBatch(assignments) {
        if (assignments.length === 0) {
            return;
        }
        const batch = firebase_config_1.db.batch();
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
    async findByGroupId(groupId) {
        const snapshot = await this.collection
            .where("groupId", "==", groupId)
            .orderBy("createdAt", "asc")
            .get();
        return snapshot.docs.map((doc) => this.toEntity(doc.id, doc.data()));
    }
    /**
     * Finds all assignments involving a specific user
     * Note: Firestore doesn't support OR queries efficiently,
     * so we need two queries and merge results
     */
    async findByUserId(userId) {
        // Query for assignments where user is receiver
        const receiverSnapshot = await this.collection
            .where("receiverId", "==", userId)
            .get();
        // Query for assignments where user is secret santa
        const santaSnapshot = await this.collection
            .where("secretSantaId", "==", userId)
            .get();
        // Merge and deduplicate results
        const assignmentMap = new Map();
        for (const doc of receiverSnapshot.docs) {
            const assignment = this.toEntity(doc.id, doc.data());
            assignmentMap.set(assignment.id, assignment);
        }
        for (const doc of santaSnapshot.docs) {
            const assignment = this.toEntity(doc.id, doc.data());
            assignmentMap.set(assignment.id, assignment);
        }
        return Array.from(assignmentMap.values());
    }
    /**
     * Finds assignment for a user in a specific group where they are the secret santa
     */
    async findByGroupAndSecretSanta(groupId, secretSantaId) {
        const snapshot = await this.collection
            .where("groupId", "==", groupId)
            .where("secretSantaId", "==", secretSantaId)
            .limit(1)
            .get();
        if (snapshot.empty) {
            return null;
        }
        const doc = snapshot.docs[0];
        return this.toEntity(doc.id, doc.data());
    }
    /**
     * Deletes all assignments for a group
     */
    async deleteByGroupId(groupId) {
        const snapshot = await this.collection
            .where("groupId", "==", groupId)
            .get();
        if (snapshot.empty) {
            return;
        }
        const batch = firebase_config_1.db.batch();
        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
        }
        await batch.commit();
    }
    /**
     * Generates a unique identifier using Firestore
     */
    generateId() {
        return this.collection.doc().id;
    }
    /**
     * Converts Assignment entity to Firestore document
     */
    toDocument(assignment) {
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
    toEntity(id, data) {
        return Assignment_1.Assignment.fromDatabase(id, data.groupId, data.receiverId, data.secretSantaId, data.createdAt);
    }
}
exports.FirebaseAssignmentRepository = FirebaseAssignmentRepository;
//# sourceMappingURL=FirebaseAssignmentRepository.js.map