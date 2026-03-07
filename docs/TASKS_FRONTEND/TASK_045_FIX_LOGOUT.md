# TASK-045: Fix Logout Navigation

## Overview

| Field            | Value                     |
| ---------------- | ------------------------- |
| **Task ID**      | TASK-045                  |
| **Plan**         | PLAN_NAVIGATION_LAYOUT.md |
| **Agent**        | @angular-implementer      |
| **Status**       | ✅ Complete               |
| **Dependencies** | None                      |

## Objective

Fix the logout functionality that currently does nothing when clicked. The `logout()` method returns an Observable that is never subscribed to.

## Problem Analysis

In `dashboard.component.ts`:

```typescript
onLogout(): void {
  this.authService.logout();  // ⚠️ Observable NOT subscribed!
}
```

The `AuthApplicationService.logout()` returns `Observable<void>`, but Observables are lazy - they don't execute until subscribed.

## Scope

### In Scope

- Subscribe to the logout Observable
- Navigate to `/login` after successful logout
- Handle potential errors gracefully

### Out of Scope

- UI changes (just fix the functionality)
- The logout button will be moved to sidebar in TASK-046/048

## Technical Requirements

### File to Modify

- `frontend/src/app/adapters/components/dashboard/dashboard.component.ts`

### Implementation

1. Import `Router` from `@angular/router`
2. Inject `Router` in constructor
3. Update `onLogout()` method:

```typescript
onLogout(): void {
  this.authService.logout().subscribe({
    next: () => {
      this.router.navigate(['/login']);
    },
    error: () => {
      // Even on error, navigate to login (state is already cleared)
      this.router.navigate(['/login']);
    }
  });
}
```

## Acceptance Criteria

- [x] Clicking logout signs out the user
- [x] After logout, user is redirected to `/login`
- [x] No console errors during logout
- [x] Build passes without errors

## Validation

```bash
cd frontend
ng build --configuration=development
```

Then manually test: Login → Click Logout → Should redirect to /login

## Results

**Status:** ⏳ → ✅
**Files Modified:**

- `frontend/src/app/adapters/components/dashboard/dashboard.component.ts`

**Changes Made:**

1. Added `Router` import from `@angular/router`
2. Injected `Router` in constructor
3. Updated `onLogout()` to subscribe to logout Observable
4. Added navigation to `/login` on success and error

**Build:** ✅ Pass
**Tests:** N/A (no tests in scope)

## Session Metrics

| Metric                 | Value           |
| ---------------------- | --------------- |
| **Model**              | Claude Opus 4.5 |
| **Tokens In/Out**      | N/A             |
| **Context Window %**   | ~5%             |
| **Duration**           | ~2 minutes      |
| **Tool Calls**         | 6               |
| **Errors/Retries**     | 0               |
| **User Interventions** | No              |
| **Files Modified**     | 1               |
| **Lines Changed**      | +15/-3          |
| **Difficulty (1-5)**   | 1               |
