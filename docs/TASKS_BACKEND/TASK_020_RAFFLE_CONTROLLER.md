# TASK-020: Implement Raffle Controller & Routes

## Status: ✅ COMPLETED

**Sprint**: 5 - Raffle System Backend  
**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-019 (Perform Raffle Use Case - ✅ Completed)

---

## Description

API endpoints for raffle operations including performing raffle and retrieving assignments.

---

## Acceptance Criteria

### Endpoints

- [x] POST /groups/:id/raffle - Perform raffle (admin only)
- [x] GET /groups/:id/my-assignment - Get my assignment (member only, after raffle)

### Implementation

- [x] RaffleController class
- [x] Routes integrated with group routes
- [x] Authentication required for all endpoints
- [x] Proper error handling and HTTP status codes

### Testing

- [x] Unit tests for controller methods
- [x] Error handling tests (13 tests)
- [x] All tests passing

---

## Technical Specification

### Endpoints

```
POST   /groups/:id/raffle         - Perform raffle (admin only)
  Response: { groupId, raffleDate, assignmentCount }

GET    /groups/:id/my-assignment  - Get my assignment (member, after raffle)
  Response: { id, groupId, receiverId, createdAt }
```

### Error Responses

- 400: NotEnoughMembersError, RaffleAlreadyCompletedError
- 403: NotGroupAdminError, NotGroupMemberError
- 404: GroupNotFoundError, AssignmentNotFoundError

---

## Files Created

1. `backend/src/adapters/http/controllers/RaffleController.ts`
2. `backend/src/adapters/http/controllers/__tests__/RaffleController.spec.ts`
3. Updated `backend/src/adapters/http/routes/groupRoutes.ts`

---

## Implementation Notes

- RaffleController handles both performRaffle and getMyAssignment endpoints
- Routes added to existing groupRoutes.ts (now requires IAssignmentRepository)
- Error handling for all raffle-specific errors
- HTTP status codes:
  - 200: Success
  - 400: Validation errors (not enough members, raffle completed, etc.)
  - 401: Unauthorized
  - 403: Forbidden (not admin/member)
  - 404: Not found (group, assignment)
  - 500: Internal server error

---

## Test Results

- RaffleController: 13 tests passing
- **Backend Total: 234 tests passing**
