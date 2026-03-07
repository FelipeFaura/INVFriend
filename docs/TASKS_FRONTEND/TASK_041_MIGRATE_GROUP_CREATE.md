# TASK-041: Migrate Group Create Component to Design System

**Agent:** @angular-ui-designer
**Status:** ✅ Complete
**Dependencies:** TASK-036
**Estimate:** 2 hours

## Objective

Migrar el formulario de creación de grupo para usar los estilos de formulario del design system.

## Files

- **Modify:** `frontend/src/app/adapters/components/group-create/group-create.component.html`
- **Modify:** `frontend/src/app/adapters/components/group-create/group-create.component.scss`

## Requirements

### 1. Form Structure

```html
<div class="page-container">
  <div class="card">
    <div class="card__header">
      <h1>Create New Group</h1>
    </div>
    <div class="card__body">
      <form [formGroup]="groupForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-group__label" for="name">Group Name *</label>
          <input
            class="form-input"
            [class.form-input--error]="hasError('name')"
            id="name"
            formControlName="name"
            placeholder="e.g., Family Christmas 2024"
          />
          <span class="form-error" *ngIf="hasError('name')">
            {{ getError('name') }}
          </span>
        </div>

        <div class="form-group">
          <label class="form-group__label" for="description">Description</label>
          <textarea
            class="form-textarea"
            id="description"
            formControlName="description"
            rows="3"
            placeholder="Optional description..."
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn--secondary" routerLink="/groups">
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn--primary"
            [disabled]="groupForm.invalid || isSubmitting"
          >
            <span class="spinner" *ngIf="isSubmitting"></span>
            Create Group
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
```

### 2. Validation States

- Error message display with `.form-error`
- Input border color changes on error

### 3. Submit Button

- Loading state with spinner
- Disabled while invalid or submitting

## Scope / Limits

### ✅ What to Do

- Apply form group, input, button classes
- Show validation errors with design system styling
- Loading state on submit

### ❌ What NOT to Do

- Do NOT change form logic
- Do NOT modify validation rules

## Acceptance Criteria

- [x] Form uses `.form-group`, `.form-input`, `.form-textarea` classes
- [x] Validation errors display with `.form-error`
- [x] Buttons use design system classes
- [x] Loading spinner on submit
- [x] Component SCSS reduced
- [x] No build errors (in scope files)

## References

- [TASK-026 Analysis - Section 3.2 Forms](./TASK_026_UI_ANALYSIS_PROPOSAL.md)

---

## 📊 Results

**Status:** ✅ Complete

**Files Modified:**

- `frontend/src/app/adapters/components/group-create/group-create.component.html`
- `frontend/src/app/adapters/components/group-create/group-create.component.scss`

**Build:** ✅ Component files compile without errors  
**Visual Review:** Responsive at mobile/tablet/desktop breakpoints  
**Accessibility:** ARIA labels, live regions, proper semantic HTML added

**Changes Made:**

1. **HTML Template:**
   - Used `.card`, `.card__header`, `.card__body` for structure
   - Applied `.form-group`, `.form-group__label`, `.form-group__label--required`
   - Applied `.form-input`, `.form-input--error` for text inputs
   - Applied `.form-textarea`, `.form-textarea--sm` for description field
   - Applied `.form-error` for validation messages
   - Applied `.form-actions`, `.form-actions--end` for button container
   - Applied `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--ghost` for buttons
   - Added `.btn--loading` and `.btn__spinner` for submit loading state
   - Added `.alert`, `.alert--error` for error banner
   - Added ARIA attributes (`aria-describedby`, `aria-live`, `aria-label`, `role="alert"`)

2. **SCSS Styles:**
   - Reduced from 178 lines to 65 lines (~64% reduction)
   - Removed all redundant form, button, input, and error styles
   - Kept only component-specific layout: page container, card header layout, back button adjustment, optional label styling, character count, alert spacing
   - Uses design system tokens via `@use` for consistency

## 🚧 External Issues Detected

- **File**: `frontend/src/app/adapters/components/group-detail/group-detail.component.html`
- **Issue**: Pre-existing TypeScript errors - `Property 'status' does not exist on type 'Group'` (8 errors)
- **Not in scope**: This file is not part of TASK-041
- **Action needed**: @project-lead should review/reassign

---

## 📊 Session Metrics

| Metric                 | Value           |
| ---------------------- | --------------- |
| **Model**              | Claude Opus 4.5 |
| **Tokens In/Out**      | N/A             |
| **Context Window %**   | ~10%            |
| **Duration**           | ~8 minutes      |
| **Tool Calls**         | ~18             |
| **Errors/Retries**     | 0               |
| **User Interventions** | No              |
| **Files Modified**     | 2               |
| **Lines Changed**      | +120 / -180     |
| **Difficulty (1-5)**   | 2               |

**Metrics Notes:** Token counts not accessible from this session.
