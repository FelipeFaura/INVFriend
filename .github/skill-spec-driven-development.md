# 🎯 SKILL: Spec-Driven Development

## 📌 Purpose

This SKILL defines the **comprehensive development process** for implementing features in the INVFriend project. It establishes a systematic approach to ensure consistency, maintainability, and alignment with the project's hexagonal architecture.

When you (AI) receive a task, follow this SKILL to guarantee high-quality, well-structured implementations that integrate seamlessly with the existing codebase.

---

## 🗺️ Before Starting: Context & References

### Core Documentation

Before implementing **any** feature, you MUST review these documents:

- **[ARCHITECTURE.md](../docs/ARCHITECTURE.md)**: Technical design, data models, hexagonal architecture layers
- **[ARCHITECTURE_QUICK_REF.md](../docs/ARCHITECTURE_QUICK_REF.md)**: Visual diagrams, flow examples, quick reference
- **[GUIDELINES.md](../docs/GUIDELINES.md)**: Code conventions, naming standards, best practices
- **[TASK_TEMPLATE.md](../docs/TASK_TEMPLATE.md)**: Task structure and scope definition
- **[INDEX.md](../docs/INDEX.md)**: Navigation guide for all documentation

### Project Context

**INVFriend** is a Secret Santa application built with:

- **Backend**: Node.js + Express + TypeScript + Firebase
- **Frontend**: Angular + TypeScript + Firebase
- **Architecture**: Hexagonal (Ports & Adapters)
- **Testing**: Jest (Backend) + Jasmine/Karma (Frontend)

---

## 🔄 Development Process Flow

### Phase 1: Understanding & Planning

#### 1.1 Read the Task Specification

Every task follows the [TASK_TEMPLATE.md](../docs/TASK_TEMPLATE.md) structure:

```markdown
# TASK: [Name]

## 📝 Description

[What needs to be done]

## 📍 Location

[Exact file paths]

## 🏗️ Model/Reference

[Interfaces, types, models to follow]

## 🎯 Specific Requirements

- [ ] Requirement 1
- [ ] Requirement 2

## 🚫 Scope / Limits

❌ What NOT to do

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md
- [ ] Includes tests
- [ ] No debug logs
```

#### 1.2 Identify the Hexagonal Layers Involved

Determine which layers you'll touch:

```
┌─ ADAPTERS (External Interface)
│  ├─ HTTP Controllers (Express routes)
│  ├─ Persistence (Firebase repositories)
│  └─ Auth (Firebase authentication)
│
├─ PORTS (Interfaces/Contracts)
│  └─ IGroupRepository, IAuthPort, etc.
│
├─ APPLICATION (Use Cases / Services)
│  ├─ Use Cases: CreateGroupUseCase, PerformRaffleUseCase
│  └─ DTOs: CreateGroupDTO, RaffleResultDTO
│
├─ DOMAIN (Business Logic - Pure)
│  ├─ Entities: Group, User, Wish, Assignment
│  └─ Errors: DomainError, InvalidBudgetError
│
└─ SHARED (Utilities)
   └─ Validators, Constants, Types
```

**Critical Rule**: Dependencies flow **inward only**:

- ✅ Adapters → Ports → Application → Domain
- ❌ Domain should NEVER depend on Adapters

#### 1.3 Check for Existing Implementations

Search for similar features:

```bash
# Example: Looking for similar use cases
grep -r "UseCase" backend/src/application/use-cases/
```

Look for patterns like:

- Similar entities in `domain/entities/`
- Existing DTOs in `application/dto/`
- Related repositories in `adapters/persistence/`

---

### Phase 2: Implementation Strategy

#### 2.1 Test-First Approach (TDD)

**Always write tests BEFORE implementation**:

1. Create test file: `__tests__/[FeatureName].spec.ts`
2. Write failing tests for all requirements
3. Implement code until tests pass
4. Refactor while keeping tests green

#### 2.2 Layer-by-Layer Implementation Order

**Bottom-Up Approach** (recommended):

```
1. Domain Layer (Entities, Errors)
   ↓
2. Ports (Interfaces)
   ↓
3. Application Layer (Use Cases, DTOs)
   ↓
4. Adapters (Controllers, Repositories)
```

**Example: Implementing "Create Group" Feature**

```typescript
// Step 1: Domain Entity
// backend/src/domain/entities/Group.ts
export class Group {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly budgetLimit: number,
    readonly adminId: string,
    readonly members: string[],
    readonly raffleStatus: "pending" | "completed",
    readonly createdAt: number,
    readonly updatedAt: number,
  ) {}

  /**
   * Factory method to create a new Group
   * @throws ValidationError if name is empty or budget <= 0
   */
  static create(name: string, budgetLimit: number, adminId: string): Group {
    if (!name?.trim()) {
      throw new ValidationError("Group name cannot be empty");
    }
    if (budgetLimit <= 0) {
      throw new InvalidBudgetError("Budget must be positive");
    }

    const now = Date.now();
    const id = `group_${now}_${Math.random().toString(36).substr(2, 9)}`;

    return new Group(
      id,
      name.trim(),
      budgetLimit,
      adminId,
      [adminId], // Admin is first member
      "pending",
      now,
      now,
    );
  }

  /**
   * Validates if group is ready for raffle
   */
  isValidForRaffle(): boolean {
    return this.members.length >= 2;
  }
}

// Step 2: Port (Interface)
// backend/src/ports/IGroupRepository.ts
export interface IGroupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
}

// Step 3: Application Use Case
// backend/src/application/use-cases/CreateGroupUseCase.ts
export class CreateGroupUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(dto: CreateGroupDTO): Promise<Group> {
    // Business validation
    const group = Group.create(dto.name, dto.budgetLimit, dto.adminId);

    // Persist
    await this.groupRepository.create(group);

    return group;
  }
}

// Step 4: Adapter (Controller)
// backend/src/adapters/http/controllers/GroupController.ts
export class GroupController {
  constructor(private createGroupUseCase: CreateGroupUseCase) {}

  async createGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto = req.body as CreateGroupDTO;
      const group = await this.createGroupUseCase.execute(dto);
      res.status(201).json(group);
    } catch (error) {
      next(error); // Pass to error middleware
    }
  }
}
```

---

### Phase 3: Code Quality Standards

#### 3.1 Language & Naming Conventions

**CRITICAL**: ALL code must be in **ENGLISH**

✅ **Correct**:

```typescript
export class GroupController {
  async createGroup(req: Request, res: Response): Promise<void> {}
}
```

❌ **Incorrect**:

```typescript
export class ControladorGrupo {
  async crearGrupo(req: Request, res: Response): Promise<void> {}
}
```

**Naming Rules** (from [GUIDELINES.md](../docs/GUIDELINES.md)):

| Element         | Convention       | Example                     |
| --------------- | ---------------- | --------------------------- |
| Classes         | PascalCase       | `GroupController`           |
| Methods         | camelCase        | `createGroup()`             |
| Variables       | camelCase        | `userName`, `isActive`      |
| Constants       | UPPER_SNAKE_CASE | `MAX_BUDGET`                |
| Interfaces      | I + PascalCase   | `IGroupRepository`          |
| Files (TS)      | PascalCase       | `GroupController.ts`        |
| Files (Angular) | kebab-case       | `group-detail.component.ts` |

#### 3.2 TypeScript Standards

```typescript
// ✅ ALWAYS use explicit types
function createUser(name: string, age: number): User {
  return new User(name, age);
}

// ❌ NEVER use 'any'
function createUser(name: any, age: any): any {
  return new User(name, age);
}

// ✅ Use readonly for immutability
interface CreateGroupDTO {
  readonly name: string;
  readonly budgetLimit: number;
}

// ✅ Use union types for states
type RaffleStatus = "pending" | "completed" | "cancelled";

// ✅ Validate inputs
if (!dto.name?.trim()) {
  throw new ValidationError("Name is required");
}
```

#### 3.3 Dependency Injection

```typescript
// ✅ ALWAYS inject dependencies via constructor
export class CreateGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private logger: ILogger,
  ) {}
}

// ❌ NEVER instantiate dependencies directly
export class CreateGroupUseCase {
  private groupRepository = new FirebaseGroupRepository();
  private logger = new ConsoleLogger();
}
```

#### 3.4 Error Handling

```typescript
// ✅ Use domain-specific errors
export class InvalidBudgetError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBudgetError';
  }
}

// ✅ Handle errors at controller level
async createGroup(req: Request, res: Response): Promise<void> {
  try {
    const group = await this.useCase.execute(req.body);
    res.status(201).json(group);
  } catch (error) {
    if (error instanceof InvalidBudgetError) {
      res.status(400).json({ code: 'INVALID_BUDGET', message: error.message });
    } else if (error instanceof ValidationError) {
      res.status(400).json({ code: 'VALIDATION_ERROR', message: error.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Internal server error' });
    }
  }
}
```

---

### Phase 4: Documentation

#### 4.1 JSDoc for Public APIs

````typescript
/**
 * Creates a new Secret Santa group
 *
 * @param dto - Data Transfer Object containing group information
 * @returns The created group with generated ID
 * @throws InvalidBudgetError if budgetLimit <= 0
 * @throws ValidationError if name is empty or invalid
 *
 * @example
 * ```typescript
 * const group = await useCase.execute({
 *   name: 'Family 2026',
 *   budgetLimit: 500,
 *   adminId: 'user123'
 * });
 * ```
 */
async execute(dto: CreateGroupDTO): Promise<Group> {
  // Implementation
}
````

#### 4.2 Inline Comments for Complex Logic

```typescript
// Only comment WHY, not WHAT (code should be self-explanatory)

// ❌ Bad comment
// Increment counter by 1
counter++;

// ✅ Good comment
// Ensure at least one retry attempt before marking as failed
const minRetries = Math.max(1, config.retries);
```

---

### Phase 5: Testing (Critical - See [skill-unit-testing.md](./skill-unit-testing.md))

#### 5.1 Test Coverage Requirements

- **Minimum**: 80% coverage
- **Target**: 90%+ coverage
- **Critical paths**: 100% coverage (auth, payment flows)

#### 5.2 Test Structure

```typescript
describe("CreateGroupUseCase", () => {
  let useCase: CreateGroupUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateGroupUseCase(mockRepository);
  });

  describe("execute", () => {
    it("should create a group with valid data", async () => {
      // Arrange
      const dto: CreateGroupDTO = {
        name: "Test Group",
        budgetLimit: 500,
        adminId: "admin123",
      };

      mockRepository.create.mockResolvedValue(expect.any(Object));

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result.name).toBe("Test Group");
      expect(result.budgetLimit).toBe(500);
      expect(result.members).toContain("admin123");
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should throw InvalidBudgetError if budget <= 0", async () => {
      // Arrange
      const dto: CreateGroupDTO = {
        name: "Test Group",
        budgetLimit: -100,
        adminId: "admin123",
      };

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(InvalidBudgetError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });
});


### Phase 6: Commit message (important - See "Git Commits" in GUIDELINES.md )

```

---

## 🚫 Scope Control & Limits

### What You MUST NOT Do Without Explicit Permission

1. ❌ **Change architecture**: Do not modify the hexagonal structure
2. ❌ **Add dependencies**: Do not install new npm packages
3. ❌ **Refactor existing code**: Unless explicitly asked
4. ❌ **Modify configuration**: Do not change `tsconfig.json`, `angular.json`, `jest.config.js`
5. ❌ **Delete code**: Unless explicitly instructed
6. ❌ **Change public interfaces**: Modifying ports/interfaces breaks contracts
7. ❌ **Skip tests**: Every feature MUST have tests
8. ❌ **Leave debug logs**: Remove all `console.log`, `debugger`, `TODO` comments

### What You SHOULD Do

1. ✅ Follow the exact file paths specified in the task
2. ✅ Implement ONLY what's requested (no "nice to have" features)
3. ✅ Ask clarifying questions if requirements are unclear
4. ✅ Reference existing patterns in the codebase
5. ✅ Write comprehensive tests
6. ✅ Document complex logic
7. ✅ Use TypeScript strict mode (no `any`)
8. ✅ Handle all error cases

---

## ✅ Pre-Commit Checklist

Before marking a task as complete, verify:

- [ ] All tests pass (`npm test`)
- [ ] Code follows [GUIDELINES.md](../docs/GUIDELINES.md) conventions
- [ ] No TypeScript errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Coverage meets minimum threshold (80%)
- [ ] All code is in English (classes, methods, variables, comments)
- [ ] JSDoc exists for all public APIs
- [ ] No debug logs (`console.log`, `debugger`)
- [ ] Error handling is complete
- [ ] Files are in the correct location
- [ ] Task requirements checklist is fulfilled
- [ ] No scope creep (only implemented what was requested)

---

## 🎓 Examples by Feature Type

### Example 1: Adding a New Entity

**Task**: Create `Wish` entity

**Implementation Order**:

1. Define entity in `backend/src/domain/entities/Wish.ts`
2. Create tests in `backend/src/domain/entities/__tests__/Wish.spec.ts`
3. Reference in [ARCHITECTURE.md](../docs/ARCHITECTURE.md) data models section

**Key Points**:

- Entity should be **immutable** (readonly properties)
- Use **factory method** (`static create()`)
- Include **validation** in factory method
- Add **business methods** (e.g., `isExpired()`, `canBeEdited()`)

### Example 2: Adding a New Use Case

**Task**: Implement `PerformRaffleUseCase`

**Implementation Order**:

1. Define port if needed: `IAssignmentRepository`
2. Create DTO: `RaffleResultDTO`
3. Implement use case: `PerformRaffleUseCase.ts`
4. Write tests: `PerformRaffleUseCase.spec.ts`
5. Add controller endpoint: `RaffleController.ts`

**Key Points**:

- Inject all dependencies (repositories, services)
- Validate business rules (e.g., minimum 2 members)
- Handle all error cases
- Return appropriate DTO, not raw entities

### Example 3: Adding a New Controller Endpoint

**Task**: Create `DELETE /groups/:id` endpoint

**Implementation Order**:

1. Ensure use case exists: `DeleteGroupUseCase`
2. Add controller method: `GroupController.deleteGroup()`
3. Add route in `backend/src/config/routes.ts`
4. Add middleware: `authMiddleware`, `adminOnlyMiddleware`
5. Write integration tests

**Key Points**:

- Use `try-catch` for error handling
- Return proper HTTP status codes (200, 400, 401, 404, 500)
- Validate authentication and authorization
- Pass errors to `next()` for error middleware

---

## 🔗 Quick Reference Links

| Document      | Purpose          | Link                                                           |
| ------------- | ---------------- | -------------------------------------------------------------- |
| Architecture  | Technical design | [ARCHITECTURE.md](../docs/ARCHITECTURE.md)                     |
| Guidelines    | Code conventions | [GUIDELINES.md](../docs/GUIDELINES.md)                         |
| Quick Ref     | Visual diagrams  | [ARCHITECTURE_QUICK_REF.md](../docs/ARCHITECTURE_QUICK_REF.md) |
| Task Template | Task structure   | [TASK_TEMPLATE.md](../docs/TASK_TEMPLATE.md)                   |
| Unit Testing  | Test standards   | [skill-unit-testing.md](./skill-unit-testing.md)               |

---

## 🤖 AI Self-Check Questions

Before completing a task, ask yourself:

1. **Did I read the task specification completely?**
2. **Did I check ARCHITECTURE.md for related patterns?**
3. **Did I follow the hexagonal layer structure?**
4. **Are all my variable/class names in English?**
5. **Did I write tests first (TDD)?**
6. **Is my code testable (dependency injection)?**
7. **Did I handle all error cases?**
8. **Did I add JSDoc to public APIs?**
9. **Did I stay within the defined scope?**
10. **Would a human reviewer approve this code?**

If the answer to ANY question is "No", revisit that aspect before submitting.

---

## 📞 Escalation Protocol

If you encounter:

- **Unclear requirements**: Ask the task assigner for clarification
- **Architecture conflicts**: Reference [ARCHITECTURE.md](../docs/ARCHITECTURE.md) and ask for guidance
- **Missing dependencies**: Request permission before adding new packages
- **Scope ambiguity**: Clarify with task assigner using [TASK_TEMPLATE.md](../docs/TASK_TEMPLATE.md) format

**Never assume**. Always ask when in doubt.

---

## 📊 Success Metrics

A successful implementation should:

- ✅ **Pass all tests** with >80% coverage
- ✅ **Follow conventions** in [GUIDELINES.md](../docs/GUIDELINES.md)
- ✅ **Respect architecture** defined in [ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- ✅ **Be maintainable** (clear naming, documented, typed)
- ✅ **Be testable** (dependency injection, no hard dependencies)
- ✅ **Be complete** (all requirements met, no scope creep)

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained By**: INVFriend Team

---

## 🎯 Summary: The Golden Path

```
1. Read Task → 2. Check ARCHITECTURE.md → 3. Write Tests →
4. Implement Domain → 5. Implement Application → 6. Implement Adapters →
7. Run Tests → 8. Document → 9. Verify Checklist → 10. Submit
```

**Remember**: Quality > Speed. Take time to do it right the first time.
