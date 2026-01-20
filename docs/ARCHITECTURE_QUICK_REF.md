# 🏗️ INVFriend - Referencia Rápida de Arquitectura

## 📊 Flujo de Datos

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
│  │ (Datos)          │ (Usuarios)   │ (Lógica)       │     │
│  └──────────────────┴──────────────┴────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Capas Hexagonales

### **Frontend (Angular)**

```
┌─ ADAPTERS (Presentación)
│  └─ Componentes: LoginComponent, GroupListComponent, etc
│  └─ HTTP Services: GroupHttpService, AuthHttpService
│  └─ Guards: AuthGuard, AdminGuard
│
├─ PORTS (Interfaces)
│  └─ IGroupRepository
│  └─ IGroupHttpPort
│
├─ APPLICATION (Lógica)
│  └─ Use Cases: CreateGroupUseCase, GetSecretSantaUseCase
│  └─ Services: GroupApplicationService
│  └─ DTOs: CreateGroupDTO
│
├─ DOMAIN (Modelos)
│  └─ Modelos: Group, User, Wish
│  └─ Errores: GroupNotFoundError
│
└─ SHARED (Utilidades)
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
├─ APPLICATION (Lógica)
│  └─ Use Cases: CreateGroupUseCase, PerformRaffleUseCase
│  └─ Services: GroupApplicationService
│  └─ DTOs: CreateGroupDTO, RaffleResultDTO
│
├─ DOMAIN (Lógica Pura)
│  └─ Entities: Group, User, Wish, Assignment, Notification
│  └─ Errors: DomainError, InvalidBudgetError, GroupNotFoundError
│
└─ SHARED
   └─ Utils: Logger, Randomizer
   └─ Constants: AppConstants
   └─ Types: Shared types
```

---

## 🔄 Flujos Principales

### **1️⃣ Crear Grupo**

```
Angular Component
    ↓ (user input)
GroupApplicationService (Frontend)
    ↓ (llamada HTTP POST /api/groups)
GroupController (Backend)
    ↓
CreateGroupUseCase
    ↓ (inyecta IGroupRepository)
FirebaseGroupRepository
    ↓ (Firebase SDK)
Realtime Database
    ↓ (retorna Group creado)
```

### **2️⃣ Realizar Sorteo**

```
Admin click "Iniciar Sorteo"
    ↓
RaffleController
    ↓
PerformRaffleUseCase
    ├─ Valida que tenga ≥2 miembros
    ├─ Genera asignaciones aleatorias
    ├─ Guarda en FirebaseAssignmentRepository
    └─ Envía notificaciones
    ↓
Notificación a cada usuario
    ↓
Frontend recibe y muestra
```

### **3️⃣ Ver Amigo Invisible**

```
Usuario entra a grupo
    ↓
GetSecretSantaUseCase (Frontend)
    ↓ (HTTP GET /api/groups/:id/secret-santa)
GetSecretSantaController (Backend)
    ↓ (valida que sorteo esté completado)
GetSecretSantaWishesUseCase
    ├─ Obtiene assignment del usuario
    ├─ Obtiene deseos del amigo invisible
    ├─ Retorna Anonymous (sin nombre)
    ↓
Frontend muestra deseos de amigo invisible
```

---

## 📦 Archivos Clave

### Backend

```
backend/src/
├── domain/entities/Group.ts         ⭐ Entidad principal
├── application/use-cases/           ⭐ Lógica de negocio
│   ├── CreateGroupUseCase.ts
│   ├── PerformRaffleUseCase.ts
│   └── AddWishUseCase.ts
├── adapters/persistence/            ⭐ BD
│   └── FirebaseGroupRepository.ts
└── adapters/http/controllers/       ⭐ API
    ├── GroupController.ts
    └── RaffleController.ts
```

### Frontend

```
frontend/src/app/
├── domain/models/group.model.ts     ⭐ Modelos
├── application/use-cases/           ⭐ Lógica
├── adapters/components/             ⭐ UI
│   ├── group-list/
│   ├── group-detail/
│   └── wish-list/
└── adapters/services/               ⭐ HTTP
    ├── group-http.service.ts
    └── auth-http.service.ts
```

---

## 🔐 Seguridad - Quién Ve Qué

```
USUARIO A (Admin)
├─ Puede ver: todos los miembros, crear sorteo, eliminar grupo
└─ NO puede: ver deseos de otros hasta sorteo

USUARIO B (Miembro)
├─ Puede ver: lista de miembros del grupo
└─ Después del sorteo:
   ├─ Puede ver: su amigo invisible (anónimo) y sus deseos
   └─ NO puede ver: amigos invisibles de otros

SISTEMA
└─ Verifica Firebase Rules antes de retornar datos
```

---

## 🎯 Validaciones en Capas

```
┌─────────────────────────────────┐
│ CAPA 1: Frontend (Angular)       │
│ - Validación UX (campos)        │
│ - DTO validation antes de enviar│
└──────────────┬──────────────────┘
               │ HTTP
┌──────────────▼──────────────────┐
│ CAPA 2: Backend HTTP (Express)  │
│ - Autenticación                 │
│ - Autorización (es admin?)      │
│ - DTO validation                │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ CAPA 3: Use Case                │
│ - Lógica de negocio             │
│ - Reglas de dominio             │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ CAPA 4: Entity (Domain)         │
│ - Validaciones invariantes      │
│ - Estado válido                 │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│ CAPA 5: Firebase Rules          │
│ - Seguridad a nivel datos       │
│ - Quién puede ver qué           │
└─────────────────────────────────┘
```

---

## 📋 Checklist de Desarrollo

Cuando implementas una feature nueva:

```
☐ Lee ARCHITECTURE.md para tu feature
☐ Identifica qué capas necesita tocar
☐ Comienza por Domain (entities)
☐ Luego Application (use cases)
☐ Luego Adapters (controllers, services)
☐ Tests en cada capa
☐ Respeta las interfaces (ports)
☐ Actualiza documentación si cambia arch
```

---

## 🚀 Ejemplo: Agregar Nueva Feature

Supongamos: "Cambiar nombre del grupo"

**1. Domain (Entidad)**

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

**2. Application (Lógica)**

```typescript
// backend/src/application/use-cases/ChangeGroupNameUseCase.ts
class ChangeGroupNameUseCase {
  execute(groupId: string, newName: string): Promise<void> {
    const group = await this.repository.findById(groupId);
    group.changeName(newName); // Usa método de entity
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

## 📞 Referencia de Interfaces Principales

```typescript
// Puertos de Repositorio (Backend)
interface IGroupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
}

// Puertos de Servicio (Backend)
interface INotificationPort {
  sendRaffleCompleted(userId: string, groupId: string): Promise<void>;
  sendWishAdded(userId: string, groupId: string): Promise<void>;
}

// DTOs (Ambos)
interface CreateGroupDTO {
  name: string;
  budgetLimit: number;
  adminId: string;
}
```

---

**Esta es tu hoja de referencia. Cuando estés en duda: READ → ARCHITECTURE.md**

_Última actualización: Enero 2026_
