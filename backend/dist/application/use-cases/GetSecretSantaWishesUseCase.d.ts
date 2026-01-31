/**
 * Get Secret Santa Wishes Use Case
 * Retrieves wishes for the user's assigned secret santa recipient
 */
import { IWishRepository } from "../../ports/IWishRepository";
import { IGroupRepository } from "../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";
export interface GetSecretSantaWishesRequest {
    groupId: string;
    userId: string;
}
export interface WishDTO {
    id: string;
    title: string;
    description?: string;
    url?: string;
    estimatedPrice?: number;
    priority?: number;
}
export declare class GroupNotFoundError extends Error {
    constructor(message?: string);
}
export declare class NotGroupMemberError extends Error {
    constructor(message?: string);
}
export declare class RaffleNotCompletedError extends Error {
    constructor(message?: string);
}
export declare class AssignmentNotFoundError extends Error {
    constructor(message?: string);
}
export declare class GetSecretSantaWishesUseCase {
    private readonly wishRepository;
    private readonly groupRepository;
    private readonly assignmentRepository;
    constructor(wishRepository: IWishRepository, groupRepository: IGroupRepository, assignmentRepository: IAssignmentRepository);
    execute(request: GetSecretSantaWishesRequest): Promise<WishDTO[]>;
}
//# sourceMappingURL=GetSecretSantaWishesUseCase.d.ts.map