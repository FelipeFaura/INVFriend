# TASK-063: Frontend - Assignment Wishes Page

## 📝 Description

Create a new page component that displays the wish list of a Secret Santa assignment recipient. This page is navigated to from the dashboard cards or the secret santa reveal component.

## 📍 Location

- `frontend/src/app/adapters/components/assignment-wishes/assignment-wishes.component.ts`
- `frontend/src/app/adapters/components/assignment-wishes/assignment-wishes.component.html`
- `frontend/src/app/adapters/components/assignment-wishes/assignment-wishes.component.scss`
- `frontend/src/app/app.routes.ts` - Add new route

## 🏗️ Model/Reference

**Route:**

```
/groups/:groupId/assignment/:receiverId/wishes
```

**Route params:**

- `groupId` - Group this assignment belongs to
- `receiverId` - The user whose wishes we're viewing (who we give a gift to)

**Data to fetch:**

1. User profile (name, photo) via `UserHttpService.getPublicProfile(receiverId)`
2. Group info (for budget) via `GroupHttpService.getGroupById(groupId)`
3. Wishes via existing `WishHttpService.getAssignedWishes(groupId)`

## 🎯 Specific Requirements

- [ ] Create standalone component `AssignmentWishesComponent`
- [ ] Add route `/groups/:groupId/assignment/:receiverId/wishes` with AuthGuard
- [ ] Display recipient's photo (64-80px) and name at top
- [ ] Display group budget limit
- [ ] Show list of wishes with: title, description, price, priority, URL link
- [ ] Show empty state if no wishes: "No wishes added yet"
- [ ] Back button → Navigate to `/groups/:groupId`
- [ ] Use design system classes (card, badge, etc.)
- [ ] Handle loading and error states

**UI Layout:**

```
┌─────────────────────────────────────────┐
│ ← Back to Group                         │
│                                         │
│  Gift Ideas for:                        │
│  [Photo 64px]  Juan García              │
│  Budget: $50                            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🎁 Nintendo Switch Game         │    │
│  │    Any game is fine             │    │
│  │    ~$60  ⭐⭐⭐ High            │    │
│  │    [View Link ↗]                │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not allow editing wishes (read-only view)
- ❌ Do not show wishes from other users
- ❌ Do not show if user is not the secret santa for this recipient
- ❌ Do not duplicate wish-list component - create new simpler read-only view

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Uses design system classes
- [ ] Responsive layout
- [ ] Loading and error states
- [ ] Empty state for no wishes
- [ ] Back navigation works
- [ ] Route protected by AuthGuard
- [ ] Accessibility: proper headings, alt text for photo
- [ ] Data-testid attributes for testing

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Design system: `frontend/src/styles/`
- Wish list pattern: `frontend/src/app/adapters/components/wish-list/`
- Similar page: `frontend/src/app/adapters/components/group-detail/`

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
