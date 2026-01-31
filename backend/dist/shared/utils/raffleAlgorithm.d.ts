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
/**
 * Single assignment result
 */
export interface RaffleAssignment {
    /** User ID of the person who receives the gift */
    receiverId: string;
    /** User ID of the secret santa (who gives the gift) */
    secretSantaId: string;
}
/**
 * Result of the raffle algorithm
 */
export interface RaffleResult {
    /** Array of assignments */
    assignments: RaffleAssignment[];
    /** Whether the raffle was successful */
    success: boolean;
    /** Error message if unsuccessful */
    error?: string;
}
/**
 * Error thrown when raffle cannot be performed
 */
export declare class RaffleError extends Error {
    constructor(message: string);
}
/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * Creates a new shuffled array without modifying the original
 *
 * @param array - Array to shuffle
 * @param randomFn - Optional random function for testing (default: Math.random)
 * @returns New shuffled array
 */
export declare function shuffleArray<T>(array: readonly T[], randomFn?: () => number): T[];
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
export declare function performRaffle(memberIds: readonly string[], randomFn?: () => number): RaffleResult;
/**
 * Validation result for raffle assignments
 */
interface ValidationResult {
    valid: boolean;
    error?: string;
}
/**
 * Validates raffle assignments to ensure all rules are satisfied
 *
 * @param assignments - Array of assignments to validate
 * @param memberIds - Original member IDs
 * @returns Validation result
 */
export declare function validateRaffleResult(assignments: RaffleAssignment[], memberIds: readonly string[]): ValidationResult;
export {};
//# sourceMappingURL=raffleAlgorithm.d.ts.map