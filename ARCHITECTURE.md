# INVFriend - Arquitectura y Especificación Técnica

## 📐 Arquitectura Hexagonal

La aplicación sigue el patrón de **Arquitectura Hexagonal (Ports & Adapters)** para maximizar mantenibilidad, testabilidad y separación de concernencias.

```
┌─────────────────────────────────────────────────────────────┐
│                    ADAPTERS (EXTERNOS)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  UI Angular  │  │ Firebase DB  │  │Firebase Auth │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  PORTS (INPUT) │
                    └───────┬────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│               BUSINESS LOGIC (NÚCLEO)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Use Cases / Application Services                     │  │
│  │  - CreateGroupUseCase                              │  │
│  │  - PerformRaffleUseCase                            │  │
│  │  - UpdateWishesUseCase                             │  │
│  │  - InviteUserUseCase                               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Entities / Domain Models                            │  │
│  │  - Group, User, Wish, Assignment, Notification    │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │ PORTS (OUTPUT) │
                    └───────┬────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              ADAPTERS (EXTERNOS - OUTPUT)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Repositories  │  │  Notification│  │  Email/Push  │      │
│  │ (Firebase)   │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Monorepo

```
INVFriend/
├── frontend/                      # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── adapters/         # Angular Components, Services HTTP
│   │   │   ├── domain/           # Modelos de dominio
│   │   │   ├── application/      # Use Cases, Application Services
│   │   │   ├── shared/           # Guards, Interceptors, Utils
│   │   │   └── ports/            # Interfaces (Repositories, Services)
│   │   ├── environments/
│   │   ├── assets/
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # Node.js Backend
│   ├── src/
│   │   ├── adapters/             # Express Routes, Firebase Adapters
│   │   ├── domain/               # Business Logic, Entities
│   │   ├── application/          # Use Cases, Services
│   │   ├── shared/               # Utils, Constants, Middlewares
│   │   ├── ports/                # Interfaces (Repositories)
│   │   ├── config/               # Firebase, Environment config
│   │   └── index.ts              # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── shared/                        # Código compartido (types, constants)
│   ├── src/
│   │   ├── models/
│   │   ├── constants/
│   │   └── utils/
│   └── package.json
│
├── ARCHITECTURE.md                # Este archivo
├── GUIDELINES.md                  # Guías de desarrollo
├── README.md                      # Documentación pública
├── firebase.json
├── .gitignore
├── package.json (root)            # Monorepo config
└── tsconfig.base.json
```

## 🗄️ Modelos de Datos

### **User (Usuario)**

```typescript
{
  id: string;                    // UID de Firebase Auth
  email: string;                 // Email único
  name: string;                  // Nombre del usuario
  photoUrl?: string;             // URL de foto de perfil
  createdAt: number;             // Timestamp de creación
  updatedAt: number;             // Timestamp de última actualización
}
```

### **Group (Grupo)**

```typescript
{
  id: string;                    // UID generado
  name: string;                  // Nombre del grupo
  description?: string;          // Descripción opcional
  adminId: string;               // UID del admin que creó el grupo
  members: string[];             // Array de UIDs de miembros
  budgetLimit: number;           // Límite de presupuesto en moneda
  raffleStatus: 'pending' | 'completed'; // Estado del sorteo
  raffleDate?: number;           // Timestamp cuando se realizó sorteo
  createdAt: number;             // Timestamp de creación
  updatedAt: number;             // Timestamp de última actualización
}
```

### **Assignment (Asignación)**

```typescript
{
  id: string; // UID generado
  groupId: string; // UID del grupo
  userId: string; // UID del usuario (quien recibe regalos)
  secretSantaId: string; // UID del amigo invisible
  createdAt: number; // Timestamp de creación
}
```

### **Wish (Deseo)**

```typescript
{
  id: string;                    // UID generado
  userId: string;                // UID del usuario que pone el deseo
  groupId: string;               // UID del grupo
  title: string;                 // Título del deseo
  description?: string;          // Descripción del deseo
  url?: string;                  // URL de referencia (ej: producto)
  createdAt: number;             // Timestamp de creación
  updatedAt: number;             // Timestamp de última actualización
}
```

### **Notification (Notificación)**

```typescript
{
  id: string; // UID generado
  userId: string; // UID del usuario que recibe notificación
  groupId: string; // UID del grupo
  type: "raffle_completed" | "wish_added"; // Tipo de notificación
  message: string; // Mensaje descriptivo
  read: boolean; // Si fue leída
  createdAt: number; // Timestamp de creación
}
```

## 🔄 Flujos Principales

### **1. Crear Grupo**

1. Admin crea grupo con nombre, descripción (opcional) y presupuesto
2. Se genera ID del grupo
3. El admin es añadido como miembro
4. Se genera enlace/código para invitar (opcional: compartible)

### **2. Invitar Miembros**

1. Admin añade emails de usuarios a invitar
2. Si el usuario no existe, se envía invitación
3. Si existe, se añade al grupo
4. Se notifica al usuario que ha sido invitado a un grupo

### **3. Realizar Sorteo**

1. Admin verifica que todos los miembros estén en el grupo
2. Admin inicia el sorteo
3. Sistema realiza asignación aleatoria (cada usuario ≠ amigo invisible)
4. Se generan registros de Assignment
5. Se notifica a todos los usuarios que el sorteo se completó
6. `raffleStatus` cambia a 'completed'

### **4. Ver Amigo Invisible**

1. Usuario accede a su grupo
2. Solo ve la asignación (amigo invisible) si sorteo está completado
3. Puede ver los deseos de su amigo invisible

### **5. Añadir/Editar Deseos**

1. Usuario añade deseos para su grupo
2. Solo su amigo invisible puede verlos (después de sorteo)
3. Notifica al amigo invisible que hay nuevos deseos

### **6. Eliminar Grupo**

1. Solo admin puede eliminar
2. Se eliminan todas las asignaciones del grupo
3. Se eliminan todos los deseos del grupo
4. Se notifica a miembros que el grupo fue eliminado

## 🔌 Puertos y Adaptadores

### **Adapters de Entrada (Input Ports)**

- **GroupController** (API REST): Endpoints para crear, editar, eliminar grupos
- **RaffleController** (API REST): Endpoint para realizar sorteo
- **WishController** (API REST): Endpoints para CRUD de deseos
- **UserController** (API REST): Endpoints de autenticación y perfil

### **Adapters de Salida (Output Ports)**

- **FirebaseGroupRepository**: Implementación de IGroupRepository
- **FirebaseUserRepository**: Implementación de IUserRepository
- **FirebaseWishRepository**: Implementación de IWishRepository
- **FirebaseNotificationService**: Implementación de INotificationService

### **Puertos (Interfaces)**

```typescript
// Puertos de Repositorio
interface IGroupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  update(group: Group): Promise<void>;
  delete(id: string): Promise<void>;
  findByMemberId(userId: string): Promise<Group[]>;
}

interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<void>;
}

interface IWishRepository {
  create(wish: Wish): Promise<Wish>;
  findByGroupAndUser(groupId: string, userId: string): Promise<Wish[]>;
  update(wish: Wish): Promise<void>;
  delete(id: string): Promise<void>;
}

// Puertos de Servicio
interface INotificationService {
  sendGroupInvite(userId: string, groupId: string): Promise<void>;
  sendRaffleCompleted(userId: string, groupId: string): Promise<void>;
  sendWishAdded(
    userId: string,
    groupId: string,
    fromUser: string,
  ): Promise<void>;
}
```

## 🎯 Use Cases (MVP)

### Backend

- `CreateGroupUseCase` - Crear nuevo grupo
- `InviteUserToGroupUseCase` - Invitar usuario a grupo
- `PerformRaffleUseCase` - Realizar sorteo automático
- `AddWishUseCase` - Añadir deseo
- `UpdateWishUseCase` - Editar deseo
- `DeleteWishUseCase` - Eliminar deseo
- `DeleteGroupUseCase` - Eliminar grupo
- `GetGroupDetailsUseCase` - Obtener detalles del grupo
- `GetSecretSantaWishesUseCase` - Obtener deseos del amigo invisible
- `AuthenticateUserUseCase` - Autenticar usuario (email/Google)

### Frontend

- Pantalla de login
- Pantalla de registro
- Lista de grupos del usuario
- Crear nuevo grupo
- Detalles del grupo
- Panel de admin para invitar y realizar sorteo
- Ver amigo invisible y sus deseos
- Añadir/editar deseos propios
- Notificaciones

## 🔐 Seguridad

- **Autenticación:** Firebase Authentication (email + Google)
- **Autorización:**
  - Solo admin puede realizar sorteo y eliminar grupo
  - Solo miembros pueden ver detalles del grupo
  - Solo el amigo invisible asignado puede ver tus deseos (post-sorteo)
- **Reglas Firestore:** Definidas por UID y roles
- **CORS:** Backend solo acepta requests desde frontend autorizado

## 🧪 Testing (Futuro - No en MVP)

- Unit Tests: Jest
- Integration Tests: Supertest (backend)
- E2E Tests: Cypress (frontend)

## 📊 Dependencias Principales

**Frontend:**

- @angular/core
- @angular/common
- @angular/forms
- @angular/router
- firebase
- rxjs

**Backend:**

- express
- firebase-admin
- typescript
- dotenv

**Shared:**

- typescript
- Types comunes

## 🚀 Deployment

- **Frontend:** Firebase Hosting
- **Backend:** Cloud Functions o Cloud Run
- **BD:** Firebase Realtime Database
- **Auth:** Firebase Authentication

---

**Versión:** 1.0.0 (MVP)  
**Última actualización:** Enero 2026
