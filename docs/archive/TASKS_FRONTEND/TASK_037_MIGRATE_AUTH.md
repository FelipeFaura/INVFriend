# TASK-037: Migrate Login/Register Components to Design System

**Agent:** @angular-ui-designer
**Status:** ✅ Complete
**Dependencies:** TASK-036
**Estimate:** 4 hours

## Objective

Migrar los componentes de autenticación (login, register) para usar las clases del design system eliminando estilos duplicados.

## Files

- **Modify:** `frontend/src/app/adapters/components/login/login.component.html`
- **Modify:** `frontend/src/app/adapters/components/login/login.component.scss`
- **Modify:** `frontend/src/app/adapters/components/register/register.component.html`
- **Modify:** `frontend/src/app/adapters/components/register/register.component.scss`

## Requirements

### 1. Update HTML Templates

Replace inline/custom classes with design system classes:

```html
<!-- Before -->
<div class="login-container">
  <input class="custom-input" type="email" />
  <button class="login-btn">Login</button>
</div>

<!-- After -->
<div class="card">
  <div class="card__body">
    <div class="form-group">
      <label class="form-group__label">Email</label>
      <input class="form-input" type="email" />
    </div>
    <button class="btn btn--primary btn--block">Login</button>
  </div>
</div>
```

### 2. Clean Component SCSS

Remove styles that are now provided by design system:

- Button styles → use `.btn` classes
- Input styles → use `.form-input` classes
- Card/container styles → use `.card` classes

Keep only component-specific layout styles if needed.

### 3. Follow Login Mockup

Reference the Login screen mockup from TASK-026:

- Centered card layout
- Gradient background page
- Logo/brand at top
- Clear form hierarchy

## Scope / Limits

### ✅ What to Do

- Update HTML to use design system classes
- Remove redundant SCSS
- Ensure visual consistency with mockup

### ❌ What NOT to Do

- Do NOT change component logic/TypeScript
- Do NOT modify form validation behavior

## Acceptance Criteria

- [x] Login component uses design system classes
- [x] Register component uses design system classes
- [x] Component SCSS files significantly reduced (no duplicated button/form styles)
- [x] Visual matches TASK-026 mockup
- [x] No build errors (in auth components)
- [ ] Login/register flow still works (requires manual testing)

## References

- [TASK-026 Analysis - Section 4.1 Login Screen](./TASK_026_UI_ANALYSIS_PROPOSAL.md)

---

## 📊 Results

**Status:** ✅ Complete

**Files Modified:**

- `frontend/src/app/adapters/components/login/login.component.html`
- `frontend/src/app/adapters/components/login/login.component.scss`
- `frontend/src/app/adapters/components/register/register.component.html`
- `frontend/src/app/adapters/components/register/register.component.scss`

**Changes Made:**

### HTML Templates

- Replaced custom classes with design system classes:
  - `.login-container` / `.register-container` → `.auth-page`
  - `.login-card` / `.register-card` → `.card`, `.card__body`
  - `.form-label` → `.form-group__label`
  - `.invalid` → `.form-input--error`
  - `.field-error` → `.form-error`
  - `.error-message` → `.alert.alert--error`
  - `.btn.btn-primary` → `.btn.btn--primary.btn--block`
  - `.btn.btn-google` → `.btn.btn--secondary.btn--block`
  - `.spinner` → `.btn__spinner`
  - `.divider` → `.auth-page__divider`
  - `.register-link` / `.login-link` → `.auth-page__link`
- Added ARIA attributes for accessibility (`aria-invalid`, `aria-describedby`, `aria-hidden`)

### SCSS Files

- **Before:** ~193 lines each (login/register)
- **After:** ~86 lines each
- **Reduction:** ~55% code reduction
- Removed duplicated styles: button, form input, form group, form label, error message, spinner
- Kept only auth-page specific layout styles: gradient background, card positioning, title styling, divider, link styling

### Build Status

- ✅ Auth components compile without errors
- ⚠️ Pre-existing errors in `group-detail.component.html` (not in scope)

## External Issues Detected

- **File:** `frontend/src/app/adapters/components/group-detail/group-detail.component.html`
- **Issue:** Property 'status' does not exist on type 'Group' (8 errors)
- **Not in scope:** This file is not part of this task
- **Action needed:** @project-lead should review/reassign

---

## 📈 Session Metrics

| Metric                 | Value                                             |
| ---------------------- | ------------------------------------------------- |
| **Model**              | Claude Opus 4.5                                   |
| **Tokens In/Out**      | N/A                                               |
| **Context Window %**   | ~15%                                              |
| **Duration**           | ~10 minutes                                       |
| **Tool Calls**         | ~20                                               |
| **Errors/Retries**     | 0                                                 |
| **User Interventions** | 0                                                 |
| **Files Modified**     | 4                                                 |
| **Lines Changed**      | ~400 removed, ~170 added (net ~230 lines reduced) |
| **Difficulty (1-5)**   | 2                                                 |

**Metrics Notes:** Token counts not accessible from this session.
