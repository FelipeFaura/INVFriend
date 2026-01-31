import { IWishRepository } from "../../ports/IWishRepository";
import { Wish } from "../../domain/entities/Wish";
/**
 * Firebase Firestore implementation of IWishRepository
 */
export declare class FirebaseWishRepository implements IWishRepository {
    private readonly collection;
    save(wish: Wish): Promise<void>;
    findById(id: string): Promise<Wish | null>;
    findByUserInGroup(userId: string, groupId: string): Promise<Wish[]>;
    findByGroup(groupId: string): Promise<Wish[]>;
    update(wish: Wish): Promise<void>;
    delete(id: string): Promise<void>;
    deleteAllByUserInGroup(userId: string, groupId: string): Promise<void>;
    private mapToWish;
}
//# sourceMappingURL=FirebaseWishRepository.d.ts.map