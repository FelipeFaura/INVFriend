/**
 * Raffle Trigger Component
 * Admin-only component to perform the Secret Santa raffle
 */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { RaffleHttpService } from "../../services/raffle-http.service";
import { RaffleResult } from "../../../domain/models/assignment.model";
import { Group } from "../../../domain/models/group.model";

export type RaffleTriggerState =
  | "idle"
  | "confirm"
  | "processing"
  | "success"
  | "error";

@Component({
  selector: "app-raffle-trigger",
  templateUrl: "./raffle-trigger.component.html",
  styleUrls: ["./raffle-trigger.component.scss"],
})
export class RaffleTriggerComponent implements OnDestroy {
  /** Group to perform raffle for */
  @Input() group: Group | null = null;

  /** Whether current user is admin */
  @Input() isAdmin = false;

  /** Emitted when raffle is completed successfully */
  @Output() raffleCompleted = new EventEmitter<RaffleResult>();

  /** Current component state */
  state: RaffleTriggerState = "idle";

  /** Error message if any */
  errorMessage: string | null = null;

  /** Result of successful raffle */
  raffleResult: RaffleResult | null = null;

  /** Minimum members required for raffle */
  readonly MIN_MEMBERS = 2;

  private destroy$ = new Subject<void>();

  constructor(private raffleHttpService: RaffleHttpService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Get member count from group
   */
  get memberCount(): number {
    return this.group?.members?.length ?? 0;
  }

  /**
   * Check if group has enough members
   */
  get hasEnoughMembers(): boolean {
    return this.memberCount >= this.MIN_MEMBERS;
  }

  /**
   * Check if raffle is already completed
   */
  get isRaffleCompleted(): boolean {
    return this.group?.raffleStatus === "completed";
  }

  /**
   * Check if raffle button should be disabled
   */
  get isButtonDisabled(): boolean {
    return (
      !this.hasEnoughMembers ||
      this.isRaffleCompleted ||
      this.state === "processing"
    );
  }

  /**
   * Show confirmation dialog
   */
  showConfirmation(): void {
    this.state = "confirm";
    this.errorMessage = null;
  }

  /**
   * Cancel and go back to idle
   */
  cancelRaffle(): void {
    this.state = "idle";
    this.errorMessage = null;
  }

  /**
   * Perform the raffle
   */
  confirmRaffle(): void {
    if (!this.group) return;

    this.state = "processing";
    this.errorMessage = null;

    this.raffleHttpService
      .performRaffle(this.group.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.raffleResult = result;
          this.state = "success";
          this.raffleCompleted.emit(result);
        },
        error: (err) => {
          this.errorMessage = err.message || "Failed to perform raffle";
          this.state = "error";
        },
      });
  }

  /**
   * Reset to idle state
   */
  resetState(): void {
    this.state = "idle";
    this.errorMessage = null;
    this.raffleResult = null;
  }
}
