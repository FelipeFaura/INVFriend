/**
 * GetMyAssignmentUseCase
 * Use case for getting a user's Secret Santa assignment in a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";
/**
 * Input DTO for getting assignment
 */
export interface GetMyAssignmentDTO {
    /** Group ID to get assignment for */
    groupId: string;
    /** User ID of the requester */
    userId: string;
}
/**
 * Output DTO for assignment result
 */
export interface AssignmentResultDTO {
    /** Assignment ID */
    id: string;
    /** Group ID */
    groupId: string;
    /** User ID who receives the gift (the person you're giving a gift to) */
    receiverId: string;
    /** Timestamp when assignment was created */
    createdAt: number;
}
/**
 * Error thrown when raffle hasn't been completed
 */
export declare class RaffleNotCompletedError extends Error {
    constructor(message?: string);
}
/**
 * Error thrown when assignment is not found
 */
export declare class AssignmentNotFoundError extends Error {
    constructor(message?: string);
}
/**
 * Use case for getting a user's Secret Santa assignment
 * Returns who the user needs to give a gift to
 */
export declare class GetMyAssignmentUseCase {
    private readonly groupRepository;
    private readonly assignmentRepository;
    constructor(groupRepository: IGroupRepository, assignmentRepository: IAssignmentRepository);
    /**
     * Gets the user's assignment in a group
     * @param dto - Input data
     * @returns Assignment showing who to give a gift to
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupMemberError if user is not a member
     * @throws RaffleNotCompletedError if raffle hasn't been done
     * @throws AssignmentNotFoundError if no assignment exists
     */
    execute(dto: GetMyAssignmentDTO): Promise<AssignmentResultDTO>;
}
//# sourceMappingURL=GetMyAssignmentUseCase.d.ts.map