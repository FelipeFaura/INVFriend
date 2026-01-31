/**
 * Update Wish Use Case
 * Updates an existing wish
 */
import { IWishRepository } from "../../ports/IWishRepository";
export interface UpdateWishRequest {
    wishId: string;
    userId: string;
    title?: string;
    description?: string;
    url?: string;
    estimatedPrice?: number;
    priority?: number;
}
export interface UpdateWishResponse {
    id: string;
    title: string;
    description?: string;
    url?: string;
    estimatedPrice?: number;
    priority?: number;
    updatedAt: Date;
}
export declare class WishNotFoundError extends Error {
    constructor(message?: string);
}
export declare class NotWishOwnerError extends Error {
    constructor(message?: string);
}
export declare class UpdateWishUseCase {
    private readonly wishRepository;
    constructor(wishRepository: IWishRepository);
    execute(request: UpdateWishRequest): Promise<UpdateWishResponse>;
}
//# sourceMappingURL=UpdateWishUseCase.d.ts.map