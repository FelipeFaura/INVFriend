# TASK-051: Profile Edit UI

## Overview

| Field            | Value                   |
| ---------------- | ----------------------- |
| **Task ID**      | TASK-051                |
| **Plan**         | PLAN_PROFILE_EDITION.md |
| **Agent**        | @angular-ui-designer    |
| **Status**       | ✅ Complete             |
| **Dependencies** | TASK-049, TASK-050      |

## Objective

Replace the placeholder ProfileComponent with a fully functional profile editing form that allows users to update their name and profile photo.

## Scope

### In Scope

- Reactive form for profile editing
- Name input with validation (2-50 chars)
- Photo upload with preview
- Loading, success, and error states
- Integration with `AuthApplicationService.updateProfile()`
- Use existing design system (tokens, mixins)
- WCAG 2.1 AA accessibility

### Out of Scope

- Storage service (TASK-049)
- Update profile method (TASK-050)
- Password change (future feature)
- Email change (future feature)

## Design Specifications

### Layout (Desktop)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Edit Profile                                        │
│  ─────────────────────────────────────────           │
│                                                      │
│  ┌────────────────┐                                  │
│  │                │                                  │
│  │   [Preview]    │   Profile Photo                  │
│  │                │   Click or drag to upload        │
│  └────────────────┘   JPG, PNG, WebP - Max 2MB       │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Display Name                                    │  │
│  └────────────────────────────────────────────────┘  │
│  2-50 characters                                     │
│                                                      │
│  Email                                               │
│  user@example.com                                    │
│  (Cannot be changed)                                 │
│                                                      │
│  ┌──────────┐  ┌─────────────────┐                   │
│  │  Cancel  │  │  Save Changes   │                   │
│  └──────────┘  └─────────────────┘                   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### States

| State           | Behavior                                      |
| --------------- | --------------------------------------------- |
| Initial         | Form populated with current user data         |
| Pristine        | Save button disabled                          |
| Dirty           | Save button enabled                           |
| Uploading Photo | Show progress indicator on photo area         |
| Saving          | Show spinner on Save button, disable inputs   |
| Success         | Show toast/snackbar, button returns to normal |
| Error           | Show error message below form                 |

### Photo Upload Area

```
┌─────────────────────────────────┐
│                                 │
│   [Current photo or avatar]     │  ← Circular, 120x120px
│                                 │
│   📷 Change Photo               │  ← Link/button
│                                 │
└─────────────────────────────────┘

Drag & drop zone covers the entire area
On hover: subtle border highlight
On drag over: stronger visual feedback
```

### Validation Messages

| Field | Validation    | Message                                   |
| ----- | ------------- | ----------------------------------------- |
| Name  | required      | "Display name is required"                |
| Name  | minlength(2)  | "Name must be at least 2 characters"      |
| Name  | maxlength(50) | "Name cannot exceed 50 characters"        |
| Photo | type          | "Please upload a JPG, PNG, or WebP image" |
| Photo | size          | "Image must be smaller than 2MB"          |

## Technical Requirements

### Component Location

```
frontend/src/app/adapters/components/profile/profile.component.ts
```

### Form Structure

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

profileForm: FormGroup;
selectedFile: File | null = null;
previewUrl: string | null = null;
isSubmitting = false;
errorMessage: string | null = null;

ngOnInit() {
  this.currentUser$.pipe(take(1)).subscribe(user => {
    this.profileForm = this.fb.group({
      name: [user?.name || '', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]]
    });
    this.previewUrl = user?.photoUrl || null;
  });
}
```

### File Input Handling

```typescript
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    this.handleFile(input.files[0]);
  }
}

onFileDrop(event: DragEvent): void {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file) {
    this.handleFile(file);
  }
}

private handleFile(file: File): void {
  // Validate type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    this.errorMessage = 'Please upload a JPG, PNG, or WebP image';
    return;
  }

  // Validate size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    this.errorMessage = 'Image must be smaller than 2MB';
    return;
  }

  this.selectedFile = file;
  this.errorMessage = null;

  // Create preview
  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrl = reader.result as string;
  };
  reader.readAsDataURL(file);
}
```

### Form Submission

```typescript
onSubmit(): void {
  if (this.profileForm.invalid || this.isSubmitting) return;

  this.isSubmitting = true;
  this.errorMessage = null;

  const updateData: UpdateProfileDTO = {};

  if (this.profileForm.get('name')?.dirty) {
    updateData.name = this.profileForm.value.name;
  }

  if (this.selectedFile) {
    updateData.photoFile = this.selectedFile;
  }

  this.authService.updateProfile(updateData).subscribe({
    next: () => {
      this.isSubmitting = false;
      this.selectedFile = null;
      this.profileForm.markAsPristine();
      // Show success feedback
    },
    error: (err) => {
      this.isSubmitting = false;
      this.errorMessage = err.message || 'Failed to update profile';
    }
  });
}
```

### Accessibility Requirements

| Element         | Requirement                               |
| --------------- | ----------------------------------------- |
| Form            | `aria-label="Edit profile form"`          |
| Name input      | `aria-describedby="name-hint name-error"` |
| Photo upload    | `aria-label="Upload profile photo"`       |
| Photo drop zone | `role="button"`, keyboard accessible      |
| Error messages  | `role="alert"`, `aria-live="polite"`      |
| Submit button   | Loading state announced                   |

### Styles

Use existing design system:

```scss
@use "../../../styles/tokens" as *;
@use "../../../styles/mixins" as *;

.profile-form {
  @include card-base;
  max-width: 500px;
  margin: 0 auto;
}

.photo-upload {
  @include flex-center;
  flex-direction: column;
  gap: $spacing-md;
}

.photo-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid $color-primary;
}

.form-actions {
  @include flex-between;
  margin-top: $spacing-lg;
}
```

## Acceptance Criteria

- [x] Form displays current user name and photo
- [x] Name input validates (required, 2-50 chars)
- [x] Photo can be selected via click or drag-and-drop
- [x] Photo preview shows before upload
- [x] Invalid files show appropriate error message
- [x] Save button disabled when form pristine or invalid
- [x] Loading state shown during submission
- [x] Success feedback shown after save
- [x] Error messages displayed on failure
- [x] Form is keyboard accessible
- [x] Screen reader compatible (ARIA labels)
- [x] Uses design system tokens/mixins
- [x] Build compiles without errors

## Files to Modify

| File                                                                | Changes                            |
| ------------------------------------------------------------------- | ---------------------------------- |
| `frontend/src/app/adapters/components/profile/profile.component.ts` | Replace placeholder with full form |

## Testing Notes

```typescript
describe("ProfileComponent", () => {
  it("should populate form with current user data", () => {
    expect(component.profileForm.value.name).toBe("Test User");
  });

  it("should enable save button when form is dirty and valid", () => {
    component.profileForm.get("name")?.setValue("New Name");
    component.profileForm.markAsDirty();
    fixture.detectChanges();
    expect(saveButton.disabled).toBeFalse();
  });

  it("should show error for invalid file type", () => {
    const pdfFile = new File([""], "doc.pdf", { type: "application/pdf" });
    component["handleFile"](pdfFile);
    expect(component.errorMessage).toContain("JPG, PNG, or WebP");
  });

  it("should show preview after valid file selected", () => {
    const jpgFile = new File([""], "photo.jpg", { type: "image/jpeg" });
    component["handleFile"](jpgFile);
    expect(component.selectedFile).toBe(jpgFile);
  });
});
```

---

## Execution Log

### Results

**Status:** ⏳ → ✅
**Files Modified:**

- `frontend/src/app/adapters/components/profile/profile.component.ts` - Complete rewrite from placeholder to full form

**Build:** ✅ Pass (compiles without TypeScript errors; budget warning unrelated)
**Visual Review:** Responsive layout implemented with mobile-first breakpoints (320px, 768px)
**Accessibility:**

- Full keyboard navigation (Tab, Enter, Space)
- ARIA labels on all interactive elements
- `role="alert"` and `role="status"` for messages
- `aria-describedby` for form hints and errors
- `aria-invalid` for validation states
- `aria-busy` on submit button during loading

**Design System Integration:**

- Uses `_tokens.scss` (colors, spacing, typography, shadows, transitions)
- Uses `_mixins.scss` (flex-center, flex-column, flex-between, mobile-only, focus-visible, button-reset, absolute-fill)
- BEM naming convention throughout

**Implementation Highlights:**

1. Reactive form with FormBuilder
2. Name validation (required, 2-50 chars)
3. Photo upload via click or drag-and-drop
4. File validation (type: JPG/PNG/WebP, size: 2MB max)
5. Client-side preview before upload
6. Loading spinner during submission
7. Success message with auto-dismiss (5s)
8. Error handling with clear user feedback
9. Cancel button returns to dashboard

---

## Session Metrics

| Metric                 | Value                                        |
| ---------------------- | -------------------------------------------- |
| **Model**              | Claude Opus 4.5                              |
| **Tokens In/Out**      | N/A                                          |
| **Context Window %**   | ~15%                                         |
| **Duration**           | ~8 minutes                                   |
| **Tool Calls**         | ~20                                          |
| **Errors/Retries**     | 0                                            |
| **User Interventions** | No                                           |
| **Files Modified**     | 1                                            |
| **Lines Changed**      | +650 / -100                                  |
| **Difficulty (1-5)**   | 3 (medium - full component with many states) |

**Metrics Notes:** Token counts not accessible from this session.
