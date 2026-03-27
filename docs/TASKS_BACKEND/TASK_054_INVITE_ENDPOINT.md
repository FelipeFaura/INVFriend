# TASK-054: Backend - Invite Member by Email Endpoint

## 📝 Description

Create a new endpoint that accepts an email address to add a member to a group. This endpoint uses the `AddMemberByEmailUseCase` created in TASK-053.

## 📍 Location

- `backend/src/adapters/http/controllers/GroupController.ts` - Add `inviteMemberByEmail` method
- `backend/src/adapters/http/routes/groupRoutes.ts` - Add route

## 🏗️ Model/Reference

**Route pattern:**

```
POST /groups/:id/invite
Body: { email: string }
```

**Existing pattern to follow:**

- `addMember` endpoint in same controller
- Route: `POST /groups/:id/members` adds by userId

**Response:**

- Success: Return updated group (same as addMember)
- Error 404: "No user registered with this email"
- Error 403: "Only the group admin can add members"
- Error 400: "User is already a member of this group"

## 🎯 Specific Requirements

- [ ] Add `inviteMemberByEmail` method to GroupController
- [ ] Add route `POST /groups/:id/invite`
- [ ] Wire up `AddMemberByEmailUseCase` in controller
- [ ] Handle errors with appropriate HTTP status codes
- [ ] Validate email format in request body

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not modify existing `/members` endpoint - create a new `/invite` endpoint
- ❌ Do not implement email sending functionality
- ❌ Do not create invitation tokens or pending states

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Returns appropriate HTTP status codes
- [ ] Request body validation (email required, valid format)
- [ ] Documented with JSDoc
- [ ] Error responses are consistent with existing endpoints

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Existing controller: `backend/src/adapters/http/controllers/GroupController.ts`
- Existing routes: `backend/src/adapters/http/routes/groupRoutes.ts`

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
