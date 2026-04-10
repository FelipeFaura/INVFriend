/**
 * GetGroupDetailsUseCase
 * Use case for retrieving group details
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { IUserRepository } from "../../ports/IUserRepository";
import { GroupResponseDTO, MemberDetailDTO } from "../dto/GroupDTOs";
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
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Executes the use case
   * @param groupId - Group unique identifier
   * @param requesterId - User requesting the details (must be member)
   * @returns Group response DTO with member details
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

    const baseDTO = toResponseDTO(group);
    const memberDetails = await this.resolveMemberDetails(group.members);
    return { ...baseDTO, memberDetails };
  }

  /**
   * Resolves member IDs to member detail DTOs
   * Falls back to ID-based placeholder if user not found
   */
  private async resolveMemberDetails(
    memberIds: readonly string[],
  ): Promise<MemberDetailDTO[]> {
    const details = await Promise.all(
      memberIds.map(async (memberId): Promise<MemberDetailDTO> => {
        const user = await this.userRepository.findById(memberId);
        if (user) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return { id: memberId, name: memberId, email: "" };
      }),
    );
    return details;
  }
}
