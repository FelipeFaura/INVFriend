/**
 * Delete Wish Use Case
 * Deletes a wish by its owner
 */
import { IWishRepository } from "../../ports/IWishRepository";

export interface DeleteWishRequest {
  wishId: string;
  userId: string;
}

export class WishNotFoundError extends Error {
  constructor(message: string = "Wish not found") {
    super(message);
    this.name = "WishNotFoundError";
  }
}

export class NotWishOwnerError extends Error {
  constructor(message: string = "User is not the owner of this wish") {
    super(message);
    this.name = "NotWishOwnerError";
  }
}

export class DeleteWishUseCase {
  constructor(private readonly wishRepository: IWishRepository) {}

  async execute(request: DeleteWishRequest): Promise<void> {
    // Find the wish
    const wish = await this.wishRepository.findById(request.wishId);
    if (!wish) {
      throw new WishNotFoundError();
    }

    // Validate ownership
    if (!wish.belongsToUser(request.userId)) {
      throw new NotWishOwnerError();
    }

    // Delete wish
    await this.wishRepository.delete(request.wishId);
  }
}
