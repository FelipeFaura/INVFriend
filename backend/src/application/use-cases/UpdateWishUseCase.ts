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

export class UpdateWishUseCase {
  constructor(private readonly wishRepository: IWishRepository) {}

  async execute(request: UpdateWishRequest): Promise<UpdateWishResponse> {
    // Find the wish
    const wish = await this.wishRepository.findById(request.wishId);
    if (!wish) {
      throw new WishNotFoundError();
    }

    // Validate ownership
    if (!wish.belongsToUser(request.userId)) {
      throw new NotWishOwnerError();
    }

    // Update wish
    const updatedWish = wish.update({
      title: request.title,
      description: request.description,
      url: request.url,
      estimatedPrice: request.estimatedPrice,
      priority: request.priority,
    });

    // Save to repository
    await this.wishRepository.update(updatedWish);

    return {
      id: updatedWish.id,
      title: updatedWish.title,
      description: updatedWish.description,
      url: updatedWish.url,
      estimatedPrice: updatedWish.estimatedPrice,
      priority: updatedWish.priority,
      updatedAt: updatedWish.updatedAt,
    };
  }
}
