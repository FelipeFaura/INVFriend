# Fix: Dashboard Auth Race Condition

## Summary

Fix race condition where Dashboard makes API calls before Firebase restores auth session, causing 401 errors and loss of user state (username disappears from sidebar).

## Status Dashboard

| Total | ✅ Done | 🔄 Active | ⏳ Pending | 🚫 Blocked |
| ----- | ------- | --------- | ---------- | ---------- |
| 2     | 0       | 0         | 2          | 0          |

## Tasks

| ID  | Description                                          | Agent                | Dependencies | Status |
| --- | ---------------------------------------------------- | -------------------- | ------------ | ------ |
| 066 | Fix interceptor: don't logout on auth not-ready race | @angular-implementer | -            | ⏳     |
| 067 | Fix dashboard: wait for auth before API calls        | @angular-implementer | -            | ⏳     |

## Execution Order

### Wave 1 (Parallel - No Dependencies)

- **TASK-066**: Fix interceptor — prevent aggressive logout on race condition
- **TASK-067**: Fix dashboard — wait for auth state before calling loadAssignments()

## Root Cause Analysis

1. App loads → `AuthApplicationService` subscribes to `afAuth.authState` (async)
2. Firebase starts restoring persisted session (takes milliseconds)
3. `DashboardComponent.ngOnInit()` calls `loadAssignments()` **immediately**
4. Interceptor reads `accessToken` → still `null` → request goes without auth header
5. Backend returns 401 (`MISSING_TOKEN`)
6. Interceptor tries `refreshTokenIfNeeded()` → `afAuth.currentUser` may be `null` → fails
7. Interceptor calls `logout()` → clears auth state → username disappears

## Architecture Notes

- Layer affected: Application (auth service timing), Adapters (interceptor, dashboard component)
- Key files:
  - `frontend/src/app/adapters/http/auth.interceptor.ts`
  - `frontend/src/app/adapters/components/dashboard/dashboard.component.ts`
  - `frontend/src/app/application/services/auth-application.service.ts`
