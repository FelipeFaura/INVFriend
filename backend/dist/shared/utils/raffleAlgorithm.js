"use strict";
/**
 * Secret Santa Raffle Algorithm
 *
 * Implements a fair assignment algorithm that ensures:
 * - Each person gets exactly 1 secret santa
 * - Each person is secret santa for exactly 1 person
 * - No one is their own secret santa
 *
 * Uses Fisher-Yates shuffle combined with circular assignment
 * to guarantee a valid derangement.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaffleError = void 0;
exports.shuffleArray = shuffleArray;
exports.performRaffle = performRaffle;
exports.validateRaffleResult = validateRaffleResult;
/**
 * Error thrown when raffle cannot be performed
 */
class RaffleError extends Error {
    constructor(message) {
        super(message);
        this.name = "RaffleError";
    }
}
exports.RaffleError = RaffleError;
/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * Creates a new shuffled array without modifying the original
 *
 * @param array - Array to shuffle
 * @param randomFn - Optional random function for testing (default: Math.random)
 * @returns New shuffled array
 */
function shuffleArray(array, randomFn = Math.random) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(randomFn() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
/**
 * Generates Secret Santa assignments using a circular derangement approach
 *
 * Algorithm:
 * 1. Shuffle the member list randomly
 * 2. Create circular assignments: member[i] gives to member[(i+1) % n]
 *
 * This approach guarantees:
 * - No one is their own secret santa (derangement property)
 * - Everyone gives exactly one gift
 * - Everyone receives exactly one gift
 *
 * @param memberIds - Array of user IDs participating in the raffle
 * @param randomFn - Optional random function for testing (default: Math.random)
 * @returns RaffleResult with assignments array
 * @throws RaffleError if fewer than 2 members provided
 */
function performRaffle(memberIds, randomFn = Math.random) {
    // Validate minimum members
    if (memberIds.length < 2) {
        return {
            assignments: [],
            success: false,
            error: "At least 2 members are required for a raffle",
        };
    }
    // Check for duplicates
    const uniqueMembers = new Set(memberIds);
    if (uniqueMembers.size !== memberIds.length) {
        return {
            assignments: [],
            success: false,
            error: "Duplicate member IDs detected",
        };
    }
    // Shuffle members to randomize assignments
    const shuffled = shuffleArray(memberIds, randomFn);
    // Create circular assignments
    // Each person gives to the next person in the shuffled list
    // Last person gives to first person (circular)
    const assignments = shuffled.map((secretSantaId, index) => {
        const receiverIndex = (index + 1) % shuffled.length;
        return {
            receiverId: shuffled[receiverIndex],
            secretSantaId,
        };
    });
    // Validate the result (sanity check)
    const validation = validateRaffleResult(assignments, memberIds);
    if (!validation.valid) {
        return {
            assignments: [],
            success: false,
            error: validation.error,
        };
    }
    return {
        assignments,
        success: true,
    };
}
/**
 * Validates raffle assignments to ensure all rules are satisfied
 *
 * @param assignments - Array of assignments to validate
 * @param memberIds - Original member IDs
 * @returns Validation result
 */
function validateRaffleResult(assignments, memberIds) {
    // Check correct number of assignments
    if (assignments.length !== memberIds.length) {
        return {
            valid: false,
            error: `Expected ${memberIds.length} assignments, got ${assignments.length}`,
        };
    }
    const memberSet = new Set(memberIds);
    const receivers = new Set();
    const santas = new Set();
    for (const assignment of assignments) {
        // Check no self-assignment
        if (assignment.receiverId === assignment.secretSantaId) {
            return {
                valid: false,
                error: `Self-assignment detected for user ${assignment.receiverId}`,
            };
        }
        // Check all participants are valid members
        if (!memberSet.has(assignment.receiverId)) {
            return {
                valid: false,
                error: `Unknown receiver: ${assignment.receiverId}`,
            };
        }
        if (!memberSet.has(assignment.secretSantaId)) {
            return {
                valid: false,
                error: `Unknown secret santa: ${assignment.secretSantaId}`,
            };
        }
        // Check for duplicate receivers
        if (receivers.has(assignment.receiverId)) {
            return {
                valid: false,
                error: `Duplicate receiver: ${assignment.receiverId}`,
            };
        }
        receivers.add(assignment.receiverId);
        // Check for duplicate santas
        if (santas.has(assignment.secretSantaId)) {
            return {
                valid: false,
                error: `Duplicate secret santa: ${assignment.secretSantaId}`,
            };
        }
        santas.add(assignment.secretSantaId);
    }
    // Check everyone is both a receiver and a santa
    for (const memberId of memberIds) {
        if (!receivers.has(memberId)) {
            return {
                valid: false,
                error: `Member ${memberId} is not receiving a gift`,
            };
        }
        if (!santas.has(memberId)) {
            return {
                valid: false,
                error: `Member ${memberId} is not giving a gift`,
            };
        }
    }
    return { valid: true };
}
//# sourceMappingURL=raffleAlgorithm.js.map