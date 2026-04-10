# TASK-019: Implement Perform Raffle Use Case

## Status: ✅ COMPLETED

**Sprint**: 5 - Raffle System Backend  
**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Dependencies**: TASK-018 (Raffle Algorithm - ✅ Completed)

---

## Description

Business logic to execute the raffle for a group, including validations and atomic storage of assignments.

---

## Acceptance Criteria

### Business Rules

- [x] Only admin can perform raffle
- [x] Minimum 2 members required
- [x] Cannot raffle if already completed
- [x] Update group status to 'completed'
- [x] Set raffleDate timestamp
- [x] Store all assignments atomically

### Implementation

- [x] PerformRaffleUseCase class
- [x] GetMyAssignmentUseCase class (bonus)
- [x] Input/Output DTOs
- [x] Integration with raffle algorithm
- [x] Atomic transaction for assignments

### Testing

- [x] Unit tests for all business rules
- [x] Error case testing
- [x] Integration with repositories (mocked)
- [x] All 22 tests passing (14 + 8)

---

## Technical Specification

### Input DTO

```typescript
interface PerformRaffleDTO {
  groupId: string;
  requesterId: string; // Must be admin
}
```

### Output DTO

```typescript
interface RaffleResultDTO {
  groupId: string;
  raffleDate: number;
  assignmentCount: number;
}
```

---

## Files Created

1. `backend/src/application/use-cases/PerformRaffleUseCase.ts`
2. `backend/src/application/use-cases/__tests__/PerformRaffleUseCase.spec.ts`
3. `backend/src/application/use-cases/GetMyAssignmentUseCase.ts`
4. `backend/src/application/use-cases/__tests__/GetMyAssignmentUseCase.spec.ts`
5. Updated `backend/src/application/use-cases/index.ts`

---

## Implementation Notes

- PerformRaffleUseCase validates admin, raffle status, and member count before executing
- Uses raffle algorithm for assignment generation
- Creates Assignment entities with generated IDs
- Stores assignments atomically via createBatch
- Updates group to completed status after assignments stored
- GetMyAssignmentUseCase added to retrieve user's assignment
- Custom errors: RaffleFailedError, RaffleNotCompletedError, AssignmentNotFoundError

---

## Test Results

- PerformRaffleUseCase: 14 tests passing
- GetMyAssignmentUseCase: 8 tests passing
- **Total: 22 tests passing**
