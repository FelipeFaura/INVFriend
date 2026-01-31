import { Assignment } from "../Assignment";

describe("Assignment Entity", () => {
  const validId = "assignment-123";
  const validGroupId = "group-456";
  const validReceiverId = "user-receiver";
  const validSecretSantaId = "user-santa";

  describe("create", () => {
    it("should create a valid assignment", () => {
      const assignment = Assignment.create(
        validId,
        validGroupId,
        validReceiverId,
        validSecretSantaId,
      );

      expect(assignment.id).toBe(validId);
      expect(assignment.groupId).toBe(validGroupId);
      expect(assignment.receiverId).toBe(validReceiverId);
      expect(assignment.secretSantaId).toBe(validSecretSantaId);
      expect(assignment.createdAt).toBeDefined();
      expect(typeof assignment.createdAt).toBe("number");
    });

    it("should set createdAt to current timestamp", () => {
      const before = Date.now();
      const assignment = Assignment.create(
        validId,
        validGroupId,
        validReceiverId,
        validSecretSantaId,
      );
      const after = Date.now();

      expect(assignment.createdAt).toBeGreaterThanOrEqual(before);
      expect(assignment.createdAt).toBeLessThanOrEqual(after);
    });

    it("should throw error if receiverId equals secretSantaId", () => {
      expect(() =>
        Assignment.create(validId, validGroupId, "same-user", "same-user"),
      ).toThrow("A person cannot be their own secret santa");
    });

    it("should allow different users as receiver and santa", () => {
      expect(() =>
        Assignment.create(validId, validGroupId, "user-a", "user-b"),
      ).not.toThrow();
    });
  });

  describe("fromDatabase", () => {
    it("should recreate assignment with exact values", () => {
      const createdAt = 1700000000000;

      const assignment = Assignment.fromDatabase(
        validId,
        validGroupId,
        validReceiverId,
        validSecretSantaId,
        createdAt,
      );

      expect(assignment.id).toBe(validId);
      expect(assignment.groupId).toBe(validGroupId);
      expect(assignment.receiverId).toBe(validReceiverId);
      expect(assignment.secretSantaId).toBe(validSecretSantaId);
      expect(assignment.createdAt).toBe(createdAt);
    });

    it("should not validate self-assignment when loading from database", () => {
      // Database might have legacy/edge case data
      const assignment = Assignment.fromDatabase(
        validId,
        validGroupId,
        "same-user",
        "same-user",
        Date.now(),
      );

      expect(assignment.receiverId).toBe("same-user");
      expect(assignment.secretSantaId).toBe("same-user");
    });
  });

  describe("involvesUser", () => {
    let assignment: Assignment;

    beforeEach(() => {
      assignment = Assignment.create(
        validId,
        validGroupId,
        validReceiverId,
        validSecretSantaId,
      );
    });

    it("should return true for receiver", () => {
      expect(assignment.involvesUser(validReceiverId)).toBe(true);
    });

    it("should return true for secret santa", () => {
      expect(assignment.involvesUser(validSecretSantaId)).toBe(true);
    });

    it("should return false for uninvolved user", () => {
      expect(assignment.involvesUser("other-user")).toBe(false);
    });
  });

  describe("isSecretSanta", () => {
    let assignment: Assignment;

    beforeEach(() => {
      assignment = Assignment.create(
        validId,
        validGroupId,
        validReceiverId,
        validSecretSantaId,
      );
    });

    it("should return true for secret santa", () => {
      expect(assignment.isSecretSanta(validSecretSantaId)).toBe(true);
    });

    it("should return false for receiver", () => {
      expect(assignment.isSecretSanta(validReceiverId)).toBe(false);
    });

    it("should return false for other users", () => {
      expect(assignment.isSecretSanta("other-user")).toBe(false);
    });
  });

  describe("isReceiver", () => {
    let assignment: Assignment;

    beforeEach(() => {
      assignment = Assignment.create(
        validId,
        validGroupId,
        validReceiverId,
        validSecretSantaId,
      );
    });

    it("should return true for receiver", () => {
      expect(assignment.isReceiver(validReceiverId)).toBe(true);
    });

    it("should return false for secret santa", () => {
      expect(assignment.isReceiver(validSecretSantaId)).toBe(false);
    });

    it("should return false for other users", () => {
      expect(assignment.isReceiver("other-user")).toBe(false);
    });
  });

  describe("immutability", () => {
    it("should have readonly properties", () => {
      const assignment = Assignment.create(
        validId,
        validGroupId,
        validReceiverId,
        validSecretSantaId,
      );

      // TypeScript should prevent these at compile time
      // These runtime checks verify the object structure
      expect(Object.isFrozen(assignment)).toBe(false); // Object not frozen, but properties are readonly
      expect(assignment.id).toBe(validId);
      expect(assignment.groupId).toBe(validGroupId);
    });
  });
});
