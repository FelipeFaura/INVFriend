# TASK-025: Implement Wish Backend

## Status: 🔄 IN PROGRESS

**Sprint**: 7 - Wishes & Notifications  
**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-011 (Group Use Cases - ✅ Completed)

---

## Description

Implement complete backend for wish management including entity, repository, and use cases.

---

## Acceptance Criteria

### Entity

- [ ] Wish entity with immutable properties
- [ ] Validation for required fields
- [ ] Helper methods (update, etc.)

### Repository

- [ ] IWishRepository interface
- [ ] FirebaseWishRepository implementation
- [ ] CRUD operations

### Use Cases

- [ ] AddWishUseCase
- [ ] UpdateWishUseCase
- [ ] DeleteWishUseCase
- [ ] GetMyWishesUseCase
- [ ] GetSecretSantaWishesUseCase

### Testing

- [ ] Entity tests
- [ ] Repository tests
- [ ] Use case tests
- [ ] All tests passing

---

## Files to Create

1. `backend/src/domain/entities/Wish.ts`
2. `backend/src/domain/entities/__tests__/Wish.spec.ts`
3. `backend/src/ports/IWishRepository.ts`
4. `backend/src/adapters/persistence/FirebaseWishRepository.ts`
5. `backend/src/adapters/persistence/__tests__/FirebaseWishRepository.spec.ts`
6. `backend/src/application/use-cases/AddWishUseCase.ts`
7. `backend/src/application/use-cases/UpdateWishUseCase.ts`
8. `backend/src/application/use-cases/DeleteWishUseCase.ts`
9. `backend/src/application/use-cases/GetMyWishesUseCase.ts`
10. `backend/src/application/use-cases/GetSecretSantaWishesUseCase.ts`
11. Tests for all use cases

---

## Implementation Notes

_To be filled after implementation_

---

## Test Results

_To be filled after tests pass_
