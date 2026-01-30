import { Component, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";

import { AuthApplicationService } from "../../../application/services/auth-application.service";
import { AuthError } from "../../../domain/errors/auth-errors";

/**
 * Custom validator for password confirmation
 */
function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get("password");
  const confirmPassword = control.get("confirmPassword");

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  return null;
}

/**
 * Register component for new user registration
 * Supports email/password and Google Sign-In
 */
@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnDestroy {
  /** Register form group */
  registerForm: FormGroup;

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
    this.registerForm = this.fb.group(
      {
        name: ["", [Validators.required, Validators.minLength(2)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  /**
   * Get name form control for validation
   */
  get name() {
    return this.registerForm.get("name");
  }

  /**
   * Get email form control for validation
   */
  get email() {
    return this.registerForm.get("email");
  }

  /**
   * Get password form control for validation
   */
  get password() {
    return this.registerForm.get("password");
  }

  /**
   * Get confirmPassword form control for validation
   */
  get confirmPassword() {
    return this.registerForm.get("confirmPassword");
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { name, email, password } = this.registerForm.value;

    this.authService
      .register({ name, email, password })
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
