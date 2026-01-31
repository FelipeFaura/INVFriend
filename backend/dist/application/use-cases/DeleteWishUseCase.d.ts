/**
 * Delete Wish Use Case
 * Deletes a wish by its owner
 */
import { IWishRepository } from "../../ports/IWishRepository";
export interface DeleteWishRequest {
    wishId: string;
    userId: string;
}
export declare class WishNotFoundError extends Error {
    constructor(message?: string);
}
export declare class NotWishOwnerError extends Error {
    constructor(message?: string);
}
export declare class DeleteWishUseCase {
    private readonly wishRepository;
    constructor(wishRepository: IWishRepository);
    execute(request: DeleteWishRequest): Promise<void>;
}
//# sourceMappingURL=DeleteWishUseCase.d.ts.map