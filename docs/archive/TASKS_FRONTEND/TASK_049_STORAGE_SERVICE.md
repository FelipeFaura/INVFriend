# TASK-049: Firebase Storage Service

## Overview

| Field            | Value                   |
| ---------------- | ----------------------- |
| **Task ID**      | TASK-049                |
| **Plan**         | PLAN_PROFILE_EDITION.md |
| **Agent**        | @angular-implementer    |
| **Status**       | ✅ Complete             |
| **Dependencies** | None                    |

## Objective

Create a reusable Storage service for uploading files (specifically profile images) to Firebase Storage.

## Scope

### In Scope

- Create `StorageService` in adapters layer
- Upload files to Firebase Storage
- Return download URL after upload
- Validate file type and size
- Delete old file when replacing

### Out of Scope

- Profile UI (TASK-051)
- Auth service integration (TASK-050)

## Technical Requirements

### Service Location

```
frontend/src/app/adapters/services/storage.service.ts
```

### Interface

```typescript
@Injectable({ providedIn: "root" })
export class StorageService {
  /**
   * Upload a file to Firebase Storage
   * @param file - File to upload
   * @param path - Storage path (e.g., 'users/{userId}/profile')
   * @returns Observable<string> - Download URL
   */
  uploadFile(file: File, path: string): Observable<string>;

  /**
   * Delete a file from Firebase Storage
   * @param path - Storage path or full URL
   */
  deleteFile(path: string): Observable<void>;

  /**
   * Validate file before upload
   * @param file - File to validate
   * @param options - Validation options
   */
  validateFile(file: File, options: FileValidationOptions): ValidationResult;
}

interface FileValidationOptions {
  maxSizeBytes: number; // Default: 2MB (2 * 1024 * 1024)
  allowedTypes: string[]; // Default: ['image/jpeg', 'image/png', 'image/webp']
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}
```

### Firebase Storage Setup

Already configured in `environment.ts`:

```typescript
storageBucket: "invfriend.firebasestorage.app";
```

### Implementation Notes

Use `@angular/fire/compat/storage` (already in dependencies):

```typescript
import { AngularFireStorage } from '@angular/fire/compat/storage';

constructor(private storage: AngularFireStorage) {}

uploadFile(file: File, path: string): Observable<string> {
  const ref = this.storage.ref(path);
  return from(ref.put(file)).pipe(
    switchMap(() => ref.getDownloadURL())
  );
}
```

### Error Handling

Create storage-specific errors:

```typescript
// In domain/errors/storage-errors.ts
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

export class FileTooLargeError extends StorageError {
  constructor(maxSize: number) {
    super(
      `File exceeds maximum size of ${maxSize / 1024 / 1024}MB`,
      "FILE_TOO_LARGE",
    );
  }
}

export class InvalidFileTypeError extends StorageError {
  constructor(allowedTypes: string[]) {
    super(
      `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
      "INVALID_FILE_TYPE",
    );
  }
}
```

## Acceptance Criteria

- [ ] `StorageService` created and injectable
- [ ] `uploadFile()` uploads to correct path and returns URL
- [ ] `validateFile()` checks type and size before upload
- [ ] Errors thrown for invalid files
- [ ] Service compiles without errors
- [ ] Unit tests pass (if created)

## Files to Create

| File                                                    | Description           |
| ------------------------------------------------------- | --------------------- |
| `frontend/src/app/adapters/services/storage.service.ts` | Storage service       |
| `frontend/src/app/domain/errors/storage-errors.ts`      | Storage error classes |

## Testing Notes

```typescript
// Test with mock AngularFireStorage
describe("StorageService", () => {
  it("should upload file and return URL", async () => {
    // Mock ref.put() and ref.getDownloadURL()
  });

  it("should reject files over 2MB", () => {
    const largeFile = new File(["x".repeat(3 * 1024 * 1024)], "large.jpg");
    const result = service.validateFile(largeFile, {
      maxSizeBytes: 2 * 1024 * 1024,
    });
    expect(result.valid).toBeFalse();
  });

  it("should reject invalid file types", () => {
    const pdfFile = new File(["content"], "doc.pdf", {
      type: "application/pdf",
    });
    const result = service.validateFile(pdfFile, {
      allowedTypes: ["image/jpeg"],
    });
    expect(result.valid).toBeFalse();
  });
});
```

---

## Execution Log

### Results

**Status:** ⏳ → ✅
**Files Created/Modified:**

- `frontend/src/app/domain/errors/storage-errors.ts` - Storage error classes
- `frontend/src/app/adapters/services/storage.service.ts` - StorageService implementation
- `frontend/src/app/app.module.ts` - Added AngularFireStorageModule import

**Build:** ✅ Pass (TypeScript compilation successful; bundle budget warning is pre-existing)
**Tests:** N/A (no tests in scope)
**Notes:**

- Service created using AngularFireStorage from `@angular/fire/compat/storage`
- Added `uploadFileWithValidation()` convenience method combining validation and upload
- Added `validateFileOrThrow()` for error-throwing validation
- URL path extraction handles both full URLs and storage paths for `deleteFile()`

### Acceptance Criteria Verification

- [x] `StorageService` created and injectable
- [x] `uploadFile()` uploads to correct path and returns URL
- [x] `validateFile()` checks type and size before upload
- [x] Errors thrown for invalid files
- [x] Service compiles without errors
- [ ] Unit tests pass (N/A - not in scope)

---

## Session Metrics

| Metric                 | Value           |
| ---------------------- | --------------- |
| **Model**              | Claude Opus 4.5 |
| **Tokens In/Out**      | N/A             |
| **Context Window %**   | ~15%            |
| **Duration**           | ~5 minutes      |
| **Tool Calls**         | ~15             |
| **Errors/Retries**     | 0               |
| **User Interventions** | No              |
| **Files Modified**     | 3               |
| **Lines Changed**      | +210 (approx)   |
| **Difficulty (1-5)**   | 2               |
