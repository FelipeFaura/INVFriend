/**
 * CreateGroupUseCase
 * Use case for creating a new Secret Santa group
 */
import { Group } from "../../domain/entities/Group";
import { IGroupRepository } from "../../ports/IGroupRepository";
import { CreateGroupDTO, GroupResponseDTO } from "../dto/GroupDTOs";
/**
 * Transforms a Group entity to a response DTO
 */
declare function toResponseDTO(group: Group): GroupResponseDTO;
export { toResponseDTO };
/**
 * Creates a new group with the requester as admin
 */
export declare class CreateGroupUseCase {
    private readonly groupRepository;
    constructor(groupRepository: IGroupRepository);
    /**
     * Executes the use case
     * @param dto - Group creation data
     * @returns Created group response DTO
     * @throws InvalidGroupNameError if name is invalid
     * @throws InvalidBudgetLimitError if budget is invalid
     */
    execute(dto: CreateGroupDTO): Promise<GroupResponseDTO>;
}
//# sourceMappingURL=CreateGroupUseCase.d.ts.map