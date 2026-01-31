"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupUseCase = void 0;
exports.toResponseDTO = toResponseDTO;
/**
 * CreateGroupUseCase
 * Use case for creating a new Secret Santa group
 */
const Group_1 = require("../../domain/entities/Group");
/**
 * Transforms a Group entity to a response DTO
 */
function toResponseDTO(group) {
    return {
        id: group.id,
        name: group.name,
        description: group.description,
        adminId: group.adminId,
        members: [...group.members],
        budgetLimit: group.budgetLimit,
        raffleStatus: group.raffleStatus,
        raffleDate: group.raffleDate,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
    };
}
/**
 * Creates a new group with the requester as admin
 */
class CreateGroupUseCase {
    constructor(groupRepository) {
        this.groupRepository = groupRepository;
    }
    /**
     * Executes the use case
     * @param dto - Group creation data
     * @returns Created group response DTO
     * @throws InvalidGroupNameError if name is invalid
     * @throws InvalidBudgetLimitError if budget is invalid
     */
    async execute(dto) {
        // Generate a new ID for the group
        const groupId = this.groupRepository.generateId();
        // Create the group entity (validates name and budget)
        const group = Group_1.Group.create(groupId, dto.name, dto.adminId, dto.budgetLimit, dto.description);
        // Persist the group
        const createdGroup = await this.groupRepository.create(group);
        return toResponseDTO(createdGroup);
    }
}
exports.CreateGroupUseCase = CreateGroupUseCase;
//# sourceMappingURL=CreateGroupUseCase.js.map