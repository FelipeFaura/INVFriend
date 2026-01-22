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
10. [Language Requirements](#language-requirements)

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

---

## 🔤 Code Conventions

### TypeScript

#### **Types**

```typescript
// ❌ DO NOT use 'any'
let data: any;

// ✅ Define explicit types
let data: Group | null;
interface Group {
  /* ... */
}
type GroupId = string & { readonly brand: "GroupId" };
```

#### **Variable Names**

```typescript
// ❌ Abbreviations
const grp = new Group();
const usr_name = "John";

// ✅ Descriptive names
const group = new Group();
const userName = "John";
const isGroupActive = true;
const groupsCount = 5;
```

#### **Constants**

```typescript
// ✅ UPPER_SNAKE_CASE for global constants
const MAX_BUDGET = 10000;
const MIN_MEMBERS = 2;
const DATABASE_TIMEOUT_MS = 5000;

// ✅ camelCase for local constants
const defaultBudget = 500;
```

#### **Functions**

```typescript
// ✅ Verbs for functions that do something
const createGroup = (...) => {};
const updateWish = (...) => {};
const isValidBudget = (...) => {};

// ✅ Descriptive parameter names
function inviteUser(userId: string, groupId: string): Promise<void>

// ❌ Generic names
function invoke(id: string, ref: string): Promise<void>
```

### Angular

#### **Components**

```typescript
// Recommended structure:
@Component({
  selector: "app-group-detail", // kebab-case
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush, // Performance
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  // Public properties first
  @Input() groupId: string = "";
  @Output() groupDeleted = new EventEmitter<string>();

  // Private properties
  private destroy$ = new Subject<void>();

  constructor(
    private groupService: GroupApplicationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### **Services (Application Services)**

```typescript
@Injectable({
  providedIn: "root",
})
export class GroupApplicationService {
  constructor(private groupHttpService: GroupHttpService) {}

  createGroup(dto: CreateGroupDTO): Observable<Group> {
    return this.groupHttpService.createGroup(dto);
  }
}
```

#### **HTTP Service**

```typescript
@Injectable({
  providedIn: "root",
})
export class GroupHttpService {
  constructor(private http: HttpClient) {}

  createGroup(dto: CreateGroupDTO): Observable<Group> {
    return this.http
      .post<Group>("/api/groups", dto)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error.message));
  }
}
```

### Node.js/Express

#### **Controllers**

```typescript
export class GroupController {
  constructor(
    private createGroupUseCase: CreateGroupUseCase,
    private logger: Logger,
  ) {}

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
      next(error);
    }
  }
}
```

#### **Use Cases**

```typescript
export class CreateGroupUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(dto: CreateGroupDTO): Promise<Group> {
    if (dto.budgetLimit <= 0) {
      throw new InvalidBudgetError("Budget must be positive");
    }

    const group = Group.create(dto.name, dto.budgetLimit, dto.adminId);
    await this.groupRepository.create(group);

    return group;
  }
}
```

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

---

## 💡 Best Practices

### Dependency Injection

```typescript
// ✅ Always inject dependencies
export class GroupController {
  constructor(private useCase: CreateGroupUseCase) {}
}

// ❌ Instantiate directly
export class GroupController {
  private useCase = new CreateGroupUseCase();
}
```

### Error Handling

```typescript
// ✅ Domain-specific errors
export class InvalidBudgetError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBudgetError";
  }
}

// ✅ Catch and handle
try {
  await useCase.execute(dto);
} catch (error) {
  if (error instanceof InvalidBudgetError) {
    res.status(400).json({ message: error.message });
  }
}
```

### RxJS (Angular)

```typescript
// ✅ Use async pipe and takeUntil
export class GroupListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  groups$ = this.groupService.getGroups().pipe(
    takeUntil(this.destroy$)
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Template
<div *ngFor="let group of groups$ | async">
  {{ group.name }}
</div>

// ❌ Subscribe without unsubscribing
this.groupService.getGroups().subscribe(groups => {
  this.groups = groups;
});
```

### Null Safety

```typescript
// ✅ Check null explicitly
const group = await this.groupRepository.findById(id);
if (!group) {
  throw new GroupNotFoundError();
}

// ✅ Optional chaining
const adminName = group?.admin?.name;

// ❌ Assume it exists
const adminName = group.admin.name; // Can crash if admin is null
```

### Logging

```typescript
// ✅ Use logger consistently
this.logger.info(`Group created: ${group.id}`);
this.logger.error(`Failed to create group`, error);
this.logger.debug(`Group data:`, group);

// ❌ console.log in production
console.log("Group created");
```

### Validation

```typescript
// ✅ Validate in Use Case or Controller
if (!dto.name || dto.name.trim().length === 0) {
  throw new ValidationError("Group name is required");
}

// ✅ Use specialized libraries (Joi, Zod)
const schema = Joi.object({
  name: Joi.string().required(),
  budgetLimit: Joi.number().positive().required(),
});

// ❌ Inconsistent or missing validation
```

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

// ❌ INCORRECT - Spanish in code
export class ControladorGrupo {
  constructor(private crearGrupoUseCase: CrearGrupoUseCase) {}

  async crearGrupo(req: Request, res: Response): Promise<void> {
    // Crear nuevo grupo con validación
    const grupo = await this.crearGrupoUseCase.ejecutar(req.body);
    res.status(201).json(grupo);
  }
}
```

### What Must Be in English

1. **Class names**: `GroupService`, not `ServicioGrupo`
2. **Method names**: `createGroup()`, not `crearGrupo()`
3. **Variable names**: `userName`, not `nombreUsuario`
4. **Interface names**: `IGroupRepository`, not `IRepositorioGrupo`
5. **File names**: `group-controller.ts`, not `controlador-grupo.ts`
6. **Comments**: Use English for all code comments
7. **Error messages**: User-facing messages can be in Spanish, but error class names and internal messages should be English
8. **Type names**: `GroupDTO`, not `GrupoDTO`
9. **Constants**: `MAX_BUDGET`, not `PRESUPUESTO_MAXIMO`
10. **Database fields**: Use English field names when possible

### Examples

#### Variables and Functions

```typescript
// ✅ CORRECT
const userList = [];
function calculateBudget() {}
const isValidEmail = true;

// ❌ INCORRECT
const listaUsuarios = [];
function calcularPresupuesto() {}
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

**Last Updated:** January 2026
**Version:** 1.0.0 (MVP)
