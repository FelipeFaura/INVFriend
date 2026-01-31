/**
 * Group Detail Component
 * Display group details and manage members
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, switchMap } from "rxjs/operators";

import { GroupHttpService } from "../../services/group-http.service";
import { Group } from "../../../domain/models/group.model";

@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.scss"],
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  group: Group | null = null;
  currentUserId: string | null = null;
  isLoading = false;
  error: string | null = null;

  // Modal states
  showDeleteConfirm = false;
  showAddMemberModal = false;
  showRemoveMemberConfirm = false;
  memberToRemove: string | null = null;
  newMemberId = "";
  actionError: string | null = null;
  isProcessing = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupHttpService: GroupHttpService,
  ) {}

  ngOnInit(): void {
    // Get current user ID from localStorage (set by auth service)
    this.currentUserId = localStorage.getItem("userId");
    this.loadGroup();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load group details
   */
  loadGroup(): void {
    this.isLoading = true;
    this.error = null;

    this.route.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((params) => this.groupHttpService.getGroupById(params["id"])),
      )
      .subscribe({
        next: (group) => {
          this.group = group;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || "Failed to load group";
          this.isLoading = false;
        },
      });
  }

  /**
   * Check if current user is the admin
   */
  get isAdmin(): boolean {
    return this.group?.adminId === this.currentUserId;
  }

  /**
   * Get formatted date
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Get status display text
   */
  getStatusLabel(status: "pending" | "completed"): string {
    return status === "pending" ? "Pending" : "Completed";
  }

  /**
   * Navigate back to group list
   */
  goBack(): void {
    this.router.navigate(["/groups"]);
  }

  /**
   * Navigate to edit page (placeholder)
   */
  editGroup(): void {
    // For now, just show a message - edit component will be in future sprint
    alert("Edit functionality coming soon!");
  }

  // Delete Group
  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteGroup(): void {
    if (!this.group) return;

    this.isProcessing = true;
    this.actionError = null;

    this.groupHttpService
      .deleteGroup(this.group.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(["/groups"]);
        },
        error: (err) => {
          this.actionError = err.message || "Failed to delete group";
          this.isProcessing = false;
          this.showDeleteConfirm = false;
        },
      });
  }

  // Add Member
  openAddMemberModal(): void {
    this.showAddMemberModal = true;
    this.newMemberId = "";
    this.actionError = null;
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
    this.newMemberId = "";
    this.actionError = null;
  }

  addMember(): void {
    if (!this.group || !this.newMemberId.trim()) return;

    this.isProcessing = true;
    this.actionError = null;

    this.groupHttpService
      .addMember(this.group.id, this.newMemberId.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedGroup) => {
          this.group = updatedGroup;
          this.isProcessing = false;
          this.closeAddMemberModal();
        },
        error: (err) => {
          this.actionError = err.message || "Failed to add member";
          this.isProcessing = false;
        },
      });
  }

  // Remove Member
  confirmRemoveMember(memberId: string): void {
    this.memberToRemove = memberId;
    this.showRemoveMemberConfirm = true;
  }

  cancelRemoveMember(): void {
    this.memberToRemove = null;
    this.showRemoveMemberConfirm = false;
  }

  removeMember(): void {
    if (!this.group || !this.memberToRemove) return;

    this.isProcessing = true;
    this.actionError = null;

    this.groupHttpService
      .removeMember(this.group.id, this.memberToRemove)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedGroup) => {
          this.group = updatedGroup;
          this.isProcessing = false;
          this.cancelRemoveMember();
        },
        error: (err) => {
          this.actionError = err.message || "Failed to remove member";
          this.isProcessing = false;
          this.cancelRemoveMember();
        },
      });
  }

  /**
   * Check if member is the admin
   */
  isMemberAdmin(memberId: string): boolean {
    return this.group?.adminId === memberId;
  }

  /**
   * Handle raffle completed event
   */
  onRaffleCompleted(): void {
    // Reload the group to get updated raffle status
    this.loadGroup();
  }
}
