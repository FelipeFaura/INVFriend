# TASK-010: Implement Group Repository & Port

## Status: ✅ COMPLETED

**Sprint**: Sprint 3 (Group Management Backend)  
**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Actual Effort**: 2 hours  
**Completed**: January 30, 2026

---

## Description

Create repository interface (port) and Firebase implementation for Group persistence following hexagonal architecture.

---

## Dependencies

- ✅ TASK-009: Group Entity & Domain Logic (Completed)

---

## Files Created

### Port Interface

- `backend/src/ports/IGroupRepository.ts` - Repository interface defining data access contract

### Repository Implementation

- `backend/src/adapters/persistence/FirebaseGroupRepository.ts` - Firestore implementation

### Tests

- `backend/src/adapters/persistence/__tests__/FirebaseGroupRepository.spec.ts` - 11 unit tests

---

## Implementation Details

### IGroupRepository Interface

```typescript
interface IGroupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  findByMemberId(userId: string): Promise<Group[]>;
  findByAdminId(adminId: string): Promise<Group[]>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
  generateId(): string;
}
```

### FirebaseGroupRepository Methods

| Method             | Description                            | Throws             |
| ------------------ | -------------------------------------- | ------------------ |
| `create()`         | Creates group document in Firestore    | -                  |
| `findById()`       | Returns Group or null                  | -                  |
| `findByMemberId()` | Returns groups where user is member    | -                  |
| `findByAdminId()`  | Returns groups administered by user    | -                  |
| `update()`         | Updates existing group document        | GroupNotFoundError |
| `delete()`         | Deletes group document                 | GroupNotFoundError |
| `generateId()`     | Generates unique Firestore document ID | -                  |

### Data Mapping

The repository handles conversion between domain entities and Firestore documents:

```typescript
// Domain Entity → Firestore Document
toDocument(group: Group): GroupDocument {
  return {
    name: group.name,
    description: group.description,
    adminId: group.adminId,
    members: group.members,
    budgetLimit: group.budgetLimit,
    raffleStatus: group.raffleStatus,
    raffleDate: group.raffleDate,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

// Firestore Document → Domain Entity
toEntity(id: string, doc: GroupDocument): Group {
  return Group.fromDatabase(
    id,
    doc.name,
    doc.description,
    doc.adminId,
    doc.members,
    doc.budgetLimit,
    doc.raffleStatus,
    doc.raffleDate,
    doc.createdAt,
    doc.updatedAt,
  );
}
```

---

## Test Results

```
FirebaseGroupRepository
  create
    ✓ should create a group in Firestore
  findById
    ✓ should return group when found
    ✓ should return null when group not found
  findByMemberId
    ✓ should return groups where user is a member
    ✓ should return empty array when no groups found
  findByAdminId
    ✓ should return groups administered by user
  update
    ✓ should update an existing group
    ✓ should throw GroupNotFoundError when group does not exist
  delete
    ✓ should delete an existing group
    ✓ should throw GroupNotFoundError when group does not exist
  generateId
    ✓ should generate a unique id

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

---

## Acceptance Criteria

- [x] IGroupRepository interface defines all required methods
- [x] FirebaseGroupRepository implements the interface correctly
- [x] Proper error handling with domain errors (GroupNotFoundError)
- [x] Bidirectional mapping between Group entity and Firestore document
- [x] Support for querying by member and admin
- [x] All 11 unit tests passing
- [x] Follows hexagonal architecture pattern

---

## Notes

- Added `findByAdminId()` method (not in original spec) for admin-specific queries
- Added `generateId()` method for pre-generating document IDs before creation
- Queries use Firestore's `array-contains` for efficient member lookup
- Results sorted by `createdAt` descending (newest first)

---

## References

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Hexagonal Architecture
- [GUIDELINES.md](../GUIDELINES.md) - Repository Pattern
- [Group Entity](../../backend/src/domain/entities/Group.ts)
- [GroupErrors](../../backend/src/domain/errors/GroupErrors.ts)
