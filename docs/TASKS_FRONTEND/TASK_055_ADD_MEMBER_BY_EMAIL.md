# TASK-055: Frontend - Update Add Member Modal to Use Email

## 📝 Description

Update the "Add Member" modal in group-detail component to accept an email address instead of a User ID. Connect to the new `/invite` endpoint.

## 📍 Location

- `frontend/src/app/adapters/components/group-detail/group-detail.component.html` - Update modal UI
- `frontend/src/app/adapters/components/group-detail/group-detail.component.ts` - Update logic
- `frontend/src/app/adapters/services/group-http.service.ts` - Add `inviteMemberByEmail` method
- `frontend/src/app/application/dto/group.dto.ts` - Add DTO if needed

## 🏗️ Model/Reference

**Current modal (to modify):**

```html
<label for="memberId" class="form-group__label">User ID</label>
<input
  type="text"
  id="memberId"
  [(ngModel)]="newMemberId"
  placeholder="Enter user ID"
/>
<span class="form-hint">Enter the user's unique identifier</span>
```

**Target (after change):**

```html
<label for="memberEmail" class="form-group__label">Email</label>
<input
  type="email"
  id="memberEmail"
  [(ngModel)]="newMemberEmail"
  placeholder="Enter email address"
/>
<span class="form-hint">Enter the user's registered email</span>
```

## 🎯 Specific Requirements

- [ ] Change input field from "User ID" to "Email"
- [ ] Update placeholder text: "Enter email address"
- [ ] Update hint text: "Enter the user's registered email"
- [ ] Add email format validation (pattern validator or HTML5 type="email")
- [ ] Update variable name: `newMemberId` → `newMemberEmail`
- [ ] Add `inviteMemberByEmail(groupId, email)` method to `GroupHttpService`
- [ ] Update `addMember()` method in component to use new service method
- [ ] Handle error "No user registered with this email" with user-friendly message

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not remove existing `addMember(groupId, userId)` method in service - keep for backward compatibility
- ❌ Do not change the modal's visual design - only the input field content
- ❌ Do not add autocomplete or user search - simple email input only

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Uses design system classes (form-group, form-input, form-hint)
- [ ] Email validation shows clear error for invalid format
- [ ] Error for "user not found" is user-friendly
- [ ] Accessibility: proper label-input association

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Design system: `frontend/src/styles/components/_forms.scss`
- Current component: `frontend/src/app/adapters/components/group-detail/`

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
