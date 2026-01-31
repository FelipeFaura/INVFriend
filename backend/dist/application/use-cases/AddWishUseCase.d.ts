import { IWishRepository } from "../../ports/IWishRepository";
import { IGroupRepository } from "../../ports/IGroupRepository";
export interface AddWishRequest {
    groupId: string;
    userId: string;
    title: string;
    description?: string;
    url?: string;
    estimatedPrice?: number;
    priority?: number;
}
export interface AddWishResponse {
    id: string;
    groupId: string;
    userId: string;
    title: string;
    description?: string;
    url?: string;
    estimatedPrice?: number;
    priority?: number;
    createdAt: Date;
}
export declare class NotGroupMemberError extends Error {
    constructor(message?: string);
}
export declare class GroupNotFoundError extends Error {
    constructor(message?: string);
}
export declare class AddWishUseCase {
    private readonly wishRepository;
    private readonly groupRepository;
    constructor(wishRepository: IWishRepository, groupRepository: IGroupRepository);
    execute(request: AddWishRequest): Promise<AddWishResponse>;
    private generateWishId;
}
//# sourceMappingURL=AddWishUseCase.d.ts.map