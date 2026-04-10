/**
 * Firebase implementation of IUserRepository
 * Handles user data access using Firestore
 */
import { db } from "../../config/firebase.config";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../ports/IUserRepository";

/** Firestore collection name for users */
const USERS_COLLECTION = "users";

/**
 * Data structure stored in Firestore
 */
interface UserDocument {
  email: string;
  name: string;
  photoUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

/**
 * Firebase Firestore implementation of IUserRepository
 */
export class FirebaseUserRepository implements IUserRepository {
  private readonly collection = db.collection(USERS_COLLECTION);

  /**
   * Finds a user by their unique identifier
   */
  async findById(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as UserDocument;
    return User.fromDatabase(
      doc.id,
      data.email,
      data.name,
      data.photoUrl,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Finds a user by their email address
   */
  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const snapshot = await this.collection
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as UserDocument;
    return User.fromDatabase(
      doc.id,
      data.email,
      data.name,
      data.photoUrl,
      data.createdAt,
      data.updatedAt,
    );
  }
}
