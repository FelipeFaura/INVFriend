# TASK-060: Backend - GetAllMyAssignmentsUseCase

## 📝 Description

Create a use case to retrieve ALL Secret Santa assignments for the current user across all groups. Each assignment should include group information (name, budgetLimit).

## 📍 Location

- `backend/src/application/use-cases/GetAllMyAssignmentsUseCase.ts` - New use case
- `backend/src/application/dto/AssignmentDTOs.ts` - Create or update DTO file
- `backend/src/application/use-cases/index.ts` - Export new use case

## 🏗️ Model/Reference

**Input:**

```typescript
export interface GetAllMyAssignmentsDTO {
  userId: string; // Current authenticated user
}
```

**Output:**

```typescript
export interface AssignmentWithGroupDTO {
  assignmentId: string;
  groupId: string;
  groupName: string;
  budgetLimit: number;
  receiverId: string;
  createdAt: string; // ISO date
}

export interface AllAssignmentsResponseDTO {
  assignments: AssignmentWithGroupDTO[];
}
```

## 🎯 Specific Requirements

- [ ] Create `GetAllMyAssignmentsUseCase` that:
  - Uses existing `IAssignmentRepository.findByUser(userId)` to get assignments where user is secretSanta
  - For each assignment, fetch the group to get name and budgetLimit
  - Return enriched assignments with group info
  - Sort by createdAt descending (most recent first)
- [ ] Filter to only include assignments where user is the SECRET SANTA (giver), not receiver
- [ ] Create DTOs in `AssignmentDTOs.ts`
- [ ] Export from index.ts
- [ ] Include unit tests (at least 4 tests)

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not include assignments where user is the RECEIVER (only where they are the giver)
- ❌ Do not include user profile data in this response (that's fetched separately)
- ❌ Do not modify existing assignment repository

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Includes unit tests
- [ ] No debug logs
- [ ] Documented with JSDoc
- [ ] Efficiently fetches group data (consider batching if many assignments)

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Assignment repository: `backend/src/ports/IAssignmentRepository.ts`
- Similar pattern: `backend/src/application/use-cases/GetMyAssignmentUseCase.ts`

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
