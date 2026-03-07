import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { AuthApplicationService } from "../../../application/services/auth-application.service";
import { User } from "../../../domain/models/user.model";

/**
 * Layout Component
 * Provides consistent navigation and layout across the application
 * Features a responsive sidebar that collapses to hamburger menu on mobile
 */
@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy {
  /** Observable of current user */
  currentUser$: Observable<User | null>;

  /** Sidebar open state */
  sidebarOpen = false;

  /** Track if on mobile */
  private isMobile = false;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly authService: AuthApplicationService,
    private readonly router: Router,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener("window:resize")
  onResize(): void {
    this.checkScreenSize();
  }

  /**
   * Toggle sidebar open/closed
   */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  /**
   * Close sidebar
   */
  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  /**
   * Close sidebar on mobile when navigating
   */
  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  /**
   * Handle logout
   */
  onLogout(): void {
    this.authService
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(["/login"]);
        },
        error: () => {
          // Even on error, navigate to login (auth state is already cleared)
          this.router.navigate(["/login"]);
        },
      });
  }

  /**
   * Check screen size and update mobile state
   */
  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    // Auto-close sidebar when switching to desktop
    if (!this.isMobile) {
      this.sidebarOpen = false;
    }
  }
}
