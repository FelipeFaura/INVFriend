# TASK-065: Frontend - Dashboard with Assignment Cards

## 📝 Description

Transform the dashboard from a placeholder to show cards for all the user's Secret Santa assignments across all groups. Each card shows the recipient's photo, name, group name, and budget. Clicking a card navigates to the assignment wishes page.

## 📍 Location

- `frontend/src/app/adapters/components/dashboard/dashboard.component.ts` - Rewrite
- `frontend/src/app/adapters/components/dashboard/dashboard.component.html` - New template
- `frontend/src/app/adapters/components/dashboard/dashboard.component.scss` - New styles

## 🏗️ Model/Reference

**Services to inject:**

- `AuthApplicationService` - Get current user for greeting
- `AssignmentHttpService` (new) - Get all assignments
- `UserHttpService` - Get recipient profiles
- `Router` - Navigation

**Data to fetch:**

1. All assignments via `GET /assignments/mine`
2. For each assignment, recipient profile via `UserHttpService.getPublicProfile(receiverId)`

**Card data model:**

```typescript
interface AssignmentCard {
  assignmentId: string;
  groupId: string;
  groupName: string;
  budgetLimit: number;
  receiverId: string;
  recipientName: string;
  recipientPhotoUrl: string | null;
}
```

## 🎯 Specific Requirements

- [ ] Create or update `AssignmentHttpService` with `getMyAssignments()` method
- [ ] Fetch all assignments on component init
- [ ] For each assignment, fetch recipient profile (can be parallel)
- [ ] Display cards in a responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- [ ] Each card shows:
  - Recipient photo (48px) or initial avatar
  - Recipient name
  - Group name
  - Budget
- [ ] Clicking card navigates to `/groups/:groupId/assignment/:receiverId/wishes`
- [ ] Empty state: "No Secret Santa assignments yet" with suggestion to join/create groups
- [ ] Loading state while fetching
- [ ] Error state if fetch fails
- [ ] Keep "Welcome" header with user name

**Card Layout:**

```
┌─────────────────────────────────┐
│  [Photo 48px]                   │
│  Juan García                    │
│  Grupo: Familia                 │
│  Budget: $50                    │
│                    [→]          │
└─────────────────────────────────┘
```

**Grid Layout:**

```
Mobile (< 640px):    1 column
Tablet (640-1024px): 2 columns
Desktop (> 1024px):  3 columns
```

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not show assignments where user is the RECEIVER
- ❌ Do not implement pagination yet (assume reasonable number of assignments)
- ❌ Do not add wish count to cards (requires additional API call)
- ❌ Do not change the route - dashboard stays at `/dashboard`

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Uses design system classes (card, badge, etc.)
- [ ] Responsive grid layout
- [ ] Loading, error, and empty states
- [ ] Cards are clickable (entire card, not just button)
- [ ] Accessibility: cards are keyboard navigable
- [ ] Photo fallback to initial avatar
- [ ] Data-testid attributes for testing

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Design system: `frontend/src/styles/`
- Card styles: `frontend/src/styles/components/_cards.scss`
- Similar card grid: `frontend/src/app/adapters/components/group-list/`

---

## 📊 Results

_(Filled by sub-agent upon completion)_

**Status:** ⏳ Pending

**Files Created/Modified:**

-

**Build:** ⏳
**Tests:** ⏳

**Notes:**

---

## 📈 Session Metrics

_(Filled by sub-agent upon completion)_
