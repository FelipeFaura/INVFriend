# TASK-067: Fix Dashboard — Wait for Auth Before API Calls

## 📝 Description

The `DashboardComponent.ngOnInit()` calls `loadAssignments()` immediately, which fires an HTTP request to `/api/assignments/mine`. At this point, Firebase auth may not have restored the session yet, so the access token is null and the request fails with 401.

**Fix**: Wait for the auth state to be ready (user is not null) before calling `loadAssignments()`.

## 📍 Location

- File: `frontend/src/app/adapters/components/dashboard/dashboard.component.ts`

## 🏗️ Current Code (Reference)

```typescript
// Current ngOnInit - fires immediately
ngOnInit(): void {
  this.loadAssignments();
}

// Auth service exposes:
currentUser$: Observable<User | null>  // emits null initially, then user when Firebase restores session
```

## 🎯 Specific Requirements

- [ ] In `ngOnInit`, subscribe to `currentUser$` and wait for a non-null user before calling `loadAssignments()`
- [ ] Use `filter(user => user !== null)` + `take(1)` to get the first authenticated emission
- [ ] Pipe through `takeUntil(this.destroy$)` for cleanup
- [ ] Keep existing `loading` state behavior (loading=true until assignments load)
- [ ] If user navigates away before auth resolves, component cleanup must work (no memory leaks)
- [ ] The `ChangeDetectionStrategy.OnPush` is in use — ensure change detection is triggered after assignments load (use `ChangeDetectorRef.markForCheck()` or keep existing pattern)

## 🚫 Scope / Limits

- ❌ Do NOT modify `auth-application.service.ts`
- ❌ Do NOT modify the template (`dashboard.component.html`)
- ❌ Do NOT modify any other files
- ❌ Do NOT add new dependencies

## ✅ Acceptance / Checklist

- [ ] Dashboard waits for authenticated user before calling API
- [ ] No 401 errors on page load when Firebase is still initializing
- [ ] `loading` spinner shows until assignments are loaded
- [ ] No memory leaks (subscriptions cleaned up on destroy)
- [ ] Build passes (`ng build --configuration=development`)

## Results

_To be filled by the implementing agent_
