/**
 * Assignment Wishes Component
 * Displays the wish list of the user assigned to receive a gift from the current user.
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { WishHttpService } from "../../services/wish-http.service";
import { UserHttpService } from "../../services/user-http.service";
import { GroupHttpService } from "../../services/group-http.service";
import { Wish } from "../../../domain/models/wish.model";
import { UserPublicProfile } from "../../../domain/models/user.model";
import { Group } from "../../../domain/models/group.model";

export type AssignmentWishesState = "loading" | "loaded" | "error";

@Component({
  selector: "app-assignment-wishes",
  templateUrl: "./assignment-wishes.component.html",
  styleUrls: ["./assignment-wishes.component.scss"],
})
export class AssignmentWishesComponent implements OnInit, OnDestroy {
  state: AssignmentWishesState = "loading";
  groupId = "";
  userId = "";

  wishes: Wish[] = [];
  receiverProfile: UserPublicProfile | null = null;
  group: Group | null = null;
  errorMessage = "";

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private wishHttpService: WishHttpService,
    private userHttpService: UserHttpService,
    private groupHttpService: GroupHttpService
  ) {}

  ngOnInit(): void {
    this.groupId = this.route.snapshot.paramMap.get("id") || "";
    this.userId = this.route.snapshot.paramMap.get("userId") || "";

    if (!this.groupId || !this.userId) {
      this.state = "error";
      this.errorMessage = "Invalid route parameters.";
      return;
    }

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all required data in parallel
   */
  loadData(): void {
    this.state = "loading";
    this.errorMessage = "";

    forkJoin({
      wishes: this.wishHttpService.getAssignedWishes(this.groupId),
      profile: this.userHttpService.getUserPublicProfile(this.userId),
      group: this.groupHttpService.getGroupById(this.groupId),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ wishes, profile, group }) => {
          this.wishes = wishes;
          this.receiverProfile = profile;
          this.group = group;
          this.state = "loaded";
        },
        error: (err) => {
          this.errorMessage =
            err.message || "Failed to load assignment wishes.";
          this.state = "error";
        },
      });
  }

  /**
   * Get first letter of receiver name for avatar fallback
   */
  getReceiverInitial(): string {
    return this.receiverProfile?.name?.charAt(0)?.toUpperCase() || "?";
  }

  /**
   * Get priority label for display
   */
  getPriorityLabel(priority?: number): string {
    if (!priority) return "";
    const labels: Record<number, string> = {
      1: "★★★★★",
      2: "★★★★☆",
      3: "★★★☆☆",
      4: "★★☆☆☆",
      5: "★☆☆☆☆",
    };
    return labels[priority] || "";
  }

  /**
   * Format price for display
   */
  formatPrice(price?: number): string {
    if (price === undefined || price === null) return "";
    return `$${price.toFixed(2)}`;
  }

  /**
   * Check if URL is valid for link display
   */
  isValidUrl(url?: string): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Retry loading data after an error
   */
  retry(): void {
    this.loadData();
  }
}
