# INVFriend - Development Guidelines and Conventions

## 📋 Contents

1. [Scope Control for AI](#scope-control-for-ai)
2. [Folder Structure](#folder-structure)
3. [Code Conventions](#code-conventions)
4. [Naming Standards](#naming-standards)
5. [Best Practices](#best-practices)
6. [Development Process](#development-process)
7. [Documentation](#documentation)
8. [Testing](#testing)
9. [Versioning](#versioning)
10. [Git Commits](#git-commits)
11. [Language Requirements](#language-requirements)

---

## 🎯 Scope Control for AI

**CRITICAL RULE:** Tasks assigned to AI must be **specific, limited and with clear description**.

### ✅ Well-defined tasks for AI:

```
❌ "Implement authentication"
✅ "Create FirebaseAuthAdapter service following IAuthPort interface,
   with methods: loginWithEmail(email, password),
   loginWithGoogle(), logout(), getCurrentUser().
   Location: backend/src/adapters/auth/FirebaseAuthAdapter.ts"
```

### 📝 AI Task Template

When assigning a task to AI, include:

1. **What:** Clear description of what must be done
2. **Where:** Exact file location
3. **Model:** References to existing interfaces or models
4. **Limits:** What NOT to include (controlled scope)
5. **Testing:** If tests are required

**Example:**

```
TASK: Implement CreateGroupUseCase

WHAT: Use case that creates a new group and returns the created instance.
     - Must validate that budget is > 0
     - Must assign admin as first member
     - Must generate timestamps correctly

WHERE: backend/src/application/use-cases/CreateGroupUseCase.ts

MODEL:
- Implement interface described in ARCHITECTURE.md
- Use injected repository (IGroupRepository)
- Return Group with structure defined in ARCHITECTURE.md

LIMITS:
- Do not include notifications
- Do not create endpoints
- Do not perform authentication validation (that goes in controller)

TESTING: Create backend/src/application/use-cases/__tests__/CreateGroupUseCase.spec.ts
```

### 🚫 Scope Blocker

Tasks that AI should **NOT** do without supervision:

- ❌ Change existing architecture or structure
- ❌ Add new dependencies (npm packages)
- ❌ Delete or refactor existing code without instruction
- ❌ Modify configuration files (tsconfig, angular.json, etc)
- ❌ Change names of interfaces or public methods
- ❌ Skip documentation

**If something from this list is needed, explicit confirmation must be requested.**

---

## 📁 Folder Structure

### Backend (Node.js)

```
backend/
├── src/
│   ├── adapters/                    # Adapters layer (input and output)
│   │   ├── auth/
│   │   │   ├── FirebaseAuthAdapter.ts
│   │   │   └── __tests__/
│   │   ├── http/                   # Express controllers
│   │   │   ├── controllers/
│   │   │   │   ├── GroupController.ts
│   │   │   │   ├── RaffleController.ts
│   │   │   │   └── __tests__/
│   │   │   └── middleware/
│   │   │       ├── authMiddleware.ts
│   │   │       └── errorHandler.ts
│   │   └── persistence/            # Database adapters
│   │       ├── FirebaseGroupRepository.ts
│   │       ├── FirebaseUserRepository.ts
│   │       └── __tests__/
│   │
│   ├── domain/                      # Business logic, without external dependencies
│   │   ├── entities/
│   │   │   ├── Group.ts
│   │   │   ├── User.ts
│   │   │   ├── Wish.ts
│   │   │   ├── Assignment.ts
│   │   │   └── Notification.ts
│   │   └── errors/
│   │       ├── DomainError.ts
│   │       ├── GroupNotFoundError.ts
│   │       └── InvalidBudgetError.ts
│   │
│   ├── application/                 # Use Cases, Application Services
│   │   ├── use-cases/
│   │   │   ├── CreateGroupUseCase.ts
│   │   │   ├── PerformRaffleUseCase.ts
│   │   │   ├── AddWishUseCase.ts
│   │   │   └── __tests__/
│   │   ├── services/
│   │   │   ├── GroupApplicationService.ts
│   │   │   └── __tests__/
│   │   └── dto/
│   │       ├── CreateGroupDTO.ts
│   │       └── RaffleResultDTO.ts
│   │
│   ├── ports/                       # Interfaces (contracts)
│   │   ├── IGroupRepository.ts
│   │   ├── IUserRepository.ts
│   │   ├── INotificationPort.ts
│   │   └── IAuthPort.ts
│   │
│   ├── shared/                      # Shared utilities
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── randomizer.ts        # For fair raffle
│   │   │   └── validators.ts
│   │   ├── constants/
│   │   │   └── AppConstants.ts
│   │   └── types/
│   │       └── index.ts
│   │
│   ├── config/
│   │   ├── firebase.config.ts
│   │   ├── environment.ts
│   │   └── routes.ts
│   │
│   └── index.ts                    # Express entry point
│
├── __tests__/
│   └── integration/                 # Integration tests
│       └── group.integration.spec.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── jest.config.js
```

### Frontend (Angular)

```
frontend/
├── src/
│   ├── app/
│   │   ├── adapters/                # Components, HTTP services, guards
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── group-list/
│   │   │   │   ├── group-detail/
│   │   │   │   ├── group-create/
│   │   │   │   ├── wish-list/
│   │   │   │   └── __tests__/
│   │   │   ├── services/
│   │   │   │   ├── GroupHttpService.ts  # API calls
│   │   │   │   ├── AuthHttpService.ts
│   │   │   │   └── __tests__/
│   │   │   └── guards/
│   │   │       ├── AuthGuard.ts
│   │   │       └── AdminGuard.ts
│   │   │
│   │   ├── domain/                  # Models, interfaces
│   │   │   ├── models/
│   │   │   │   ├── group.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   └── wish.model.ts
│   │   │   └── errors/
│   │   │       └── index.ts
│   │   │
│   │   ├── application/             # Use Cases, Services
│   │   │   ├── use-cases/
│   │   │   │   ├── CreateGroupUseCase.ts
│   │   │   │   ├── GetSecretSantaUseCase.ts
│   │   │   │   └── __tests__/
│   │   │   ├── services/
│   │   │   │   ├── GroupApplicationService.ts
│   │   │   │   └── NotificationService.ts
│   │   │   └── dto/
│   │   │       └── CreateGroupDTO.ts
│   │   │
│   │   ├── ports/                   # Interfaces
│   │   │   ├── IGroupRepository.ts
│   │   │   └── IGroupHttpPort.ts
│   │   │
│   │   ├── shared/                  # Utilities, pipes, directives
│   │   │   ├── pipes/
│   │   │   │   ├── currency.pipe.ts
│   │   │   │   └── __tests__/
│   │   │   ├── directives/
│   │   │   ├── utils/
│   │   │   │   ├── validators.ts
│   │   │   │   └── formatters.ts
│   │   │   ├── constants/
│   │   │   └── types/
│   │   │
│   │   └── app.module.ts
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── main.scss
│   ├── main.ts
│   └── index.html
│
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

## 🔤 Code Conventions

**📖 For detailed code examples and patterns**, see [GUIDELINES_DETAILED.md](./GUIDELINES_DETAILED.md)

### TypeScript

#### **Types**

- ❌ DO NOT use `any`
- ✅ Define explicit types
- ✅ Use interfaces for object shapes
- ✅ Use type aliases for unions and branded types

#### **Variable Names**

- ✅ camelCase for variables and functions
- ✅ Descriptive names, no abbreviations
- ✅ Boolean variables start with `is`, `has`, `should`
- ❌ Avoid generic names like `data`, `info`, `item`

#### **Constants**

- ✅ UPPER_SNAKE_CASE for global constants
- ✅ camelCase for local constants
- ✅ Group related constants in objects or enums

#### **Functions**

- ✅ Use verbs for functions that perform actions
- ✅ Descriptive parameter names
- ✅ Keep functions small and focused (single responsibility)

### Angular

#### **Components**

- ✅ kebab-case for selectors (`app-group-detail`)
- ✅ OnPush change detection when possible
- ✅ Public properties first, private properties after
- ✅ Implement lifecycle hooks (OnInit, OnDestroy)
- ✅ Unsubscribe from observables in ngOnDestroy

#### **Services**

- ✅ `providedIn: 'root'` for singleton services
- ✅ Application services delegate to HTTP services
- ✅ HTTP services handle API communication

### Node.js/Express

#### **Controllers**

- ✅ Thin controllers - delegate to use cases
- ✅ Handle HTTP concerns only (request/response)
- ✅ Use middleware for cross-cutting concerns
- ✅ Proper error handling with try-catch

#### **Use Cases**

- ✅ Single responsibility per use case
- ✅ Inject dependencies via constructor
- ✅ Validate inputs before processing
- ✅ Return domain entities, not DTOs

---

## 📛 Naming Standards

### Files

```
// Angular Components
group-list.component.ts
group-list.component.html
group-list.component.scss

// Services
group.service.ts (if adapter/HTTP)
GroupApplicationService.ts (if application service)

// Use Cases
CreateGroupUseCase.ts
PerformRaffleUseCase.ts

// Repositories
IGroupRepository.ts (interface)
FirebaseGroupRepository.ts (implementation)

// Models/Entities
Group.ts
User.ts

// Tests
group.spec.ts
GroupApplicationService.spec.ts
group.integration.spec.ts
```

### Classes

```
// ✅ PascalCase
class GroupApplicationService { }
class CreateGroupUseCase { }
class FirebaseGroupRepository { }

// ❌ camelCase or snake_case
class groupApplicationService { }
class create_group_use_case { }
```

### Interfaces

```
// ✅ Prefix 'I' for interfaces
interface IGroupRepository { }
interface INotificationPort { }

// ❌ Without prefix
interface GroupRepository { }
```

### Methods

```
// ✅ camelCase
public async createGroup(): Promise<Group> { }
public isValidBudget(budget: number): boolean { }

// ❌ PascalCase or snake_case
public async CreateGroup(): Promise<Group> { }
public Is_Valid_Budget(): boolean { }
```

## 💡 Best Practices

**📖 For detailed examples**, see [GUIDELINES_DETAILED.md](./GUIDELINES_DETAILED.md)

### Dependency Injection

- ✅ Always inject dependencies via constructor
- ❌ Never instantiate dependencies directly
- ✅ Use interfaces for loose coupling

### Error Handling

- ✅ Create domain-specific error classes
- ✅ Extend base `DomainError` class
- ✅ Catch errors at appropriate boundaries
- ✅ Log errors with context

### RxJS (Angular)

- ✅ Use async pipe in templates
- ✅ Use takeUntil for subscription cleanup
- ✅ Unsubscribe in ngOnDestroy
- ❌ Avoid nested subscriptions

### Null Safety

- ✅ Check for null/undefined explicitly
- ✅ Use optional chaining (`?.`)
- ✅ Use nullish coalescing (`??`)
- ❌ Don't assume values exist

### Logging

- ✅ Use logger service consistently
- ✅ Different levels: info, warn, error, debug
- ❌ Never use console.log in production code

### Validation

- ✅ Validate in Use Cases or Controllers
- ✅ Use validation libraries (Joi, Zod)
- ✅ Return meaningful error messages
- ❌ Don't skip validation

---

## 🔄 Development Process

### Before Writing Code

1. **Read ARCHITECTURE.md** - Understand structure and responsibilities
2. **Identify the layer** - Adapter, Domain, Application?
3. **Review existing interfaces** - In `ports/`
4. **Plan tests** - What needs testing

### Writing Code

1. **Create tests first** (TDD if possible)
2. **Implement with explicit types** - Do not use `any`
3. **Follow naming conventions** - Exactly as in GUIDELINES
4. **Document public APIs** - JSDoc/comments
5. **Handle errors** - Domain-specific errors

### After Writing Code

1. **Pass all tests** - Including new ones
2. **Lint and format** - `npm run lint` and `npm run format`
3. **Review coverage** - >80% coverage if possible
4. **Document changes** - Update ARCHITECTURE.md if there are architecture changes

### Checklist before Commit

```
- [ ] Green tests (unit + integration if applicable)
- [ ] Code follows GUIDELINES conventions
- [ ] No linting errors
- [ ] No debug logs
- [ ] Documentation updated
- [ ] Descriptive commit message
- [ ] Scope is contained (didn't go beyond the task)
```

---

## 📚 Documentation

### JSDoc/Comments

```typescript
/**
 * Creates a new Secret Santa group
 *
 * @param dto - DTO with group data
 * @returns Created group with assigned ID
 * @throws InvalidBudgetError if budget <= 0
 * @throws InvalidNameError if name is empty
 *
 * @example
 * const group = await createGroupUseCase.execute({
 *   name: 'Family 2026',
 *   budgetLimit: 500,
 *   adminId: 'user123'
 * });
 */
export async function execute(dto: CreateGroupDTO): Promise<Group> {}
```

### Folder READMEs

If a folder has complex logic, add `README.md`:

```
adapters/persistence/README.md
- Explain what each repository is
- How to add a new one
- Patterns used
```

### Architectural Changes

Always update ARCHITECTURE.md if:

- A new layer is added
- Data flow changes
- New entities are added
- Ports change

---

## 🧪 Testing

### Structure

```
- Unit Tests: Next to code (e.g., `CreateGroupUseCase.spec.ts`)
- Integration Tests: Folder `__tests__/integration/`
- E2E Tests: Future, not in MVP
```

### Naming

```
describe('CreateGroupUseCase', () => {
  describe('execute', () => {
    it('should create a group with valid data', () => {
      // Arrange
      const dto = { name: 'Test', budgetLimit: 500, adminId: 'admin1' };

      // Act
      const result = useCase.execute(dto);

      // Assert
      expect(result.name).toBe('Test');
    });

    it('should throw InvalidBudgetError if budget <= 0', () => {
      // Arrange
      const dto = { name: 'Test', budgetLimit: -1, adminId: 'admin1' };

      // Act & Assert
      expect(() => useCase.execute(dto)).toThrow(InvalidBudgetError);
    });
  });
});
```

---

## 📝 Versioning

- Use **Semantic Versioning**: MAJOR.MINOR.PATCH
- Descriptive commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Example: `feat: add group deletion functionality`

---

## 🌐 Language Requirements

**CRITICAL:** ALL code in this project MUST be written in English.

### Mandatory English Usage

```typescript
// ✅ CORRECT - English everywhere
export class GroupController {
  constructor(private createGroupUseCase: CreateGroupUseCase) {}

  async createGroup(req: Request, res: Response): Promise<void> {
    // Create new group with validation
    const group = await this.createGroupUseCase.execute(req.body);
    res.status(201).json(group);
  }
}

## 🧪 Testing

**📖 For detailed test examples**, see [GUIDELINES_DETAILED.md](./GUIDELINES_DETAILED.md#testing-patterns)

### Structure

- Unit Tests: Next to code (e.g., `CreateGroupUseCase.spec.ts`)
- Integration Tests: Folder `__tests__/integration/`
- E2E Tests: Future, not in MVP

### Naming Convention

```

describe('ClassName', () => {
describe('methodName', () => {
it('should do something when condition', () => {
// Arrange
// Act  
 // Assert
});
});
});

```

### Coverage Goals

- Unit tests: >80% coverage
- All use cases: 100% coverage
- Critical paths: 100% coveragection calcularPresupuesto() {}
const esEmailValido = true;
```

#### Interfaces and Types

```typescript
// ✅ CORRECT
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<void>;
}

type GroupStatus = "active" | "completed" | "cancelled";

// ❌ INCORRECT
interface IRepositorioUsuario {
  encontrarPorId(id: string): Promise<Usuario | null>;
  crear(usuario: Usuario): Promise<void>;
}

type EstadoGrupo = "activo" | "completado" | "cancelado";
```

#### Error Handling

```typescript
// ✅ CORRECT
export class InvalidBudgetError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBudgetError";
  }
}

throw new InvalidBudgetError("Budget must be positive");

// ❌ INCORRECT
export class ErrorPresupuestoInvalido extends DomainError {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ErrorPresupuestoInvalido";
  }
}

throw new ErrorPresupuestoInvalido("El presupuesto debe ser positivo");
```

#### Documentation

```typescript
// ✅ CORRECT
/**
 * Creates a new user in the system
 * @param userData - User information
 * @returns Created user with generated ID
 */
async function createUser(userData: CreateUserDTO): Promise<User> {}

// ❌ INCORRECT
/**
 * Crea un nuevo usuario en el sistema
 * @param datosUsuario - Información del usuario
 * @returns Usuario creado con ID generado
 */
async function crearUsuario(datosUsuario: CrearUsuarioDTO): Promise<Usuario> {}
```

### Exception: User-Facing Content

The ONLY acceptable Spanish usage is in:

- **UI text**: Messages shown directly to end users
- **Validation error messages**: User-visible validation feedback
- **Email templates**: Emails sent to users
- **Documentation**: README files, architecture docs (can be bilingual)

```typescript
// ✅ CORRECT - Internal code in English, user message in Spanish
export class GroupController {
  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const group = await this.createGroupUseCase.execute(req.body);
      res.status(201).json({
        group,
        message: "Grupo creado exitosamente", // User-facing message
      });
    } catch (error) {
      if (error instanceof InvalidBudgetError) {
        res.status(400).json({
          error: "InvalidBudgetError", // Error code in English
          message: "El presupuesto debe ser mayor a 0", // User message in Spanish
        });
      }
    }
  }
}
```

### Enforcement

- All pull requests will be reviewed for English compliance
- CI/CD linting rules enforce English naming conventions
- Code reviews must reject Spanish code elements
- This is a **non-negotiable** project standard

---

## 🔖 Git Commits

We follow **[Conventional Commits](https://www.conventionalcommits.org/)** for all commit messages.

### Format

```
<type>(<scope>): <description>

<body>

<footer>
```

### Types

- `feat`: New API/UI feature
- `fix`: Bug fix for API/UI
- `refactor`: Code restructuring without behavior change
- `perf`: Performance improvement (special refactor)
- `style`: Formatting, whitespace (no behavior change)
- `test`: Add or fix tests
- `docs`: Documentation only
- `build`: Dependencies, build tools, project version
- `ops`: Infrastructure, deployment, CI/CD, backups
- `chore`: Initial commit, .gitignore, maintenance tasks

### Rules

- **Description**: Imperative, lowercase, no period
  - ✅ `feat: add email notifications`
  - ❌ `feat: Added email notifications.`
- **Scope**: Optional, project-specific (e.g., `feat(auth): ...`)
- **Breaking changes**: Add `!` before `:` (e.g., `feat!: remove endpoint`)
- **Footer**: Reference issues (`Closes #123`) or breaking changes

### Examples

```
feat(auth): add Google login support

fix(cart): prevent empty cart submission

refactor: simplify user validation logic

docs: update API authentication guide

build: upgrade Angular to v18.2
```

---

**Last Updated:** January 2026
**Version:** 1.0.0 (MVP)
