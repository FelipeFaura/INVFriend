# 🧪 SKILL: Unit Testing Standards

## 📌 Purpose

This SKILL defines the **comprehensive testing standards** for the INVFriend project. It establishes testing patterns, conventions, mocking strategies, and quality expectations to ensure robust, maintainable test suites.

When you (AI) implement features, your tests must follow this SKILL to guarantee reliability and consistency across the codebase.

---

## 🗺️ Testing Philosophy

### Core Principles

1. **Tests are First-Class Code**: Tests deserve the same care as production code
2. **TDD When Possible**: Write tests before implementation
3. **Test Behavior, Not Implementation**: Focus on "what" not "how"
4. **Isolated Tests**: Each test should run independently
5. **Fast Tests**: Tests should run in milliseconds
6. **Readable Tests**: Tests serve as living documentation

### Testing Pyramid

```
           ╱╲
          ╱E2E╲         <- Few (UI flows) [FUTURE - Not in MVP]
         ╱──────╲
        ╱Integration╲   <- Some (API endpoints, DB operations)
       ╱────────────╲
      ╱  Unit Tests  ╲  <- Many (Business logic, use cases, entities)
     ╱────────────────╲
```

**Focus**: This SKILL covers **Unit Tests** and **Integration Tests**.

---

## 🔧 Test Configuration

### Backend (Jest)

**Configuration**: [backend/jest.config.js](../backend/jest.config.js)

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.spec.ts", "!src/index.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

**Run Commands**:

```bash
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage report
npm test -- Group.spec.ts   # Run specific test
```

### Frontend (Angular - Karma/Jasmine)

**Configuration**: [frontend/angular.json](../frontend/angular.json) + [frontend/tsconfig.spec.json](../frontend/tsconfig.spec.json)

**Run Commands**:

```bash
ng test                     # Run all tests with Karma
ng test --code-coverage     # With coverage
ng test --watch=false       # Single run (CI)
```

---

## 📁 Test File Structure

### Naming Conventions

| Type             | Pattern                           | Example                                   |
| ---------------- | --------------------------------- | ----------------------------------------- |
| Unit Test        | `[FileName].spec.ts`              | `Group.spec.ts`                           |
| Integration Test | `[feature].integration.spec.ts`   | `group.integration.spec.ts`               |
| Location         | `__tests__/` folder or co-located | `domain/entities/__tests__/Group.spec.ts` |

### Backend Test Structure

```
backend/src/
├── domain/
│   ├── entities/
│   │   ├── Group.ts
│   │   └── __tests__/
│   │       └── Group.spec.ts            # Unit test for entity
│   └── errors/
│       └── __tests__/
│           └── AuthErrors.spec.ts
│
├── application/
│   └── use-cases/
│       ├── CreateGroupUseCase.ts
│       └── __tests__/
│           └── CreateGroupUseCase.spec.ts   # Unit test for use case
│
├── adapters/
│   ├── auth/
│   │   ├── FirebaseAuthAdapter.ts
│   │   └── __tests__/
│   │       └── FirebaseAuthAdapter.spec.ts  # Unit test with mocks
│   └── http/
│       └── controllers/
│           ├── AuthController.ts
│           └── __tests__/
│               └── AuthController.spec.ts   # Unit test for controller
│
└── __tests__/
    └── integration/
        ├── auth.integration.spec.ts         # API integration tests
        └── group.integration.spec.ts
```

---

## ✍️ Writing Unit Tests

### Test Structure: AAA Pattern

**Arrange → Act → Assert**

```typescript
describe("CreateGroupUseCase", () => {
  describe("execute", () => {
    it("should create a group with valid data", async () => {
      // ===== ARRANGE =====
      const dto: CreateGroupDTO = {
        name: "Test Group",
        budgetLimit: 500,
        adminId: "admin123",
      };

      const mockRepository: jest.Mocked<IGroupRepository> = {
        create: jest.fn().mockResolvedValue(expect.any(Object)),
        findById: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      };

      const useCase = new CreateGroupUseCase(mockRepository);

      // ===== ACT =====
      const result = await useCase.execute(dto);

      // ===== ASSERT =====
      expect(result.name).toBe("Test Group");
      expect(result.budgetLimit).toBe(500);
      expect(result.members).toContain("admin123");
      expect(result.raffleStatus).toBe("pending");
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
```

### Naming Tests: Behavioral Descriptions

✅ **Good Test Names** (describe behavior):

```typescript
it("should create a group with valid data");
it("should throw InvalidBudgetError when budget is negative");
it("should add admin as first member on group creation");
it("should normalize email to lowercase before validation");
it("should return null when user is not found");
```

❌ **Bad Test Names** (implementation details):

```typescript
it("tests the execute method");
it("should work");
it("validates input");
it("test 1");
```

### Test Organization: describe() Blocks

```typescript
describe("Group Entity", () => {
  // Test class/module

  describe("create() factory method", () => {
    // Test specific method/function

    describe("validation", () => {
      // Group related tests

      it("should throw ValidationError when name is empty", () => {});
      it("should throw ValidationError when name is only whitespace", () => {});
      it("should throw InvalidBudgetError when budget is zero", () => {});
      it("should throw InvalidBudgetError when budget is negative", () => {});
    });

    describe("success cases", () => {
      it("should create group with trimmed name", () => {});
      it("should add admin to members array", () => {});
      it("should set raffleStatus to pending", () => {});
      it("should generate valid timestamps", () => {});
    });
  });

  describe("isValidForRaffle()", () => {
    it("should return false when less than 2 members", () => {});
    it("should return true when 2 or more members", () => {});
  });
});
```

---

## 🎭 Mocking Strategies

### 1. Mocking Dependencies (Repositories, Services)

#### Pattern: Create Mock Type

```typescript
import { IGroupRepository } from "../../../../ports/IGroupRepository";

describe("CreateGroupUseCase", () => {
  let useCase: CreateGroupUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

  beforeEach(() => {
    // Create fully typed mock with all methods
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByMemberId: jest.fn(),
    };

    // Inject mock into use case
    useCase = new CreateGroupUseCase(mockRepository);
  });

  it("should call repository.create with correct data", async () => {
    // Mock return value
    mockRepository.create.mockResolvedValue(expect.any(Object));

    const dto = { name: "Test", budgetLimit: 500, adminId: "admin1" };
    await useCase.execute(dto);

    // Verify interaction
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test",
        budgetLimit: 500,
      }),
    );
  });
});
```

### 2. Mocking Firebase (Admin SDK)

#### Pattern: Mock Firebase Modules

```typescript
import { FirebaseAuthAdapter } from "../FirebaseAuthAdapter";

describe("FirebaseAuthAdapter", () => {
  let adapter: FirebaseAuthAdapter;
  let mockAuth: any;
  let mockDb: any;

  beforeEach(() => {
    // Mock Firebase Auth
    mockAuth = {
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      getUser: jest.fn(),
      createCustomToken: jest.fn(),
      verifyIdToken: jest.fn(),
    };

    // Mock Firestore
    mockDb = {
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          set: jest.fn().mockResolvedValue(undefined),
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({ id: "user123", email: "test@example.com" }),
          }),
        }),
      }),
    };

    // Inject mocks
    adapter = new FirebaseAuthAdapter(mockAuth, mockDb);
  });

  it("should create user in Firebase Auth", async () => {
    mockAuth.getUserByEmail.mockRejectedValue({ code: "auth/user-not-found" });
    mockAuth.createUser.mockResolvedValue({
      uid: "user123",
      email: "test@example.com",
    });
    mockAuth.createCustomToken.mockResolvedValue("token123");

    await adapter.registerWithEmail("test@example.com", "Password123", "John");

    expect(mockAuth.createUser).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Password123",
      displayName: "John",
    });
  });
});
```

### 3. Mocking Express Request/Response

#### Pattern: Partial Mocks for Controllers

```typescript
import { Request, Response } from "express";
import { AuthController } from "../AuthController";

describe("AuthController", () => {
  let controller: AuthController;
  let mockAuthPort: jest.Mocked<IAuthPort>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;

  beforeEach(() => {
    mockAuthPort = {
      registerWithEmail: jest.fn(),
      loginWithEmail: jest.fn(),
      loginWithGoogle: jest.fn(),
      getCurrentUser: jest.fn(),
      verifyToken: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };

    controller = new AuthController(mockAuthPort);

    // Mock response with chaining
    jsonData = null;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        jsonData = data;
      }),
    };

    mockRequest = {
      body: {},
      headers: {},
      params: {},
    };
  });

  it("should return 201 on successful registration", async () => {
    const user = User.create("user123", "test@example.com", "John", null);
    mockAuthPort.registerWithEmail.mockResolvedValue({
      user: user.toJSON(),
      accessToken: "token123",
      expiresIn: 3600,
    });

    mockRequest.body = {
      email: "test@example.com",
      password: "Password123",
      name: "John",
    };

    await controller.register(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(jsonData.accessToken).toBe("token123");
  });
});
```

---

## 🎯 Coverage Requirements

### Minimum Thresholds

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

### What to Test (Priority)

**HIGH PRIORITY** (100% coverage required):

- ✅ **Domain Entities**: All business logic and validations
- ✅ **Use Cases**: All business rules and error paths
- ✅ **Validators**: All validation functions
- ✅ **Error Handlers**: All error scenarios

**MEDIUM PRIORITY** (90%+ coverage):

- ✅ **Adapters**: Controllers, repositories with mocked dependencies
- ✅ **Services**: Application services
- ✅ **DTOs**: Transformation logic if complex

**LOW PRIORITY** (Coverage optional):

- ℹ️ **Configuration files**: `config/firebase.config.ts`
- ℹ️ **Entry points**: `index.ts`, `main.ts`
- ℹ️ **Type definitions**: Pure interfaces/types

---

## 📝 Test Patterns & Examples

### Pattern 1: Testing Entities (Domain Layer)

**File**: `backend/src/domain/entities/__tests__/Group.spec.ts`

```typescript
import { Group } from "../Group";
import { ValidationError } from "../../errors/AuthErrors";
import { InvalidBudgetError } from "../../errors/AuthErrors";

describe("Group Entity", () => {
  describe("create() factory method", () => {
    describe("validation errors", () => {
      it("should throw ValidationError when name is empty", () => {
        expect(() => Group.create("", 500, "admin1")).toThrow(ValidationError);
      });

      it("should throw ValidationError when name is only whitespace", () => {
        expect(() => Group.create("   ", 500, "admin1")).toThrow(
          ValidationError,
        );
      });

      it("should throw InvalidBudgetError when budget is zero", () => {
        expect(() => Group.create("Test", 0, "admin1")).toThrow(
          InvalidBudgetError,
        );
      });

      it("should throw InvalidBudgetError when budget is negative", () => {
        expect(() => Group.create("Test", -100, "admin1")).toThrow(
          InvalidBudgetError,
        );
      });
    });

    describe("success cases", () => {
      it("should create group with valid data", () => {
        const group = Group.create("Test Group", 500, "admin1");

        expect(group.name).toBe("Test Group");
        expect(group.budgetLimit).toBe(500);
        expect(group.adminId).toBe("admin1");
        expect(group.raffleStatus).toBe("pending");
      });

      it("should trim whitespace from name", () => {
        const group = Group.create("  Test Group  ", 500, "admin1");

        expect(group.name).toBe("Test Group");
      });

      it("should add admin as first member", () => {
        const group = Group.create("Test", 500, "admin1");

        expect(group.members).toContain("admin1");
        expect(group.members.length).toBe(1);
      });

      it("should set timestamps", () => {
        const before = Date.now();
        const group = Group.create("Test", 500, "admin1");
        const after = Date.now();

        expect(group.createdAt).toBeGreaterThanOrEqual(before);
        expect(group.createdAt).toBeLessThanOrEqual(after);
        expect(group.updatedAt).toBe(group.createdAt);
      });

      it("should generate unique IDs", () => {
        const group1 = Group.create("Test1", 500, "admin1");
        const group2 = Group.create("Test2", 500, "admin1");

        expect(group1.id).not.toBe(group2.id);
      });
    });
  });

  describe("isValidForRaffle()", () => {
    it("should return false when only 1 member", () => {
      const group = Group.create("Test", 500, "admin1");

      expect(group.isValidForRaffle()).toBe(false);
    });

    it("should return true when 2 or more members", () => {
      const group = Group.create("Test", 500, "admin1");
      // Simulate adding a member (in real code, use proper method)
      const groupWithMembers = new Group(
        group.id,
        group.name,
        group.budgetLimit,
        group.adminId,
        ["admin1", "user2"],
        group.raffleStatus,
        group.createdAt,
        group.updatedAt,
      );

      expect(groupWithMembers.isValidForRaffle()).toBe(true);
    });
  });
});
```

### Pattern 2: Testing Use Cases (Application Layer)

**File**: `backend/src/application/use-cases/__tests__/CreateGroupUseCase.spec.ts`

```typescript
import { CreateGroupUseCase } from "../CreateGroupUseCase";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { CreateGroupDTO } from "../../dto/CreateGroupDTO";
import {
  InvalidBudgetError,
  ValidationError,
} from "../../../domain/errors/AuthErrors";

describe("CreateGroupUseCase", () => {
  let useCase: CreateGroupUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByMemberId: jest.fn(),
    };

    useCase = new CreateGroupUseCase(mockRepository);
  });

  describe("execute", () => {
    it("should create a group with valid data", async () => {
      const dto: CreateGroupDTO = {
        name: "Test Group",
        budgetLimit: 500,
        adminId: "admin123",
      };

      mockRepository.create.mockResolvedValue(expect.any(Object));

      const result = await useCase.execute(dto);

      expect(result.name).toBe("Test Group");
      expect(result.budgetLimit).toBe(500);
      expect(result.adminId).toBe("admin123");
      expect(result.members).toContain("admin123");
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it("should throw InvalidBudgetError when budget is negative", async () => {
      const dto: CreateGroupDTO = {
        name: "Test",
        budgetLimit: -100,
        adminId: "admin123",
      };

      await expect(useCase.execute(dto)).rejects.toThrow(InvalidBudgetError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should throw ValidationError when name is empty", async () => {
      const dto: CreateGroupDTO = {
        name: "",
        budgetLimit: 500,
        adminId: "admin123",
      };

      await expect(useCase.execute(dto)).rejects.toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should call repository with created group", async () => {
      const dto: CreateGroupDTO = {
        name: "Test",
        budgetLimit: 500,
        adminId: "admin123",
      };

      mockRepository.create.mockResolvedValue(expect.any(Object));

      await useCase.execute(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test",
          budgetLimit: 500,
          adminId: "admin123",
          raffleStatus: "pending",
        }),
      );
    });

    it("should propagate repository errors", async () => {
      const dto: CreateGroupDTO = {
        name: "Test",
        budgetLimit: 500,
        adminId: "admin123",
      };

      const dbError = new Error("Database connection failed");
      mockRepository.create.mockRejectedValue(dbError);

      await expect(useCase.execute(dto)).rejects.toThrow(dbError);
    });
  });
});
```

### Pattern 3: Testing Adapters (Infrastructure Layer)

**File**: `backend/src/adapters/auth/__tests__/FirebaseAuthAdapter.spec.ts`

```typescript
import { FirebaseAuthAdapter } from "../FirebaseAuthAdapter";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  ValidationError,
} from "../../../domain/errors/AuthErrors";

describe("FirebaseAuthAdapter", () => {
  let adapter: FirebaseAuthAdapter;
  let mockAuth: any;
  let mockDb: any;

  beforeEach(() => {
    mockAuth = {
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      createCustomToken: jest.fn(),
      verifyIdToken: jest.fn(),
    };

    mockDb = {
      collection: jest.fn(),
    };

    adapter = new FirebaseAuthAdapter(mockAuth, mockDb);
  });

  describe("registerWithEmail", () => {
    it("should successfully register a new user", async () => {
      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          set: jest.fn().mockResolvedValue(undefined),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.getUserByEmail.mockRejectedValue({
        code: "auth/user-not-found",
      });
      mockAuth.createUser.mockResolvedValue({
        uid: "user123",
        email: "test@example.com",
      });
      mockAuth.createCustomToken.mockResolvedValue("token123");

      const response = await adapter.registerWithEmail(
        "test@example.com",
        "Password123",
        "John Doe",
      );

      expect(response.user.email).toBe("test@example.com");
      expect(response.accessToken).toBe("token123");
      expect(mockAuth.createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123",
        displayName: "John Doe",
      });
    });

    it("should throw UserAlreadyExistsError if user exists", async () => {
      mockAuth.getUserByEmail.mockResolvedValue({ uid: "existing-user" });

      await expect(
        adapter.registerWithEmail(
          "existing@example.com",
          "Password123",
          "John",
        ),
      ).rejects.toThrow(UserAlreadyExistsError);
    });

    it("should validate email format", async () => {
      await expect(
        adapter.registerWithEmail("invalid-email", "Password123", "John"),
      ).rejects.toThrow(ValidationError);
    });

    it("should validate password strength", async () => {
      await expect(
        adapter.registerWithEmail("test@example.com", "weak", "John"),
      ).rejects.toThrow(ValidationError);
    });

    it("should normalize email to lowercase", async () => {
      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          set: jest.fn().mockResolvedValue(undefined),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.getUserByEmail.mockRejectedValue({
        code: "auth/user-not-found",
      });
      mockAuth.createUser.mockResolvedValue({ uid: "user123" });
      mockAuth.createCustomToken.mockResolvedValue("token123");

      await adapter.registerWithEmail(
        "Test@Example.COM",
        "Password123",
        "John",
      );

      expect(mockAuth.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
        }),
      );
    });
  });
});
```

### Pattern 4: Testing Controllers (HTTP Layer)

**File**: `backend/src/adapters/http/controllers/__tests__/AuthController.spec.ts`

```typescript
import { Request, Response } from "express";
import { AuthController } from "../AuthController";
import { IAuthPort } from "../../../../ports/IAuthPort";
import { User } from "../../../../domain/entities/User";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  ValidationError,
} from "../../../../domain/errors/AuthErrors";

describe("AuthController", () => {
  let controller: AuthController;
  let mockAuthPort: jest.Mocked<IAuthPort>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;

  beforeEach(() => {
    mockAuthPort = {
      registerWithEmail: jest.fn(),
      loginWithEmail: jest.fn(),
      loginWithGoogle: jest.fn(),
      getCurrentUser: jest.fn(),
      verifyToken: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };

    controller = new AuthController(mockAuthPort);

    jsonData = null;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        jsonData = data;
      }),
    };

    mockRequest = {
      body: {},
      headers: {},
    };
  });

  describe("register", () => {
    it("should successfully register a user", async () => {
      const user = User.create("user123", "test@example.com", "John Doe", null);
      mockAuthPort.registerWithEmail.mockResolvedValue({
        user: user.toJSON(),
        accessToken: "token123",
        expiresIn: 3600,
      });

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123",
        name: "John Doe",
      };

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(jsonData.accessToken).toBe("token123");
    });

    it("should handle UserAlreadyExistsError with 409", async () => {
      mockAuthPort.registerWithEmail.mockRejectedValue(
        new UserAlreadyExistsError("test@example.com"),
      );

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123",
        name: "John",
      };

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(jsonData.code).toBe("USER_ALREADY_EXISTS");
    });

    it("should handle ValidationError with 400", async () => {
      mockAuthPort.registerWithEmail.mockRejectedValue(
        new ValidationError("Invalid email"),
      );

      mockRequest.body = {
        email: "invalid",
        password: "Password123",
        name: "John",
      };

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonData.code).toBe("VALIDATION_ERROR");
    });
  });
});
```

---

## 🚫 Testing Anti-Patterns (What NOT to Do)

### ❌ Anti-Pattern 1: Testing Implementation Details

```typescript
// ❌ BAD: Testing private methods
it("should call private validateEmail method", () => {
  const spy = jest.spyOn(adapter as any, "validateEmail");
  adapter.registerWithEmail("test@example.com", "Pass123", "John");
  expect(spy).toHaveBeenCalled();
});

// ✅ GOOD: Test public behavior
it("should throw ValidationError for invalid email", async () => {
  await expect(
    adapter.registerWithEmail("invalid", "Pass123", "John"),
  ).rejects.toThrow(ValidationError);
});
```

### ❌ Anti-Pattern 2: Interdependent Tests

```typescript
// ❌ BAD: Tests depend on execution order
describe("GroupService", () => {
  let createdGroupId: string;

  it("should create group", async () => {
    const group = await service.createGroup({ name: "Test" });
    createdGroupId = group.id; // ⚠️ Shared state
  });

  it("should find created group", async () => {
    const group = await service.findById(createdGroupId); // ⚠️ Depends on previous test
    expect(group).toBeDefined();
  });
});

// ✅ GOOD: Each test is independent
describe("GroupService", () => {
  it("should create group", async () => {
    mockRepository.create.mockResolvedValue(mockGroup);
    const group = await service.createGroup({ name: "Test" });
    expect(group).toBeDefined();
  });

  it("should find group by ID", async () => {
    mockRepository.findById.mockResolvedValue(mockGroup);
    const group = await service.findById("group123");
    expect(group).toBeDefined();
  });
});
```

### ❌ Anti-Pattern 3: Excessive Mocking

```typescript
// ❌ BAD: Mocking everything (testing nothing)
it("should create group", async () => {
  const mockGroup = { id: "1", name: "Test" };
  jest.spyOn(Group, "create").mockReturnValue(mockGroup as any);
  mockRepository.create.mockResolvedValue(mockGroup);

  const result = await useCase.execute({ name: "Test" });

  expect(result).toBe(mockGroup);
  // This test doesn't actually test Group.create() logic!
});

// ✅ GOOD: Mock only external dependencies
it("should create group with valid data", async () => {
  mockRepository.create.mockResolvedValue(expect.any(Object));

  const result = await useCase.execute({
    name: "Test",
    budgetLimit: 500,
    adminId: "admin1",
  });

  // Real Group.create() runs, validations are tested
  expect(result.name).toBe("Test");
  expect(result.members).toContain("admin1");
});
```

### ❌ Anti-Pattern 4: Unclear Assertions

```typescript
// ❌ BAD: Vague assertions
it("should work", async () => {
  const result = await service.createGroup({ name: "Test" });
  expect(result).toBeTruthy(); // What does this actually verify?
});

// ✅ GOOD: Specific assertions
it("should create group with admin as first member", async () => {
  const result = await service.createGroup({
    name: "Test",
    budgetLimit: 500,
    adminId: "admin123",
  });

  expect(result.name).toBe("Test");
  expect(result.members).toEqual(["admin123"]);
  expect(result.raffleStatus).toBe("pending");
});
```

---

## 🎯 Test Checklist (Before Commit)

### For Every Feature Implementation

- [ ] **Unit tests exist** for all new code
- [ ] **Tests follow AAA pattern** (Arrange, Act, Assert)
- [ ] **Test names are descriptive** (behavior, not implementation)
- [ ] **All edge cases are tested** (empty strings, null, negative numbers, etc.)
- [ ] **Error paths are tested** (all exceptions are covered)
- [ ] **Mocks are properly typed** (use `jest.Mocked<Type>`)
- [ ] **Tests are isolated** (no shared state between tests)
- [ ] **Coverage meets threshold** (>80% for new code)
- [ ] **Tests pass locally** (`npm test` succeeds)
- [ ] **No console.log in tests** (remove debug statements)
- [ ] **beforeEach/afterEach used correctly** (clean setup/teardown)

---

## 📚 Quick Reference

### Common Jest Matchers

```typescript
// Equality
expect(value).toBe(expected); // Strict equality (===)
expect(value).toEqual(expected); // Deep equality
expect(value).not.toBe(expected); // Negation

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3);
expect(value).toBeLessThan(3);
expect(value).toBeCloseTo(0.3, 1); // Floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain("substring");

// Arrays / Iterables
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty("key");
expect(object).toMatchObject({ key: "value" });

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow("error message");
await expect(asyncFn()).rejects.toThrow();

// Function calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
expect(mockFn).toHaveBeenLastCalledWith("arg");
```

### Mock Functions

```typescript
// Create mock
const mockFn = jest.fn();
const mockFn = jest.fn().mockReturnValue(42);
const mockFn = jest.fn().mockResolvedValue("async result");
const mockFn = jest.fn().mockRejectedValue(new Error("fail"));

// Return different values on subsequent calls
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2).mockReturnValue(3);

// Spy on existing method
const spy = jest.spyOn(object, "method");
spy.mockImplementation(() => "mocked");

// Inspect calls
mockFn.mock.calls; // Array of call arguments
mockFn.mock.results; // Array of return values
mockFn.mock.calls.length; // Number of times called

// Reset
mockFn.mockClear(); // Clear call history
mockFn.mockReset(); // Clear + reset implementation
mockFn.mockRestore(); // Restore original (for spies)
```

---

## 🔗 Related Documentation

| Document        | Purpose             | Link                                                                   |
| --------------- | ------------------- | ---------------------------------------------------------------------- |
| Spec-Driven Dev | Development process | [skill-spec-driven-development.md](./skill-spec-driven-development.md) |
| Guidelines      | Code conventions    | [GUIDELINES.md](../docs/GUIDELINES.md)                                 |
| Architecture    | System design       | [ARCHITECTURE.md](../docs/ARCHITECTURE.md)                             |
| Jest Config     | Test configuration  | [jest.config.js](../backend/jest.config.js)                            |

---

## 🎓 Learning Resources

### Jest Documentation

- Official Docs: https://jestjs.io/docs/getting-started
- Mock Functions: https://jestjs.io/docs/mock-functions
- Async Tests: https://jestjs.io/docs/asynchronous

### Testing Philosophy

- "Test Behavior, Not Implementation": Focus on what the code does, not how
- "Red-Green-Refactor": Write failing test → Make it pass → Improve code
- "F.I.R.S.T Principles": Fast, Independent, Repeatable, Self-validating, Timely

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained By**: INVFriend Team

---

## 🎯 Summary: Testing Golden Rules

```
1. Write tests FIRST (TDD)
2. Test behavior, NOT implementation
3. Use AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies ONLY
5. Each test is INDEPENDENT
6. Descriptive test names (full sentences)
7. Cover edge cases and error paths
8. Aim for >80% coverage
9. Tests should run FAST (<1s for unit tests)
10. Tests are DOCUMENTATION (make them readable)
```

**Remember**: Good tests give confidence to refactor and evolve code safely.
