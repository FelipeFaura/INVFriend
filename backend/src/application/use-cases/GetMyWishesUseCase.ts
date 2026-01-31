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

export class GroupNotFoundError extends Error {
  constructor(message: string = "Group not found") {
    super(message);
    this.name = "GroupNotFoundError";
  }
}

export class NotGroupMemberError extends Error {
  constructor(message: string = "User is not a member of this group") {
    super(message);
    this.name = "NotGroupMemberError";
  }
}

export class GetMyWishesUseCase {
  constructor(
    private readonly wishRepository: IWishRepository,
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(request: GetMyWishesRequest): Promise<WishDTO[]> {
    // Validate group exists
    const group = await this.groupRepository.findById(request.groupId);
    if (!group) {
      throw new GroupNotFoundError();
    }

    // Validate user is a member
    if (!group.isMember(request.userId)) {
      throw new NotGroupMemberError();
    }

    // Get wishes
    const wishes = await this.wishRepository.findByUserInGroup(
      request.userId,
      request.groupId,
    );

    return wishes.map((wish) => ({
      id: wish.id,
      groupId: wish.groupId,
      userId: wish.userId,
      title: wish.title,
      description: wish.description,
      url: wish.url,
      estimatedPrice: wish.estimatedPrice,
      priority: wish.priority,
      createdAt: wish.createdAt,
      updatedAt: wish.updatedAt,
    }));
  }
}
