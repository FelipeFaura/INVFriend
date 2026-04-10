# TASK-025: Implement Wish Backend

## Status: ✅ COMPLETED

**Sprint**: 7 - Wishes & Notifications  
**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-011 (Group Use Cases - ✅ Completed)  
**Completed**: February 2026

---

## Description

Implement complete backend for wish management including entity, repository, and use cases.

---

## Acceptance Criteria

### Entity

- [x] Wish entity with immutable properties
- [x] Validation for required fields
- [x] Helper methods (update, etc.)

### Repository

- [x] IWishRepository interface
- [x] FirebaseWishRepository implementation
- [x] CRUD operations

### Use Cases

- [x] AddWishUseCase
- [x] UpdateWishUseCase
- [x] DeleteWishUseCase
- [x] GetMyWishesUseCase
- [x] GetSecretSantaWishesUseCase

### Testing

- [x] Entity tests
- [x] Repository tests
- [x] Use case tests
- [x] All tests passing

---

## Files Created

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

All Wish backend components have been implemented following hexagonal architecture:

- Wish entity with validation and business rules
- IWishRepository port interface
- FirebaseWishRepository adapter
- All CRUD use cases with proper authorization checks

---

## Test Results

All tests passing - included in backend's 310 passing tests
