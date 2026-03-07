# TASK-042: Migrate Wishes Components to Design System

**Agent:** @angular-ui-designer
**Status:** ✅ Complete
**Dependencies:** TASK-036
**Estimate:** 3 hours

## Objective

Migrar los componentes de lista de deseos (wish list, wish form) para usar el design system.

## Files

- **Modify:** `frontend/src/app/adapters/components/wish-list/wish-list.component.html`
- **Modify:** `frontend/src/app/adapters/components/wish-list/wish-list.component.scss`

> **Nota:** No existe componente `wish-form` separado. El formulario está integrado en `wish-list`.

## Requirements

### 1. Wish List Layout

```html
<section class="card">
  <div class="card__header">
    <h2>My Wishlist</h2>
    <button class="btn btn--sm btn--primary" (click)="addWish()">
      + Add Wish
    </button>
  </div>
  <div class="card__body">
    <ul class="wish-list">
      <li class="wish-item" *ngFor="let wish of wishes">
        <div class="wish-item__content">
          <span class="wish-item__name">{{ wish.name }}</span>
          <span class="wish-item__url" *ngIf="wish.url">
            <a [href]="wish.url" target="_blank">View</a>
          </span>
        </div>
        <div class="wish-item__actions">
          <button class="btn btn--icon btn--ghost" (click)="edit(wish)">
            ✏️
          </button>
          <button class="btn btn--icon btn--icon-danger" (click)="delete(wish)">
            🗑️
          </button>
        </div>
      </li>
    </ul>

    <!-- Empty state -->
    <div class="empty-state" *ngIf="wishes.length === 0">
      <p>No wishes added yet</p>
    </div>
  </div>
</section>
```

### 2. Wish Form (Modal or Inline)

Use `.modal` classes if it's a dialog, or `.form-group` classes if inline.

### 3. Wish Item Styling

Keep wish item as a local style but use design tokens:

- Spacing from tokens
- Colors from tokens
- Hover states

## Scope / Limits

### ✅ What to Do

- Apply card, button, form classes
- Style wish items using design tokens
- Add empty state

### ❌ What NOT to Do

- Do NOT change wish CRUD logic
- Do NOT modify API calls

## Acceptance Criteria

- [x] Wish list uses card structure
- [x] Buttons use design system classes
- [x] Wish items styled with design tokens
- [x] Form (if present) uses form classes
- [x] Empty state styled
- [x] No build errors

## References

- [TASK-026 Analysis - Component Styles](./TASK_026_UI_ANALYSIS_PROPOSAL.md)

---

## 📊 Results

**Status:** ✅ Complete

**Files Modified:**

- `frontend/src/app/adapters/components/wish-list/wish-list.component.html`
- `frontend/src/app/adapters/components/wish-list/wish-list.component.scss`

**Build:** ✅ Pass (2 minor warnings about optional chaining - pre-existing)

**Changes Summary:**

### HTML Template

- Migrated sections to use `.card`, `.card__header`, `.card__body` structure
- Updated buttons to design system classes: `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--danger`, `.btn--icon`, `.btn--ghost`, `.btn--icon-danger`
- Converted modals to `.modal-backdrop`, `.modal`, `.modal__header`, `.modal__title`, `.modal__close`, `.modal__body`, `.modal__footer`
- Updated forms to `.form-group`, `.form-group__label`, `.form-input`, `.form-textarea`, `.form-select`
- Migrated empty states to `.empty-state`, `.empty-state__title`, `.empty-state__description`
- Migrated loading spinner to `.spinner`, `.spinner--lg`
- Added alerts with `.alert`, `.alert--error` for error states
- Added `.badge` components for priority and price
- Added ARIA attributes for accessibility (role, aria-labelledby, aria-modal, aria-label)
- Changed wish list from `<div>` to semantic `<ul>/<li>` elements

### SCSS Styles

- Imported design tokens with `@use '../../../../styles/tokens' as *`
- Removed all duplicate button, modal, and form styles (now in global design system)
- Kept component-specific wish-item styles using design tokens
- Simplified to ~220 lines (from ~480 lines) - 54% reduction
- Uses design system spacing, colors, typography, shadows, and transitions
- Maintained responsive breakpoints using design system `$breakpoint-sm`

**Visual Review:** Responsive layout structure verified  
**Accessibility:** ARIA attributes added to modals, keyboard-friendly button structure

---

## 📈 Session Metrics

| Metric             | Value                         |
| ------------------ | ----------------------------- |
| Model              | Claude Opus 4.5               |
| Tokens In/Out      | N/A                           |
| Context Window %   | ~15%                          |
| Duration           | ~12 minutes                   |
| Tool Calls         | ~20                           |
| Errors/Retries     | 0                             |
| User Interventions | No                            |
| Files Modified     | 2                             |
| Lines Changed      | +394 / -476 (net -82 lines)   |
| Difficulty (1-5)   | 2 (straightforward migration) |

**Metrics Notes:** Token counts not accessible from this session.
