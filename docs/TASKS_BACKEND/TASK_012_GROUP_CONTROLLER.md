# TASK-012: Implement Group Controller & Routes

## Status: ✅ COMPLETED

**Sprint**: Sprint 3 (Group Management Backend)  
**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Actual Effort**: 2 hours  
**Dependencies**: TASK-011 (Group Use Cases) ✅

---

## Description

Create REST API endpoints for group management. The controller handles HTTP requests and delegates to use cases for business logic.

---

## Dependencies

- ✅ TASK-009: Group Entity & Domain Logic
- ✅ TASK-010: Group Repository & Port
- ✅ TASK-011: Group Use Cases

---

## Files to Create

### Controller

- `backend/src/adapters/http/controllers/GroupController.ts`

### Tests

- `backend/src/adapters/http/controllers/__tests__/GroupController.spec.ts`

---

## API Endpoints

| Method | Endpoint | Description | Auth | Access |
|--------|----------|-------------|------|--------|
| POST | `/groups` | Create new group | Required | Any user |
| GET | `/groups` | List user's groups | Required | Any user |
| GET | `/groups/:id` | Get group details | Required | Members only |
| PUT | `/groups/:id` | Update group | Required | Admin only |
| DELETE | `/groups/:id` | Delete group | Required | Admin only |
| POST | `/groups/:id/members` | Add member | Required | Admin only |
| DELETE | `/groups/:id/members/:userId` | Remove member | Required | Admin only |

---

## Request/Response Examples

### POST /groups
```json
// Request
{
  "name": "Secret Santa 2026",
  "budgetLimit": 50,
  "description": "Christmas gift exchange"
}

// Response (201)
{
  "id": "group-123",
  "name": "Secret Santa 2026",
  "description": "Christmas gift exchange",
  "adminId": "user-123",
  "members": ["user-123"],
  "budgetLimit": 50,
  "raffleStatus": "pending",
  "raffleDate": null,
  "createdAt": 1706745600000,
  "updatedAt": 1706745600000
}
```

### Error Responses

| Code | Error | When |
|------|-------|------|
| 400 | INVALID_GROUP_NAME | Name < 3 or > 100 chars |
| 400 | INVALID_BUDGET_LIMIT | Budget <= 0 |
| 400 | ALREADY_GROUP_MEMBER | User already in group |
| 400 | CANNOT_REMOVE_ADMIN | Trying to remove admin |
| 400 | CANNOT_DELETE_AFTER_RAFFLE | Raffle completed |
| 401 | UNAUTHORIZED | Not authenticated |
| 403 | NOT_GROUP_ADMIN | Not admin for operation |
| 403 | NOT_GROUP_MEMBER | Not member (view details) |
| 404 | GROUP_NOT_FOUND | Group doesn't exist |

---

## Implementation Checklist

- [ ] Create GroupController class
- [ ] Implement createGroup endpoint
- [ ] Implement getGroups endpoint
- [ ] Implement getGroupById endpoint
- [ ] Implement updateGroup endpoint
- [ ] Implement deleteGroup endpoint
- [ ] Implement addMember endpoint
- [ ] Implement removeMember endpoint
- [ ] Centralized error handling
- [ ] Unit tests for all endpoints
- [ ] All tests passing

---

## Test Coverage Plan

1. **createGroup**
   - ✓ Success case (201)
   - ✓ Unauthenticated (401)
   - ✓ Invalid name (400)
   - ✓ Invalid budget (400)

2. **getGroups**
   - ✓ Success case (200)
   - ✓ Unauthenticated (401)

3. **getGroupById**
   - ✓ Success case (200)
   - ✓ Group not found (404)
   - ✓ Not a member (403)

4. **updateGroup**
   - ✓ Success case (200)
   - ✓ Not admin (403)
   - ✓ Group not found (404)

5. **deleteGroup**
   - ✓ Success case (200)
   - ✓ Not admin (403)
   - ✓ Raffle completed (400)

6. **addMember**
   - ✓ Success case (200)
   - ✓ Not admin (403)
   - ✓ Already member (400)

7. **removeMember**
   - ✓ Success case (200)
   - ✓ Not admin (403)
   - ✓ Remove admin (400)
   - ✓ Not a member (400)

---

## Implementation Notes

### Files Created

1. **GroupController.ts** - Controller with 7 endpoint methods and centralized error handling
2. **groupRoutes.ts** - Express router factory with all routes configured

### Test Results

- **22 tests passing**
- All success and error cases covered
- TDD approach followed (red → green → refactor)

---

## References

- [ARCHITECTURE_QUICK_REF.md](../ARCHITECTURE_QUICK_REF.md) - Flow 1
- [AuthController.ts](../../backend/src/adapters/http/controllers/AuthController.ts) - Pattern reference
- [Group Use Cases](../../backend/src/application/use-cases/)

