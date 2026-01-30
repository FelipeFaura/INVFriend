# 📋 Frontend Tasks Tracker

This folder contains detailed task specifications for frontend (Angular) development following the [TASK_TEMPLATE.md](../TASK_TEMPLATE.md) format.

**📊 Current Status**: See [PROJECT_PROGRESS.md](../PROJECT_PROGRESS.md) for live dashboard and metrics.

## 🔄 In Progress Tasks

### Sprint 2: Authentication Frontend

| Task ID  | Task Name                             | Status            | Dependencies | Estimated |
| -------- | ------------------------------------- | ----------------- | ------------ | --------- |
| TASK-005 | Implement Auth Domain Models & Errors | 🔄 READY TO START | TASK-004 ✅  | 2 hours   |
| TASK-006 | Implement Auth HTTP Service           | ⏸️ PENDING        | TASK-005     | 4 hours   |
| TASK-007 | Implement Login & Register Components | ⏸️ PENDING        | TASK-006     | 6 hours   |
| TASK-008 | Implement Auth Guards & Routing       | ⏸️ PENDING        | TASK-007     | 3 hours   |

**Expected Files**:

- `frontend/src/app/domain/models/user.model.ts`
- `frontend/src/app/domain/errors/auth-errors.ts`
- `frontend/src/app/application/dto/auth.dto.ts`
- `frontend/src/app/adapters/services/auth-http.service.ts`
- `frontend/src/app/adapters/components/login/login.component.ts`
- `frontend/src/app/adapters/components/register/register.component.ts`
- `frontend/src/app/adapters/guards/auth.guard.ts`
- `frontend/src/app/adapters/guards/admin.guard.ts`

## 📝 Next Task Details

### TASK-005: Implement Auth Domain Models & Errors (Frontend)

**What to implement**:

1. Create `User` model matching backend structure
2. Define error classes for common auth failures
3. Create DTOs for:
   - Login (email, password)
   - Register (email, password, name)
   - Google login (googleToken)
   - Auth response (user, accessToken, expiresIn)

**Files to create**:

```typescript
// frontend/src/app/domain/models/user.model.ts
export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

// frontend/src/app/domain/errors/auth-errors.ts
export class AuthError extends Error {}
export class InvalidCredentialsError extends AuthError {}
export class UserAlreadyExistsError extends AuthError {}

// frontend/src/app/application/dto/auth.dto.ts
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn?: number;
}
```

**Reference Backend Implementation**:

- See `backend/src/domain/entities/User.ts`
- See `backend/src/domain/errors/AuthErrors.ts`
- See `backend/src/shared/types/AuthTypes.ts`

## 🔮 Upcoming Tasks (Sprint 4)

### Sprint 4: Group Management Frontend

| Task ID  | Task Name                             | Status     | Dependencies |
| -------- | ------------------------------------- | ---------- | ------------ |
| TASK-013 | Implement Group Models & HTTP Service | ⏸️ PENDING | TASK-012     |
| TASK-014 | Implement Group List Component        | ⏸️ PENDING | TASK-013     |
| TASK-015 | Implement Create Group Component      | ⏸️ PENDING | TASK-013     |
| TASK-016 | Implement Group Detail Component      | ⏸️ PENDING | TASK-014     |

## 📊 Statistics

**📈 For complete statistics and velocity metrics**, see [PROJECT_PROGRESS.md](../PROJECT_PROGRESS.md).

- **Total Frontend Tasks**: 16
- **Ready to Start**: 1 (TASK-005)
- **Pending**: 15

---

**Reference**: See [SPRINT_PLANNING.md](../SPRINT_PLANNING.md) for complete roadmap
