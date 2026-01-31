import {
  shuffleArray,
  performRaffle,
  validateRaffleResult,
  RaffleAssignment,
} from "../raffleAlgorithm";

describe("Raffle Algorithm", () => {
  describe("shuffleArray", () => {
    it("should return array of same length", () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffleArray(arr);
      expect(result.length).toBe(arr.length);
    });

    it("should contain all original elements", () => {
      const arr = ["a", "b", "c", "d", "e"];
      const result = shuffleArray(arr);
      expect(result.sort()).toEqual(arr.sort());
    });

    it("should not modify the original array", () => {
      const arr = [1, 2, 3, 4, 5];
      const original = [...arr];
      shuffleArray(arr);
      expect(arr).toEqual(original);
    });

    it("should produce consistent results with fixed random function", () => {
      const arr = [1, 2, 3, 4, 5];
      // Fixed random function that always returns 0.5
      const fixedRandom = () => 0.5;

      const result1 = shuffleArray(arr, fixedRandom);
      const result2 = shuffleArray(arr, fixedRandom);

      expect(result1).toEqual(result2);
    });

    it("should handle empty array", () => {
      const result = shuffleArray([]);
      expect(result).toEqual([]);
    });

    it("should handle single element array", () => {
      const result = shuffleArray([42]);
      expect(result).toEqual([42]);
    });

    it("should produce different orderings over many shuffles", () => {
      const arr = [1, 2, 3, 4, 5];
      const results = new Set<string>();

      // Run 100 shuffles
      for (let i = 0; i < 100; i++) {
        const shuffled = shuffleArray(arr);
        results.add(JSON.stringify(shuffled));
      }

      // Should have at least a few different orderings
      expect(results.size).toBeGreaterThan(5);
    });
  });

  describe("performRaffle", () => {
    describe("basic functionality", () => {
      it("should create valid assignments for 2 members", () => {
        const members = ["user1", "user2"];
        const result = performRaffle(members);

        expect(result.success).toBe(true);
        expect(result.assignments.length).toBe(2);

        // Each person should give to the other
        const assignment1 = result.assignments.find(
          (a) => a.secretSantaId === "user1",
        );
        const assignment2 = result.assignments.find(
          (a) => a.secretSantaId === "user2",
        );

        expect(assignment1?.receiverId).toBe("user2");
        expect(assignment2?.receiverId).toBe("user1");
      });

      it("should create valid assignments for 3 members", () => {
        const members = ["alice", "bob", "charlie"];
        const result = performRaffle(members);

        expect(result.success).toBe(true);
        expect(result.assignments.length).toBe(3);
      });

      it("should create valid assignments for large groups", () => {
        const members = Array.from({ length: 50 }, (_, i) => `user${i}`);
        const result = performRaffle(members);

        expect(result.success).toBe(true);
        expect(result.assignments.length).toBe(50);
      });
    });

    describe("derangement property (no self-assignment)", () => {
      it("should never assign someone to themselves", () => {
        const members = ["a", "b", "c", "d", "e"];

        // Run 100 times to ensure no self-assignment
        for (let i = 0; i < 100; i++) {
          const result = performRaffle(members);
          expect(result.success).toBe(true);

          for (const assignment of result.assignments) {
            expect(assignment.receiverId).not.toBe(assignment.secretSantaId);
          }
        }
      });

      it("should work correctly for 2 members (edge case)", () => {
        const members = ["only-two-1", "only-two-2"];

        for (let i = 0; i < 50; i++) {
          const result = performRaffle(members);
          expect(result.success).toBe(true);

          for (const assignment of result.assignments) {
            expect(assignment.receiverId).not.toBe(assignment.secretSantaId);
          }
        }
      });
    });

    describe("bijection property", () => {
      it("should ensure everyone gives exactly one gift", () => {
        const members = ["a", "b", "c", "d", "e"];
        const result = performRaffle(members);

        expect(result.success).toBe(true);

        const santas = result.assignments.map((a) => a.secretSantaId);
        const uniqueSantas = new Set(santas);
        expect(uniqueSantas.size).toBe(members.length);
      });

      it("should ensure everyone receives exactly one gift", () => {
        const members = ["a", "b", "c", "d", "e"];
        const result = performRaffle(members);

        expect(result.success).toBe(true);

        const receivers = result.assignments.map((a) => a.receiverId);
        const uniqueReceivers = new Set(receivers);
        expect(uniqueReceivers.size).toBe(members.length);
      });
    });

    describe("error handling", () => {
      it("should fail with less than 2 members", () => {
        const result = performRaffle(["only-one"]);

        expect(result.success).toBe(false);
        expect(result.error).toContain("2 members");
        expect(result.assignments).toEqual([]);
      });

      it("should fail with empty array", () => {
        const result = performRaffle([]);

        expect(result.success).toBe(false);
        expect(result.error).toContain("2 members");
      });

      it("should fail with duplicate member IDs", () => {
        const result = performRaffle(["user1", "user2", "user1"]);

        expect(result.success).toBe(false);
        expect(result.error).toContain("Duplicate");
      });
    });

    describe("randomness", () => {
      it("should produce different results over multiple calls", () => {
        const members = ["a", "b", "c", "d", "e"];
        const results = new Set<string>();

        for (let i = 0; i < 100; i++) {
          const result = performRaffle(members);
          results.add(JSON.stringify(result.assignments));
        }

        // Should have multiple different orderings
        expect(results.size).toBeGreaterThan(5);
      });

      it("should be deterministic with fixed random function", () => {
        const members = ["a", "b", "c", "d", "e"];
        let callCount = 0;
        const fixedRandom = () => {
          // Returns sequence: 0.1, 0.2, 0.3, ...
          return (++callCount % 10) / 10;
        };

        callCount = 0;
        const result1 = performRaffle(members, fixedRandom);

        callCount = 0;
        const result2 = performRaffle(members, fixedRandom);

        expect(result1.assignments).toEqual(result2.assignments);
      });
    });
  });

  describe("validateRaffleResult", () => {
    const members = ["alice", "bob", "charlie"];

    it("should validate correct assignments", () => {
      const validAssignments: RaffleAssignment[] = [
        { receiverId: "bob", secretSantaId: "alice" },
        { receiverId: "charlie", secretSantaId: "bob" },
        { receiverId: "alice", secretSantaId: "charlie" },
      ];

      const result = validateRaffleResult(validAssignments, members);
      expect(result.valid).toBe(true);
    });

    it("should detect self-assignment", () => {
      const invalidAssignments: RaffleAssignment[] = [
        { receiverId: "alice", secretSantaId: "alice" }, // Self-assignment!
        { receiverId: "charlie", secretSantaId: "bob" },
        { receiverId: "bob", secretSantaId: "charlie" },
      ];

      const result = validateRaffleResult(invalidAssignments, members);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Self-assignment");
    });

    it("should detect duplicate receivers", () => {
      const invalidAssignments: RaffleAssignment[] = [
        { receiverId: "bob", secretSantaId: "alice" },
        { receiverId: "bob", secretSantaId: "charlie" }, // Bob receives twice!
        { receiverId: "alice", secretSantaId: "bob" },
      ];

      const result = validateRaffleResult(invalidAssignments, members);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Duplicate receiver");
    });

    it("should detect duplicate santas", () => {
      const invalidAssignments: RaffleAssignment[] = [
        { receiverId: "bob", secretSantaId: "alice" },
        { receiverId: "charlie", secretSantaId: "alice" }, // Alice gives twice!
        { receiverId: "alice", secretSantaId: "bob" },
      ];

      const result = validateRaffleResult(invalidAssignments, members);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Duplicate secret santa");
    });

    it("should detect wrong number of assignments", () => {
      const invalidAssignments: RaffleAssignment[] = [
        { receiverId: "bob", secretSantaId: "alice" },
        { receiverId: "charlie", secretSantaId: "bob" },
        // Missing one assignment
      ];

      const result = validateRaffleResult(invalidAssignments, members);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Expected 3 assignments");
    });

    it("should detect unknown receiver", () => {
      const invalidAssignments: RaffleAssignment[] = [
        { receiverId: "unknown", secretSantaId: "alice" },
        { receiverId: "charlie", secretSantaId: "bob" },
        { receiverId: "alice", secretSantaId: "charlie" },
      ];

      const result = validateRaffleResult(invalidAssignments, members);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Unknown receiver");
    });

    it("should detect unknown santa", () => {
      const invalidAssignments: RaffleAssignment[] = [
        { receiverId: "bob", secretSantaId: "unknown" },
        { receiverId: "charlie", secretSantaId: "bob" },
        { receiverId: "alice", secretSantaId: "charlie" },
      ];

      const result = validateRaffleResult(invalidAssignments, members);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Unknown secret santa");
    });
  });

  describe("integration: full raffle validation", () => {
    it("should produce valid results that pass validation", () => {
      const members = ["a", "b", "c", "d", "e", "f", "g", "h"];

      for (let i = 0; i < 50; i++) {
        const result = performRaffle(members);
        expect(result.success).toBe(true);

        const validation = validateRaffleResult(result.assignments, members);
        expect(validation.valid).toBe(true);
      }
    });
  });
});
