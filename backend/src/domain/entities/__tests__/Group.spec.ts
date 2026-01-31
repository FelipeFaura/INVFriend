import { Group } from "../Group";
import {
  InvalidGroupNameError,
  InvalidBudgetLimitError,
  AlreadyGroupMemberError,
  NotGroupMemberError,
  CannotRemoveAdminError,
  NotEnoughMembersError,
  RaffleAlreadyCompletedError,
} from "../../errors/GroupErrors";

describe("Group Entity", () => {
  const validGroupData = {
    id: "group-123",
    name: "Secret Santa 2026",
    adminId: "admin-user-123",
    budgetLimit: 50,
    description: "Christmas gift exchange",
  };

  describe("create", () => {
    it("should create a group with valid data", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
        validGroupData.description,
      );

      expect(group.id).toBe(validGroupData.id);
      expect(group.name).toBe(validGroupData.name);
      expect(group.adminId).toBe(validGroupData.adminId);
      expect(group.budgetLimit).toBe(validGroupData.budgetLimit);
      expect(group.description).toBe(validGroupData.description);
      expect(group.raffleStatus).toBe("pending");
      expect(group.raffleDate).toBeNull();
      expect(group.createdAt).toBeDefined();
      expect(group.updatedAt).toBeDefined();
    });

    it("should automatically add admin as first member", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.members).toContain(validGroupData.adminId);
      expect(group.members.length).toBe(1);
    });

    it("should create group without description", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.description).toBeNull();
    });

    it("should trim group name", () => {
      const group = Group.create(
        validGroupData.id,
        "  Secret Santa  ",
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.name).toBe("Secret Santa");
    });

    it("should throw InvalidGroupNameError for name shorter than 3 characters", () => {
      expect(() =>
        Group.create(
          validGroupData.id,
          "AB",
          validGroupData.adminId,
          validGroupData.budgetLimit,
        ),
      ).toThrow(InvalidGroupNameError);
    });

    it("should throw InvalidGroupNameError for name longer than 100 characters", () => {
      const longName = "A".repeat(101);
      expect(() =>
        Group.create(
          validGroupData.id,
          longName,
          validGroupData.adminId,
          validGroupData.budgetLimit,
        ),
      ).toThrow(InvalidGroupNameError);
    });

    it("should throw InvalidBudgetLimitError for budget <= 0", () => {
      expect(() =>
        Group.create(
          validGroupData.id,
          validGroupData.name,
          validGroupData.adminId,
          0,
        ),
      ).toThrow(InvalidBudgetLimitError);

      expect(() =>
        Group.create(
          validGroupData.id,
          validGroupData.name,
          validGroupData.adminId,
          -10,
        ),
      ).toThrow(InvalidBudgetLimitError);
    });
  });

  describe("fromDatabase", () => {
    it("should create group from database data", () => {
      const dbData = {
        id: "group-123",
        name: "Test Group",
        description: "Test",
        adminId: "admin-123",
        members: ["admin-123", "user-456"],
        budgetLimit: 100,
        raffleStatus: "pending" as const,
        raffleDate: null,
        createdAt: 1704067200000,
        updatedAt: 1704067200000,
      };

      const group = Group.fromDatabase(
        dbData.id,
        dbData.name,
        dbData.description,
        dbData.adminId,
        dbData.members,
        dbData.budgetLimit,
        dbData.raffleStatus,
        dbData.raffleDate,
        dbData.createdAt,
        dbData.updatedAt,
      );

      expect(group.id).toBe(dbData.id);
      expect(group.name).toBe(dbData.name);
      expect(group.members).toEqual(dbData.members);
      expect(group.createdAt).toBe(dbData.createdAt);
    });
  });

  describe("update", () => {
    it("should update group name", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      const updated = group.update("New Name");

      expect(updated.name).toBe("New Name");
      expect(updated.id).toBe(group.id);
    });

    it("should update group description", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      const updated = group.update(undefined, "New description");

      expect(updated.description).toBe("New description");
    });

    it("should update budget limit", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      const updated = group.update(undefined, undefined, 100);

      expect(updated.budgetLimit).toBe(100);
    });

    it("should throw InvalidGroupNameError on invalid name update", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(() => group.update("AB")).toThrow(InvalidGroupNameError);
    });

    it("should throw InvalidBudgetLimitError on invalid budget update", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(() => group.update(undefined, undefined, 0)).toThrow(
        InvalidBudgetLimitError,
      );
    });
  });

  describe("addMember", () => {
    it("should add a new member", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      const updated = group.addMember("new-user-123");

      expect(updated.members).toContain("new-user-123");
      expect(updated.members.length).toBe(2);
    });

    it("should throw AlreadyGroupMemberError if user is already a member", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(() => group.addMember(validGroupData.adminId)).toThrow(
        AlreadyGroupMemberError,
      );
    });

    it("should throw RaffleAlreadyCompletedError if raffle is completed", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );
      const withMember = group.addMember("user-2");
      const completed = withMember.completeRaffle();

      expect(() => completed.addMember("user-3")).toThrow(
        RaffleAlreadyCompletedError,
      );
    });
  });

  describe("removeMember", () => {
    it("should remove a member", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );
      const withMember = group.addMember("user-to-remove");

      const updated = withMember.removeMember("user-to-remove");

      expect(updated.members).not.toContain("user-to-remove");
      expect(updated.members.length).toBe(1);
    });

    it("should throw CannotRemoveAdminError when trying to remove admin", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(() => group.removeMember(validGroupData.adminId)).toThrow(
        CannotRemoveAdminError,
      );
    });

    it("should throw NotGroupMemberError if user is not a member", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(() => group.removeMember("non-existent-user")).toThrow(
        NotGroupMemberError,
      );
    });

    it("should throw RaffleAlreadyCompletedError if raffle is completed", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );
      const withMembers = group.addMember("user-2");
      const completed = withMembers.completeRaffle();

      expect(() => completed.removeMember("user-2")).toThrow(
        RaffleAlreadyCompletedError,
      );
    });
  });

  describe("completeRaffle", () => {
    it("should complete raffle with enough members", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );
      const withMember = group.addMember("user-2");

      const completed = withMember.completeRaffle();

      expect(completed.raffleStatus).toBe("completed");
      expect(completed.raffleDate).toBeDefined();
      expect(completed.raffleDate).not.toBeNull();
    });

    it("should throw NotEnoughMembersError with less than 2 members", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(() => group.completeRaffle()).toThrow(NotEnoughMembersError);
    });

    it("should throw RaffleAlreadyCompletedError if already completed", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );
      const withMember = group.addMember("user-2");
      const completed = withMember.completeRaffle();

      expect(() => completed.completeRaffle()).toThrow(
        RaffleAlreadyCompletedError,
      );
    });
  });

  describe("isMember", () => {
    it("should return true for a member", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.isMember(validGroupData.adminId)).toBe(true);
    });

    it("should return false for non-member", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.isMember("non-member")).toBe(false);
    });
  });

  describe("isAdmin", () => {
    it("should return true for admin", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.isAdmin(validGroupData.adminId)).toBe(true);
    });

    it("should return false for non-admin", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.isAdmin("other-user")).toBe(false);
    });
  });

  describe("canPerformRaffle", () => {
    it("should return true when pending and has enough members", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );
      const withMember = group.addMember("user-2");

      expect(withMember.canPerformRaffle()).toBe(true);
    });

    it("should return false when not enough members", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );

      expect(group.canPerformRaffle()).toBe(false);
    });

    it("should return false when raffle completed", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
      );
      const withMember = group.addMember("user-2");
      const completed = withMember.completeRaffle();

      expect(completed.canPerformRaffle()).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("should return plain object representation", () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
        validGroupData.description,
      );

      const json = group.toJSON();

      expect(json.id).toBe(validGroupData.id);
      expect(json.name).toBe(validGroupData.name);
      expect(json.adminId).toBe(validGroupData.adminId);
      expect(json.budgetLimit).toBe(validGroupData.budgetLimit);
      expect(json.description).toBe(validGroupData.description);
      expect(json.members).toEqual([validGroupData.adminId]);
      expect(json.raffleStatus).toBe("pending");
    });
  });
});
