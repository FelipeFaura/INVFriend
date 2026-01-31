/**
 * Group Status Component
 * Displays the raffle status of a group
 */
import { Component, Input } from "@angular/core";

import { Group } from "../../../domain/models/group.model";

@Component({
  selector: "app-group-status",
  templateUrl: "./group-status.component.html",
  styleUrls: ["./group-status.component.scss"],
})
export class GroupStatusComponent {
  /** Group to display status for */
  @Input() group: Group | null = null;

  /** Minimum members required for raffle */
  readonly MIN_MEMBERS = 2;

  /**
   * Get member count
   */
  get memberCount(): number {
    return this.group?.members?.length ?? 0;
  }

  /**
   * Check if raffle is completed
   */
  get isRaffleCompleted(): boolean {
    return this.group?.raffleStatus === "completed";
  }

  /**
   * Check if group has enough members
   */
  get hasEnoughMembers(): boolean {
    return this.memberCount >= this.MIN_MEMBERS;
  }

  /**
   * Get progress percentage toward minimum members
   */
  get memberProgress(): number {
    if (this.memberCount >= this.MIN_MEMBERS) {
      return 100;
    }
    return Math.round((this.memberCount / this.MIN_MEMBERS) * 100);
  }

  /**
   * Get status label
   */
  get statusLabel(): string {
    return this.isRaffleCompleted ? "Raffle Completed" : "Pending Raffle";
  }

  /**
   * Get status class for styling
   */
  get statusClass(): string {
    return this.isRaffleCompleted ? "completed" : "pending";
  }
}
