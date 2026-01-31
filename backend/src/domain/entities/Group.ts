import {
  InvalidGroupNameError,
  InvalidBudgetLimitError,
  AlreadyGroupMemberError,
  NotGroupMemberError,
  CannotRemoveAdminError,
  NotEnoughMembersError,
  RaffleAlreadyCompletedError,
} from '../errors/GroupErrors';

/**
 * Raffle status type
 */
export type RaffleStatus = 'pending' | 'completed';

/**
 * Group entity - Represents a Secret Santa group
 * This is an immutable entity following domain-driven design principles
 */
export class Group {
  /** Minimum characters for group name */
  static readonly MIN_NAME_LENGTH = 3;
  /** Maximum characters for group name */
  static readonly MAX_NAME_LENGTH = 100;
  /** Minimum members required for raffle */
  static readonly MIN_MEMBERS_FOR_RAFFLE = 2;

  private constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string | null,
    readonly adminId: string,
    readonly members: readonly string[],
    readonly budgetLimit: number,
    readonly raffleStatus: RaffleStatus,
    readonly raffleDate: number | null,
    readonly createdAt: number,
    readonly updatedAt: number,
  ) {}

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
  static create(
    id: string,
    name: string,
    adminId: string,
    budgetLimit: number,
    description?: string | null,
  ): Group {
    // Validate name
    const trimmedName = name.trim();
    if (trimmedName.length < Group.MIN_NAME_LENGTH || trimmedName.length > Group.MAX_NAME_LENGTH) {
      throw new InvalidGroupNameError(
        `Group name must be between ${Group.MIN_NAME_LENGTH} and ${Group.MAX_NAME_LENGTH} characters`,
      );
    }

    // Validate budget
    if (budgetLimit <= 0) {
      throw new InvalidBudgetLimitError('Budget limit must be greater than 0');
    }

    const now = Date.now();
    return new Group(
      id,
      trimmedName,
      description?.trim() || null,
      adminId,
      [adminId], // Admin is automatically added as first member
      budgetLimit,
      'pending',
      null,
      now,
      now,
    );
  }

  /**
   * Creates a Group from existing data (used when loading from database)
   */
  static fromDatabase(
    id: string,
    name: string,
    description: string | null,
    adminId: string,
    members: string[],
    budgetLimit: number,
    raffleStatus: RaffleStatus,
    raffleDate: number | null,
    createdAt: number,
    updatedAt: number,
  ): Group {
    return new Group(
      id,
      name,
      description,
      adminId,
      [...members],
      budgetLimit,
      raffleStatus,
      raffleDate,
      createdAt,
      updatedAt,
    );
  }

  /**
   * Updates the group information
   * @param name - Optional new name
   * @param description - Optional new description
   * @param budgetLimit - Optional new budget limit
   * @returns New Group instance with updated data
   * @throws InvalidGroupNameError if name is invalid
   * @throws InvalidBudgetLimitError if budget is invalid
   */
  update(name?: string, description?: string | null, budgetLimit?: number): Group {
    let newName = this.name;
    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length < Group.MIN_NAME_LENGTH || trimmedName.length > Group.MAX_NAME_LENGTH) {
        throw new InvalidGroupNameError();
      }
      newName = trimmedName;
    }

    let newBudget = this.budgetLimit;
    if (budgetLimit !== undefined) {
      if (budgetLimit <= 0) {
        throw new InvalidBudgetLimitError();
      }
      newBudget = budgetLimit;
    }

    const newDescription = description !== undefined ? description?.trim() || null : this.description;

    return new Group(
      this.id,
      newName,
      newDescription,
      this.adminId,
      this.members,
      newBudget,
      this.raffleStatus,
      this.raffleDate,
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Adds a member to the group
   * @param userId - User ID to add
   * @returns New Group instance with member added
   * @throws AlreadyGroupMemberError if user is already a member
   * @throws RaffleAlreadyCompletedError if raffle has been completed
   */
  addMember(userId: string): Group {
    if (this.raffleStatus === 'completed') {
      throw new RaffleAlreadyCompletedError('Cannot add members after raffle has been completed');
    }

    if (this.members.includes(userId)) {
      throw new AlreadyGroupMemberError();
    }

    return new Group(
      this.id,
      this.name,
      this.description,
      this.adminId,
      [...this.members, userId],
      this.budgetLimit,
      this.raffleStatus,
      this.raffleDate,
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Removes a member from the group
   * @param userId - User ID to remove
   * @returns New Group instance with member removed
   * @throws CannotRemoveAdminError if trying to remove admin
   * @throws NotGroupMemberError if user is not a member
   * @throws RaffleAlreadyCompletedError if raffle has been completed
   */
  removeMember(userId: string): Group {
    if (this.raffleStatus === 'completed') {
      throw new RaffleAlreadyCompletedError('Cannot remove members after raffle has been completed');
    }

    if (userId === this.adminId) {
      throw new CannotRemoveAdminError();
    }

    if (!this.members.includes(userId)) {
      throw new NotGroupMemberError();
    }

    return new Group(
      this.id,
      this.name,
      this.description,
      this.adminId,
      this.members.filter((id) => id !== userId),
      this.budgetLimit,
      this.raffleStatus,
      this.raffleDate,
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Marks the raffle as completed
   * @returns New Group instance with raffle completed
   * @throws NotEnoughMembersError if there are less than 2 members
   * @throws RaffleAlreadyCompletedError if raffle was already completed
   */
  completeRaffle(): Group {
    if (this.raffleStatus === 'completed') {
      throw new RaffleAlreadyCompletedError();
    }

    if (this.members.length < Group.MIN_MEMBERS_FOR_RAFFLE) {
      throw new NotEnoughMembersError(Group.MIN_MEMBERS_FOR_RAFFLE);
    }

    return new Group(
      this.id,
      this.name,
      this.description,
      this.adminId,
      this.members,
      this.budgetLimit,
      'completed',
      Date.now(),
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Check if a user is a member of the group
   * @param userId - User ID to check
   * @returns true if user is a member
   */
  isMember(userId: string): boolean {
    return this.members.includes(userId);
  }

  /**
   * Check if a user is the admin of the group
   * @param userId - User ID to check
   * @returns true if user is the admin
   */
  isAdmin(userId: string): boolean {
    return this.adminId === userId;
  }

  /**
   * Check if the group can perform raffle
   * @returns true if raffle can be performed
   */
  canPerformRaffle(): boolean {
    return this.raffleStatus === 'pending' && this.members.length >= Group.MIN_MEMBERS_FOR_RAFFLE;
  }

  /**
   * Converts the entity to a plain object for serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      adminId: this.adminId,
      members: [...this.members],
      budgetLimit: this.budgetLimit,
      raffleStatus: this.raffleStatus,
      raffleDate: this.raffleDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
