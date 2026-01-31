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

export class RaffleNotCompletedError extends Error {
  constructor(
    message: string = "Raffle has not been completed for this group",
  ) {
    super(message);
    this.name = "RaffleNotCompletedError";
  }
}

export class AssignmentNotFoundError extends Error {
  constructor(message: string = "Assignment not found") {
    super(message);
    this.name = "AssignmentNotFoundError";
  }
}

export class GetSecretSantaWishesUseCase {
  constructor(
    private readonly wishRepository: IWishRepository,
    private readonly groupRepository: IGroupRepository,
    private readonly assignmentRepository: IAssignmentRepository,
  ) {}

  async execute(request: GetSecretSantaWishesRequest): Promise<WishDTO[]> {
    // Validate group exists
    const group = await this.groupRepository.findById(request.groupId);
    if (!group) {
      throw new GroupNotFoundError();
    }

    // Validate user is a member
    if (!group.isMember(request.userId)) {
      throw new NotGroupMemberError();
    }

    // Validate raffle is completed
    if (group.raffleStatus !== "completed") {
      throw new RaffleNotCompletedError();
    }

    // Get user's assignment (who they give a gift to)
    const assignment =
      await this.assignmentRepository.findByGroupAndSecretSanta(
        request.groupId,
        request.userId,
      );

    if (!assignment) {
      throw new AssignmentNotFoundError();
    }

    // Get wishes for the assigned recipient
    const wishes = await this.wishRepository.findByUserInGroup(
      assignment.receiverId,
      request.groupId,
    );

    // Return wishes without exposing who the user ID is (for privacy)
    return wishes.map((wish) => ({
      id: wish.id,
      title: wish.title,
      description: wish.description,
      url: wish.url,
      estimatedPrice: wish.estimatedPrice,
      priority: wish.priority,
    }));
  }
}
