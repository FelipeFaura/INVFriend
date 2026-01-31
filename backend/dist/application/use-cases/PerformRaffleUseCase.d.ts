import { IGroupRepository } from "../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";
/**
 * Input DTO for performing a raffle
 */
export interface PerformRaffleDTO {
    /** Group ID to perform raffle for */
    groupId: string;
    /** User ID of the requester (must be admin) */
    requesterId: string;
}
/**
 * Output DTO for raffle result
 */
export interface RaffleResultDTO {
    /** Group ID */
    groupId: string;
    /** Timestamp when raffle was performed */
    raffleDate: number;
    /** Number of assignments created */
    assignmentCount: number;
}
/**
 * Error thrown when raffle fails
 */
export declare class RaffleFailedError extends Error {
    constructor(message: string);
}
/**
 * Use case for executing a Secret Santa raffle
 *
 * Business Rules:
 * - Only admin can perform raffle
 * - Minimum 2 members required
 * - Cannot raffle if already completed
 * - Updates group status to 'completed'
 * - Stores all assignments atomically
 */
export declare class PerformRaffleUseCase {
    private readonly groupRepository;
    private readonly assignmentRepository;
    constructor(groupRepository: IGroupRepository, assignmentRepository: IAssignmentRepository);
    /**
     * Executes the raffle for a group
     * @param dto - Raffle input data
     * @returns Raffle result with assignment count
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupAdminError if requester is not admin
     * @throws RaffleAlreadyCompletedError if raffle was already done
     * @throws NotEnoughMembersError if less than 2 members
     * @throws RaffleFailedError if algorithm fails
     */
    execute(dto: PerformRaffleDTO): Promise<RaffleResultDTO>;
}
//# sourceMappingURL=PerformRaffleUseCase.d.ts.map