"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseWishRepository = void 0;
/**
 * Firebase Wish Repository
 * Firestore implementation of IWishRepository using Firebase Admin SDK
 */
const firebase_config_1 = require("../../config/firebase.config");
const Wish_1 = require("../../domain/entities/Wish");
/** Firestore collection name for wishes */
const WISHES_COLLECTION = "wishes";
/**
 * Firebase Firestore implementation of IWishRepository
 */
class FirebaseWishRepository {
    constructor() {
        this.collection = firebase_config_1.db.collection(WISHES_COLLECTION);
    }
    async save(wish) {
        const wishData = wish.toObject();
        const docRef = this.collection.doc(wish.id);
        await docRef.set({
            ...wishData,
            createdAt: wishData.createdAt.getTime(),
            updatedAt: wishData.updatedAt.getTime(),
        });
    }
    async findById(id) {
        const docRef = this.collection.doc(id);
        const snapshot = await docRef.get();
        if (!snapshot.exists) {
            return null;
        }
        return this.mapToWish(snapshot.id, snapshot.data());
    }
    async findByUserInGroup(userId, groupId) {
        const snapshot = await this.collection
            .where("userId", "==", userId)
            .where("groupId", "==", groupId)
            .get();
        return snapshot.docs.map((doc) => this.mapToWish(doc.id, doc.data()));
    }
    async findByGroup(groupId) {
        const snapshot = await this.collection
            .where("groupId", "==", groupId)
            .get();
        return snapshot.docs.map((doc) => this.mapToWish(doc.id, doc.data()));
    }
    async update(wish) {
        const wishData = wish.toObject();
        const docRef = this.collection.doc(wish.id);
        await docRef.update({
            title: wishData.title,
            description: wishData.description,
            url: wishData.url,
            estimatedPrice: wishData.estimatedPrice,
            priority: wishData.priority,
            updatedAt: wishData.updatedAt.getTime(),
        });
    }
    async delete(id) {
        const docRef = this.collection.doc(id);
        await docRef.delete();
    }
    async deleteAllByUserInGroup(userId, groupId) {
        const wishes = await this.findByUserInGroup(userId, groupId);
        if (wishes.length === 0) {
            return;
        }
        const batch = firebase_config_1.db.batch();
        for (const wish of wishes) {
            const docRef = this.collection.doc(wish.id);
            batch.delete(docRef);
        }
        await batch.commit();
    }
    mapToWish(id, data) {
        const props = {
            id,
            groupId: data.groupId,
            userId: data.userId,
            title: data.title,
            description: data.description,
            url: data.url,
            estimatedPrice: data.estimatedPrice,
            priority: data.priority,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        };
        return Wish_1.Wish.fromPersistence(props);
    }
}
exports.FirebaseWishRepository = FirebaseWishRepository;
//# sourceMappingURL=FirebaseWishRepository.js.map