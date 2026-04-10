# TASK-013: Implement Group Models & HTTP Service

## Status: ✅ COMPLETED

**Sprint**: Sprint 4 (Group Management Frontend)  
**Priority**: HIGH  
**Estimated Effort**: 3 hours  
**Actual Effort**: 1.5 hours  
**Dependencies**: TASK-012 (Group Controller & Routes) ✅

---

## Description

Create domain models, DTOs, and HTTP service for group management on the frontend. This follows the same hexagonal architecture patterns established in the auth module.

---

## Files to Create

### Domain Models

- `frontend/src/app/domain/models/group.model.ts`
- `frontend/src/app/domain/errors/group-errors.ts`

### DTOs

- `frontend/src/app/application/dto/group.dto.ts`

### Services

- `frontend/src/app/adapters/services/group-http.service.ts`
- `frontend/src/app/adapters/services/__tests__/group-http.service.spec.ts`

---

## Model Specifications

### Group Model

```typescript
interface Group {
  id: string;
  name: string;
  description?: string;
  adminId: string;
  members: string[];
  budgetLimit: number;
  raffleStatus: "pending" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
```

### GroupSummary Model (for list views)

```typescript
interface GroupSummary {
  id: string;
  name: string;
  memberCount: number;
  isAdmin: boolean;
  raffleStatus: "pending" | "completed";
}
```

---

## HTTP Service Methods

| Method                          | Endpoint                           | Description        |
| ------------------------------- | ---------------------------------- | ------------------ |
| `createGroup(dto)`              | POST /groups                       | Create new group   |
| `getGroups()`                   | GET /groups                        | List user's groups |
| `getGroupById(id)`              | GET /groups/:id                    | Get group details  |
| `updateGroup(id, dto)`          | PUT /groups/:id                    | Update group       |
| `deleteGroup(id)`               | DELETE /groups/:id                 | Delete group       |
| `addMember(groupId, userId)`    | POST /groups/:id/members           | Add member         |
| `removeMember(groupId, userId)` | DELETE /groups/:id/members/:userId | Remove member      |

---

## Test Plan

### Unit Tests (group-http.service.spec.ts)

1. **createGroup**
   - Should call POST /groups with DTO
   - Should return created group

2. **getGroups**
   - Should call GET /groups
   - Should return array of GroupSummary

3. **getGroupById**
   - Should call GET /groups/:id
   - Should return group details

4. **updateGroup**
   - Should call PUT /groups/:id
   - Should return updated group

5. **deleteGroup**
   - Should call DELETE /groups/:id

6. **addMember**
   - Should call POST /groups/:id/members

7. **removeMember**
   - Should call DELETE /groups/:id/members/:userId

---

## Error Handling

Map backend error codes to frontend error classes:

| Backend Code         | Frontend Error          |
| -------------------- | ----------------------- |
| GROUP_NOT_FOUND      | GroupNotFoundError      |
| NOT_GROUP_ADMIN      | NotGroupAdminError      |
| NOT_GROUP_MEMBER     | NotGroupMemberError     |
| ALREADY_GROUP_MEMBER | AlreadyGroupMemberError |
| INVALID_GROUP_NAME   | InvalidGroupNameError   |
| INVALID_BUDGET_LIMIT | InvalidBudgetLimitError |

---

## Acceptance Criteria

- [x] Group model matches backend response structure
- [x] All HTTP methods implemented with proper typing
- [x] Error responses transformed to typed errors
- [x] Service uses auth interceptor for token
- [x] Unit tests cover all methods (16 tests passing)

---

## Implementation Notes

### Files Created

1. **group.model.ts** - Group, GroupSummary, GroupMember interfaces
2. **group-errors.ts** - 8 error classes + factory function
3. **group.dto.ts** - Request/Response DTOs
4. **group-http.service.ts** - 7 HTTP methods with error mapping
5. **group-http.service.spec.ts** - 16 unit tests

---

## References

- [TASK-006](./TASK_006_AUTH_HTTP_SERVICE.md) - Auth HTTP Service (pattern reference)
- [Backend Group DTOs](../../backend/src/application/dto/GroupDTOs.ts)
- [Backend Group Controller](../../backend/src/adapters/http/controllers/GroupController.ts)
