import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupStatusComponent } from "./group-status.component";
import { Group } from "../../../domain/models/group.model";

describe("GroupStatusComponent", () => {
  let component: GroupStatusComponent;
  let fixture: ComponentFixture<GroupStatusComponent>;

  const mockGroup: Group = {
    id: "group-123",
    name: "Test Group",
    description: "Test Description",
    adminId: "admin-1",
    members: ["admin-1", "member-2", "member-3"],
    budgetLimit: 50,
    createdAt: new Date(),
    updatedAt: new Date(),
    raffleStatus: "pending",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupStatusComponent);
    component = fixture.componentInstance;
    component.group = mockGroup;
    fixture.detectChanges();
  });

  describe("initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });
  });

  describe("member count", () => {
    it("should return correct member count", () => {
      expect(component.memberCount).toBe(3);
    });

    it("should return 0 when group is null", () => {
      component.group = null;
      expect(component.memberCount).toBe(0);
    });
  });

  describe("raffle status", () => {
    it("should detect pending raffle", () => {
      expect(component.isRaffleCompleted).toBe(false);
    });

    it("should detect completed raffle", () => {
      component.group = { ...mockGroup, raffleStatus: "completed" };
      expect(component.isRaffleCompleted).toBe(true);
    });
  });

  describe("hasEnoughMembers", () => {
    it("should return true when enough members", () => {
      expect(component.hasEnoughMembers).toBe(true);
    });

    it("should return false when not enough members", () => {
      component.group = { ...mockGroup, members: ["admin-1"] };
      expect(component.hasEnoughMembers).toBe(false);
    });
  });

  describe("memberProgress", () => {
    it("should return 100 when at or above minimum", () => {
      expect(component.memberProgress).toBe(100);
    });

    it("should return 50 when half of minimum", () => {
      component.group = { ...mockGroup, members: ["admin-1"] };
      expect(component.memberProgress).toBe(50);
    });

    it("should return 0 when no members", () => {
      component.group = { ...mockGroup, members: [] };
      expect(component.memberProgress).toBe(0);
    });
  });

  describe("statusLabel", () => {
    it("should return Pending Raffle when not completed", () => {
      expect(component.statusLabel).toBe("Pending Raffle");
    });

    it("should return Raffle Completed when completed", () => {
      component.group = { ...mockGroup, raffleStatus: "completed" };
      expect(component.statusLabel).toBe("Raffle Completed");
    });
  });

  describe("statusClass", () => {
    it("should return pending class when not completed", () => {
      expect(component.statusClass).toBe("pending");
    });

    it("should return completed class when completed", () => {
      component.group = { ...mockGroup, raffleStatus: "completed" };
      expect(component.statusClass).toBe("completed");
    });
  });
});
