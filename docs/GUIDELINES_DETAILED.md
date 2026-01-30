# INVFriend - Detailed Code Examples and Patterns

This document provides **detailed code examples and implementation patterns** for the INVFriend project. For general conventions and standards, see [GUIDELINES.md](./GUIDELINES.md).

## 📋 Contents

1. [Angular Patterns](#angular-patterns)
2. [Node.js/Express Patterns](#nodejsexpress-patterns)
3. [Testing Patterns](#testing-patterns)
4. [Advanced TypeScript](#advanced-typescript)
5. [RxJS Patterns](#rxjs-patterns)
6. [Error Handling Patterns](#error-handling-patterns)

---

## 🅰️ Angular Patterns

### Component Example - Complete

```typescript
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { GroupApplicationService } from "../../application/services/group-application.service";
import { Group } from "../../domain/models/group.model";

@Component({
  selector: "app-group-detail",
  templateUrl: "./group-detail.component.html",
  styleUrls: ["./group-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  // Public properties first
  @Input() groupId: string = "";
  @Output() groupDeleted = new EventEmitter<string>();

  group: Group | null = null;
  isLoading = false;
  error: string | null = null;

  // Private properties
  private destroy$ = new Subject<void>();

  constructor(
    private groupService: GroupApplicationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadGroup();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGroup(): void {
    this.isLoading = true;
    this.groupService
      .getGroupById(this.groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (group) => {
          this.group = group;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = error.message;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onDelete(): void {
    if (!confirm("Are you sure?")) return;

    this.groupService
      .deleteGroup(this.groupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.groupDeleted.emit(this.groupId);
        },
        error: (error) => {
          this.error = error.message;
          this.cdr.markForCheck();
        },
      });
  }
}
```

### Application Service Example

```typescript
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GroupHttpService } from "../adapters/services/group-http.service";
import { Group } from "../domain/models/group.model";
import { CreateGroupDTO } from "../application/dto/group.dto";

@Injectable({
  providedIn: "root",
})
export class GroupApplicationService {
  constructor(private groupHttpService: GroupHttpService) {}

  createGroup(dto: CreateGroupDTO): Observable<Group> {
    return this.groupHttpService.createGroup(dto);
  }

  getGroupById(id: string): Observable<Group> {
    return this.groupHttpService.getGroupById(id);
  }

  getUserGroups(): Observable<Group[]> {
    return this.groupHttpService.getUserGroups();
  }

  updateGroup(id: string, dto: Partial<CreateGroupDTO>): Observable<Group> {
    return this.groupHttpService.updateGroup(id, dto);
  }

  deleteGroup(id: string): Observable<void> {
    return this.groupHttpService.deleteGroup(id);
  }
}
```

### HTTP Service Example

```typescript
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Group } from "../../domain/models/group.model";
import { CreateGroupDTO } from "../../application/dto/group.dto";

@Injectable({
  providedIn: "root",
})
export class GroupHttpService {
  private readonly baseUrl = "/api/groups";

  constructor(private http: HttpClient) {}

  createGroup(dto: CreateGroupDTO): Observable<Group> {
    return this.http
      .post<Group>(this.baseUrl, dto)
      .pipe(catchError(this.handleError));
  }

  getGroupById(id: string): Observable<Group> {
    return this.http
      .get<Group>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getUserGroups(): Observable<Group[]> {
    return this.http
      .get<Group[]>(this.baseUrl)
      .pipe(catchError(this.handleError));
  }

  updateGroup(id: string, dto: Partial<CreateGroupDTO>): Observable<Group> {
    return this.http
      .put<Group>(`${this.baseUrl}/${id}`, dto)
      .pipe(catchError(this.handleError));
  }

  deleteGroup(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "An unknown error occurred";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
```

---

## 🟢 Node.js/Express Patterns

### Controller Example - Complete

```typescript
import { Request, Response, NextFunction } from "express";
import { CreateGroupUseCase } from "../../application/use-cases/CreateGroupUseCase";
import { GetGroupDetailsUseCase } from "../../application/use-cases/GetGroupDetailsUseCase";
import { DeleteGroupUseCase } from "../../application/use-cases/DeleteGroupUseCase";
import { CreateGroupDTO } from "../../application/dto/GroupDTOs";
import { Logger } from "../../shared/utils/logger";
import { InvalidBudgetError } from "../../domain/errors/GroupErrors";

export class GroupController {
  constructor(
    private createGroupUseCase: CreateGroupUseCase,
    private getGroupDetailsUseCase: GetGroupDetailsUseCase,
    private deleteGroupUseCase: DeleteGroupUseCase,
    private logger: Logger,
  ) {}

  async createGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto: CreateGroupDTO = req.body;
      const userId = req.user?.uid; // From auth middleware

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const group = await this.createGroupUseCase.execute({
        ...dto,
        adminId: userId,
      });

      this.logger.info(`Group created: ${group.id}`);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof InvalidBudgetError) {
        res.status(400).json({
          error: error.name,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  async getGroupDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;

      const group = await this.getGroupDetailsUseCase.execute(id, userId);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  }

  async deleteGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.uid;

      await this.deleteGroupUseCase.execute(id, userId);

      this.logger.info(`Group deleted: ${id}`);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
```

### Use Case Example - Complete

```typescript
import { Group } from "../../domain/entities/Group";
import { IGroupRepository } from "../../ports/IGroupRepository";
import { CreateGroupDTO } from "../dto/GroupDTOs";
import {
  InvalidBudgetError,
  InvalidNameError,
} from "../../domain/errors/GroupErrors";
import { Logger } from "../../shared/utils/logger";

export class CreateGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private logger: Logger,
  ) {}

  async execute(dto: CreateGroupDTO): Promise<Group> {
    // Validation
    this.validateDTO(dto);

    // Create domain entity
    const group = Group.create(
      dto.name,
      dto.budgetLimit,
      dto.adminId,
      dto.description,
    );

    // Persist
    await this.groupRepository.create(group);

    this.logger.info(`Group created successfully: ${group.id}`);
    return group;
  }

  private validateDTO(dto: CreateGroupDTO): void {
    if (!dto.name || dto.name.trim().length < 3) {
      throw new InvalidNameError("Group name must be at least 3 characters");
    }

    if (dto.budgetLimit <= 0) {
      throw new InvalidBudgetError("Budget must be greater than 0");
    }

    if (!dto.adminId) {
      throw new Error("Admin ID is required");
    }
  }
}
```

### Repository Implementation Example

```typescript
import { Group } from "../../domain/entities/Group";
import { IGroupRepository } from "../../ports/IGroupRepository";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { Logger } from "../../shared/utils/logger";

export class FirebaseGroupRepository implements IGroupRepository {
  private readonly collectionName = "groups";
  private db = getFirestore();

  constructor(private logger: Logger) {}

  async create(group: Group): Promise<Group> {
    try {
      const groupRef = doc(this.db, this.collectionName, group.id);
      await setDoc(groupRef, group.toJSON());

      this.logger.debug(`Group persisted: ${group.id}`);
      return group;
    } catch (error) {
      this.logger.error("Failed to create group", error);
      throw new Error("Failed to create group");
    }
  }

  async findById(id: string): Promise<Group | null> {
    try {
      const groupRef = doc(this.db, this.collectionName, id);
      const snapshot = await getDoc(groupRef);

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return Group.fromJSON(data);
    } catch (error) {
      this.logger.error(`Failed to find group: ${id}`, error);
      throw new Error("Failed to fetch group");
    }
  }

  async findByMemberId(userId: string): Promise<Group[]> {
    try {
      const groupsRef = collection(this.db, this.collectionName);
      const q = query(groupsRef, where("members", "array-contains", userId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => Group.fromJSON(doc.data()));
    } catch (error) {
      this.logger.error(`Failed to find groups for user: ${userId}`, error);
      throw new Error("Failed to fetch user groups");
    }
  }

  async update(group: Group): Promise<void> {
    try {
      const groupRef = doc(this.db, this.collectionName, group.id);
      await setDoc(groupRef, group.toJSON(), { merge: true });

      this.logger.debug(`Group updated: ${group.id}`);
    } catch (error) {
      this.logger.error(`Failed to update group: ${group.id}`, error);
      throw new Error("Failed to update group");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const groupRef = doc(this.db, this.collectionName, id);
      await deleteDoc(groupRef);

      this.logger.debug(`Group deleted: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete group: ${id}`, error);
      throw new Error("Failed to delete group");
    }
  }
}
```

---

## 🧪 Testing Patterns

### Unit Test Example - Use Case

```typescript
import { CreateGroupUseCase } from "../CreateGroupUseCase";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { Group } from "../../../domain/entities/Group";
import {
  InvalidBudgetError,
  InvalidNameError,
} from "../../../domain/errors/GroupErrors";
import { Logger } from "../../../shared/utils/logger";

describe("CreateGroupUseCase", () => {
  let useCase: CreateGroupUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMemberId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
    } as any;

    useCase = new CreateGroupUseCase(mockRepository, mockLogger);
  });

  describe("execute", () => {
    it("should create a group with valid data", async () => {
      // Arrange
      const dto = {
        name: "Test Group",
        budgetLimit: 500,
        adminId: "user123",
      };

      mockRepository.create.mockResolvedValue(expect.any(Group));

      // Act
      const result = await useCase.execute(dto);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe("Test Group");
      expect(result.budgetLimit).toBe(500);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.any(Group));
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it("should throw InvalidBudgetError if budget is zero", async () => {
      // Arrange
      const dto = {
        name: "Test Group",
        budgetLimit: 0,
        adminId: "user123",
      };

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(InvalidBudgetError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("should throw InvalidBudgetError if budget is negative", async () => {
      // Arrange
      const dto = {
        name: "Test Group",
        budgetLimit: -100,
        adminId: "user123",
      };

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(InvalidBudgetError);
    });

    it("should throw InvalidNameError if name is too short", async () => {
      // Arrange
      const dto = {
        name: "AB",
        budgetLimit: 500,
        adminId: "user123",
      };

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(InvalidNameError);
    });

    it("should throw error if adminId is missing", async () => {
      // Arrange
      const dto = {
        name: "Test Group",
        budgetLimit: 500,
        adminId: "",
      };

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow();
    });
  });
});
```

### Integration Test Example

```typescript
import request from "supertest";
import { app } from "../../index";
import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";

describe("Group API Integration Tests", () => {
  let authToken: string;
  let createdGroupId: string;

  beforeAll(async () => {
    // Login to get auth token
    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "Test1234",
    });

    authToken = response.body.accessToken;
  });

  afterEach(async () => {
    // Cleanup created groups
    if (createdGroupId) {
      const db = getFirestore();
      await deleteDoc(doc(db, "groups", createdGroupId));
    }
  });

  describe("POST /api/groups", () => {
    it("should create a new group", async () => {
      const response = await request(app)
        .post("/api/groups")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Group",
          budgetLimit: 500,
          description: "Test description",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Test Group");
      expect(response.body.budgetLimit).toBe(500);

      createdGroupId = response.body.id;
    });

    it("should return 400 for invalid budget", async () => {
      const response = await request(app)
        .post("/api/groups")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Group",
          budgetLimit: -100,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 401 without auth token", async () => {
      const response = await request(app).post("/api/groups").send({
        name: "Test Group",
        budgetLimit: 500,
      });

      expect(response.status).toBe(401);
    });
  });
});
```

---

## 🔷 Advanced TypeScript

### Domain Entity Pattern

```typescript
export class Group {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string | null,
    readonly adminId: string,
    readonly members: readonly string[],
    readonly budgetLimit: number,
    readonly raffleStatus: "pending" | "completed",
    readonly raffleDate: number | null,
    readonly createdAt: number,
    readonly updatedAt: number,
  ) {}

  /**
   * Factory method to create a new group
   */
  static create(
    name: string,
    budgetLimit: number,
    adminId: string,
    description?: string,
  ): Group {
    const now = Date.now();
    return new Group(
      this.generateId(),
      name,
      description || null,
      adminId,
      [adminId], // Admin is automatically a member
      budgetLimit,
      "pending",
      null,
      now,
      now,
    );
  }

  /**
   * Reconstruct from database
   */
  static fromJSON(data: any): Group {
    return new Group(
      data.id,
      data.name,
      data.description,
      data.adminId,
      data.members,
      data.budgetLimit,
      data.raffleStatus,
      data.raffleDate,
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Add a member to the group
   */
  addMember(userId: string): Group {
    if (this.members.includes(userId)) {
      return this;
    }

    return new Group(
      this.id,
      this.name,
      this.description,
      this.adminId,
      [...this.members, userId],
      this.budgetLimit,
      this.raffleStatus,
      this.raffleDate,
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Complete the raffle
   */
  completeRaffle(): Group {
    if (this.raffleStatus === "completed") {
      throw new Error("Raffle already completed");
    }

    if (this.members.length < 2) {
      throw new Error("Need at least 2 members for raffle");
    }

    return new Group(
      this.id,
      this.name,
      this.description,
      this.adminId,
      this.members,
      this.budgetLimit,
      "completed",
      Date.now(),
      this.createdAt,
      Date.now(),
    );
  }

  /**
   * Check if user is admin
   */
  isAdmin(userId: string): boolean {
    return this.adminId === userId;
  }

  /**
   * Check if ready for raffle
   */
  isValidForRaffle(): boolean {
    return this.members.length >= 2 && this.raffleStatus === "pending";
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      adminId: this.adminId,
      members: [...this.members],
      budgetLimit: this.budgetLimit,
      raffleStatus: this.raffleStatus,
      raffleDate: this.raffleDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private static generateId(): string {
    return `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

## 📖 RxJS Patterns

### Async Pipe Pattern

```typescript
// Component
export class GroupListComponent implements OnInit {
  groups$!: Observable<Group[]>;
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new Subject<string | null>();

  constructor(private groupService: GroupApplicationService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  private loadGroups(): void {
    this.isLoading$.next(true);

    this.groups$ = this.groupService.getUserGroups().pipe(
      tap(() => this.isLoading$.next(false)),
      catchError((error) => {
        this.error$.next(error.message);
        this.isLoading$.next(false);
        return of([]);
      }),
    );
  }
}
```

```html
<!-- Template -->
<div class="group-list">
  <div *ngIf="isLoading$ | async" class="loading">Loading...</div>
  <div *ngIf="error$ | async as error" class="error">{{ error }}</div>

  <div *ngFor="let group of groups$ | async" class="group-card">
    <h3>{{ group.name }}</h3>
    <p>Budget: {{ group.budgetLimit | currency }}</p>
  </div>
</div>
```

---

## ⚠️ Error Handling Patterns

### Custom Domain Errors

```typescript
// Base domain error
export class DomainError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific errors
export class InvalidBudgetError extends DomainError {
  constructor(message = "Budget must be greater than 0") {
    super(message, "INVALID_BUDGET");
  }
}

export class GroupNotFoundError extends DomainError {
  constructor(groupId: string) {
    super(`Group not found: ${groupId}`, "GROUP_NOT_FOUND");
  }
}

export class UnauthorizedAccessError extends DomainError {
  constructor(message = "User not authorized for this action") {
    super(message, "UNAUTHORIZED_ACCESS");
  }
}
```

### Global Error Handler (Express)

```typescript
import { Request, Response, NextFunction } from "express";
import { DomainError } from "../domain/errors/DomainError";
import { Logger } from "../shared/utils/logger";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const logger = new Logger();

  if (error instanceof DomainError) {
    logger.warn(`Domain error: ${error.code} - ${error.message}`);
    res.status(400).json({
      error: error.code,
      message: error.message,
    });
    return;
  }

  // Unhandled errors
  logger.error("Unhandled error:", error);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
}
```

---

**Last Updated:** January 2026  
**Version:** 1.0.0 (MVP)

**Reference:** See [GUIDELINES.md](./GUIDELINES.md) for conventions and standards
