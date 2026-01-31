import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { SimpleChange } from "@angular/core";

import { SecretSantaRevealComponent } from "./secret-santa-reveal.component";
import { RaffleHttpService } from "../../services/raffle-http.service";
import { Group } from "../../../domain/models/group.model";
import { Assignment } from "../../../domain/models/assignment.model";
import {
  RaffleNotCompletedError,
  AssignmentNotFoundError,
  UnknownRaffleError,
} from "../../../domain/errors/raffle-errors";

describe("SecretSantaRevealComponent", () => {
  let component: SecretSantaRevealComponent;
  let fixture: ComponentFixture<SecretSantaRevealComponent>;
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
    raffleStatus: "completed",
  };

  const mockAssignment: Assignment = {
    id: "assignment-456",
    groupId: "group-123",
    receiverId: "member-2",
    createdAt: new Date(),
  };

  beforeEach(async () => {
    mockRaffleService = jasmine.createSpyObj("RaffleHttpService", [
      "getMyAssignment",
    ]);
    mockRaffleService.getMyAssignment.and.returnValue(of(mockAssignment));

    await TestBed.configureTestingModule({
      declarations: [SecretSantaRevealComponent],
      providers: [{ provide: RaffleHttpService, useValue: mockRaffleService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SecretSantaRevealComponent);
    component = fixture.componentInstance;
  });

  describe("initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should be hidden initially without group", () => {
      fixture.detectChanges();
      expect(component.state).toBe("hidden");
    });

    it("should be hidden when raffle not completed", fakeAsync(() => {
      component.group = { ...mockGroup, raffleStatus: "pending" };
      fixture.detectChanges();
      tick();

      expect(component.state).toBe("hidden");
      expect(mockRaffleService.getMyAssignment).not.toHaveBeenCalled();
    }));

    it("should load assignment when raffle completed", fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(component.state).toBe("revealed");
      expect(mockRaffleService.getMyAssignment).toHaveBeenCalledWith(
        "group-123",
      );
    }));
  });

  describe("loading assignment", () => {
    it("should show revealed state with assignment", fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(component.state).toBe("revealed");
      expect(component.assignment).toEqual(mockAssignment);
    }));

    it("should show no-assignment when RaffleNotCompletedError", fakeAsync(() => {
      mockRaffleService.getMyAssignment.and.returnValue(
        throwError(() => new RaffleNotCompletedError()),
      );

      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(component.state).toBe("no-assignment");
    }));

    it("should show no-assignment when AssignmentNotFoundError", fakeAsync(() => {
      mockRaffleService.getMyAssignment.and.returnValue(
        throwError(() => new AssignmentNotFoundError()),
      );

      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(component.state).toBe("no-assignment");
    }));

    it("should show error for other errors", fakeAsync(() => {
      mockRaffleService.getMyAssignment.and.returnValue(
        throwError(() => new UnknownRaffleError("Network error")),
      );

      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(component.state).toBe("error");
      expect(component.errorMessage).toBe("Network error");
    }));
  });

  describe("ngOnChanges", () => {
    it("should reload when group changes", fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      const newGroup = { ...mockGroup, id: "group-456" };
      component.group = newGroup;

      component.ngOnChanges({
        group: new SimpleChange(mockGroup, newGroup, false),
      });
      tick();

      expect(mockRaffleService.getMyAssignment).toHaveBeenCalledWith(
        "group-456",
      );
    }));

    it("should not reload on first change", fakeAsync(() => {
      component.group = mockGroup;

      component.ngOnChanges({
        group: new SimpleChange(null, mockGroup, true),
      });

      // Only called once from ngOnInit via detectChanges
      fixture.detectChanges();
      tick();
      expect(mockRaffleService.getMyAssignment).toHaveBeenCalledTimes(1);
    }));
  });

  describe("retry", () => {
    it("should retry loading assignment", fakeAsync(() => {
      mockRaffleService.getMyAssignment.and.returnValue(
        throwError(() => new UnknownRaffleError("Network error")),
      );

      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(component.state).toBe("error");

      // Fix the service and retry
      mockRaffleService.getMyAssignment.and.returnValue(of(mockAssignment));
      component.retry();
      tick();

      expect(component.state).toBe("revealed");
      expect(mockRaffleService.getMyAssignment).toHaveBeenCalledTimes(2);
    }));
  });

  describe("getMemberDisplay", () => {
    it("should return member ID", () => {
      expect(component.getMemberDisplay("user-123")).toBe("user-123");
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
