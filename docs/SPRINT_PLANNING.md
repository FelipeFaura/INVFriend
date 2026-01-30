# 📅 INVFriend - Sprint Planning & Task Roadmap

![Progress](<https://img.shields.io/badge/Progress-12.5%25%20(4%2F32)-blue>)
![Sprint](https://img.shields.io/badge/Sprint-2%20In%20Progress-yellow)
![Completed](https://img.shields.io/badge/Sprint%201-Completed-success)

## 📋 Overview

This document organizes the **INVFriend MVP** development into structured sprints. Each sprint contains well-defined tasks following the [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) format and the [spec-driven development approach](./.github/skill-spec-driven-development.md).

**Project Duration**: 8 Sprints (~16 weeks / 4 months)  
**Sprint Length**: 2 weeks  
**Total Tasks**: 32 tasks  
**Completed**: 4 tasks (TASK-001 to TASK-004) ✅  
**Current Sprint**: Sprint 2 (Auth Frontend)  
**Last Updated**: January 30, 2026

---

## 📊 Current Progress

**For detailed progress metrics, sprint status, and completion rates**, see [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md).

**Quick Status:**

- Current Sprint: Sprint 2 (Auth Frontend)
- Overall Progress: 12.5% (4/32 tasks)
- Next Task: TASK-005 (Auth Domain Models)

---

## 🎯 Sprint Strategy

### Development Order

```
Sprint 1-2: Foundation & Authentication (Backend + Frontend)
Sprint 3-4: Group Management (Backend + Frontend)
Sprint 5-6: Raffle & Assignments (Backend + Frontend)
Sprint 7: Wishes & Notifications (Backend + Frontend)
Sprint 8: Polish, Testing & Deployment
```

### Key Principles

1. **Backend First**: Implement backend services before frontend
2. **Vertical Slices**: Complete features end-to-end (API → UI)
3. **Test Coverage**: Every task includes unit tests (>80% coverage)
4. **Incremental**: Each sprint delivers working, testable functionality
5. **Dependencies**: Respect task dependencies (auth before groups, groups before raffle)

---

## 📊 Sprint Overview Table

| Sprint   | Focus Area                   | Backend Tasks | Frontend Tasks | Total Tasks | Status         |
| -------- | ---------------------------- | ------------- | -------------- | ----------- | -------------- |
| Sprint 1 | Project Setup & Auth Backend | 4             | 0              | 4           | ✅ COMPLETED   |
| Sprint 2 | Auth Frontend & Guards       | 0             | 4              | 4           | 🔄 IN PROGRESS |
| Sprint 3 | Group Management Backend     | 4             | 0              | 4           | ⏸️ PENDING     |
| Sprint 4 | Group Management Frontend    | 0             | 4              | 4           | ⏸️ PENDING     |
| Sprint 5 | Raffle System Backend        | 4             | 0              | 4           | ⏸️ PENDING     |
| Sprint 6 | Raffle System Frontend       | 0             | 4              | 4           | ⏸️ PENDING     |
| Sprint 7 | Wishes & Notifications       | 2             | 2              | 4           | ⏸️ PENDING     |
| Sprint 8 | Integration, Polish & Deploy | 2             | 2              | 4           | ⏸️ PENDING     |

---

## ✅ SPRINT 1: Foundation & Authentication Backend (COMPLETED)

**Status**: ✅ **COMPLETED** on January 30, 2026  
**Goal**: Establish project foundation and implement complete authentication backend  
**Result**: Working auth API with registration, login, Google OAuth, token management

**Tasks Completed:**

- ✅ TASK-001: Project Setup & Configuration (4h)
- ✅ TASK-002: Implement Authentication Backend (6h)
- ✅ TASK-003: Implement Auth Middleware (3h)
- ✅ TASK-004: Implement Auth Controllers & Routes (4h)

**📚 Detailed sprint information**: See [SPRINTS_ARCHIVE.md](./SPRINTS_ARCHIVE.md#sprint-1)

---

## 🔄 SPRINT 2: Authentication Frontend (IN PROGRESS)

**Duration**: Weeks 3-4  
**Status**: 🔄 **IN PROGRESS** (0/4 tasks completed)  
**Started**: January 30, 2026  
**Goal**: Implement complete authentication UI in Angular  
**Deliverables**: Login/register screens, auth guards, user session management

### SPRINT 2 - Task Breakdown

#### 🔄 TASK-005: Implement Auth Domain Models & Errors (Frontend) - READY TO START

**Priority**: HIGH  
**Estimated Effort**: 2 hours  
**Dependencies**: TASK-004 (✅ Completed)  
**Status**: 🔄 READY TO START

**Description**:
Create domain models and error classes for frontend authentication.

**Files to Create**:

- `frontend/src/app/domain/models/user.model.ts`
- `frontend/src/app/domain/errors/auth-errors.ts`
- `frontend/src/app/application/dto/auth.dto.ts`

**Requirements**:

- [ ] User model matches backend structure
- [ ] Error classes for common auth failures
- [ ] DTOs for login, register, Google login

**Reference**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Data Models

---

#### ⏸️ TASK-006: Implement Auth HTTP Service (Frontend)

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-005  
**Status**: ⏸️ PENDING (Waiting for TASK-005)

**Description**:
Create HTTP service to communicate with backend auth API.

**Files to Create**:

- `frontend/src/app/adapters/services/auth-http.service.ts`
- `frontend/src/app/adapters/services/__tests__/auth-http.service.spec.ts`
- `frontend/src/app/application/services/auth-application.service.ts`

**Requirements**:

- [ ] All API calls typed with RxJS Observables
- [ ] Error handling with catchError
- [ ] Token storage in localStorage
- [ ] Automatic token refresh on 401
- [ ] HTTP interceptor for adding Authorization header

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Angular Services

---

#### ⏸️ TASK-007: Implement Login & Register Components

**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-006  
**Status**: ⏸️ PENDING (Waiting for TASK-006)

**Description**:
Create login and registration UI components.

**Files to Create**:

- `frontend/src/app/adapters/components/login/login.component.ts`
- `frontend/src/app/adapters/components/login/login.component.html`
- `frontend/src/app/adapters/components/login/login.component.scss`
- `frontend/src/app/adapters/components/register/register.component.ts`
- `frontend/src/app/adapters/components/register/register.component.html`
- `frontend/src/app/adapters/components/register/register.component.scss`
- Component tests for both

**Features**:

- [ ] Email/password login form with validation
- [ ] Email/password register form with validation
- [ ] Google Sign-In button
- [ ] Loading states during API calls
- [ ] Error messages display
- [ ] Redirect to home on success
- [ ] Reactive Forms with validators

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Angular Components

---

#### ⏸️ TASK-008: Implement Auth Guards & Routing

**Priority**: HIGH  
**Estimated Effort**: 3 hours  
**Dependencies**: TASK-007  
**Status**: ⏸️ PENDING (Waiting for TASK-007)

**Description**:
Create route guards to protect authenticated routes.

**Files to Create**:

- `frontend/src/app/adapters/guards/auth.guard.ts`
- `frontend/src/app/adapters/guards/admin.guard.ts`
- `frontend/src/app/adapters/guards/__tests__/auth.guard.spec.ts`
- Update `app-routing.module.ts`

**Requirements**:

- [ ] AuthGuard: Redirect to /login if not authenticated
- [ ] AdminGuard: Verify user is group admin
- [ ] Protect routes: /groups, /profile
- [ ] Public routes: /login, /register, /

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Angular Guards

---

## 🏢 SPRINT 3: Group Management Backend

**Duration**: Weeks 5-6  
**Goal**: Implement complete group CRUD operations backend  
**Deliverables**: Group creation, members management, admin controls

### SPRINT 3 - Task Breakdown

#### TASK-009: Implement Group Entity & Domain Logic

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-002

**Description**:
Create Group domain entity with business rules.

**Files to Create**:

- `backend/src/domain/entities/Group.ts`
- `backend/src/domain/entities/__tests__/Group.spec.ts`
- `backend/src/domain/errors/GroupErrors.ts`

**Business Rules**:

- [ ] Group name: 3-100 characters
- [ ] Budget limit: > 0
- [ ] Admin automatically added as member
- [ ] Minimum 2 members for raffle
- [ ] RaffleStatus: 'pending' | 'completed'

**Reference**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Group Model

---

#### TASK-010: Implement Group Repository & Port

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-009

**Description**:
Create repository interface and Firebase implementation for groups.

**Files to Create**:

- `backend/src/ports/IGroupRepository.ts`
- `backend/src/adapters/persistence/FirebaseGroupRepository.ts`
- `backend/src/adapters/persistence/__tests__/FirebaseGroupRepository.spec.ts`

**Methods**:

```typescript
interface IGroupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  findByMemberId(userId: string): Promise<Group[]>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
}
```

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Dependency Injection

---

#### TASK-011: Implement Group Use Cases

**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-010

**Description**:
Implement business logic for group operations.

**Files to Create**:

- `backend/src/application/use-cases/CreateGroupUseCase.ts`
- `backend/src/application/use-cases/GetGroupDetailsUseCase.ts`
- `backend/src/application/use-cases/AddMemberToGroupUseCase.ts`
- `backend/src/application/use-cases/RemoveMemberFromGroupUseCase.ts`
- `backend/src/application/use-cases/DeleteGroupUseCase.ts`
- `backend/src/application/dto/GroupDTOs.ts`
- Tests for all use cases

**Validations**:

- [ ] Only admin can delete group
- [ ] Only admin can remove members
- [ ] Cannot remove admin from group
- [ ] Cannot delete group after raffle completed

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Use Cases

---

#### TASK-012: Implement Group Controller & Routes

**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Dependencies**: TASK-011

**Description**:
Create REST API endpoints for group management.

**Files to Create**:

- `backend/src/adapters/http/controllers/GroupController.ts`
- `backend/src/adapters/http/controllers/__tests__/GroupController.spec.ts`

**Endpoints**:

```
POST   /groups                 - Create new group (authenticated)
GET    /groups                 - List user's groups (authenticated)
GET    /groups/:id             - Get group details (authenticated, member only)
PUT    /groups/:id             - Update group (authenticated, admin only)
DELETE /groups/:id             - Delete group (authenticated, admin only)
POST   /groups/:id/members     - Add member (authenticated, admin only)
DELETE /groups/:id/members/:userId - Remove member (authenticated, admin only)
```

**Reference**: [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) - Flow 1

---

## 🎨 SPRINT 4: Group Management Frontend

**Duration**: Weeks 7-8  
**Goal**: Implement complete group management UI  
**Deliverables**: Group creation, list, details, member management

### SPRINT 4 - Task Breakdown

#### TASK-013: Implement Group Models & HTTP Service

**Priority**: HIGH  
**Estimated Effort**: 3 hours  
**Dependencies**: TASK-012

**Description**:
Create domain models and HTTP service for groups.

**Files to Create**:

- `frontend/src/app/domain/models/group.model.ts`
- `frontend/src/app/adapters/services/group-http.service.ts`
- `frontend/src/app/adapters/services/__tests__/group-http.service.spec.ts`

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Angular Services

---

#### TASK-014: Implement Group List Component

**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Dependencies**: TASK-013

**Description**:
Display list of user's groups with search/filter.

**Files to Create**:

- `frontend/src/app/adapters/components/group-list/group-list.component.ts`
- `frontend/src/app/adapters/components/group-list/group-list.component.html`
- `frontend/src/app/adapters/components/group-list/group-list.component.scss`
- Component tests

**Features**:

- [ ] Display all user groups (admin + member)
- [ ] Search by group name
- [ ] Filter by status (pending/completed)
- [ ] Click to view details
- [ ] "Create New Group" button
- [ ] Empty state when no groups

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - RxJS

---

#### TASK-015: Implement Create Group Component

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-013

**Description**:
Form to create new groups.

**Files to Create**:

- `frontend/src/app/adapters/components/group-create/group-create.component.ts`
- `frontend/src/app/adapters/components/group-create/group-create.component.html`
- `frontend/src/app/adapters/components/group-create/group-create.component.scss`
- Component tests

**Features**:

- [ ] Reactive form with validators
- [ ] Fields: name, description (optional), budget limit
- [ ] Real-time validation feedback
- [ ] Success message on creation
- [ ] Redirect to group details after creation

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Angular Components

---

#### TASK-016: Implement Group Detail Component

**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-014

**Description**:
Display group details and manage members.

**Files to Create**:

- `frontend/src/app/adapters/components/group-detail/group-detail.component.ts`
- `frontend/src/app/adapters/components/group-detail/group-detail.component.html`
- `frontend/src/app/adapters/components/group-detail/group-detail.component.scss`
- Component tests

**Features**:

- [ ] Display group info (name, budget, admin, status)
- [ ] Member list with roles
- [ ] Admin controls: Add/remove members, delete group
- [ ] Conditional UI based on user role (admin vs member)
- [ ] Confirmation dialogs for destructive actions

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Change Detection

---

## 🎲 SPRINT 5: Raffle System Backend

**Duration**: Weeks 9-10  
**Goal**: Implement Secret Santa raffle algorithm and assignments  
**Deliverables**: Fair raffle logic, assignment storage, result retrieval

### SPRINT 5 - Task Breakdown

#### TASK-017: Implement Assignment Entity & Repository

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-010

**Description**:
Create Assignment entity and persistence layer.

**Files to Create**:

- `backend/src/domain/entities/Assignment.ts`
- `backend/src/domain/entities/__tests__/Assignment.spec.ts`
- `backend/src/ports/IAssignmentRepository.ts`
- `backend/src/adapters/persistence/FirebaseAssignmentRepository.ts`
- Tests

**Model**:

```typescript
{
  id: string;
  groupId: string;
  userId: string; // Who receives the gift
  secretSantaId: string; // Who gives the gift
  createdAt: number;
}
```

**Reference**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Assignment Model

---

#### TASK-018: Implement Raffle Algorithm

**Priority**: CRITICAL  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-017

**Description**:
Implement fair Secret Santa assignment algorithm.

**Files to Create**:

- `backend/src/shared/utils/raffleAlgorithm.ts`
- `backend/src/shared/utils/__tests__/raffleAlgorithm.spec.ts`

**Requirements**:

- [ ] Each person gets exactly 1 secret santa
- [ ] Each person is secret santa for exactly 1 person
- [ ] No one is their own secret santa
- [ ] Randomized but deterministic (testable)
- [ ] Handle edge cases (2 members minimum)

**Algorithm**: Fisher-Yates shuffle with validation

**Reference**: [GUIDELINES.md](./GUIDELINES.md) - Best Practices

---

#### TASK-019: Implement Perform Raffle Use Case

**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Dependencies**: TASK-018

**Description**:
Business logic to execute raffle for a group.

**Files to Create**:

- `backend/src/application/use-cases/PerformRaffleUseCase.ts`
- `backend/src/application/use-cases/__tests__/PerformRaffleUseCase.spec.ts`

**Business Rules**:

- [ ] Only admin can perform raffle
- [ ] Minimum 2 members required
- [ ] Cannot raffle if already completed
- [ ] Update group status to 'completed'
- [ ] Set raffleDate timestamp
- [ ] Store all assignments atomically

**Reference**: [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) - Flow 3

---

#### TASK-020: Implement Raffle Controller & Routes

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-019

**Description**:
API endpoints for raffle operations.

**Files to Create**:

- `backend/src/adapters/http/controllers/RaffleController.ts`
- `backend/src/adapters/http/controllers/__tests__/RaffleController.spec.ts`

**Endpoints**:

```
POST   /groups/:id/raffle      - Perform raffle (admin only)
GET    /groups/:id/my-assignment - Get my secret santa (member, after raffle)
```

**Reference**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Security

---

## 🎨 SPRINT 6: Raffle System Frontend

**Duration**: Weeks 11-12  
**Goal**: Implement raffle UI and secret santa reveal  
**Deliverables**: Raffle trigger, assignment display, secret santa view

### SPRINT 6 - Task Breakdown

#### TASK-021: Implement Assignment Models & HTTP Service

**Priority**: HIGH  
**Estimated Effort**: 2 hours  
**Dependencies**: TASK-020

**Description**:
Create frontend models for assignments.

**Files to Create**:

- `frontend/src/app/domain/models/assignment.model.ts`
- `frontend/src/app/adapters/services/raffle-http.service.ts`
- Tests

---

#### TASK-022: Implement Raffle Trigger Component

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-021

**Description**:
Admin UI to perform raffle.

**Files to Create**:

- `frontend/src/app/adapters/components/raffle-trigger/raffle-trigger.component.ts`
- Component HTML/SCSS and tests

**Features**:

- [ ] Display member count
- [ ] Validate minimum members
- [ ] "Perform Raffle" button (admin only)
- [ ] Confirmation dialog with warning
- [ ] Loading state during raffle
- [ ] Success animation on completion

---

#### TASK-023: Implement Secret Santa Reveal Component

**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Dependencies**: TASK-022

**Description**:
Display assigned secret santa information.

**Files to Create**:

- `frontend/src/app/adapters/components/secret-santa-reveal/secret-santa-reveal.component.ts`
- Component HTML/SCSS and tests

**Features**:

- [ ] Show only after raffle completed
- [ ] Display secret santa (anonymous, no name initially)
- [ ] Show secret santa's wishes
- [ ] Option to reveal identity (with confirmation)
- [ ] Budget reminder

**Reference**: [ARCHITECTURE_QUICK_REF.md](./ARCHITECTURE_QUICK_REF.md) - Flow 4

---

#### TASK-024: Implement Group Status Indicator

**Priority**: MEDIUM  
**Estimated Effort**: 3 hours  
**Dependencies**: TASK-023

**Description**:
Visual indicator of group raffle status.

**Files to Create**:

- `frontend/src/app/adapters/components/group-status/group-status.component.ts`
- Component HTML/SCSS and tests

**Features**:

- [ ] Badge: "Pending Raffle" / "Raffle Completed"
- [ ] Progress indicator (members count vs minimum)
- [ ] Date of raffle completion

---

## 🎁 SPRINT 7: Wishes & Notifications

**Duration**: Weeks 13-14  
**Goal**: Implement wish lists and notification system  
**Deliverables**: Create/edit wishes, notification triggers

### SPRINT 7 - Task Breakdown

#### TASK-025: Implement Wish Backend (Entity, Repository, Use Cases)

**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-011

**Description**:
Complete backend for wish management.

**Files to Create**:

- `backend/src/domain/entities/Wish.ts` + tests
- `backend/src/ports/IWishRepository.ts`
- `backend/src/adapters/persistence/FirebaseWishRepository.ts` + tests
- `backend/src/application/use-cases/AddWishUseCase.ts` + tests
- `backend/src/application/use-cases/UpdateWishUseCase.ts` + tests
- `backend/src/application/use-cases/DeleteWishUseCase.ts` + tests
- `backend/src/application/use-cases/GetSecretSantaWishesUseCase.ts` + tests

**Reference**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Wish Model

---

#### TASK-026: Implement Wish Controller & Routes

**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-025

**Description**:
API endpoints for wishes.

**Files to Create**:

- `backend/src/adapters/http/controllers/WishController.ts`
- Controller tests

**Endpoints**:

```
POST   /groups/:groupId/wishes           - Add wish
GET    /groups/:groupId/wishes           - Get my wishes
GET    /groups/:groupId/secret-santa-wishes - Get secret santa's wishes
PUT    /wishes/:id                       - Update wish
DELETE /wishes/:id                       - Delete wish
```

---

#### TASK-027: Implement Wish List Component (Frontend)

**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-026

**Description**:
UI to manage personal wishes and view secret santa wishes.

**Files to Create**:

- `frontend/src/app/adapters/components/wish-list/wish-list.component.ts`
- Component HTML/SCSS and tests

**Features**:

- [ ] Display user's wishes
- [ ] Add/edit/delete wish inline
- [ ] Fields: title, description, URL, estimated price
- [ ] View secret santa's wishes (read-only)
- [ ] Empty state

---

#### TASK-028: Implement Basic Notification System

**Priority**: MEDIUM  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-020, TASK-026

**Description**:
Simple notification storage and display.

**Files to Create**:

- `backend/src/domain/entities/Notification.ts`
- `backend/src/ports/INotificationPort.ts`
- `backend/src/adapters/persistence/FirebaseNotificationRepository.ts`
- `frontend/src/app/adapters/components/notifications/notifications.component.ts`

**Triggers**:

- [ ] User invited to group
- [ ] Raffle completed
- [ ] Secret santa added wish

**Scope**:

- ✅ In-app notifications only (MVP)
- ❌ Email notifications (future)
- ❌ Push notifications (future)

---

## 🚢 SPRINT 8: Integration, Testing & Deployment

**Duration**: Weeks 15-16  
**Goal**: End-to-end testing, bug fixes, deployment  
**Deliverables**: Production-ready application

### SPRINT 8 - Task Breakdown

#### TASK-029: Integration Testing

**Priority**: HIGH  
**Estimated Effort**: 6 hours  
**Dependencies**: All previous tasks

**Description**:
Create end-to-end integration tests for critical flows.

**Files to Create**:

- `backend/__tests__/integration/auth.integration.spec.ts`
- `backend/__tests__/integration/group.integration.spec.ts`
- `backend/__tests__/integration/raffle.integration.spec.ts`

**Test Flows**:

- [ ] Complete auth flow (register → login → protected route)
- [ ] Complete group flow (create → add members → raffle)
- [ ] Complete wish flow (add → view as secret santa)

**Reference**: [skill-unit-testing.md](../.github/skill-unit-testing.md)

---

#### TASK-030: Code Quality & Documentation Review

**Priority**: MEDIUM  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-029

**Description**:
Final code quality checks and documentation updates.

**Checklist**:

- [ ] All tests passing (>80% coverage)
- [ ] No linting errors
- [ ] All public APIs have JSDoc
- [ ] Update ARCHITECTURE.md with final state
- [ ] Update README.md with deployment instructions
- [ ] Create API documentation (Swagger/OpenAPI)

---

#### TASK-031: Firebase Deployment Setup

**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Dependencies**: TASK-030

**Description**:
Configure production deployment.

**Tasks**:

- [ ] Configure Firebase Hosting for frontend
- [ ] Deploy backend to Cloud Functions or Cloud Run
- [ ] Set up production environment variables
- [ ] Configure Firestore security rules
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Create deployment scripts

**Reference**: [ARCHITECTURE.md](./ARCHITECTURE.md) - Deployment

---

#### TASK-032: User Acceptance Testing & Bug Fixes

**Priority**: HIGH  
**Estimated Effort**: 5 hours  
**Dependencies**: TASK-031

**Description**:
Final testing and bug triage.

**Activities**:

- [ ] Manual testing of all features
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing
- [ ] Fix critical and high-priority bugs
- [ ] Performance optimization
- [ ] Security audit

---

## 📊 Task Dependency Graph

```
SPRINT 1 (Backend Foundation)
├─ TASK-001 (Setup)
   └─ TASK-002 (Auth Backend)
      ├─ TASK-003 (Middleware)
      └─ TASK-004 (Auth API)

SPRINT 2 (Frontend Auth)
└─ TASK-005 (Models)
   └─ TASK-006 (HTTP Service)
      └─ TASK-007 (Login/Register UI)
         └─ TASK-008 (Guards)

SPRINT 3 (Group Backend)
└─ TASK-009 (Group Entity)
   └─ TASK-010 (Repository)
      └─ TASK-011 (Use Cases)
         └─ TASK-012 (API)

SPRINT 4 (Group Frontend)
└─ TASK-013 (Models/Service)
   ├─ TASK-014 (List)
   ├─ TASK-015 (Create)
   └─ TASK-016 (Detail)

SPRINT 5 (Raffle Backend)
└─ TASK-017 (Assignment Entity)
   └─ TASK-018 (Algorithm)
      └─ TASK-019 (Use Case)
         └─ TASK-020 (API)

SPRINT 6 (Raffle Frontend)
└─ TASK-021 (Models/Service)
   └─ TASK-022 (Trigger)
      └─ TASK-023 (Reveal)
         └─ TASK-024 (Status)

SPRINT 7 (Wishes)
├─ TASK-025 (Backend)
│  └─ TASK-026 (API)
│     └─ TASK-027 (Frontend)
└─ TASK-028 (Notifications)

SPRINT 8 (Launch)
└─ TASK-029 (Integration Tests)
   └─ TASK-030 (Quality Review)
      └─ TASK-031 (Deployment)
         └─ TASK-032 (UAT)
```

---

## 🎯 Sprint Ceremonies

### Daily (Async for AI)

- **Stand-up**: Progress update, blockers
- **Code Review**: All PRs reviewed within 24h

### Every Sprint

- **Sprint Planning** (Day 1): Review tasks, assign priorities
- **Mid-Sprint Check** (Day 5): Progress review, adjust scope if needed
- **Sprint Review** (Day 9): Demo completed features
- **Sprint Retrospective** (Day 10): What went well, what to improve

---

## 📋 Task Template Reference

Each task in this plan should be expanded using [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) with:

```markdown
# TASK-XXX: [Task Name]

## 📝 Description

[Detailed description]

## 📍 Location

[Exact file paths]

## 🏗️ Model/Reference

[Interfaces, examples]

## 🎯 Specific Requirements

- [ ] Requirement 1
- [ ] Requirement 2

## 🚫 Scope / Limits

❌ What NOT to do

## ✅ Acceptance / Checklist

- [ ] Tests passing
- [ ] Coverage >80%
- [ ] Follows GUIDELINES.md
```

**Example**: See [TASKS_BACKEND/TASK_001_AUTH_SERVICE.md](./TASKS_BACKEND/TASK_001_AUTH_SERVICE.md)

---

## 📈 Success Metrics

### Sprint-Level Metrics

**Sprint 1** ✅ COMPLETED:

- [x] All planned tasks completed (4/4)
- [x] Backend authentication system fully implemented
- [x] Tests included with adapters
- [x] All acceptance criteria met
- [x] Code follows GUIDELINES.md conventions

**Sprint 2** 🔄 IN PROGRESS:

- [ ] All planned tasks completed (0/4)
- [ ] Test coverage >80%
- [ ] Zero critical bugs
- [ ] All acceptance criteria met

### Project-Level Metrics (End of Sprint 8)

**Current Progress**: 12.5% (4/32 tasks completed)

- [ ] All 6 main flows working end-to-end
- [x] Backend authentication complete (Sprint 1) ✅
- [ ] Frontend authentication complete (Sprint 2)
- [ ] Group management complete (Sprint 3-4)
- [ ] Raffle system complete (Sprint 5-6)
- [ ] Backend test coverage >85%
- [ ] Frontend test coverage >80%
- [ ] App deployed and accessible
- [ ] Documentation complete and up-to-date

---

## 🚀 Next Steps

**Current Status**: Sprint 1 ✅ Complete → Sprint 2 🔄 In Progress

1. **Next Task: TASK-005**: Implement Auth Domain Models & Errors (Frontend)
   - Create TypeScript models matching backend User entity
   - Define error classes for authentication failures
   - Create DTOs for auth operations
   - Estimated: 2 hours
2. **Follow spec-driven development**: Use [skill-spec-driven-development.md](../.github/skill-spec-driven-development.md)

3. **Create detailed task specs**: Expand each task using [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)

4. **Track progress**: Update this document as tasks complete

5. **Adapt as needed**: Adjust scope based on actual velocity

### Recent Achievements 🎉

- ✅ Complete backend authentication system with Firebase
- ✅ JWT token generation and validation
- ✅ User entity with domain logic
- ✅ Auth middleware for protected routes
- ✅ Comprehensive test coverage for auth adapters
- ✅ All code following project conventions

---

## 📚 References

| Document              | Purpose             | Link                                                                            |
| --------------------- | ------------------- | ------------------------------------------------------------------------------- |
| Spec-Driven Dev SKILL | Development process | [skill-spec-driven-development.md](../.github/skill-spec-driven-development.md) |
| Unit Testing SKILL    | Testing standards   | [skill-unit-testing.md](../.github/skill-unit-testing.md)                       |
| Task Template         | Task structure      | [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)                                          |
| Architecture          | System design       | [ARCHITECTURE.md](./ARCHITECTURE.md)                                            |
| Guidelines            | Code conventions    | [GUIDELINES.md](./GUIDELINES.md)                                                |

---

## 📝 Changelog

### January 30, 2026

- ✅ **Sprint 1 COMPLETED**: All 4 tasks finished
  - TASK-001: Project Setup & Configuration
  - TASK-002: Authentication Backend Implementation
  - TASK-003: Auth Middleware
  - TASK-004: Auth Controllers & Routes
- 🔄 **Sprint 2 STARTED**: Ready to begin frontend authentication
- 📊 **Progress**: 12.5% overall (4/32 tasks)
- 💾 **Commit**: `2f8de2d` - "001 Auth Service backend"
- 📈 **Achievement**: Complete backend authentication system with Firebase, JWT tokens, middleware, and comprehensive tests

---

**Version**: 1.1.0  
**Created**: January 30, 2026  
**Last Updated**: January 30, 2026 (Sprint 1 Completed)  
**Next Review**: After Sprint 2 completion  
**Maintained By**: INVFriend Team

---

## 🎉 Remember

> "A sprint well planned is half done. Break down complexity, deliver incrementally, test thoroughly."

Good luck with your Secret Santa app! 🎅🎁
