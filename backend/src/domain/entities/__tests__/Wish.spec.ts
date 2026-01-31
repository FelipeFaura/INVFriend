/**
 * Wish Entity Tests
 */
import { Wish, CreateWishProps } from "../Wish";

describe("Wish Entity", () => {
  const validProps: CreateWishProps = {
    id: "wish-123",
    groupId: "group-456",
    userId: "user-789",
    title: "New Headphones",
    description: "Sony WH-1000XM5",
    url: "https://amazon.com/headphones",
    estimatedPrice: 350,
    priority: 1,
  };

  describe("create", () => {
    it("should create a wish with all properties", () => {
      const wish = Wish.create(validProps);

      expect(wish.id).toBe("wish-123");
      expect(wish.groupId).toBe("group-456");
      expect(wish.userId).toBe("user-789");
      expect(wish.title).toBe("New Headphones");
      expect(wish.description).toBe("Sony WH-1000XM5");
      expect(wish.url).toBe("https://amazon.com/headphones");
      expect(wish.estimatedPrice).toBe(350);
      expect(wish.priority).toBe(1);
      expect(wish.createdAt).toBeInstanceOf(Date);
      expect(wish.updatedAt).toBeInstanceOf(Date);
    });

    it("should create a wish with minimal properties", () => {
      const wish = Wish.create({
        id: "wish-123",
        groupId: "group-456",
        userId: "user-789",
        title: "A book",
      });

      expect(wish.id).toBe("wish-123");
      expect(wish.title).toBe("A book");
      expect(wish.description).toBeUndefined();
      expect(wish.url).toBeUndefined();
      expect(wish.estimatedPrice).toBeUndefined();
      expect(wish.priority).toBeUndefined();
    });
  });

  describe("validation", () => {
    it("should throw error for empty id", () => {
      expect(() => Wish.create({ ...validProps, id: "" })).toThrow(
        "Wish ID is required",
      );
    });

    it("should throw error for empty groupId", () => {
      expect(() => Wish.create({ ...validProps, groupId: "" })).toThrow(
        "Group ID is required",
      );
    });

    it("should throw error for empty userId", () => {
      expect(() => Wish.create({ ...validProps, userId: "" })).toThrow(
        "User ID is required",
      );
    });

    it("should throw error for empty title", () => {
      expect(() => Wish.create({ ...validProps, title: "" })).toThrow(
        "Title is required",
      );
    });

    it("should throw error for title over 200 characters", () => {
      expect(() =>
        Wish.create({ ...validProps, title: "a".repeat(201) }),
      ).toThrow("Title must be 200 characters or less");
    });

    it("should throw error for description over 1000 characters", () => {
      expect(() =>
        Wish.create({ ...validProps, description: "a".repeat(1001) }),
      ).toThrow("Description must be 1000 characters or less");
    });

    it("should throw error for URL over 500 characters", () => {
      expect(() =>
        Wish.create({ ...validProps, url: "https://" + "a".repeat(500) }),
      ).toThrow("URL must be 500 characters or less");
    });

    it("should throw error for negative estimated price", () => {
      expect(() => Wish.create({ ...validProps, estimatedPrice: -10 })).toThrow(
        "Estimated price cannot be negative",
      );
    });

    it("should throw error for priority less than 1", () => {
      expect(() => Wish.create({ ...validProps, priority: 0 })).toThrow(
        "Priority must be between 1 and 5",
      );
    });

    it("should throw error for priority greater than 5", () => {
      expect(() => Wish.create({ ...validProps, priority: 6 })).toThrow(
        "Priority must be between 1 and 5",
      );
    });
  });

  describe("fromPersistence", () => {
    it("should reconstitute a wish from persistence", () => {
      const date = new Date("2026-01-15");
      const wish = Wish.fromPersistence({
        ...validProps,
        createdAt: date,
        updatedAt: date,
      });

      expect(wish.id).toBe("wish-123");
      expect(wish.createdAt).toEqual(date);
      expect(wish.updatedAt).toEqual(date);
    });
  });

  describe("update", () => {
    it("should update title", () => {
      const wish = Wish.create(validProps);
      const updated = wish.update({ title: "Updated Headphones" });

      expect(updated.title).toBe("Updated Headphones");
      expect(updated.id).toBe(wish.id);
    });

    it("should update description", () => {
      const wish = Wish.create(validProps);
      const updated = wish.update({ description: "New description" });

      expect(updated.description).toBe("New description");
    });

    it("should update url", () => {
      const wish = Wish.create(validProps);
      const updated = wish.update({ url: "https://new-url.com" });

      expect(updated.url).toBe("https://new-url.com");
    });

    it("should update estimated price", () => {
      const wish = Wish.create(validProps);
      const updated = wish.update({ estimatedPrice: 500 });

      expect(updated.estimatedPrice).toBe(500);
    });

    it("should update priority", () => {
      const wish = Wish.create(validProps);
      const updated = wish.update({ priority: 3 });

      expect(updated.priority).toBe(3);
    });

    it("should update updatedAt timestamp", () => {
      const wish = Wish.create(validProps);
      const originalUpdatedAt = wish.updatedAt;

      // Small delay to ensure different timestamp
      const updated = wish.update({ title: "New Title" });

      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it("should validate on update", () => {
      const wish = Wish.create(validProps);

      expect(() => wish.update({ title: "" })).toThrow("Title is required");
    });
  });

  describe("belongsToUser", () => {
    it("should return true for correct user", () => {
      const wish = Wish.create(validProps);
      expect(wish.belongsToUser("user-789")).toBe(true);
    });

    it("should return false for wrong user", () => {
      const wish = Wish.create(validProps);
      expect(wish.belongsToUser("other-user")).toBe(false);
    });
  });

  describe("belongsToGroup", () => {
    it("should return true for correct group", () => {
      const wish = Wish.create(validProps);
      expect(wish.belongsToGroup("group-456")).toBe(true);
    });

    it("should return false for wrong group", () => {
      const wish = Wish.create(validProps);
      expect(wish.belongsToGroup("other-group")).toBe(false);
    });
  });

  describe("toObject", () => {
    it("should return plain object", () => {
      const wish = Wish.create(validProps);
      const obj = wish.toObject();

      expect(obj.id).toBe("wish-123");
      expect(obj.groupId).toBe("group-456");
      expect(obj.userId).toBe("user-789");
      expect(obj.title).toBe("New Headphones");
      expect(obj.description).toBe("Sony WH-1000XM5");
      expect(obj.url).toBe("https://amazon.com/headphones");
      expect(obj.estimatedPrice).toBe(350);
      expect(obj.priority).toBe(1);
    });
  });
});
