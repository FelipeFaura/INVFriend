# TASK-052: Fix Production Bundle Size

## Overview

| Field            | Value                 |
| ---------------- | --------------------- |
| **Task ID**      | TASK-052              |
| **Plan**         | Standalone fix        |
| **Agent**        | @angular-implementer  |
| **Status**       | ⏳ Pending            |
| **Dependencies** | None                  |
| **Priority**     | 🔴 High (blocks prod) |

## Problem

Production build fails due to bundle size exceeding configured budget:

```
Warning: bundle initial exceeded maximum budget. Budget 512.00 kB was not met by 587.99 kB
Error: bundle initial exceeded maximum budget. Budget 1.05 MB was not met by 51.41 kB with a total of 1.10 MB
```

**Current size**: 1.10 MB  
**Budget limit**: 1.05 MB  
**Excess**: 51.41 kB

Development build passes (`ng build --configuration=development`), but production build fails.

## Objective

Reduce the initial bundle size to under 1.05 MB OR adjust the budget if the size is justified.

## Scope

### Option A: Optimize Bundle (Preferred)

- [ ] Analyze bundle composition with `source-map-explorer` or `webpack-bundle-analyzer`
- [ ] Identify largest contributors to bundle size
- [ ] Apply optimizations:
  - Lazy load more modules
  - Remove unused imports
  - Use lighter alternatives for heavy dependencies
  - Tree-shake unused code

### Option B: Adjust Budget (If justified)

If the bundle size is reasonable given the app's features:

- [ ] Update `angular.json` → `budgets` configuration
- [ ] Document justification for increased budget

### Out of Scope

- Refactoring application logic
- Changing feature requirements

## Technical Details

### Current Bundle Composition

```
Initial chunk files:
main.js        | 1.03 MB
polyfills.js   | 34.81 kB
styles.css     | 34.76 kB
runtime.js     | 2.75 kB
─────────────────────────
Total          | 1.10 MB

Lazy chunks:
groups-module              | 89.92 kB
profile-module             | 17.09 kB
dashboard-module           | 1.82 kB
```

### Analysis Commands

```bash
# Install analyzer
npm install -D source-map-explorer

# Build with source maps
ng build --source-map

# Analyze main bundle
npx source-map-explorer dist/frontend/main.*.js
```

### Budget Configuration Location

```
frontend/angular.json → projects.frontend.architect.build.configurations.production.budgets
```

### Likely Culprits

Based on typical Angular + Firebase apps:

1. **Firebase SDK** - Often large, consider modular imports
2. **AngularFire** - Ensure only needed modules imported
3. **RxJS** - Check for unused operators
4. **Zone.js** - Required, but ensure no duplicates

### Optimization Strategies

| Strategy                     | Potential Savings | Effort |
| ---------------------------- | ----------------- | ------ |
| Lazy load auth module        | ~50-100 kB        | Medium |
| Modular Firebase imports     | ~100-200 kB       | Medium |
| Remove unused RxJS operators | ~10-30 kB         | Low    |
| Tree-shake unused code       | ~20-50 kB         | Low    |

## Acceptance Criteria

- [ ] `ng build` (production) completes without errors
- [ ] Bundle size is within configured budget
- [ ] All existing functionality works correctly
- [ ] Changes documented if budget was adjusted

## Files Likely to Modify

| File                                     | Changes                                 |
| ---------------------------------------- | --------------------------------------- |
| `frontend/angular.json`                  | Budget adjustment OR build optimization |
| `frontend/src/app/app.module.ts`         | Remove unused imports                   |
| `frontend/src/app/app-routing.module.ts` | Additional lazy loading                 |

## Testing

```bash
# Verify production build passes
ng build

# Verify app still works
ng serve
# Test: login, groups, profile, wishes
```

---

## Execution Log

_To be filled during implementation_
