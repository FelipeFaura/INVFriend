/**
 * Get My Wishes Use Case
 * Retrieves all wishes for a user in a group
 */
import { IWishRepository } from "../../ports/IWishRepository";
import { IGroupRepository } from "../../ports/IGroupRepository";
export interface GetMyWishesRequest {
    groupId: string;
    userId: string;
}
export interface WishDTO {
    id: string;
    groupId: string;
    userId: string;
    title: string;
    description?: string;
    url?: string;
    estimatedPrice?: number;
    priority?: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GroupNotFoundError extends Error {
    constructor(message?: string);
}
export declare class NotGroupMemberError extends Error {
    constructor(message?: string);
}
export declare class GetMyWishesUseCase {
    private readonly wishRepository;
    private readonly groupRepository;
    constructor(wishRepository: IWishRepository, groupRepository: IGroupRepository);
    execute(request: GetMyWishesRequest): Promise<WishDTO[]>;
}
//# sourceMappingURL=GetMyWishesUseCase.d.ts.map