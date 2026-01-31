# TASK-011: Implement Group Use Cases

## Status: ✅ COMPLETED

**Sprint**: Sprint 3 (Group Management Backend)  
**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Actual Effort**: 3 hours  
**Completed**: January 31, 2026

---

## Description

Implement business logic use cases for group operations following hexagonal architecture. Use cases orchestrate domain entities and repository operations.

---

## Dependencies

- ✅ TASK-009: Group Entity & Domain Logic (Completed)
- ✅ TASK-010: Group Repository & Port (Completed)

---

## Files Created

### DTOs

- `backend/src/application/dto/GroupDTOs.ts` - Data Transfer Objects for group operations

### Use Cases

| File                              | Description                                  |
| --------------------------------- | -------------------------------------------- |
| `CreateGroupUseCase.ts`           | Creates new group with admin as first member |
| `GetGroupDetailsUseCase.ts`       | Retrieves group details (members only)       |
| `GetUserGroupsUseCase.ts`         | Lists all groups for a user                  |
| `UpdateGroupUseCase.ts`           | Updates group info (admin only)              |
| `AddMemberToGroupUseCase.ts`      | Adds member to group (admin only)            |
| `RemoveMemberFromGroupUseCase.ts` | Removes member from group (admin only)       |
| `DeleteGroupUseCase.ts`           | Deletes group (admin only, before raffle)    |
| `index.ts`                        | Barrel export for all use cases              |

### Tests

- `backend/src/application/use-cases/__tests__/CreateGroupUseCase.spec.ts` (5 tests)
- `backend/src/application/use-cases/__tests__/GetGroupDetailsUseCase.spec.ts` (4 tests)
- `backend/src/application/use-cases/__tests__/GetUserGroupsUseCase.spec.ts` (3 tests)
- `backend/src/application/use-cases/__tests__/UpdateGroupUseCase.spec.ts` (8 tests)
- `backend/src/application/use-cases/__tests__/AddMemberToGroupUseCase.spec.ts` (5 tests)
- `backend/src/application/use-cases/__tests__/RemoveMemberFromGroupUseCase.spec.ts` (6 tests)
- `backend/src/application/use-cases/__tests__/DeleteGroupUseCase.spec.ts` (5 tests)

**Total: 36 new tests**

---

## Implementation Details

### DTOs

```typescript
// Input DTOs
interface CreateGroupDTO {
  name: string;
  adminId: string;
  budgetLimit: number;
  description?: string;
}

interface UpdateGroupDTO {
  name?: string;
  description?: string | null;
  budgetLimit?: number;
}

interface AddMemberDTO {
  groupId: string;
  userId: string;
  requesterId: string;
}

interface RemoveMemberDTO {
  groupId: string;
  userId: string;
  requesterId: string;
}

// Output DTOs
interface GroupResponseDTO {
  /* full group data */
}
interface GroupSummaryDTO {
  /* for list views */
}
```

### Use Case Authorization Matrix

| Use Case        | Who Can Execute        | Conditions                               |
| --------------- | ---------------------- | ---------------------------------------- |
| CreateGroup     | Any authenticated user | -                                        |
| GetGroupDetails | Group members          | Must be member                           |
| GetUserGroups   | Any authenticated user | Returns own groups                       |
| UpdateGroup     | Group admin only       | -                                        |
| AddMember       | Group admin only       | Raffle not completed                     |
| RemoveMember    | Group admin only       | Cannot remove self, raffle not completed |
| DeleteGroup     | Group admin only       | Raffle not completed                     |

### Error Handling

Each use case validates authorization and throws appropriate domain errors:

- `GroupNotFoundError` - Group doesn't exist
- `NotGroupAdminError` - Requester is not admin
- `NotGroupMemberError` - Requester is not a member
- `AlreadyGroupMemberError` - User already in group
- `CannotRemoveAdminError` - Trying to remove admin
- `CannotDeleteAfterRaffleError` - Raffle already completed
- `RaffleAlreadyCompletedError` - Modification after raffle

---

## Test Results

```
CreateGroupUseCase
  ✓ should create a group successfully
  ✓ should create a group without description
  ✓ should throw InvalidGroupNameError for short name
  ✓ should throw InvalidBudgetLimitError for zero budget
  ✓ should throw InvalidBudgetLimitError for negative budget

GetGroupDetailsUseCase
  ✓ should return group details for a member
  ✓ should return group details for the admin
  ✓ should throw GroupNotFoundError when group does not exist
  ✓ should throw NotGroupMemberError when requester is not a member

GetUserGroupsUseCase
  ✓ should return list of groups for a user
  ✓ should return empty array when user has no groups
  ✓ should correctly identify admin status for each group

UpdateGroupUseCase
  ✓ should update group name
  ✓ should update group description
  ✓ should update budget limit
  ✓ should update multiple fields at once
  ✓ should throw GroupNotFoundError when group does not exist
  ✓ should throw NotGroupAdminError when requester is not admin
  ✓ should throw InvalidGroupNameError for invalid name
  ✓ should throw InvalidBudgetLimitError for invalid budget

AddMemberToGroupUseCase
  ✓ should add a member successfully
  ✓ should throw GroupNotFoundError when group does not exist
  ✓ should throw NotGroupAdminError when requester is not admin
  ✓ should throw AlreadyGroupMemberError when user is already a member
  ✓ should throw RaffleAlreadyCompletedError when raffle is completed

RemoveMemberFromGroupUseCase
  ✓ should remove a member successfully
  ✓ should throw GroupNotFoundError when group does not exist
  ✓ should throw NotGroupAdminError when requester is not admin
  ✓ should throw CannotRemoveAdminError when trying to remove admin
  ✓ should throw NotGroupMemberError when user is not a member
  ✓ should throw RaffleAlreadyCompletedError when raffle is completed

DeleteGroupUseCase
  ✓ should delete a group successfully
  ✓ should throw GroupNotFoundError when group does not exist
  ✓ should throw NotGroupAdminError when requester is not admin
  ✓ should throw CannotDeleteAfterRaffleError when raffle is completed
  ✓ should throw NotGroupAdminError before checking raffle status

Test Suites: 7 passed, 7 total
Tests:       36 passed, 36 total
```

---

## Acceptance Criteria

- [x] CreateGroupUseCase generates ID and persists group
- [x] GetGroupDetailsUseCase validates membership before returning
- [x] GetUserGroupsUseCase returns summary with admin flag
- [x] UpdateGroupUseCase validates admin and applies changes
- [x] AddMemberToGroupUseCase validates admin and raffle status
- [x] RemoveMemberFromGroupUseCase validates admin, prevents self-removal
- [x] DeleteGroupUseCase validates admin and raffle status
- [x] All use cases use DTOs for input/output
- [x] All 36 unit tests passing
- [x] Proper error handling with domain errors

---

## Notes

- Use cases follow Single Responsibility Principle
- Each use case has one `execute()` method
- Repository is injected via constructor (Dependency Inversion)
- Domain validation happens in Entity, authorization in Use Case
- `toResponseDTO` helper exported for reuse across use cases

---

## References

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Use Case Layer
- [GUIDELINES.md](../GUIDELINES.md) - Use Cases Pattern
- [Group Entity](../../backend/src/domain/entities/Group.ts)
- [IGroupRepository](../../backend/src/ports/IGroupRepository.ts)
