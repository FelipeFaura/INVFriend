# TASK-047: Update Routes to Use Layout

## Overview

| Field            | Value                     |
| ---------------- | ------------------------- |
| **Task ID**      | TASK-047                  |
| **Plan**         | PLAN_NAVIGATION_LAYOUT.md |
| **Agent**        | @angular-implementer      |
| **Status**       | ✅ Complete               |
| **Dependencies** | TASK-046                  |

## Objective

Update the Angular routing configuration to wrap all authenticated routes inside the Layout component, providing consistent navigation across the app.

## Scope

### In Scope

- Import LayoutModule/LayoutComponent in routing
- Restructure routes so authenticated paths are children of Layout
- Keep login/register routes outside Layout

### Out of Scope

- Creating the Layout component (TASK-046)
- Modifying individual page components

## Technical Requirements

### File to Modify

- `frontend/src/app/app-routing.module.ts`

### Current Structure

```typescript
const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [GuestGuard] },
  { path: "register", component: RegisterComponent, canActivate: [GuestGuard] },
  { path: "dashboard", canActivate: [AuthGuard], loadChildren: ... },
  { path: "groups", canActivate: [AuthGuard], loadChildren: ... },
  { path: "profile", canActivate: [AuthGuard], loadChildren: ... },
  { path: "**", redirectTo: "/dashboard" }
];
```

### New Structure

```typescript
const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  // Auth routes (no layout)
  { path: "login", component: LoginComponent, canActivate: [GuestGuard] },
  { path: "register", component: RegisterComponent, canActivate: [GuestGuard] },
  // Authenticated routes (with layout)
  {
    path: "",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./adapters/components/dashboard/dashboard.module").then(
            (m) => m.DashboardModule,
          ),
      },
      {
        path: "groups",
        loadChildren: () =>
          import("./groups.module").then((m) => m.GroupsModule),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./adapters/components/profile/profile.module").then(
            (m) => m.ProfileModule,
          ),
      },
    ],
  },
  { path: "**", redirectTo: "/dashboard" },
];
```

### Key Changes

1. Import `LayoutComponent` (or `LayoutModule`)
2. Group authenticated routes as children of a Layout route
3. Move `AuthGuard` to the Layout parent route (children inherit it)
4. Remove individual `canActivate: [AuthGuard]` from child routes

## Acceptance Criteria

- [ ] Login/Register pages render WITHOUT sidebar
- [ ] Dashboard/Groups/Profile render WITH sidebar
- [ ] Navigation between authenticated pages works
- [ ] Auth guard still protects all authenticated routes
- [ ] Lazy loading still works for feature modules
- [ ] Build passes without errors

## Validation

```bash
cd frontend
ng build --configuration=development
```

Manual test:

1. Go to /login → No sidebar visible
2. Login → Dashboard loads WITH sidebar
3. Click Groups → Groups page WITH sidebar
4. Click Profile → Profile page WITH sidebar
5. Logout → Back to /login WITHOUT sidebar

## Results

**Status:** ⏳ → ✅
**Files Modified:**

- frontend/src/app/app-routing.module.ts - Restructured routes with LayoutComponent wrapper
- frontend/src/app/app.module.ts - Added LayoutModule import

**Build:** ✅ Pass
**Tests:** N/A
**Notes:** Routes now wrap all authenticated paths (dashboard, groups, profile) inside LayoutComponent. Login/register remain outside the layout for clean auth flow.

## Session Metrics

| Metric             | Value           |
| ------------------ | --------------- |
| Model              | Claude Opus 4.5 |
| Tokens In/Out      | N/A             |
| Context Window %   | ~5%             |
| Duration           | ~3 minutes      |
| Tool Calls         | 12              |
| Errors/Retries     | 0               |
| User Interventions | No              |
| Files Modified     | 2               |
| Lines Changed      | +35 / -25       |
| Difficulty (1-5)   | 2               |

**Metrics Notes:** Token counts not accessible from this session. Duration estimated from timestamps.
