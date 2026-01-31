"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseGroupRepository = void 0;
/**
 * Firebase implementation of IGroupRepository
 * Handles group persistence using Firestore
 */
const firebase_config_1 = require("../../config/firebase.config");
const Group_1 = require("../../domain/entities/Group");
const GroupErrors_1 = require("../../domain/errors/GroupErrors");
/** Firestore collection name for groups */
const GROUPS_COLLECTION = "groups";
/**
 * Firebase Firestore implementation of IGroupRepository
 */
class FirebaseGroupRepository {
    constructor() {
        this.collection = firebase_config_1.db.collection(GROUPS_COLLECTION);
    }
    /**
     * Creates a new group in Firestore
     */
    async create(group) {
        const docRef = this.collection.doc(group.id);
        const data = this.toDocument(group);
        await docRef.set(data);
        return group;
    }
    /**
     * Finds a group by its unique identifier
     */
    async findById(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            return null;
        }
        return this.toEntity(doc.id, doc.data());
    }
    /**
     * Finds all groups where a user is a member
     */
    async findByMemberId(userId) {
        const snapshot = await this.collection
            .where("members", "array-contains", userId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => this.toEntity(doc.id, doc.data()));
    }
    /**
     * Finds all groups administered by a user
     */
    async findByAdminId(adminId) {
        const snapshot = await this.collection
            .where("adminId", "==", adminId)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => this.toEntity(doc.id, doc.data()));
    }
    /**
     * Updates an existing group
     */
    async update(group) {
        const docRef = this.collection.doc(group.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new GroupErrors_1.GroupNotFoundError(group.id);
        }
        const data = this.toDocument(group);
        await docRef.update(data);
    }
    /**
     * Deletes a group by its identifier
     */
    async delete(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new GroupErrors_1.GroupNotFoundError(id);
        }
        await docRef.delete();
    }
    /**
     * Generates a unique identifier for a new group
     */
    generateId() {
        return this.collection.doc().id;
    }
    /**
     * Converts a Group entity to Firestore document format
     */
    toDocument(group) {
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
    toEntity(id, data) {
        return Group_1.Group.fromDatabase(id, data.name, data.description, data.adminId, data.members, data.budgetLimit, data.raffleStatus, data.raffleDate, data.createdAt, data.updatedAt);
    }
}
exports.FirebaseGroupRepository = FirebaseGroupRepository;
//# sourceMappingURL=FirebaseGroupRepository.js.map