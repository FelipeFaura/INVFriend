# TASK-053: Backend - AddMemberByEmailUseCase

## 📝 Description

Create a new use case that allows adding a member to a group by their email address instead of user ID. The use case should lookup the user by email using Firebase Admin SDK and then delegate to the existing `addMember` entity method.

## 📍 Location

- `backend/src/application/use-cases/AddMemberByEmailUseCase.ts` - New use case
- `backend/src/application/dto/GroupDTOs.ts` - Add `AddMemberByEmailDTO`
- `backend/src/application/use-cases/index.ts` - Export new use case
- `backend/src/domain/errors/GroupErrors.ts` - Add `UserNotFoundByEmailError`

## 🏗️ Model/Reference

**Existing patterns to follow:**

- `backend/src/application/use-cases/AddMemberToGroupUseCase.ts` - Similar structure
- `backend/src/adapters/auth/FirebaseAuthAdapter.ts` - Uses `auth.getUserByEmail()`

**DTO structure:**

```typescript
export interface AddMemberByEmailDTO {
  groupId: string;
  email: string;
  requesterId: string; // Admin making the request
}
```

## 🎯 Specific Requirements

- [ ] Create `AddMemberByEmailDTO` in GroupDTOs.ts
- [ ] Create `UserNotFoundByEmailError` error class
- [ ] Create `AddMemberByEmailUseCase` that:
  - Receives email and groupId
  - Looks up user by email using Firebase Admin Auth
  - Returns clear error if email not found: "No user registered with this email"
  - Delegates to existing `group.addMember(userId)` logic
  - Validates admin permissions (same as AddMemberToGroupUseCase)
- [ ] Export use case from index.ts
- [ ] Include unit tests

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not modify existing `AddMemberToGroupUseCase` - keep it for backward compatibility
- ❌ Do not modify the Group entity - use existing `addMember(userId)` method
- ❌ Do not create invitation/pending member system - just lookup and add directly
- ❌ Do not send emails - just add the member

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Includes unit tests (at least 5 tests)
- [ ] No debug logs
- [ ] Documented with JSDoc
- [ ] Error messages are user-friendly
- [ ] Uses dependency injection for auth adapter

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Hexagonal architecture
- Similar: `backend/src/application/use-cases/AddMemberToGroupUseCase.ts`
- Auth adapter: `backend/src/adapters/auth/FirebaseAuthAdapter.ts`

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
