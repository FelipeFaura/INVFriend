# TASK-059: Backend - User Public Profile Endpoint

## 📝 Description

Create an endpoint to retrieve a user's public profile (name and photo) by user ID. This endpoint uses the `GetUserPublicProfileUseCase` created in TASK-058.

## 📍 Location

- `backend/src/adapters/http/controllers/UserController.ts` - New controller
- `backend/src/adapters/http/routes/userRoutes.ts` - New routes file
- `backend/src/index.ts` - Register new routes

## 🏗️ Model/Reference

**Route:**

```
GET /users/:id/profile
```

**Response (200):**

```json
{
  "id": "user-123",
  "name": "Juan García",
  "photoUrl": "https://firebasestorage.googleapis.com/..."
}
```

**Response (404):**

```json
{
  "code": "USER_NOT_FOUND",
  "message": "User not found"
}
```

## 🎯 Specific Requirements

- [ ] Create `UserController` with `getPublicProfile` method
- [ ] Create `userRoutes.ts` with GET endpoint
- [ ] Register routes in main `index.ts` under `/users` path
- [ ] Require authentication (use authMiddleware)
- [ ] Handle `UserNotFoundError` with 404 status
- [ ] Return only public fields (id, name, photoUrl)

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not allow unauthenticated access
- ❌ Do not expose email or other private fields
- ❌ Do not create CRUD operations - only GET profile

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Returns appropriate HTTP status codes (200, 404, 401)
- [ ] Documented with JSDoc
- [ ] Error responses consistent with existing endpoints
- [ ] Route registered in main app

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Existing controller pattern: `backend/src/adapters/http/controllers/GroupController.ts`
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
