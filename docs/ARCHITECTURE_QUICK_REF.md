# 🏗️ INVFriend - Architecture Quick Reference

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    🖥️  ANGULAR (Frontend)                   │
│                      Port 4200                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Componentes → Services → Use Cases → HTTP Services │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTP REST API
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  🟢 NODE/EXPRESS (Backend)                  │
│                      Port 3000                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Routes → Controllers → Use Cases → Repositories    │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ Firebase SDK
                             │
┌────────────────────────────▼────────────────────────────────┐
│           🔥 FIREBASE (Cloud + Authentication)             │
│  ┌──────────────────┬──────────────┬────────────────┐     │
│  │ Realtime DB      │ Auth         │ Cloud Functions│     │
│  │ (Data)           │ (Users)      │ (Logic)        │     │
│  └──────────────────┴──────────────┴────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Hexagonal Layers

### **Frontend (Angular)**

```
┌─ ADAPTERS (Presentation)
│  └─ Components: LoginComponent, GroupListComponent, etc
│  └─ HTTP Services: GroupHttpService, AuthHttpService
│  └─ Guards: AuthGuard, AdminGuard
│
├─ PORTS (Interfaces)
│  └─ IGroupRepository
│  └─ IGroupHttpPort
│
├─ APPLICATION (Logic)
│  └─ Use Cases: CreateGroupUseCase, GetSecretSantaUseCase
│  └─ Services: GroupApplicationService
│  └─ DTOs: CreateGroupDTO
│
├─ DOMAIN (Models)
│  └─ Models: Group, User, Wish
│  └─ Errors: GroupNotFoundError
│
└─ SHARED (Utilities)
   └─ Pipes, Directives, Utils, Constants
```

### **Backend (Node.js)**

```
┌─ ADAPTERS
│  └─ HTTP: Controllers, Middleware (Express)
│  └─ Auth: FirebaseAuthAdapter
│  └─ Persistence: Firebase Repository Implementations
│
├─ PORTS (Interfaces)
│  └─ IGroupRepository
│  └─ IUserRepository
│  └─ IAuthPort
│  └─ INotificationPort
│
├─ APPLICATION (Logic)
│  └─ Use Cases: CreateGroupUseCase, PerformRaffleUseCase
│  └─ Services: GroupApplicationService
│  └─ DTOs: CreateGroupDTO, RaffleResultDTO
│
├─ DOMAIN (Pure Logic)
│  └─ Entities: Group, User, Wish, Assignment, Notification
│  └─ Errors: DomainError, InvalidBudgetError, GroupNotFoundError
│
└─ SHARED
   └─ Utils: Logger, Randomizer
   └─ Constants: AppConstants
   └─ Types: Shared types
```

---

## 🔄 Main Flows

**📖 For detailed flow descriptions**, see [ARCHITECTURE.md](./ARCHITECTURE.md#main-flows)

```
1️⃣ Create Group
  Component → GroupAppService → HTTP → Controller → UseCase → Repository → DB

2️⃣ Perform Raffle
  Admin → RaffleController → UseCase → Validate → Generate → Save → Notify

3️⃣ View Secret Santa
  User → GetSecretSantaUseCase → HTTP → Controller → GetAssignment → GetWishes → Display
```

---

## 📦 Key Files

### Backend

```
backend/src/
├── domain/entities/Group.ts         ⭐ Main entity
├── application/use-cases/           ⭐ Business logic
│   ├── CreateGroupUseCase.ts
│   ├── PerformRaffleUseCase.ts
│   └── AddWishUseCase.ts
├── adapters/persistence/            ⭐ DB
│   └── FirebaseGroupRepository.ts
└── adapters/http/controllers/       ⭐ API
    ├── GroupController.ts
    └── RaffleController.ts
```

### Frontend

```
frontend/src/app/
├── domain/models/group.model.ts     ⭐ Models
├── application/use-cases/           ⭐ Logic
├── adapters/components/             ⭐ UI
│   ├── group-list/
│   ├── group-detail/
│   └── wish-list/
└── adapters/services/               ⭐ HTTP
    ├── group-http.service.ts
    └── auth-http.service.ts
```

---

## 🔐 Security - Who Sees What

```
USER A (Admin)
├─ Can view: all members, create raffle, delete group
└─ CANNOT: see others' wishes until raffle

USER B (Member)
├─ Can view: group member list
└─ After raffle:
   ├─ Can view: their secret santa (anonymous) and their wishes
   └─ CANNOT view: others' secret santas

SYSTEM
└─ Verifies Firebase Rules before returning data
```

---

## 🎯 Layer Validations

```
┌─────────────────────────────────┐
│ LAYER 1: Frontend (Angular)     │
│ - UX validation (fields)        │
│ - DTO validation before sending │
└──────────────┬──────────────────┘
               │ HTTP
┌──────────────▼──────────────────┐
│ LAYER 2: Backend HTTP (Express) │
│ - Authentication                │
│ - Authorization (is admin?)     │
│ - DTO validation                │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ LAYER 3: Use Case               │
│ - Business logic                │
│ - Domain rules                  │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ LAYER 4: Entity (Domain)        │
│ - Invariant validations         │
│ - Valid state                   │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ LAYER 5: Firebase Rules         │
│ - Data-level security           │
│ - Who can see what              │
└─────────────────────────────────┘
```

---

## 📋 Development Checklist

When implementing a new feature:

```
☐ Read ARCHITECTURE.md for your feature
☐ Identify which layers need to be touched
☐ Start with Domain (entities)
☐ Then Application (use cases)
☐ Then Adapters (controllers, services)
☐ Tests in each layer
☐ Respect interfaces (ports)
☐ Update documentation if architecture changes
```

---

## 🚀 Example: Add New Feature

Suppose: "Change group name"

**1. Domain (Entity)**

```typescript
// backend/src/domain/entities/Group.ts
class Group {
  changeName(newName: string): void {
    if (!newName?.trim()) throw new InvalidNameError();
    this.name = newName;
    this.updatedAt = Date.now();
  }
}
```

**2. Application (Logic)**

```typescript
// backend/src/application/use-cases/ChangeGroupNameUseCase.ts
class ChangeGroupNameUseCase {
  execute(groupId: string, newName: string): Promise<void> {
    const group = await this.repository.findById(groupId);
    group.changeName(newName); // Uses entity method
    await this.repository.update(group);
  }
}
```

**3. Adapter (HTTP)**

```typescript
// backend/src/adapters/http/controllers/GroupController.ts
@Put('/groups/:id/name')
async changeGroupName(req, res) {
  const result = await this.useCase.execute(
    req.params.id,
    req.body.name
  );
  res.json(result);
}
```

**4. Frontend (UI)**

```typescript
// frontend/src/app/adapters/components/group-detail/group-detail.component.ts
onChangeName(newName: string) {
  this.groupService.changeGroupName(this.groupId, newName)
    .subscribe(/* ... */);
}
```

**5. Tests**

```
backend/src/domain/entities/__tests__/Group.spec.ts
backend/src/application/use-cases/__tests__/ChangeGroupNameUseCase.spec.ts
frontend/src/app/adapters/components/__tests__/group-detail.spec.ts
```

---

## 📞 Main Interfaces Reference

```typescript
// Repository Ports (Backend)
interface IGroupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
}

// Service Ports (Backend)
interface INotificationPort {
  sendRaffleCompleted(userId: string, groupId: string): Promise<void>;
  sendWishAdded(userId: string, groupId: string): Promise<void>;
}

// DTOs (Both)
interface CreateGroupDTO {
  name: string;
  budgetLimit: number;
  adminId: string;
}
```

---

**This is your reference sheet. When in doubt: READ → ARCHITECTURE.md**

_Last updated: January 2026_
