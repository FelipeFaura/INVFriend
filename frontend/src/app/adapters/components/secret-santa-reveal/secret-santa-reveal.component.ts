/**
 * Secret Santa Reveal Component
 * Displays the user's Secret Santa assignment
 */
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { RaffleHttpService } from "../../services/raffle-http.service";
import { UserHttpService } from "../../services/user-http.service";
import { Assignment } from "../../../domain/models/assignment.model";
import { Group } from "../../../domain/models/group.model";
import { UserPublicProfile } from "../../../domain/models/user.model";
import {
  RaffleNotCompletedError,
  AssignmentNotFoundError,
} from "../../../domain/errors/raffle-errors";

export type RevealState =
  | "hidden"
  | "loading"
  | "revealed"
  | "no-assignment"
  | "error";

@Component({
  selector: "app-secret-santa-reveal",
  templateUrl: "./secret-santa-reveal.component.html",
  styleUrls: ["./secret-santa-reveal.component.scss"],
})
export class SecretSantaRevealComponent
  implements OnInit, OnChanges, OnDestroy
{
  /** Group to get assignment for */
  @Input() group: Group | null = null;

  /** Current component state */
  state: RevealState = "hidden";

  /** Assignment data */
  assignment: Assignment | null = null;

  /** Error message if any */
  errorMessage: string | null = null;

  /** Receiver's public profile */
  receiverProfile: UserPublicProfile | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private raffleHttpService: RaffleHttpService,
    private userHttpService: UserHttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAndLoadAssignment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["group"] && !changes["group"].firstChange) {
      this.checkAndLoadAssignment();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check if raffle is completed and load assignment
   */
  checkAndLoadAssignment(): void {
    if (!this.group) {
      this.state = "hidden";
      return;
    }

    if (this.group.raffleStatus !== "completed") {
      this.state = "hidden";
      return;
    }

    this.loadAssignment();
  }

  /**
   * Load the user's assignment from the API
   */
  loadAssignment(): void {
    if (!this.group) return;

    this.state = "loading";
    this.errorMessage = null;

    this.raffleHttpService
      .getMyAssignment(this.group.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assignment) => {
          this.assignment = assignment;
          this.state = "revealed";
          this.loadReceiverProfile(assignment.receiverId);
        },
        error: (err) => {
          if (
            err instanceof RaffleNotCompletedError ||
            err instanceof AssignmentNotFoundError
          ) {
            this.state = "no-assignment";
          } else {
            this.errorMessage = err.message || "Failed to load assignment";
            this.state = "error";
          }
        },
      });
  }

  /**
   * Retry loading assignment
   */
  retry(): void {
    this.loadAssignment();
  }

  /**
   * Load the receiver's public profile
   */
  loadReceiverProfile(userId: string): void {
    this.userHttpService
      .getUserPublicProfile(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (profile) => {
          this.receiverProfile = profile;
        },
        error: () => {
          // Profile load failure is non-critical; keep showing assignment
          this.receiverProfile = null;
        },
      });
  }

  /**
   * Navigate to the assignment's wishes page
   */
  navigateToWishes(): void {
    if (!this.group || !this.assignment) return;
    this.router.navigate([
      "/groups",
      this.group.id,
      "assignment",
      this.assignment.receiverId,
      "wishes",
    ]);
  }

  /**
   * Get first letter of receiver name for avatar fallback
   */
  getReceiverInitial(): string {
    return this.receiverProfile?.name?.charAt(0)?.toUpperCase() || "?";
  }

  /**
   * Get member name by ID (fallback when profile not loaded)
   */
  getMemberDisplay(memberId: string): string {
    return memberId;
  }
}
