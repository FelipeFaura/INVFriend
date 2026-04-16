import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Subject, takeUntil, take } from "rxjs";

import { AuthApplicationService } from "../../../application/services/auth-application.service";
import { UpdateProfileDTO } from "../../../application/dto/auth.dto";
import { TranslatePipe } from "../../pipes/translate.pipe";
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";

/**
 * Profile component - user profile editing form
 * Allows users to update their display name and profile photo
 */
@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslatePipe, LanguageSelectorComponent],
  template: `
    <div class="profile-page">
      <header class="profile-page__header">
        <a
          routerLink="/dashboard"
          class="profile-page__back-link"
          aria-label="Go back to dashboard"
        >
          {{ 'profileBack' | translate }}
        </a>
        <h1 class="profile-page__title">{{ 'profileTitle' | translate }}</h1>
      </header>

      <main class="profile-page__content">
        <form
          *ngIf="profileForm"
          [formGroup]="profileForm"
          (ngSubmit)="onSubmit()"
          class="profile-form"
          aria-label="Edit profile form"
        >
          <!-- Success Message -->
          <div
            *ngIf="successMessage"
            class="alert alert--success"
            role="status"
            aria-live="polite"
          >
            <span class="alert__icon" aria-hidden="true">✓</span>
            <span class="alert__content">{{ successMessage }}</span>
          </div>

          <!-- Error Message -->
          <div
            *ngIf="errorMessage"
            class="alert alert--error"
            role="alert"
            aria-live="polite"
          >
            <span class="alert__icon" aria-hidden="true">!</span>
            <span class="alert__content">{{ errorMessage }}</span>
          </div>

          <!-- Photo Upload Section -->
          <div class="photo-upload">
            <div
              class="photo-upload__dropzone"
              [class.photo-upload__dropzone--dragover]="isDragOver"
              [class.photo-upload__dropzone--uploading]="isUploading"
              (click)="fileInput.click()"
              (keydown.enter)="fileInput.click()"
              (keydown.space)="fileInput.click(); $event.preventDefault()"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onFileDrop($event)"
              role="button"
              tabindex="0"
              [attr.aria-label]="
                previewUrl
                  ? 'Change profile photo. Current photo displayed.'
                  : 'Upload profile photo'
              "
              aria-describedby="photo-hint"
            >
              <!-- Photo Preview -->
              <div class="photo-upload__preview">
                <img
                  *ngIf="previewUrl"
                  [src]="previewUrl"
                  alt="Profile photo preview"
                  class="photo-upload__image"
                />
                <div *ngIf="!previewUrl" class="photo-upload__placeholder">
                  <span
                    class="photo-upload__placeholder-icon"
                    aria-hidden="true"
                    >📷</span
                  >
                  <span class="photo-upload__placeholder-initial">{{
                    getInitial()
                  }}</span>
                </div>
              </div>

              <!-- Upload Indicator -->
              <div *ngIf="isUploading" class="photo-upload__loading">
                <div class="spinner spinner--white" aria-hidden="true"></div>
              </div>
            </div>

            <div class="photo-upload__info">
              <button
                type="button"
                class="photo-upload__change-btn"
                (click)="fileInput.click()"
                [disabled]="isSubmitting"
              >
                {{ previewUrl ? ('profileChangePhoto' | translate) : ('profileUploadPhoto' | translate) }}
              </button>
              <p id="photo-hint" class="photo-upload__hint">
                JPG, PNG, WebP - Max 2MB
              </p>
            </div>

            <input
              #fileInput
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="photo-upload__input"
              (change)="onFileSelected($event)"
              aria-hidden="true"
              tabindex="-1"
            />
          </div>

          <!-- Name Input -->
          <div class="form-group">
            <label
              for="name"
              class="form-group__label form-group__label--required"
            >
              Display Name
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="form-input"
              [class.form-input--error]="
                profileForm.get('name')?.invalid &&
                profileForm.get('name')?.touched
              "
              aria-describedby="name-hint name-error"
              [attr.aria-invalid]="
                profileForm.get('name')?.invalid &&
                profileForm.get('name')?.touched
              "
            />
            <p id="name-hint" class="form-help">2-50 characters</p>
            <p
              *ngIf="
                profileForm.get('name')?.hasError('required') &&
                profileForm.get('name')?.touched
              "
              id="name-error"
              class="form-error"
              role="alert"
            >
              Display name is required
            </p>
            <p
              *ngIf="
                profileForm.get('name')?.hasError('minlength') &&
                profileForm.get('name')?.touched
              "
              id="name-error"
              class="form-error"
              role="alert"
            >
              Name must be at least 2 characters
            </p>
            <p
              *ngIf="
                profileForm.get('name')?.hasError('maxlength') &&
                profileForm.get('name')?.touched
              "
              id="name-error"
              class="form-error"
              role="alert"
            >
              Name cannot exceed 50 characters
            </p>
          </div>

          <!-- Email (read-only) -->
          <div class="form-group">
            <label for="email" class="form-group__label">Email</label>
            <input
              id="email"
              type="email"
              [value]="userEmail"
              class="form-input"
              disabled
              aria-describedby="email-hint"
            />
            <p id="email-hint" class="form-help">Cannot be changed</p>
          </div>

          <!-- Language preference -->
          <div class="form-group">
            <label class="form-group__label">{{ 'langSelectorLabel' | translate }}</label>
            <div>
              <app-language-selector></app-language-selector>
            </div>
          </div>

          <!-- Actions -->
          <div class="profile-form__actions">
            <a routerLink="/dashboard" class="btn btn--secondary">Cancel</a>
            <button
              type="submit"
              class="btn btn--primary"
              [disabled]="
                profileForm.invalid ||
                (profileForm.pristine && !selectedFile) ||
                isSubmitting
              "
              [attr.aria-busy]="isSubmitting"
            >
              <span
                *ngIf="isSubmitting"
                class="spinner spinner--sm spinner--white"
                aria-hidden="true"
              ></span>
              {{ isSubmitting ? ('profileSaving' | translate) : ('profileSave' | translate) }}
            </button>
          </div>
        </form>
      </main>
    </div>
  `,
  styles: [
    `
      @use "../../../../styles/tokens" as *;
      @use "../../../../styles/mixins" as *;

      // ===================
      // PAGE LAYOUT
      // ===================

      .profile-page {
        min-height: 100vh;
        padding: $space-8;
        background: $gradient-primary;

        @include mobile-only {
          padding: $space-4;
        }

        &__header {
          max-width: 500px;
          margin: 0 auto $space-6;
          color: $text-inverse;
        }

        &__back-link {
          display: inline-block;
          margin-bottom: $space-4;
          color: rgba($color-neutral-0, 0.8);
          text-decoration: none;
          font-size: $font-size-sm;
          transition: color $transition-fast;

          &:hover {
            color: $text-inverse;
          }

          &:focus-visible {
            outline: 2px solid $color-neutral-0;
            outline-offset: 2px;
          }
        }

        &__title {
          margin: 0;
          font-size: $font-size-2xl;
          font-weight: $font-weight-bold;

          @include mobile-only {
            font-size: $font-size-xl;
          }
        }

        &__content {
          max-width: 500px;
          margin: 0 auto;
        }
      }

      // ===================
      // PROFILE FORM
      // ===================

      .profile-form {
        background-color: $bg-surface;
        border-radius: $radius-lg;
        padding: $space-6;
        box-shadow: $shadow-lg;

        @include mobile-only {
          padding: $space-4;
        }

        &__actions {
          @include flex-between;
          gap: $space-4;
          margin-top: $space-6;
          padding-top: $space-6;
          border-top: $border-width-default solid $border-default;

          @include mobile-only {
            flex-direction: column;

            .btn {
              width: 100%;
            }
          }
        }
      }

      // ===================
      // ALERTS (inline)
      // ===================

      .alert {
        display: flex;
        align-items: flex-start;
        gap: $space-3;
        padding: $space-4;
        border-radius: $radius-md;
        margin-bottom: $space-6;
        font-size: $font-size-sm;

        &__icon {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: $font-weight-bold;
        }

        &__content {
          flex: 1;
        }

        &--success {
          background-color: $color-success-50;
          border: $border-width-default solid $color-success-200;
          color: $color-success-800;

          .alert__icon {
            color: $color-success-500;
          }
        }

        &--error {
          background-color: $color-error-50;
          border: $border-width-default solid $color-error-200;
          color: $color-error-800;

          .alert__icon {
            color: $color-error-500;
          }
        }
      }

      // ===================
      // PHOTO UPLOAD
      // ===================

      .photo-upload {
        @include flex-column;
        align-items: center;
        gap: $space-4;
        margin-bottom: $space-6;
        padding-bottom: $space-6;
        border-bottom: $border-width-default solid $border-default;

        &__dropzone {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: $radius-full;
          cursor: pointer;
          transition: all $transition-fast;
          border: 3px solid $color-primary-500;
          overflow: hidden;

          &:hover {
            border-color: $color-primary-600;
            transform: scale(1.02);
          }

          &:focus-visible {
            outline: 2px solid $border-focus;
            outline-offset: 4px;
            box-shadow: $shadow-focus;
          }

          &--dragover {
            border-color: $color-primary-400;
            border-style: dashed;
            background-color: $color-primary-50;
            transform: scale(1.05);
          }

          &--uploading {
            pointer-events: none;
          }
        }

        &__preview {
          width: 100%;
          height: 100%;
          @include flex-center;
        }

        &__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &__placeholder {
          @include flex-center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: $gradient-primary;
          color: $text-inverse;
        }

        &__placeholder-icon {
          font-size: $font-size-xl;
          margin-bottom: $space-1;
        }

        &__placeholder-initial {
          font-size: $font-size-3xl;
          font-weight: $font-weight-bold;
        }

        &__loading {
          @include absolute-fill;
          @include flex-center;
          background-color: rgba($color-neutral-900, 0.5);
        }

        &__info {
          text-align: center;
        }

        &__change-btn {
          @include button-reset;
          color: $text-link;
          font-size: $font-size-sm;
          font-weight: $font-weight-medium;
          transition: color $transition-fast;

          &:hover:not(:disabled) {
            color: $text-link-hover;
            text-decoration: underline;
          }

          &:focus-visible {
            outline: 2px solid $border-focus;
            outline-offset: 2px;
          }

          &:disabled {
            color: $text-muted;
            cursor: not-allowed;
          }
        }

        &__hint {
          margin: $space-2 0 0;
          font-size: $font-size-xs;
          color: $text-secondary;
        }

        &__input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      }

      // ===================
      // FORM ELEMENTS (using design system)
      // ===================

      .form-group {
        margin-bottom: $space-4;

        &__label {
          display: block;
          margin-bottom: $space-2;
          font-size: $font-size-sm;
          font-weight: $font-weight-medium;
          color: $text-primary;

          &--required::after {
            content: " *";
            color: $color-error-500;
          }
        }
      }

      .form-input {
        width: 100%;
        padding: $space-3 $space-4;
        font-family: $font-family-base;
        font-size: $font-size-base;
        color: $text-primary;
        background-color: $bg-surface;
        border: $border-width-thick solid $border-default;
        border-radius: $radius-md;
        transition:
          border-color $transition-fast,
          box-shadow $transition-fast;

        &::placeholder {
          color: $text-muted;
        }

        &:focus {
          border-color: $border-focus;
          box-shadow: $shadow-focus;
          outline: none;
        }

        &:disabled {
          background-color: $bg-muted;
          color: $text-muted;
          cursor: not-allowed;
        }

        &--error {
          border-color: $color-error-500;

          &:focus {
            border-color: $color-error-500;
            box-shadow: $shadow-focus-error;
          }
        }
      }

      .form-help {
        margin: $space-2 0 0;
        font-size: $font-size-sm;
        color: $text-secondary;
      }

      .form-error {
        display: flex;
        align-items: center;
        gap: $space-1;
        margin: $space-2 0 0;
        font-size: $font-size-sm;
        color: $color-error-600;
      }

      // ===================
      // BUTTONS (using design system)
      // ===================

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: $space-2;
        padding: $space-3 $space-5;
        font-family: $font-family-base;
        font-size: $font-size-base;
        font-weight: $font-weight-medium;
        border: $border-width-default solid transparent;
        border-radius: $radius-md;
        cursor: pointer;
        text-decoration: none;
        transition: all $transition-fast;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        &:focus-visible {
          outline: 2px solid $border-focus;
          outline-offset: 2px;
          box-shadow: $shadow-focus;
        }

        &--primary {
          background: $gradient-primary;
          color: $text-inverse;

          &:hover:not(:disabled) {
            background: $gradient-primary-hover;
            transform: translateY(-1px);
            box-shadow: $shadow-md;
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        }

        &--secondary {
          background-color: $bg-muted;
          color: $text-primary;
          border-color: $border-default;

          &:hover:not(:disabled) {
            background-color: $color-neutral-200;
            border-color: $border-strong;
          }
        }
      }

      // ===================
      // SPINNER (from design system)
      // ===================

      .spinner {
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 3px solid $color-neutral-200;
        border-top-color: $color-primary-500;
        border-radius: $radius-full;
        animation: spinnerRotate 0.8s linear infinite;

        &--sm {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        &--white {
          border-color: rgba($color-neutral-0, 0.3);
          border-top-color: $color-neutral-0;
        }
      }

      @keyframes spinnerRotate {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  // Observable streams
  currentUser$ = this.authService.currentUser$;

  // Form state
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  userEmail = "";

  // UI state
  isSubmitting = false;
  isUploading = false;
  isDragOver = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Cleanup
  private destroy$ = new Subject<void>();
  private successTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly authService: AuthApplicationService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      this.profileForm = this.fb.group({
        name: [
          user?.name || "",
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
      });
      this.previewUrl = user?.photoUrl || null;
      this.userEmail = user?.email || "";
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.successTimeout) {
      clearTimeout(this.successTimeout);
    }
  }

  /**
   * Get user initial for avatar placeholder
   */
  getInitial(): string {
    const name = this.profileForm?.get("name")?.value;
    return name ? name.charAt(0).toUpperCase() : "?";
  }

  /**
   * Handle file selection from input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.handleFile(input.files[0]);
    }
    // Reset input for re-selection of same file
    input.value = "";
  }

  /**
   * Handle drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  /**
   * Handle drag leave event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  /**
   * Handle file drop event
   */
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  /**
   * Validate and handle file selection
   */
  private handleFile(file: File): void {
    // Clear previous messages
    this.errorMessage = null;
    this.successMessage = null;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = "Please upload a JPG, PNG, or WebP image";
      return;
    }

    // Validate size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = "Image must be smaller than 2MB";
      return;
    }

    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.onerror = () => {
      this.errorMessage = "Failed to read file";
      this.selectedFile = null;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    if (this.profileForm.invalid || this.isSubmitting) {
      return;
    }

    // Clear messages
    this.errorMessage = null;
    this.successMessage = null;
    this.isSubmitting = true;

    // Build update data
    const updateData: UpdateProfileDTO = {};

    if (this.profileForm.get("name")?.dirty) {
      updateData.name = this.profileForm.value.name.trim();
    }

    if (this.selectedFile) {
      updateData.photoFile = this.selectedFile;
    }

    // Check if there's anything to update
    if (!updateData.name && !updateData.photoFile) {
      this.isSubmitting = false;
      return;
    }

    this.authService
      .updateProfile(updateData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.selectedFile = null;
          this.profileForm.markAsPristine();
          this.successMessage = "Profile updated successfully!";

          // Auto-clear success message after 5 seconds
          this.successTimeout = setTimeout(() => {
            this.successMessage = null;
          }, 5000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage =
            err.message || "Failed to update profile. Please try again.";
        },
      });
  }
}
