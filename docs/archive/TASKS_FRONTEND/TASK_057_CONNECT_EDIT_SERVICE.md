# TASK-057: Frontend - Connect Edit Modal to Service

## 📝 Description

Connect the Edit Group modal (created in TASK-056) to the existing `updateGroup()` method in `GroupHttpService`. Handle loading states, success, and error scenarios.

## 📍 Location

- `frontend/src/app/adapters/components/group-detail/group-detail.component.ts` - Update `saveGroupChanges()`

## 🏗️ Model/Reference

**Existing service method (already implemented):**

```typescript
// frontend/src/app/adapters/services/group-http.service.ts
updateGroup(id: string, dto: UpdateGroupDTO): Observable<Group>
```

**Backend endpoint (already implemented):**

```
PUT /groups/:id
Body: { name?, description?, budgetLimit? }
```

## 🎯 Specific Requirements

- [ ] Implement `saveGroupChanges()` method:
  - Call `groupHttpService.updateGroup(groupId, editForm)`
  - Show loading state on Save button ("Saving...")
  - On success: Close modal, update local `group` object with response
  - On error: Show error message in modal (use existing `actionError` pattern)
- [ ] Only send changed fields (compare with original values)
- [ ] Prevent double-submit (disable button while processing)
- [ ] Show success feedback (group data updates in UI)

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not modify the service layer - `updateGroup()` already exists
- ❌ Do not modify the modal template - that's TASK-056
- ❌ Do not add toast notifications - use inline error display

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Loading state shows on button while saving
- [ ] Error handling with user-friendly messages
- [ ] Group data in UI updates after successful save
- [ ] Modal closes only after successful save
- [ ] Uses `takeUntil(destroy$)` pattern for subscription management

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Existing pattern: `deleteGroup()` method in same component
- Service: `frontend/src/app/adapters/services/group-http.service.ts`

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
