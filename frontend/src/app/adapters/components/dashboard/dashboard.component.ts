import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { Subject, forkJoin, of } from "rxjs";
import { catchError, filter, take, takeUntil } from "rxjs/operators";

import { AuthApplicationService } from "../../../application/services/auth-application.service";
import { AssignmentHttpService } from "../../services/assignment-http.service";
import { UserHttpService } from "../../services/user-http.service";
import { MyAssignmentSummary } from "../../../domain/models/assignment.model";
import { UserPublicProfile } from "../../../domain/models/user.model";

interface AssignmentWithProfile {
  assignment: MyAssignmentSummary;
  profile: UserPublicProfile | null;
}

/**
 * Dashboard component - main landing page for authenticated users.
 * Shows all Secret Santa assignment cards across groups.
 */
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser$ = this.authService.currentUser$;
  loading = true;
  assignments: MyAssignmentSummary[] = [];
  assignmentsWithProfiles: AssignmentWithProfile[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthApplicationService,
    private readonly assignmentService: AssignmentHttpService,
    private readonly userService: UserHttpService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter((user) => user !== null),
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.loadAssignments());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Navigate to the receiver's wish list */
  navigateToWishes(assignment: MyAssignmentSummary): void {
    this.router.navigate([
      "/groups",
      assignment.groupId,
      "assignment",
      assignment.receiverId,
      "wishes",
    ]);
  }

  /** Get the first letter of a name for the avatar fallback */
  getInitial(name?: string): string {
    return name ? name.charAt(0).toUpperCase() : "?";
  }

  private loadAssignments(): void {
    this.assignmentService
      .getAllMyAssignments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assignments) => {
          this.assignments = assignments;

          if (assignments.length === 0) {
            this.loading = false;
            this.cdr.markForCheck();
            return;
          }

          const profileRequests = assignments.map((a) =>
            this.userService.getUserPublicProfile(a.receiverId).pipe(
              catchError(() => of(null)),
            ),
          );

          forkJoin(profileRequests)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (profiles) => {
                this.assignmentsWithProfiles = assignments.map((assignment, i) => ({
                  assignment,
                  profile: profiles[i],
                }));
                this.loading = false;
                this.cdr.markForCheck();
              },
              error: () => {
                this.loading = false;
                this.cdr.markForCheck();
              },
            });
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
