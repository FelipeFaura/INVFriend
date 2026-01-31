/**
 * GetGroupDetailsUseCase
 * Use case for retrieving group details
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { GroupResponseDTO } from "../dto/GroupDTOs";
import {
  GroupNotFoundError,
  NotGroupMemberError,
} from "../../domain/errors/GroupErrors";
import { toResponseDTO } from "./CreateGroupUseCase";

/**
 * Retrieves detailed information about a group
 * Only group members can view group details
 */
export class GetGroupDetailsUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param groupId - Group unique identifier
   * @param requesterId - User requesting the details (must be member)
   * @returns Group response DTO
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupMemberError if requester is not a member
   */
  async execute(
    groupId: string,
    requesterId: string,
  ): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Verify requester is a member
    if (!group.isMember(requesterId)) {
      throw new NotGroupMemberError(
        "You must be a member to view group details",
      );
    }

    return toResponseDTO(group);
  }
}
