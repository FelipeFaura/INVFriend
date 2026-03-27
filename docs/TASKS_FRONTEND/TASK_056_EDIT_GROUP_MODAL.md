# TASK-056: Frontend - Create Edit Group Modal

## 📝 Description

Create an "Edit Group" modal in the group-detail component that allows the admin to modify group settings: name, description, and budget limit.

## 📍 Location

- `frontend/src/app/adapters/components/group-detail/group-detail.component.html` - Add modal template
- `frontend/src/app/adapters/components/group-detail/group-detail.component.ts` - Add modal logic
- `frontend/src/app/adapters/components/group-detail/group-detail.component.scss` - Add styles if needed

## 🏗️ Model/Reference

**Group fields to edit:**

```typescript
interface UpdateGroupDTO {
  name?: string;
  description?: string;
  budgetLimit?: number;
}
```

**Reference modals in same component:**

- Delete Confirmation Modal
- Add Member Modal
- Remove Member Modal

**Use design system classes from:**

- `frontend/src/styles/components/_modal.scss`
- `frontend/src/styles/components/_forms.scss`

## 🎯 Specific Requirements

- [ ] Create Edit Group modal with same structure as existing modals
- [ ] Form fields:
  - Name (required, 2-50 characters) - text input
  - Description (optional) - textarea
  - Budget Limit (required, min 1) - number input with $ prefix
- [ ] Pre-populate fields with current group values when modal opens
- [ ] Add component properties:
  - `showEditModal: boolean`
  - `editForm: { name: string, description: string, budgetLimit: number }`
- [ ] Add methods:
  - `openEditModal()` - Replace current `alert("coming soon")` placeholder
  - `closeEditModal()`
  - `saveGroupChanges()` - Placeholder, just closes modal (TASK-057 connects it)
- [ ] Validation feedback for required fields
- [ ] Cancel and Save buttons (Save disabled when invalid)

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not connect to backend service yet - that's TASK-057
- ❌ Do not add date/raffle deadline field (not in current UpdateGroupDTO)
- ❌ Do not change overall modal styling - use existing design system
- ❌ Do not modify other modals

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Uses design system classes (modal, modal--sm, form-group, etc.)
- [ ] Form validation works (required fields, min length, min value)
- [ ] Modal opens when clicking edit button (pencil icon)
- [ ] Modal closes when clicking Cancel or X
- [ ] Accessibility: proper ARIA attributes, focus management
- [ ] Data-testid attributes for testing

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Existing modals in same component
- Design system: `frontend/src/styles/components/_modal.scss`
- Design system: `frontend/src/styles/components/_forms.scss`

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
