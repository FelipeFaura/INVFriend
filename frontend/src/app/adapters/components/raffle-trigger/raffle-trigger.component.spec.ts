import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { of, throwError, Subject } from "rxjs";

import { RaffleTriggerComponent } from "./raffle-trigger.component";
import { RaffleHttpService } from "../../services/raffle-http.service";
import { Group } from "../../../domain/models/group.model";
import { RaffleResult } from "../../../domain/models/assignment.model";
import { NotEnoughMembersError } from "../../../domain/errors/raffle-errors";

describe("RaffleTriggerComponent", () => {
  let component: RaffleTriggerComponent;
  let fixture: ComponentFixture<RaffleTriggerComponent>;
  let mockRaffleService: jasmine.SpyObj<RaffleHttpService>;

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

  const mockRaffleResult: RaffleResult = {
    groupId: "group-123",
    raffleDate: new Date(),
    assignmentCount: 3,
  };

  beforeEach(async () => {
    mockRaffleService = jasmine.createSpyObj("RaffleHttpService", [
      "performRaffle",
    ]);

    await TestBed.configureTestingModule({
      declarations: [RaffleTriggerComponent],
      providers: [{ provide: RaffleHttpService, useValue: mockRaffleService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RaffleTriggerComponent);
    component = fixture.componentInstance;
    component.group = mockGroup;
    component.isAdmin = true;
    fixture.detectChanges();
  });

  describe("initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should start in idle state", () => {
      expect(component.state).toBe("idle");
    });

    it("should show correct member count", () => {
      expect(component.memberCount).toBe(3);
    });
  });

  describe("member validation", () => {
    it("should return true when enough members", () => {
      expect(component.hasEnoughMembers).toBe(true);
    });

    it("should return false when not enough members", () => {
      component.group = { ...mockGroup, members: ["admin-1"] };
      expect(component.hasEnoughMembers).toBe(false);
    });

    it("should return 0 when group is null", () => {
      component.group = null;
      expect(component.memberCount).toBe(0);
    });
  });

  describe("button state", () => {
    it("should be disabled when not enough members", () => {
      component.group = { ...mockGroup, members: ["admin-1"] };
      expect(component.isButtonDisabled).toBe(true);
    });

    it("should be disabled when raffle already completed", () => {
      component.group = { ...mockGroup, raffleStatus: "completed" };
      expect(component.isButtonDisabled).toBe(true);
    });

    it("should be disabled when processing", () => {
      component.state = "processing";
      expect(component.isButtonDisabled).toBe(true);
    });

    it("should be enabled when conditions met", () => {
      expect(component.isButtonDisabled).toBe(false);
    });
  });

  describe("confirmation flow", () => {
    it("should show confirmation on showConfirmation()", () => {
      component.showConfirmation();
      expect(component.state).toBe("confirm");
    });

    it("should cancel and return to idle", () => {
      component.state = "confirm";
      component.cancelRaffle();
      expect(component.state).toBe("idle");
    });

    it("should clear error message on cancel", () => {
      component.errorMessage = "Some error";
      component.cancelRaffle();
      expect(component.errorMessage).toBeNull();
    });
  });

  describe("perform raffle", () => {
    it("should call service and update state on success", fakeAsync(() => {
      mockRaffleService.performRaffle.and.returnValue(of(mockRaffleResult));

      component.confirmRaffle();
      tick();

      expect(mockRaffleService.performRaffle).toHaveBeenCalledWith("group-123");
      expect(component.state).toBe("success");
      expect(component.raffleResult).toEqual(mockRaffleResult);
    }));

    it("should emit raffleCompleted event on success", fakeAsync(() => {
      mockRaffleService.performRaffle.and.returnValue(of(mockRaffleResult));
      const emitSpy = spyOn(component.raffleCompleted, "emit");

      component.confirmRaffle();
      tick();

      expect(emitSpy).toHaveBeenCalledWith(mockRaffleResult);
    }));

    it("should set processing state while performing", fakeAsync(() => {
      const subject = new Subject<RaffleResult>();
      mockRaffleService.performRaffle.and.returnValue(subject.asObservable());

      component.confirmRaffle();

      expect(component.state).toBe("processing");

      // Complete the observable
      subject.next(mockRaffleResult);
      subject.complete();
      tick();

      expect(component.state).toBe("success");
    }));

    it("should handle error and update state", fakeAsync(() => {
      const error = new NotEnoughMembersError("Not enough members");
      mockRaffleService.performRaffle.and.returnValue(throwError(() => error));

      component.confirmRaffle();
      tick();

      expect(component.state).toBe("error");
      expect(component.errorMessage).toBe("Not enough members");
    }));

    it("should do nothing if group is null", () => {
      component.group = null;
      component.confirmRaffle();

      expect(mockRaffleService.performRaffle).not.toHaveBeenCalled();
    });
  });

  describe("reset state", () => {
    it("should reset all state to initial values", () => {
      component.state = "error";
      component.errorMessage = "Some error";
      component.raffleResult = mockRaffleResult;

      component.resetState();

      expect(component.state).toBe("idle");
      expect(component.errorMessage).toBeNull();
      expect(component.raffleResult).toBeNull();
    });
  });

  describe("raffle completed detection", () => {
    it("should detect completed raffle", () => {
      component.group = { ...mockGroup, raffleStatus: "completed" };
      expect(component.isRaffleCompleted).toBe(true);
    });

    it("should detect pending raffle", () => {
      component.group = { ...mockGroup, raffleStatus: "pending" };
      expect(component.isRaffleCompleted).toBe(false);
    });
  });

  describe("cleanup", () => {
    it("should unsubscribe on destroy", () => {
      const destroySpy = spyOn(component["destroy$"], "next");
      const completeSpy = spyOn(component["destroy$"], "complete");

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
