/**
 * Raffle status type
 */
export type RaffleStatus = "pending" | "completed";
/**
 * Group entity - Represents a Secret Santa group
 * This is an immutable entity following domain-driven design principles
 */
export declare class Group {
    readonly id: string;
    readonly name: string;
    readonly description: string | null;
    readonly adminId: string;
    readonly members: readonly string[];
    readonly budgetLimit: number;
    readonly raffleStatus: RaffleStatus;
    readonly raffleDate: number | null;
    readonly createdAt: number;
    readonly updatedAt: number;
    /** Minimum characters for group name */
    static readonly MIN_NAME_LENGTH = 3;
    /** Maximum characters for group name */
    static readonly MAX_NAME_LENGTH = 100;
    /** Minimum members required for raffle */
    static readonly MIN_MEMBERS_FOR_RAFFLE = 2;
    private constructor();
    /**
     * Factory method to create a new group
     * @param id - Group unique identifier
     * @param name - Group name (3-100 characters)
     * @param adminId - User ID of the group admin
     * @param budgetLimit - Budget limit for gifts (must be > 0)
     * @param description - Optional group description
     * @returns New Group instance with admin automatically added as member
     * @throws InvalidGroupNameError if name is invalid
     * @throws InvalidBudgetLimitError if budget is invalid
     */
    static create(id: string, name: string, adminId: string, budgetLimit: number, description?: string | null): Group;
    /**
     * Creates a Group from existing data (used when loading from database)
     */
    static fromDatabase(id: string, name: string, description: string | null, adminId: string, members: string[], budgetLimit: number, raffleStatus: RaffleStatus, raffleDate: number | null, createdAt: number, updatedAt: number): Group;
    /**
     * Updates the group information
     * @param name - Optional new name
     * @param description - Optional new description
     * @param budgetLimit - Optional new budget limit
     * @returns New Group instance with updated data
     * @throws InvalidGroupNameError if name is invalid
     * @throws InvalidBudgetLimitError if budget is invalid
     */
    update(name?: string, description?: string | null, budgetLimit?: number): Group;
    /**
     * Adds a member to the group
     * @param userId - User ID to add
     * @returns New Group instance with member added
     * @throws AlreadyGroupMemberError if user is already a member
     * @throws RaffleAlreadyCompletedError if raffle has been completed
     */
    addMember(userId: string): Group;
    /**
     * Removes a member from the group
     * @param userId - User ID to remove
     * @returns New Group instance with member removed
     * @throws CannotRemoveAdminError if trying to remove admin
     * @throws NotGroupMemberError if user is not a member
     * @throws RaffleAlreadyCompletedError if raffle has been completed
     */
    removeMember(userId: string): Group;
    /**
     * Marks the raffle as completed
     * @returns New Group instance with raffle completed
     * @throws NotEnoughMembersError if there are less than 2 members
     * @throws RaffleAlreadyCompletedError if raffle was already completed
     */
    completeRaffle(): Group;
    /**
     * Check if a user is a member of the group
     * @param userId - User ID to check
     * @returns true if user is a member
     */
    isMember(userId: string): boolean;
    /**
     * Check if a user is the admin of the group
     * @param userId - User ID to check
     * @returns true if user is the admin
     */
    isAdmin(userId: string): boolean;
    /**
     * Check if the group can perform raffle
     * @returns true if raffle can be performed
     */
    canPerformRaffle(): boolean;
    /**
     * Converts the entity to a plain object for serialization
     */
    toJSON(): Record<string, unknown>;
}
//# sourceMappingURL=Group.d.ts.map