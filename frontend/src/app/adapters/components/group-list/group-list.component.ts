/**
 * Group List Component
 * Displays all groups where the user is a member or admin
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";

import { GroupHttpService } from "../../services/group-http.service";
import { GroupSummary } from "../../../domain/models/group.model";

@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"],
})
export class GroupListComponent implements OnInit, OnDestroy {
  groups: GroupSummary[] = [];
  filteredGroups: GroupSummary[] = [];
  searchTerm = "";
  isLoading = false;
  error: string | null = null;
  isProcessing: { [groupId: string]: boolean } = {};
  invitationError: string | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(
    private groupHttpService: GroupHttpService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadGroups();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load groups from the API
   */
  loadGroups(): void {
    this.isLoading = true;
    this.error = null;

    this.groupHttpService
      .getGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          this.applyFilter();
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || "Failed to load groups";
          this.isLoading = false;
        },
      });
  }

  /**
   * Handle search input changes
   */
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject$.next(term);
  }

  /**
   * Navigate to create group page
   */
  navigateToCreate(): void {
    this.router.navigate(["/groups/create"]);
  }

  /**
   * Navigate to group detail page
   */
  navigateToGroup(groupId: string): void {
    const group = this.groups.find((g) => g.id === groupId);
    if (group?.isPending) return;
    this.router.navigate(["/groups", groupId]);
  }

  /**
   * Accept a pending group invitation
   */
  acceptInvitation(groupId: string, event: Event): void {
    event.stopPropagation();
    this.isProcessing[groupId] = true;
    this.invitationError = null;

    this.groupHttpService
      .acceptInvitation(groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isProcessing[groupId] = false;
          this.loadGroups();
        },
        error: (err: Error) => {
          this.invitationError = err.message || "Failed to accept invitation";
          this.isProcessing[groupId] = false;
        },
      });
  }

  /**
   * Reject a pending group invitation
   */
  rejectInvitation(groupId: string, event: Event): void {
    event.stopPropagation();
    this.isProcessing[groupId] = true;
    this.invitationError = null;

    this.groupHttpService
      .rejectInvitation(groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isProcessing[groupId] = false;
          this.loadGroups();
        },
        error: (err: Error) => {
          this.invitationError = err.message || "Failed to reject invitation";
          this.isProcessing[groupId] = false;
        },
      });
  }

  /**
   * Get pending invitation groups from the filtered list
   */
  get pendingGroups(): GroupSummary[] {
    return this.filteredGroups.filter((g) => g.isPending);
  }

  /**
   * Get accepted (non-pending) groups from the filtered list
   */
  get acceptedGroups(): GroupSummary[] {
    return this.filteredGroups.filter((g) => !g.isPending);
  }

  /**
   * Get status label for display
   */
  getStatusLabel(status: "pending" | "completed"): string {
    return status === "pending" ? "Pending" : "Completed";
  }

  /**
   * Get status CSS class
   */
  getStatusClass(status: "pending" | "completed"): string {
    return status === "pending" ? "status-pending" : "status-completed";
  }

  /**
   * Setup debounced search
   */
  private setupSearch(): void {
    this.searchSubject$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilter();
      });
  }

  /**
   * Apply search filter to groups
   */
  private applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredGroups = [...this.groups];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredGroups = this.groups.filter((group) =>
      group.name.toLowerCase().includes(term),
    );
  }
}
