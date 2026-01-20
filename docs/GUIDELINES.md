# INVFriend - Guías de Desarrollo y Convenciones

## 📋 Contenido

1. [Control de Scope para IA](#control-de-scope-para-ia)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Convenciones de Código](#convenciones-de-código)
4. [Estándares de Nombrado](#estándares-de-nombrado)
5. [Buenas Prácticas](#buenas-prácticas)
6. [Proceso de Desarrollo](#proceso-de-desarrollo)
7. [Documentación](#documentación)

---

## 🎯 Control de Scope para IA

**REGLA CRÍTICA:** Las tareas asignadas a IA deben ser **específicas, acotadas y con descripción clara**.

### ✅ Tareas bien definidas para IA:

```
❌ "Implementar autenticación"
✅ "Crear el servicio FirebaseAuthAdapter siguiendo interface IAuthPort,
   con métodos: loginWithEmail(email, password),
   loginWithGoogle(), logout(), getCurrentUser().
   Ubicar en: backend/src/adapters/auth/FirebaseAuthAdapter.ts"
```

### 📝 Plantilla de Tarea IA

Cuando se asigne una tarea a IA, incluir:

1. **Qué:** Descripción clara del qué se debe hacer
2. **Dónde:** Ubicación exacta de archivos
3. **Modelo:** Referencias a interfaces o modelos existentes
4. **Límites:** Qué NO incluir (scope controlado)
5. **Testing:** Si requiere tests

**Ejemplo:**

```
TAREA: Implementar CreateGroupUseCase

QUÉ: Use case que crea un nuevo grupo y retorna la instancia creada.
     - Debe validar que el presupuesto sea > 0
     - Debe asignar admin como primer miembro
     - Debe generar timestamps correctamente

DÓNDE: backend/src/application/use-cases/CreateGroupUseCase.ts

MODELO:
- Implementar interfaz descrita en ARCHITECTURE.md
- Usar repository inyectado (IGroupRepository)
- Retornar Group con estructura definida en ARCHITECTURE.md

LÍMITES:
- No incluir notificaciones
- No crear endpoints
- No hacer validación de autenticación (eso va en controller)

TESTING: Crear backend/src/application/use-cases/__tests__/CreateGroupUseCase.spec.ts
```

### 🚫 Scope Blocker

Tareas que **NO** debe hacer la IA sin supervisión:

- ❌ Cambiar arquitectura o estructura existente
- ❌ Agregar dependencias nuevas (npm packages)
- ❌ Eliminar o refactorizar código existente sin indicación
- ❌ Modificar archivos de configuración (tsconfig, angular.json, etc)
- ❌ Cambiar nombre de interfaces o métodos públicos
- ❌ Saltarse documentación

**Si necesita algo de esto, debe pedir confirmación explícita.**

---

## 📁 Estructura de Carpetas

### Backend (Node.js)

```
backend/
├── src/
│   ├── adapters/                    # Layer de adaptadores (entrada y salida)
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
│   ├── domain/                      # Business logic, sin dependencias externas
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
│   ├── ports/                       # Interfaces (contratos)
│   │   ├── IGroupRepository.ts
│   │   ├── IUserRepository.ts
│   │   ├── INotificationPort.ts
│   │   └── IAuthPort.ts
│   │
│   ├── shared/                      # Utilidades compartidas
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── randomizer.ts        # Para sorteo justo
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
│   └── index.ts                    # Entry point de Express
│
├── __tests__/
│   └── integration/                 # Tests de integración
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
│   │   ├── adapters/                # Componentes, servicios HTTP, guards
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
│   │   ├── domain/                  # Modelos, interfaces
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

## 🔤 Convenciones de Código

### TypeScript

#### **Tipos**

```typescript
// ❌ NO usar 'any'
let data: any;

// ✅ Definir tipos explícitos
let data: Group | null;
interface Group {
  /* ... */
}
type GroupId = string & { readonly brand: "GroupId" };
```

#### **Nombres de Variables**

```typescript
// ❌ Abreviaciones
const grp = new Group();
const usr_name = "John";

// ✅ Nombres descriptivos
const group = new Group();
const userName = "John";
const isGroupActive = true;
const groupsCount = 5;
```

#### **Constantes**

```typescript
// ✅ UPPER_SNAKE_CASE para constantes globales
const MAX_BUDGET = 10000;
const MIN_MEMBERS = 2;
const DATABASE_TIMEOUT_MS = 5000;

// ✅ camelCase para constantes locales
const defaultBudget = 500;
```

#### **Funciones**

```typescript
// ✅ Verbos para funciones que hacen algo
const createGroup = (...) => {};
const updateWish = (...) => {};
const isValidBudget = (...) => {};

// ✅ Nombres descriptivos de parámetros
function inviteUser(userId: string, groupId: string): Promise<void>

// ❌ Nombres genéricos
function invoke(id: string, ref: string): Promise<void>
```

### Angular

#### **Componentes**

```typescript
// Estructura recomendada:
@Component({
  selector: "app-group-detail", // kebab-case
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush, // Performance
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  // Propiedades públicas primero
  @Input() groupId: string = "";
  @Output() groupDeleted = new EventEmitter<string>();

  // Propiedades privadas
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

#### **Servicios (Application Services)**

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

## 📛 Estándares de Nombrado

### Archivos

```
// Componentes Angular
group-list.component.ts
group-list.component.html
group-list.component.scss

// Servicios
group.service.ts (si es adapter/HTTP)
GroupApplicationService.ts (si es application service)

// Use Cases
CreateGroupUseCase.ts
PerformRaffleUseCase.ts

// Repositorios
IGroupRepository.ts (interfaz)
FirebaseGroupRepository.ts (implementación)

// Modelos/Entities
Group.ts
User.ts

// Tests
group.spec.ts
GroupApplicationService.spec.ts
group.integration.spec.ts
```

### Clases

```
// ✅ PascalCase
class GroupApplicationService { }
class CreateGroupUseCase { }
class FirebaseGroupRepository { }

// ❌ camelCase o snake_case
class groupApplicationService { }
class create_group_use_case { }
```

### Interfaces

```
// ✅ Prefijo 'I' para interfaces
interface IGroupRepository { }
interface INotificationPort { }

// ❌ Sin prefijo
interface GroupRepository { }
```

### Métodos

```
// ✅ camelCase
public async createGroup(): Promise<Group> { }
public isValidBudget(budget: number): boolean { }

// ❌ PascalCase o snake_case
public async CreateGroup(): Promise<Group> { }
public Is_Valid_Budget(): boolean { }
```

---

## 💡 Buenas Prácticas

### Inyección de Dependencias

```typescript
// ✅ Siempre inyectar dependencias
export class GroupController {
  constructor(private useCase: CreateGroupUseCase) {}
}

// ❌ Instanciar directamente
export class GroupController {
  private useCase = new CreateGroupUseCase();
}
```

### Error Handling

```typescript
// ✅ Errores específicos del dominio
export class InvalidBudgetError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBudgetError";
  }
}

// ✅ Capturar y manejar
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
// ✅ Usar async pipe y takeUntil
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

// ❌ Subscribir sin desuscribirse
this.groupService.getGroups().subscribe(groups => {
  this.groups = groups;
});
```

### Null Safety

```typescript
// ✅ Chequear null explícitamente
const group = await this.groupRepository.findById(id);
if (!group) {
  throw new GroupNotFoundError();
}

// ✅ Optional chaining
const adminName = group?.admin?.name;

// ❌ Asumir que existe
const adminName = group.admin.name; // Puede crash si admin es null
```

### Logueo

```typescript
// ✅ Usar logger consistentemente
this.logger.info(`Group created: ${group.id}`);
this.logger.error(`Failed to create group`, error);
this.logger.debug(`Group data:`, group);

// ❌ console.log en producción
console.log("Group created");
```

### Validación

```typescript
// ✅ Validar en Use Case o Controller
if (!dto.name || dto.name.trim().length === 0) {
  throw new ValidationError("Group name is required");
}

// ✅ Usar librerías especializadas (Joi, Zod)
const schema = Joi.object({
  name: Joi.string().required(),
  budgetLimit: Joi.number().positive().required(),
});

// ❌ Validación inconsistente o faltante
```

---

## 🔄 Proceso de Desarrollo

### Antes de Escribir Código

1. **Leer ARCHITECTURE.md** - Entender la estructura y responsabilidades
2. **Identificar la capa** - ¿Adapter, Domain, Application?
3. **Revisar interfaces existentes** - En `ports/`
4. **Planificar tests** - Qué necesita testear

### Escribiendo Código

1. **Crear tests primero** (TDD si es posible)
2. **Implementar con tipos explícitos** - No usar `any`
3. **Seguir convenciones de nombrado** - Exactamente como en GUIDELINES
4. **Documentar público APIs** - JSDoc/comments
5. **Manejar errores** - Errores específicos del dominio

### Después de Escribir Código

1. **Pasar todos los tests** - Incluidos los nuevos
2. **Lint y format** - `npm run lint` y `npm run format`
3. **Revisar cobertura** - >80% de cobertura si es posible
4. **Documentar cambios** - Actualizar ARCHITECTURE.md si hay cambios de arch

### Checklist antes de Commit

```
- [ ] Tests verdes (unit + integration si aplica)
- [ ] Código sigue convenciones de GUIDELINES
- [ ] Sin errores de linting
- [ ] Sin logs de debug
- [ ] Documentación actualizada
- [ ] Mensaje commit descriptivo
- [ ] Scope está contenido (no se salió de la tarea)
```

---

## 📚 Documentación

### JSDoc/Comments

```typescript
/**
 * Crea un nuevo grupo de Amigo Invisible
 *
 * @param dto - DTO con datos del grupo
 * @returns Grupo creado con ID asignado
 * @throws InvalidBudgetError si budget <= 0
 * @throws InvalidNameError si name está vacío
 *
 * @example
 * const group = await createGroupUseCase.execute({
 *   name: 'Familia 2026',
 *   budgetLimit: 500,
 *   adminId: 'user123'
 * });
 */
export async function execute(dto: CreateGroupDTO): Promise<Group> {}
```

### README de Carpetas

Si una carpeta tiene lógica compleja, agregar `README.md`:

```
adapters/persistence/README.md
- Explicar qué es cada repository
- Cómo añadir uno nuevo
- Patrones utilizados
```

### Cambios Arquitectónicos

Siempre actualizar ARCHITECTURE.md si:

- Se añade una nueva capa
- Se cambia flujo de datos
- Se añaden nuevas entidades
- Se cambian puertos

---

## 🧪 Testing

### Estructura

```
- Unit Tests: Junto a código (ej: `CreateGroupUseCase.spec.ts`)
- Integration Tests: Carpeta `__tests__/integration/`
- E2E Tests: Futuro, no en MVP
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

- Usar **Semantic Versioning**: MAJOR.MINOR.PATCH
- Commits descriptivos: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Ejemplo: `feat: add group deletion functionality`

---

**Última actualización:** Enero 2026
**Versión:** 1.0.0 (MVP)
