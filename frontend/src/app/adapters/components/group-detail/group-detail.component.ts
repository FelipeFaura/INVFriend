/**
 * Group Detail Component
 * Display group details and manage members
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil, switchMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/compat/firestore";

import { GroupHttpService } from "../../services/group-http.service";
import { Group } from "../../../domain/models/group.model";
import { AuthApplicationService } from "../../../application/services/auth-application.service";
import { UpdateGroupDTO } from "../../../application/dto/group.dto";

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
  isPendingMember = false;

  // Member names map (userId -> displayName)
  memberNames: Map<string, string> = new Map();

  // Modal states
  showDeleteConfirm = false;
  showAddMemberModal = false;
  showRemoveMemberConfirm = false;
  showEditModal = false;
  memberToRemove: string | null = null;
  newMemberEmail = "";
  editForm: { name: string; description: string; budgetLimit: number } = { name: '', description: '', budgetLimit: 0 };
  actionError: string | null = null;
  isProcessing = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupHttpService: GroupHttpService,
    private authService: AuthApplicationService,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit(): void {
    // Get current user ID from auth service
    this.currentUserId = this.authService.currentUser?.id || null;
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
          this.isPendingMember = group.members.length === 0 && !this.isAdmin;
          this.isLoading = false;
          // Load member names after group is loaded
          this.loadMemberNames(group);
        },
        error: (err) => {
          this.error = err.message || "Failed to load group";
          this.isLoading = false;
        },
      });
  }

  /**
   * Load display names for all members
   * Uses memberDetails from API response first, falls back to Firestore
   */
  private loadMemberNames(group: Group): void {
    if (group.memberDetails && group.memberDetails.length > 0) {
      group.memberDetails.forEach((member) => {
        this.memberNames.set(
          member.id,
          member.name || member.email || this.truncateId(member.id),
        );
      });
      return;
    }

    this.loadMemberNamesFromFirestore(group.members);
  }

  /**
   * Load display names for all members from Firestore (legacy fallback)
   */
  private loadMemberNamesFromFirestore(memberIds: string[]): void {
    memberIds.forEach((memberId) => {
      this.firestore
        .collection("users")
        .doc(memberId)
        .get()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (doc) => {
            if (doc.exists) {
              const data = doc.data() as { name?: string; email?: string };
              this.memberNames.set(
                memberId,
                data?.name || data?.email || this.truncateId(memberId),
              );
            } else {
              this.memberNames.set(memberId, this.truncateId(memberId));
            }
          },
          error: () => {
            this.memberNames.set(memberId, this.truncateId(memberId));
          },
        });
    });
  }

  /**
   * Get display name for a member
   */
  getMemberDisplayName(memberId: string): string {
    return this.memberNames.get(memberId) || this.truncateId(memberId);
  }

  /**
   * Truncate long IDs for display
   */
  private truncateId(id: string): string {
    if (id.length <= 12) return id;
    return `${id.substring(0, 6)}...${id.substring(id.length - 4)}`;
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
   * Open edit modal with current group data
   */
  editGroup(): void {
    if (!this.group) return;
    this.editForm = {
      name: this.group.name,
      description: this.group.description || '',
      budgetLimit: this.group.budgetLimit,
    };
    this.showEditModal = true;
    this.actionError = null;
  }

  /**
   * Close edit modal
   */
  closeEditModal(): void {
    this.showEditModal = false;
    this.actionError = null;
  }

  /**
   * Save group changes
   */
  saveGroupChanges(): void {
    if (!this.group) return;

    if (!this.editForm.name || this.editForm.name.trim().length < 3) {
      this.actionError = 'Group name must be at least 3 characters';
      return;
    }

    if (!this.editForm.budgetLimit || this.editForm.budgetLimit <= 0) {
      this.actionError = 'Budget limit must be greater than 0';
      return;
    }

    const dto: UpdateGroupDTO = {};
    const trimmedName = this.editForm.name.trim();
    const trimmedDescription = this.editForm.description.trim();

    if (trimmedName !== this.group.name) {
      dto.name = trimmedName;
    }
    if (trimmedDescription !== (this.group.description || '')) {
      dto.description = trimmedDescription;
    }
    if (this.editForm.budgetLimit !== this.group.budgetLimit) {
      dto.budgetLimit = this.editForm.budgetLimit;
    }

    if (Object.keys(dto).length === 0) {
      this.closeEditModal();
      return;
    }

    this.isProcessing = true;
    this.actionError = null;

    this.groupHttpService
      .updateGroup(this.group.id, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedGroup) => {
          this.group = updatedGroup;
          this.isProcessing = false;
          this.closeEditModal();
        },
        error: (err) => {
          this.actionError = err.message || 'Failed to update group';
          this.isProcessing = false;
        },
      });
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
    this.newMemberEmail = "";
    this.actionError = null;
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
    this.newMemberEmail = "";
    this.actionError = null;
  }

  addMember(): void {
    if (!this.group || !this.newMemberEmail.trim()) return;

    if (!this.newMemberEmail.trim().includes("@")) {
      this.actionError = "Please enter a valid email address";
      return;
    }

    this.isProcessing = true;
    this.actionError = null;

    this.groupHttpService
      .addMemberByEmail(this.group.id, this.newMemberEmail.trim())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedGroup) => {
          this.group = updatedGroup;
          this.loadMemberNames(updatedGroup);
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
   * Accept group invitation (pending member flow)
   */
  acceptGroupInvitation(): void {
    if (!this.group) return;
    this.isProcessing = true;
    this.actionError = null;

    this.groupHttpService
      .acceptInvitation(this.group.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isPendingMember = false;
          this.isProcessing = false;
          this.loadGroup();
        },
        error: (err: Error) => {
          this.actionError = err.message || "Failed to accept invitation";
          this.isProcessing = false;
        },
      });
  }

  /**
   * Reject group invitation and navigate back to groups list
   */
  rejectGroupInvitation(): void {
    if (!this.group) return;
    this.isProcessing = true;
    this.actionError = null;

    this.groupHttpService
      .rejectInvitation(this.group.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(["/groups"]);
        },
        error: (err: Error) => {
          this.actionError = err.message || "Failed to reject invitation";
          this.isProcessing = false;
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
