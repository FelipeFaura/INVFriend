# TASK-009: Implement Group Entity & Domain Logic

**Status**: ✅ COMPLETED  
**Started**: January 30, 2026  
**Completed**: January 30, 2026  
**Sprint**: 3 - Group Management Backend

---

## 📝 Description

Create Group domain entity with business rules following domain-driven design principles.

## 📍 Location

- `backend/src/domain/entities/Group.ts`
- `backend/src/domain/errors/GroupErrors.ts`

## 🏗️ Model/Reference

- User entity: `backend/src/domain/entities/User.ts`
- Architecture: `docs/ARCHITECTURE.md`

## 🎯 Specific Requirements

- [x] Group name: 3-100 characters
- [x] Budget limit: > 0
- [x] Admin automatically added as member
- [x] Minimum 2 members for raffle
- [x] RaffleStatus: 'pending' | 'completed'
- [x] Immutable entity pattern (returns new instances on mutation)

## 🚫 Scope / Limits

❌ Do NOT include:

- Repository implementation (TASK-010)
- Use cases (TASK-011)
- API endpoints (TASK-012)

## ✅ Acceptance / Checklist

- [x] Follows GUIDELINES.md naming conventions
- [x] TypeScript compiles without errors
- [x] All tests pass (31 tests)
- [x] No debug logs or console.log()

## 📁 Files Created

### Entity

- `backend/src/domain/entities/Group.ts` - Group entity with business logic

### Errors

- `backend/src/domain/errors/GroupErrors.ts` - Domain-specific error classes:
  - `GroupError` (base class)
  - `InvalidGroupNameError`
  - `InvalidBudgetLimitError`
  - `NotGroupAdminError`
  - `GroupNotFoundError`
  - `NotGroupMemberError`
  - `AlreadyGroupMemberError`
  - `CannotRemoveAdminError`
  - `CannotDeleteAfterRaffleError`
  - `NotEnoughMembersError`
  - `RaffleAlreadyCompletedError`

### Tests

- `backend/src/domain/entities/__tests__/Group.spec.ts`

## 🧪 Test Results

- **Total: 31 tests SUCCESS**
- create: 7 tests
- fromDatabase: 1 test
- update: 5 tests
- addMember: 3 tests
- removeMember: 4 tests
- completeRaffle: 3 tests
- isMember: 2 tests
- isAdmin: 2 tests
- canPerformRaffle: 3 tests
- toJSON: 1 test

## 📋 Entity Methods

```typescript
class Group {
  // Factory methods
  static create(id, name, adminId, budgetLimit, description?): Group
  static fromDatabase(...): Group

  // Mutations (return new instance)
  update(name?, description?, budgetLimit?): Group
  addMember(userId): Group
  removeMember(userId): Group
  completeRaffle(): Group

  // Queries
  isMember(userId): boolean
  isAdmin(userId): boolean
  canPerformRaffle(): boolean
  toJSON(): Record<string, unknown>
}
```

## 📋 Notes

- Immutable pattern: all mutations return new Group instances
- Admin is automatically added as first member on creation
- Cannot modify group after raffle is completed
- Cannot remove admin from group
