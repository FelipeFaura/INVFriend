import { Component, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";

import { AuthApplicationService } from "../../../application/services/auth-application.service";
import { AuthError } from "../../../domain/errors/auth-errors";

/**
 * Login component for user authentication
 * Supports email/password and Google Sign-In
 */
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnDestroy {
  /** Login form group */
  loginForm: FormGroup;

  /** Loading state during API call */
  isLoading = false;

  /** Error message to display */
  errorMessage: string | null = null;

  /** Subject to manage subscriptions */
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthApplicationService,
    private readonly router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Get email form control for validation
   */
  get email() {
    return this.loginForm.get("email");
  }

  /**
   * Get password form control for validation
   */
  get password() {
    return this.loginForm.get("password");
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService
      .login({ email, password })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe({
        next: () => {
          this.router.navigate(["/"]);
        },
        error: (error: AuthError) => {
          this.errorMessage = error.message;
        },
      });
  }

  /**
   * Handle Google Sign-In button click
   */
  onGoogleSignIn(): void {
    // TODO: Implement Google Sign-In SDK integration
    this.errorMessage = "Google Sign-In is not yet implemented";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
