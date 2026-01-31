/**
 * Wish List Component
 * Displays and manages user's wishes within a group
 */
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { WishHttpService } from "../../services/wish-http.service";
import { Wish } from "../../../domain/models/wish.model";
import { Group } from "../../../domain/models/group.model";
import {
  CreateWishDTO,
  UpdateWishDTO,
} from "../../../application/dto/wish.dto";

@Component({
  selector: "app-wish-list",
  templateUrl: "./wish-list.component.html",
  styleUrls: ["./wish-list.component.scss"],
})
export class WishListComponent implements OnInit, OnDestroy {
  @Input() group: Group | null = null;
  @Output() wishesChanged = new EventEmitter<void>();

  myWishes: Wish[] = [];
  assignedWishes: Wish[] = [];

  isLoading = false;
  isLoadingAssigned = false;
  error: string | null = null;
  assignedError: string | null = null;

  // Modal states
  showAddWishModal = false;
  showEditWishModal = false;
  showDeleteConfirm = false;

  // Form fields
  wishForm: CreateWishDTO = {
    title: "",
    description: "",
    url: "",
    estimatedPrice: undefined,
    priority: undefined,
  };

  editingWish: Wish | null = null;
  deletingWish: Wish | null = null;

  isProcessing = false;
  actionError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private wishHttpService: WishHttpService) {}

  ngOnInit(): void {
    if (this.group) {
      this.loadMyWishes();
      if (this.isRaffleCompleted) {
        this.loadAssignedWishes();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check if raffle is completed
   */
  get isRaffleCompleted(): boolean {
    return this.group?.raffleStatus === "completed";
  }

  /**
   * Load user's wishes
   */
  loadMyWishes(): void {
    if (!this.group) return;

    this.isLoading = true;
    this.error = null;

    this.wishHttpService
      .getMyWishes(this.group.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wishes) => {
          this.myWishes = this.sortWishesByPriority(wishes);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || "Failed to load wishes";
          this.isLoading = false;
        },
      });
  }

  /**
   * Load assigned recipient's wishes
   */
  loadAssignedWishes(): void {
    if (!this.group) return;

    this.isLoadingAssigned = true;
    this.assignedError = null;

    this.wishHttpService
      .getAssignedWishes(this.group.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (wishes) => {
          this.assignedWishes = this.sortWishesByPriority(wishes);
          this.isLoadingAssigned = false;
        },
        error: (err) => {
          this.assignedError = err.message || "Failed to load assigned wishes";
          this.isLoadingAssigned = false;
        },
      });
  }

  /**
   * Sort wishes by priority (1 = highest)
   */
  private sortWishesByPriority(wishes: Wish[]): Wish[] {
    return [...wishes].sort((a, b) => {
      const priorityA = a.priority ?? 999;
      const priorityB = b.priority ?? 999;
      return priorityA - priorityB;
    });
  }

  /**
   * Open add wish modal
   */
  openAddWishModal(): void {
    this.resetWishForm();
    this.actionError = null;
    this.showAddWishModal = true;
  }

  /**
   * Close add wish modal
   */
  closeAddWishModal(): void {
    this.showAddWishModal = false;
    this.resetWishForm();
  }

  /**
   * Open edit wish modal
   */
  openEditWishModal(wish: Wish): void {
    this.editingWish = wish;
    this.wishForm = {
      title: wish.title,
      description: wish.description || "",
      url: wish.url || "",
      estimatedPrice: wish.estimatedPrice,
      priority: wish.priority,
    };
    this.actionError = null;
    this.showEditWishModal = true;
  }

  /**
   * Close edit wish modal
   */
  closeEditWishModal(): void {
    this.showEditWishModal = false;
    this.editingWish = null;
    this.resetWishForm();
  }

  /**
   * Open delete confirmation
   */
  confirmDeleteWish(wish: Wish): void {
    this.deletingWish = wish;
    this.actionError = null;
    this.showDeleteConfirm = true;
  }

  /**
   * Close delete confirmation
   */
  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.deletingWish = null;
  }

  /**
   * Reset wish form
   */
  private resetWishForm(): void {
    this.wishForm = {
      title: "",
      description: "",
      url: "",
      estimatedPrice: undefined,
      priority: undefined,
    };
    this.actionError = null;
  }

  /**
   * Create a new wish
   */
  createWish(): void {
    if (!this.group || !this.wishForm.title?.trim()) {
      this.actionError = "Title is required";
      return;
    }

    this.isProcessing = true;
    this.actionError = null;

    const dto: CreateWishDTO = {
      title: this.wishForm.title.trim(),
      description: this.wishForm.description?.trim() || undefined,
      url: this.wishForm.url?.trim() || undefined,
      estimatedPrice: this.wishForm.estimatedPrice,
      priority: this.wishForm.priority,
    };

    this.wishHttpService
      .createWish(this.group.id, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeAddWishModal();
          this.loadMyWishes();
          this.wishesChanged.emit();
          this.isProcessing = false;
        },
        error: (err) => {
          this.actionError = err.message || "Failed to create wish";
          this.isProcessing = false;
        },
      });
  }

  /**
   * Update an existing wish
   */
  updateWish(): void {
    if (!this.group || !this.editingWish || !this.wishForm.title?.trim()) {
      this.actionError = "Title is required";
      return;
    }

    this.isProcessing = true;
    this.actionError = null;

    const dto: UpdateWishDTO = {
      title: this.wishForm.title.trim(),
      description: this.wishForm.description?.trim() || undefined,
      url: this.wishForm.url?.trim() || undefined,
      estimatedPrice: this.wishForm.estimatedPrice,
      priority: this.wishForm.priority,
    };

    this.wishHttpService
      .updateWish(this.group.id, this.editingWish.id, dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeEditWishModal();
          this.loadMyWishes();
          this.wishesChanged.emit();
          this.isProcessing = false;
        },
        error: (err) => {
          this.actionError = err.message || "Failed to update wish";
          this.isProcessing = false;
        },
      });
  }

  /**
   * Delete a wish
   */
  deleteWish(): void {
    if (!this.group || !this.deletingWish) return;

    this.isProcessing = true;
    this.actionError = null;

    this.wishHttpService
      .deleteWish(this.group.id, this.deletingWish.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.cancelDelete();
          this.loadMyWishes();
          this.wishesChanged.emit();
          this.isProcessing = false;
        },
        error: (err) => {
          this.actionError = err.message || "Failed to delete wish";
          this.isProcessing = false;
        },
      });
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
}
