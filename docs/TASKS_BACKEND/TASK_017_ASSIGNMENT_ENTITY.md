# TASK-017: Implement Assignment Entity & Repository

## Status: ✅ COMPLETED

**Sprint**: 5 - Raffle System Backend  
**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-010 (Group Repository - ✅ Completed)

---

## Description

Create the Assignment domain entity and persistence layer for storing Secret Santa raffle results.

---

## Acceptance Criteria

### Domain Entity

- [x] Assignment entity with immutable properties
- [x] Factory method for creating assignments
- [x] FromDatabase reconstruction method
- [x] Proper TypeScript typing

### Repository

- [x] IAssignmentRepository port interface
- [x] FirebaseAssignmentRepository implementation
- [x] Methods: create, findByGroupId, findByUserId, findByGroupAndSecretSanta, deleteByGroupId
- [x] Batch create for atomic raffle results storage

### Testing

- [x] Unit tests for Assignment entity (16 tests)
- [x] Unit tests for FirebaseAssignmentRepository (12 tests)
- [x] All 28 tests passing

---

## Technical Specification

### Assignment Model

```typescript
{
  id: string;
  groupId: string;
  receiverId: string; // Who receives the gift
  secretSantaId: string; // Who gives the gift (secret santa)
  createdAt: number;
}
```

### Repository Interface

```typescript
interface IAssignmentRepository {
  create(assignment: Assignment): Promise<Assignment>;
  createBatch(assignments: Assignment[]): Promise<void>;
  findByGroupId(groupId: string): Promise<Assignment[]>;
  findByUserId(userId: string): Promise<Assignment[]>;
  findByGroupAndUser(
    groupId: string,
    userId: string,
  ): Promise<Assignment | null>;
  deleteByGroupId(groupId: string): Promise<void>;
  generateId(): string;
}
```

---

## Files to Create

1. `backend/src/domain/entities/Assignment.ts`
2. `backend/src/domain/entities/__tests__/Assignment.spec.ts`
3. `backend/src/ports/IAssignmentRepository.ts`
4. `backend/src/adapters/persistence/FirebaseAssignmentRepository.ts`
5. `backend/src/adapters/persistence/__tests__/FirebaseAssignmentRepository.spec.ts`

---

## Implementation Notes

- Assignment entity is immutable with readonly properties
- Self-assignment validation in create() but not fromDatabase() for flexibility
- Helper methods: involvesUser(), isSecretSanta(), isReceiver()
- Repository uses batch writes for atomic operations
- findByUserId performs two queries and deduplicates results
- Firestore indexes needed: groupId+createdAt, receiverId, secretSantaId, groupId+secretSantaId

---

## Test Results

- Assignment Entity: 16 tests passing
- FirebaseAssignmentRepository: 12 tests passing
- **Total: 28 tests passing**
