"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformRaffleUseCase = exports.RaffleFailedError = void 0;
/**
 * PerformRaffleUseCase
 * Use case for executing the Secret Santa raffle for a group
 */
const Group_1 = require("../../domain/entities/Group");
const Assignment_1 = require("../../domain/entities/Assignment");
const GroupErrors_1 = require("../../domain/errors/GroupErrors");
const raffleAlgorithm_1 = require("../../shared/utils/raffleAlgorithm");
/**
 * Error thrown when raffle fails
 */
class RaffleFailedError extends Error {
    constructor(message) {
        super(message);
        this.name = "RaffleFailedError";
    }
}
exports.RaffleFailedError = RaffleFailedError;
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
class PerformRaffleUseCase {
    constructor(groupRepository, assignmentRepository) {
        this.groupRepository = groupRepository;
        this.assignmentRepository = assignmentRepository;
    }
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
    async execute(dto) {
        // Fetch the group
        const group = await this.groupRepository.findById(dto.groupId);
        if (!group) {
            throw new GroupErrors_1.GroupNotFoundError(dto.groupId);
        }
        // Verify requester is admin
        if (group.adminId !== dto.requesterId) {
            throw new GroupErrors_1.NotGroupAdminError("Only the group admin can perform the raffle");
        }
        // Check if raffle already completed (throws RaffleAlreadyCompletedError)
        // The Group entity's performRaffle method handles this validation
        // Let's validate first before running the algorithm
        if (group.raffleStatus === "completed") {
            const { RaffleAlreadyCompletedError } = await Promise.resolve().then(() => __importStar(require("../../domain/errors/GroupErrors")));
            throw new RaffleAlreadyCompletedError("Raffle has already been completed");
        }
        // Check minimum members (Group entity validates this too)
        if (group.members.length < Group_1.Group.MIN_MEMBERS_FOR_RAFFLE) {
            const { NotEnoughMembersError } = await Promise.resolve().then(() => __importStar(require("../../domain/errors/GroupErrors")));
            throw new NotEnoughMembersError(Group_1.Group.MIN_MEMBERS_FOR_RAFFLE);
        }
        // Run the raffle algorithm
        const raffleResult = (0, raffleAlgorithm_1.performRaffle)(group.members);
        if (!raffleResult.success) {
            throw new RaffleFailedError(raffleResult.error || "Raffle algorithm failed");
        }
        // Create Assignment entities
        const assignments = raffleResult.assignments.map((assignment) => Assignment_1.Assignment.create(this.assignmentRepository.generateId(), dto.groupId, assignment.receiverId, assignment.secretSantaId));
        // Store assignments atomically
        await this.assignmentRepository.createBatch(assignments);
        // Update group status to completed
        const updatedGroup = group.completeRaffle();
        await this.groupRepository.update(updatedGroup);
        return {
            groupId: dto.groupId,
            raffleDate: updatedGroup.raffleDate,
            assignmentCount: assignments.length,
        };
    }
}
exports.PerformRaffleUseCase = PerformRaffleUseCase;
//# sourceMappingURL=PerformRaffleUseCase.js.map