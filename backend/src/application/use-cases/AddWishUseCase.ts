/**
 * Add Wish Use Case
 * Creates a new wish for a user in a group
 */
import { Wish } from "../../domain/entities/Wish";
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

export class NotGroupMemberError extends Error {
  constructor(message: string = "User is not a member of this group") {
    super(message);
    this.name = "NotGroupMemberError";
  }
}

export class GroupNotFoundError extends Error {
  constructor(message: string = "Group not found") {
    super(message);
    this.name = "GroupNotFoundError";
  }
}

export class AddWishUseCase {
  constructor(
    private readonly wishRepository: IWishRepository,
    private readonly groupRepository: IGroupRepository,
  ) {}

  async execute(request: AddWishRequest): Promise<AddWishResponse> {
    // Validate group exists
    const group = await this.groupRepository.findById(request.groupId);
    if (!group) {
      throw new GroupNotFoundError();
    }

    // Validate user is a member
    if (!group.isMember(request.userId)) {
      throw new NotGroupMemberError();
    }

    // Create wish
    const wishId = this.generateWishId();
    const wish = Wish.create({
      id: wishId,
      groupId: request.groupId,
      userId: request.userId,
      title: request.title,
      description: request.description,
      url: request.url,
      estimatedPrice: request.estimatedPrice,
      priority: request.priority,
    });

    // Save to repository
    await this.wishRepository.save(wish);

    return {
      id: wish.id,
      groupId: wish.groupId,
      userId: wish.userId,
      title: wish.title,
      description: wish.description,
      url: wish.url,
      estimatedPrice: wish.estimatedPrice,
      priority: wish.priority,
      createdAt: wish.createdAt,
    };
  }

  private generateWishId(): string {
    return `wish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
