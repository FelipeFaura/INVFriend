# TASK-061: Backend - All My Assignments Endpoint

## 📝 Description

Create an endpoint to retrieve all Secret Santa assignments for the current user across all groups.

## 📍 Location

- `backend/src/adapters/http/controllers/AssignmentController.ts` - New controller
- `backend/src/adapters/http/routes/assignmentRoutes.ts` - New routes file
- `backend/src/index.ts` - Register new routes

## 🏗️ Model/Reference

**Route:**

```
GET /assignments/mine
```

**Response (200):**

```json
{
  "assignments": [
    {
      "assignmentId": "asgn-123",
      "groupId": "grp-456",
      "groupName": "Familia",
      "budgetLimit": 50,
      "receiverId": "user-789",
      "createdAt": "2026-03-07T10:00:00.000Z"
    },
    {
      "assignmentId": "asgn-124",
      "groupId": "grp-457",
      "groupName": "Trabajo",
      "budgetLimit": 30,
      "receiverId": "user-790",
      "createdAt": "2026-03-06T15:00:00.000Z"
    }
  ]
}
```

## 🎯 Specific Requirements

- [ ] Create `AssignmentController` with `getMyAssignments` method
- [ ] Create `assignmentRoutes.ts` with GET endpoint
- [ ] Register routes in main `index.ts` under `/assignments` path
- [ ] Require authentication (use authMiddleware)
- [ ] Use `GetAllMyAssignmentsUseCase` from TASK-060
- [ ] Return empty array if user has no assignments

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not allow unauthenticated access
- ❌ Do not include receiver profile data (frontend fetches separately)
- ❌ Do not create other CRUD endpoints - only this one GET

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Returns appropriate HTTP status codes (200, 401)
- [ ] Documented with JSDoc
- [ ] Error responses consistent with existing endpoints
- [ ] Route registered in main app

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Existing controller pattern: `backend/src/adapters/http/controllers/RaffleController.ts`
- Existing routes pattern: `backend/src/adapters/http/routes/groupRoutes.ts`

---

## 📊 Results

_(Filled by sub-agent upon completion)_

**Status:** ⏳ Pending

**Files Created/Modified:**

-

**Build:** ⏳
**Tests:** ⏳

**Notes:**

---

## 📈 Session Metrics

_(Filled by sub-agent upon completion)_
