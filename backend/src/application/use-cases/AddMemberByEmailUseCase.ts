/**
 * AddMemberByEmailUseCase
 * Use case for adding a member to a group by email address
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { IUserRepository } from "../../ports/IUserRepository";
import { AddMemberByEmailDTO, GroupResponseDTO } from "../dto/GroupDTOs";
import {
  GroupNotFoundError,
  NotGroupAdminError,
} from "../../domain/errors/GroupErrors";
import { UserNotFoundError } from "../../domain/errors/AuthErrors";
import { toResponseDTO } from "./CreateGroupUseCase";

/**
 * Adds a new member to a group by looking up their email address
 * Only the group admin can add members
 */
export class AddMemberByEmailUseCase {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the use case
   * @param dto - Add member by email data
   * @returns Updated group response DTO
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupAdminError if requester is not the admin
   * @throws UserNotFoundError if no user with that email exists
   * @throws AlreadyGroupMemberError if user is already a member
   * @throws RaffleAlreadyCompletedError if raffle has been completed
   */
  async execute(dto: AddMemberByEmailDTO): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findById(dto.groupId);

    if (!group) {
      throw new GroupNotFoundError(dto.groupId);
    }

    // Verify requester is the admin
    if (!group.isAdmin(dto.requesterId)) {
      throw new NotGroupAdminError("Only the group admin can add members");
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UserNotFoundError(dto.email);
    }

    // Add the member (validation happens in the entity)
    const updatedGroup = group.addMember(user.id);

    // Persist the changes
    await this.groupRepository.update(updatedGroup);

    return toResponseDTO(updatedGroup);
  }
}
