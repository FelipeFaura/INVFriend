# 📋 Backend Tasks Tracker

This folder contains detailed task specifications for backend development following the [TASK_TEMPLATE.md](../TASK_TEMPLATE.md) format.

**📊 Current Status**: See [PROJECT_PROGRESS.md](../PROJECT_PROGRESS.md) for live dashboard and metrics.

## ✅ Completed Tasks

### Sprint 1: Foundation & Authentication Backend

| Task ID  | Task Name                           | Status       | Completed Date | Commit    |
| -------- | ----------------------------------- | ------------ | -------------- | --------- |
| TASK-001 | Project Setup & Configuration       | ✅ COMPLETED | Jan 30, 2026   | `2f8de2d` |
| TASK-002 | Implement Authentication Backend    | ✅ COMPLETED | Jan 30, 2026   | `2f8de2d` |
| TASK-003 | Implement Auth Middleware           | ✅ COMPLETED | Jan 30, 2026   | `2f8de2d` |
| TASK-004 | Implement Auth Controllers & Routes | ✅ COMPLETED | Jan 30, 2026   | `2f8de2d` |

**Files Created**:

- ✅ `backend/src/domain/entities/User.ts`
- ✅ `backend/src/domain/errors/AuthErrors.ts`
- ✅ `backend/src/shared/types/AuthTypes.ts`
- ✅ `backend/src/shared/utils/validators.ts`
- ✅ `backend/src/ports/IAuthPort.ts`
- ✅ `backend/src/adapters/auth/FirebaseAuthAdapter.ts`
- ✅ `backend/src/adapters/auth/__tests__/FirebaseAuthAdapter.spec.ts`
- ✅ `backend/src/adapters/http/middleware/authMiddleware.ts`
- ✅ `backend/src/adapters/http/controllers/AuthController.ts`
- ✅ `backend/src/adapters/http/controllers/__tests__/AuthController.spec.ts`
- ✅ `backend/src/config/firebase.config.ts`

## 📝 Task Specifications

- [TASK_001_AUTH_SERVICE.md](./TASK_001_AUTH_SERVICE.md) - Complete authentication service specification

## 🔄 Upcoming Tasks (Sprint 3)

### Sprint 3: Group Management Backend

| Task ID  | Task Name                             | Status     | Dependencies |
| -------- | ------------------------------------- | ---------- | ------------ |
| TASK-009 | Implement Group Entity & Domain Logic | ⏸️ PENDING | TASK-002     |
| TASK-010 | Implement Group Repository & Port     | ⏸️ PENDING | TASK-009     |
| TASK-011 | Implement Group Use Cases             | ⏸️ PENDING | TASK-010     |
| TASK-012 | Implement Group Controller & Routes   | ⏸️ PENDING | TASK-011     |

**Expected Files**:

- `backend/src/domain/entities/Group.ts`
- `backend/src/ports/IGroupRepository.ts`
- `backend/src/adapters/persistence/FirebaseGroupRepository.ts`
- `backend/src/application/use-cases/CreateGroupUseCase.ts`
- `backend/src/adapters/http/controllers/GroupController.ts`

## 📊 Statistics

**📈 For complete statistics and velocity metrics**, see [PROJECT_PROGRESS.md](../PROJECT_PROGRESS.md).

- **Total Backend Tasks**: 22
- **Completed**: 16
- **Pending**: 6 (TASK-053, TASK-054, TASK-058 to 061)

## 📋 Backlog

### Dashboard Secret Santa (TASK-058 to TASK-061)

| Task ID  | Task Name                   | Status     | Dependencies |
| -------- | --------------------------- | ---------- | ------------ |
| TASK-058 | GetUserPublicProfileUseCase | ⏳ Pending | -            |
| TASK-059 | User Profile Endpoint       | ⏳ Pending | TASK-058     |
| TASK-060 | GetAllMyAssignmentsUseCase  | ⏳ Pending | -            |
| TASK-061 | All Assignments Endpoint    | ⏳ Pending | TASK-060     |

[Full Plan](../TASKS_FRONTEND/PLAN_DASHBOARD_SECRET_SANTA.md)

### Group Improvements (TASK-053 to TASK-054)

| Task ID  | Task Name                       | Status     | Dependencies |
| -------- | ------------------------------- | ---------- | ------------ |
| TASK-053 | AddMemberByEmailUseCase         | ⏳ Pending | -            |
| TASK-054 | Invite Member by Email Endpoint | ⏳ Pending | TASK-053     |

[Full Plan](../TASKS_FRONTEND/PLAN_GROUP_IMPROVEMENTS.md)

---

**Reference**: See [SPRINT_PLANNING.md](../SPRINT_PLANNING.md) for complete roadmap
