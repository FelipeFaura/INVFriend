# INVFriend - Architecture and Technical Specification

## 📐 Hexagonal Architecture

The application follows the **Hexagonal Architecture (Ports & Adapters)** pattern to maximize maintainability, testability, and separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                    ADAPTERS (EXTERNAL)                      │
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
│               BUSINESS LOGIC (CORE)                         │
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
│              ADAPTERS (EXTERNAL - OUTPUT)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Repositories  │  │  Notification│  │  Email/Push  │      │
│  │ (Firebase)   │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
INVFriend/
├── frontend/         # Angular Application (UI layer)
├── backend/          # Node.js Backend (API layer)
├── shared/           # Shared types and constants
└── docs/             # Project documentation
```

### Layer Organization

Each layer (frontend/backend) follows hexagonal architecture:

- **adapters/** - External interfaces (UI components, HTTP, DB adapters)
- **domain/** - Business entities and rules (pure logic, no dependencies)
- **application/** - Use cases and application services
- **ports/** - Interfaces defining contracts between layers
- **shared/** - Utilities, constants, and helpers

📖 **Detailed folder structure**: See [GUIDELINES.md](./GUIDELINES.md#folder-structure)

## 🗄️ Data Models

### **User**

```typescript
{
  id: string;                    // Firebase Auth UID
  email: string;                 // Unique email
  name: string;                  // User name
  photoUrl?: string;             // Profile photo URL
  createdAt: number;             // Creation timestamp
  updatedAt: number;             // Last update timestamp
}
```

### **Group**

```typescript
{
  id: string;                    // Generated UID
  name: string;                  // Group name
  description?: string;          // Optional description
  adminId: string;               // UID of the admin who created the group
  members: string[];             // Array of member UIDs
  budgetLimit: number;           // Budget limit in currency
  raffleStatus: 'pending' | 'completed'; // Raffle status
  raffleDate?: number;           // Timestamp when raffle was performed
  createdAt: number;             // Creation timestamp
  updatedAt: number;             // Last update timestamp
}
```

### **Assignment**

```typescript
{
  id: string; // Generated UID
  groupId: string; // Group UID
  userId: string; // User UID (who receives gifts)
  secretSantaId: string; // Secret Santa UID
  createdAt: number; // Creation timestamp
}
```

### **Wish**

```typescript
{
  id: string;                    // Generated UID
  userId: string;                // UID of the user who creates the wish
  groupId: string;               // Group UID
  title: string;                 // Wish title
  description?: string;          // Wish description
  url?: string;                  // Reference URL (e.g., product)
  createdAt: number;             // Creation timestamp
  updatedAt: number;             // Last update timestamp
}
```

### **Notification**

```typescript
{
  id: string; // Generated UID
  userId: string; // UID of the user who receives the notification
  groupId: string; // Group UID
  type: "raffle_completed" | "wish_added"; // Notification type
  message: string; // Descriptive message
  read: boolean; // Whether it was read
  createdAt: number; // Creation timestamp
}
```

## 🔄 Main Flows

### **1. Create Group**

1. Admin creates group with name, description (optional), and budget
2. Group ID is generated
3. Admin is added as a member
4. Invitation link/code is generated (optional: shareable)

### **2. Invite Members**

1. Admin adds emails of users to invite
2. If the user doesn't exist, an invitation is sent
3. If they exist, they are added to the group
4. User is notified that they have been invited to a group

### **3. Perform Raffle**

1. Admin verifies that all members are in the group
2. Admin starts the raffle
3. System performs random assignment (each user ≠ secret santa)
4. Assignment records are generated
5. All users are notified that the raffle has been completed
6. `raffleStatus` changes to 'completed'

### **4. View Secret Santa**

1. User accesses their group
2. They only see the assignment (secret santa) if raffle is completed
3. They can view their secret santa's wishes

### **5. Add/Edit Wishes**

1. User adds wishes for their group
2. Only their secret santa can see them (after raffle)
3. Notifies the secret santa that there are new wishes

### **6. Delete Group**

1. Only admin can delete
2. All group assignments are deleted
3. All group wishes are deleted
4. Members are notified that the group was deleted

## 🔌 Ports and Adapters

### **Input Adapters (Input Ports)**

- **GroupController** (REST API): Endpoints to create, edit, delete groups
- **RaffleController** (REST API): Endpoint to perform raffle
- **WishController** (REST API): Endpoints for CRUD of wishes
- **UserController** (REST API): Endpoints for authentication and profile

### **Output Adapters (Output Ports)**

- **FirebaseGroupRepository**: Implementation of IGroupRepository
- **FirebaseUserRepository**: Implementation of IUserRepository
- **FirebaseWishRepository**: Implementation of IWishRepository
- **FirebaseNotificationService**: Implementation of INotificationService

### **Ports (Interfaces)**

```typescript
// Repository Ports
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

// Service Ports
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

- `CreateGroupUseCase` - Create new group
- `InviteUserToGroupUseCase` - Invite user to group
- `PerformRaffleUseCase` - Perform automatic raffle
- `AddWishUseCase` - Add wish
- `UpdateWishUseCase` - Edit wish
- `DeleteWishUseCase` - Delete wish
- `DeleteGroupUseCase` - Delete group
- `GetGroupDetailsUseCase` - Get group details
- `GetSecretSantaWishesUseCase` - Get secret santa wishes
- `AuthenticateUserUseCase` - Authenticate user (email/Google)

### Frontend

- Login screen
- Registration screen
- User's group list
- Create new group
- Group details
- Admin panel to invite and perform raffle
- View secret santa and their wishes
- Add/edit own wishes
- Notifications

## 🔐 Security

- **Authentication:** Firebase Authentication (email + Google)
- **Authorization:**
  - Only admin can perform raffle and delete group
  - Only members can view group details
  - Only the assigned secret santa can view your wishes (post-raffle)
- **Firestore Rules:** Defined by UID and roles
- **CORS:** Backend only accepts requests from authorized frontend

## 🧪 Testing (Future - Not in MVP)

- Unit Tests: Jest
- Integration Tests: Supertest (backend)
- E2E Tests: Cypress (frontend)

## 📊 Main Dependencies

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
- Common types

## 🚀 Deployment

- **Frontend:** Firebase Hosting
- **Backend:** Cloud Functions or Cloud Run
- **DB:** Firebase Realtime Database
- **Auth:** Firebase Authentication

---

**Version:** 1.0.0 (MVP)  
**Last updated:** January 2026
