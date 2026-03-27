# TASK-064: Frontend - Update Secret Santa Reveal Component

## 📝 Description

Update the Secret Santa Reveal component to display the recipient's photo and name instead of their user ID. Add a button/link to navigate to the assignment wishes page.

## 📍 Location

- `frontend/src/app/adapters/components/secret-santa-reveal/secret-santa-reveal.component.ts`
- `frontend/src/app/adapters/components/secret-santa-reveal/secret-santa-reveal.component.html`
- `frontend/src/app/adapters/components/secret-santa-reveal/secret-santa-reveal.component.scss`

## 🏗️ Model/Reference

**Current display (to replace):**

```html
<p class="reveal-name">{{ getMemberDisplay(assignment.receiverId) }}</p>
```

Shows: `7OJqu4CXvpg5IGiTBNHDOh` (user ID)

**Target display:**

```html
<div class="reveal-recipient">
  <img
    *ngIf="recipientProfile?.photoUrl"
    [src]="recipientProfile.photoUrl"
    class="reveal-avatar"
  />
  <div
    *ngIf="!recipientProfile?.photoUrl"
    class="reveal-avatar reveal-avatar--initial"
  >
    {{ getInitial(recipientProfile?.name) }}
  </div>
  <p class="reveal-name">{{ recipientProfile?.name || 'Loading...' }}</p>
</div>
<button class="btn btn--secondary" (click)="viewWishList()">
  Ver lista de deseos
</button>
```

## 🎯 Specific Requirements

- [ ] Inject `UserHttpService` to fetch recipient profile
- [ ] Inject `Router` for navigation
- [ ] Add property `recipientProfile: UserPublicProfile | null`
- [ ] When assignment loads, fetch recipient profile via `UserHttpService.getPublicProfile(assignment.receiverId)`
- [ ] Display photo (64px circle) or initial avatar if no photo
- [ ] Display recipient name instead of ID
- [ ] Add "Ver lista de deseos" button that navigates to `/groups/:groupId/assignment/:receiverId/wishes`
- [ ] Handle loading state while fetching profile
- [ ] Handle error state if profile fetch fails (show name as "Unknown" or fallback)

**Avatar initial logic:**

```typescript
getInitial(name: string | undefined): string {
  return name ? name.charAt(0).toUpperCase() : '?';
}
```

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not change the component's @Input interface
- ❌ Do not remove existing functionality
- ❌ Do not fetch profile if state is not 'revealed'

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Uses design system classes
- [ ] Photo displayed as circle (border-radius: 50%)
- [ ] Initial avatar fallback works
- [ ] Navigation to wishes page works
- [ ] Graceful degradation if profile fetch fails
- [ ] Accessibility: alt text for image

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Current component: `frontend/src/app/adapters/components/secret-santa-reveal/`
- User service: TASK-062
- Wishes page route: `/groups/:groupId/assignment/:receiverId/wishes`

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
