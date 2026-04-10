# 📐 SKILL: Coding Guidelines

## 📌 Purpose

This SKILL consolidates the coding conventions, naming standards, and architectural patterns for the INVFriend project. All agents must follow these guidelines when writing or reviewing code.

**Primary Sources:**

- [GUIDELINES.md](../../../docs/GUIDELINES.md) - Full conventions document
- [GUIDELINES_DETAILED.md](../../../docs/GUIDELINES_DETAILED.md) - Detailed examples
- [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) - Layer rules

---

## 🏗️ Architecture: Hexagonal (Ports & Adapters)

### Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    ADAPTERS (EXTERNAL)                      │
│  Components/Controllers → HTTP Services → UI/API           │
└───────────────────────────┬─────────────────────────────────┘
                            │ implements
                    ┌───────▼────────┐
                    │     PORTS      │  (Interfaces/Contracts)
                    └───────┬────────┘
                            │ uses
┌───────────────────────────▼─────────────────────────────────┐
│               APPLICATION (Use Cases)                       │
│  CreateGroupUseCase, PerformRaffleUseCase, etc.            │
└───────────────────────────┬─────────────────────────────────┘
                            │ uses
┌───────────────────────────▼─────────────────────────────────┐
│               DOMAIN (Pure Business Logic)                  │
│  Entities: Group, User, Wish, Assignment                    │
│  Errors: GroupNotFoundError, InvalidBudgetError             │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Rules

| Layer           | Can Import                 | Cannot Import                |
| --------------- | -------------------------- | ---------------------------- |
| **Domain**      | Nothing external           | Application, Adapters, Ports |
| **Application** | Domain                     | Adapters                     |
| **Adapters**    | Application, Domain, Ports | -                            |
| **Ports**       | Domain (types only)        | Application, Adapters        |

### Folder Mapping

```
backend/src/
├── domain/          ← Pure business logic, no dependencies
│   ├── entities/
│   └── errors/
├── application/     ← Use cases, services, DTOs
│   ├── use-cases/
│   ├── services/
│   └── dto/
├── adapters/        ← External interfaces
│   ├── http/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   ├── persistence/
│   └── auth/
├── ports/           ← Interface definitions
└── shared/          ← Utilities, constants

frontend/src/app/
├── domain/          ← Entities, interfaces
├── application/     ← Use cases, services
├── adapters/        ← Components, HTTP services
├── ports/           ← Contracts
└── shared/          ← Utilities, guards, interceptors
```

---

## 📝 TypeScript Conventions

### Typing Rules

| Rule                  | Status       | Example                         |
| --------------------- | ------------ | ------------------------------- |
| `any` type            | ❌ Forbidden | Use explicit types or `unknown` |
| Explicit return types | ✅ Required  | `function getName(): string`    |
| Strict mode           | ✅ Enabled   | `"strict": true` in tsconfig    |
| Non-null assertion    | ⚠️ Avoid     | Use type guards instead         |

### Naming Conventions

| Type                | Convention                           | Example                              |
| ------------------- | ------------------------------------ | ------------------------------------ |
| Variables/Functions | `camelCase`                          | `getUserName`, `isValid`             |
| Classes             | `PascalCase`                         | `GroupService`, `CreateGroupUseCase` |
| Interfaces          | `IPascalCase`                        | `IGroupRepository`, `IAuthPort`      |
| Constants           | `UPPER_SNAKE_CASE`                   | `MAX_MEMBERS`, `API_BASE_URL`        |
| Enums               | `PascalCase`                         | `RaffleStatus.Pending`               |
| Booleans            | Prefix: `is`, `has`, `should`, `can` | `isValid`, `hasMembers`              |

### File Naming

| Type             | Pattern                           | Example                      |
| ---------------- | --------------------------------- | ---------------------------- |
| Entities         | `PascalCase.ts`                   | `Group.ts`                   |
| Use Cases        | `PascalCaseUseCase.ts`            | `CreateGroupUseCase.ts`      |
| Repositories     | `FirebasePascalCaseRepository.ts` | `FirebaseGroupRepository.ts` |
| Controllers      | `PascalCaseController.ts`         | `GroupController.ts`         |
| Interfaces/Ports | `IPascalCase.ts`                  | `IGroupRepository.ts`        |
| Components       | `kebab-case.component.ts`         | `group-list.component.ts`    |
| Services         | `kebab-case.service.ts`           | `group-http.service.ts`      |
| Tests            | `*.spec.ts`                       | `Group.spec.ts`              |

---

## 🔷 Backend Patterns (Node.js/Express)

### Entity Pattern

```typescript
// ✅ Private constructor + factory method
export class Group {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly adminId: string,
    public readonly members: string[],
    public readonly budgetLimit: number,
    public readonly raffleStatus: RaffleStatus,
    public readonly createdAt: number,
    public readonly updatedAt: number,
  ) {}

  static create(props: CreateGroupProps): Group {
    // Validation
    if (!props.name?.trim()) {
      throw new InvalidGroupNameError("Name is required");
    }
    if (props.budgetLimit <= 0) {
      throw new InvalidBudgetError("Budget must be positive");
    }

    return new Group(
      generateId(),
      props.name.trim(),
      props.adminId,
      [props.adminId], // Admin is first member
      props.budgetLimit,
      RaffleStatus.Pending,
      Date.now(),
      Date.now(),
    );
  }

  // Domain methods
  isValidForRaffle(): boolean {
    return this.members.length >= 2;
  }
}
```

### Use Case Pattern

```typescript
// ✅ Single responsibility, constructor injection
export class CreateGroupUseCase {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly authPort: IAuthPort,
  ) {}

  async execute(dto: CreateGroupDTO, userId: string): Promise<Group> {
    // 1. Validate input
    this.validateDto(dto);

    // 2. Create domain entity
    const group = Group.create({
      ...dto,
      adminId: userId,
    });

    // 3. Persist
    await this.groupRepository.save(group);

    // 4. Return result
    return group;
  }

  private validateDto(dto: CreateGroupDTO): void {
    // DTO validation logic
  }
}
```

### Controller Pattern

```typescript
// ✅ Thin controller - delegates to use case
export class GroupController {
  constructor(private readonly createGroupUseCase: CreateGroupUseCase) {}

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const dto: CreateGroupDTO = req.body;
    const userId = req.user.uid;

    const group = await this.createGroupUseCase.execute(dto, userId);

    res.status(201).json(group);
  }
}
```

### Repository Pattern

```typescript
// ✅ Implements port interface
export class FirebaseGroupRepository implements IGroupRepository {
  constructor(private readonly db: Firestore) {}

  async save(group: Group): Promise<void> {
    await this.db
      .collection("groups")
      .doc(group.id)
      .set(this.toFirestore(group));
  }

  async findById(id: string): Promise<Group | null> {
    const doc = await this.db.collection("groups").doc(id).get();
    return doc.exists ? this.fromFirestore(doc) : null;
  }

  private toFirestore(group: Group): FirestoreGroup {
    return {
      /* mapping */
    };
  }

  private fromFirestore(doc: DocumentSnapshot): Group {
    return /* mapping */;
  }
}
```

---

## 🅰️ Frontend Patterns (Angular)

### Component Pattern

```typescript
// ✅ OnPush, takeUntil for subscriptions
@Component({
  selector: "app-group-list",
  templateUrl: "./group-list.component.html",
  styleUrls: ["./group-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListComponent implements OnInit, OnDestroy {
  groups$: Observable<Group[]>;
  private destroy$ = new Subject<void>();

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.groups$ = this.groupService.getGroups();

    // For imperative subscriptions
    this.someService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.handleData(data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Service Pattern

```typescript
// ✅ providedIn: 'root' for singletons
@Injectable({ providedIn: "root" })
export class GroupHttpService {
  private readonly apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  createGroup(dto: CreateGroupDTO): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, dto);
  }
}
```

---

## 🔄 Workflow Rules (All Agents)

These rules apply to every agent that writes or reviews code.

### Build Verification

After making changes, verify the build passes:

```bash
# Backend
cd backend && npm run build && npm test

# Frontend
cd frontend && npx ng build --configuration=development
```

For plan closure, verify **production** build:
```bash
cd frontend && npx ng build   # NOT --configuration=development
```

### External Issue Reporting

If you discover a problem **outside your assigned scope**, do NOT fix it. Report it:

```
## Issues detected (outside scope)
- [file path]: [description of the issue] — needs attention from orchestrator
```

The orchestrator will triage and assign the issue.

### Scope Boundaries

- Only modify files directly relevant to your assignment.
- If a change requires modifying a shared file (e.g., `index.ts`, routing), note it in your report.
- Never modify test assertions to make them pass — fix the production code.
- No `console.log()` or debug code in production files.

### SCSS Import Paths

Frontend SCSS files must use **full relative paths**:
```scss
// ✅ Correct
@use '../../../../styles/tokens' as *;
@use '../../../../styles/mixins' as mix;

// ❌ Wrong — will fail at build time
@use "tokens" as *;
@use "mixins" as mix;
```

### Angular Template Null Safety

Inside `*ngIf` guards, TypeScript still considers properties nullable in bindings:
```html
<!-- ✅ Correct -->
<img [src]="item.profile!.photoUrl" />
<span>{{ item.profile?.displayName }}</span>

<!-- ❌ Will cause TS2531 -->
<img [src]="item.profile.photoUrl" />
```

---

## 🧪 Testing Conventions

### Test File Location

| Type                | Location                               |
| ------------------- | -------------------------------------- |
| Backend unit tests  | `src/**/__tests__/*.spec.ts`           |
| Frontend unit tests | Co-located `*.spec.ts` or `__tests__/` |
| Integration tests   | `*.integration.spec.ts`                |

### Test Structure (AAA Pattern)

```typescript
describe("Group", () => {
  describe("create", () => {
    it("should create a group with valid data", () => {
      // Arrange
      const props = { name: "Test", adminId: "user-1", budgetLimit: 50 };

      // Act
      const group = Group.create(props);

      // Assert
      expect(group.name).toBe("Test");
      expect(group.adminId).toBe("user-1");
    });
  });
});
```

### Coverage Requirements

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  }
}
```

---

## 📏 Code Quality Rules

### Forbidden

```typescript
// ❌ Never use any
const data: any = response;

// ❌ No console.log in production
console.log("debug", data);

// ❌ No commented-out code
// const oldImplementation = () => { ... };

// ❌ No magic numbers
if (members.length > 50) {
}
```

### Required

```typescript
// ✅ Explicit types
const data: UserResponse = response;

// ✅ Use constants
const MAX_MEMBERS = 50;
if (members.length > MAX_MEMBERS) { }

// ✅ JSDoc on public methods
/**
 * Creates a new group with the given properties.
 * @param props - The group creation properties
 * @returns The created group entity
 * @throws InvalidGroupNameError if name is empty
 */
static create(props: CreateGroupProps): Group { }
```

---

## 🌐 Localization (i18n)

_Note: INVFriend currently uses hardcoded strings. If i18n is added, follow these patterns:_

```typescript
// Angular i18n pattern
// In templates:
<h1 i18n="Page title|Main heading for group page">Groups</h1>

// In TypeScript:
constructor(private translateService: TranslateService) {}

getMessage(): string {
  return this.translateService.instant('GROUPS.CREATE_SUCCESS');
}
```

---

## ✅ Quick Reference Checklist

Before submitting code, verify:

- [ ] No `any` types
- [ ] No `console.log()` or debug code
- [ ] No commented-out code
- [ ] JSDoc on public methods
- [ ] Correct layer (domain/application/adapters)
- [ ] Dependencies flow inward only
- [ ] File naming follows conventions
- [ ] Tests written and passing
- [ ] Coverage meets 80% threshold
