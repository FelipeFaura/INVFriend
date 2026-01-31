/**
 * Firebase Wish Repository
 * Firestore implementation of IWishRepository using Firebase Admin SDK
 */
import { db } from "../../config/firebase.config";
import { IWishRepository } from "../../ports/IWishRepository";
import { Wish, WishProps } from "../../domain/entities/Wish";

/** Firestore collection name for wishes */
const WISHES_COLLECTION = "wishes";

/**
 * Firebase Firestore implementation of IWishRepository
 */
export class FirebaseWishRepository implements IWishRepository {
  private readonly collection = db.collection(WISHES_COLLECTION);

  async save(wish: Wish): Promise<void> {
    const wishData = wish.toObject();
    const docRef = this.collection.doc(wish.id);

    await docRef.set({
      ...wishData,
      createdAt: wishData.createdAt.getTime(),
      updatedAt: wishData.updatedAt.getTime(),
    });
  }

  async findById(id: string): Promise<Wish | null> {
    const docRef = this.collection.doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return null;
    }

    return this.mapToWish(snapshot.id, snapshot.data()!);
  }

  async findByUserInGroup(userId: string, groupId: string): Promise<Wish[]> {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .where("groupId", "==", groupId)
      .get();

    return snapshot.docs.map((doc) => this.mapToWish(doc.id, doc.data()));
  }

  async findByGroup(groupId: string): Promise<Wish[]> {
    const snapshot = await this.collection
      .where("groupId", "==", groupId)
      .get();

    return snapshot.docs.map((doc) => this.mapToWish(doc.id, doc.data()));
  }

  async update(wish: Wish): Promise<void> {
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

  async delete(id: string): Promise<void> {
    const docRef = this.collection.doc(id);
    await docRef.delete();
  }

  async deleteAllByUserInGroup(userId: string, groupId: string): Promise<void> {
    const wishes = await this.findByUserInGroup(userId, groupId);

    if (wishes.length === 0) {
      return;
    }

    const batch = db.batch();
    for (const wish of wishes) {
      const docRef = this.collection.doc(wish.id);
      batch.delete(docRef);
    }

    await batch.commit();
  }

  private mapToWish(id: string, data: FirebaseFirestore.DocumentData): Wish {
    const props: WishProps = {
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

    return Wish.fromPersistence(props);
  }
}
