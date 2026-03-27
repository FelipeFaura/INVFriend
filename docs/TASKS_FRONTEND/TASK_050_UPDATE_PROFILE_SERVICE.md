# TASK-050: Update Profile Service

## Overview

| Field            | Value                   |
| ---------------- | ----------------------- |
| **Task ID**      | TASK-050                |
| **Plan**         | PLAN_PROFILE_EDITION.md |
| **Agent**        | @angular-implementer    |
| **Status**       | ✅ Complete             |
| **Dependencies** | TASK-049                |

## Objective

Add `updateProfile()` method to `AuthApplicationService` that updates user name and/or photo across Firebase Auth, Firestore, and Storage.

## Scope

### In Scope

- Add `updateProfile(data: UpdateProfileDTO)` method
- Update Firebase Auth displayName
- Update Firestore user document
- Upload photo to Storage (using StorageService)
- Refresh local auth state after update

### Out of Scope

- Storage service implementation (TASK-049)
- Profile edit UI (TASK-051)

## Technical Requirements

### DTO Definition

```typescript
// In application/dto/auth.dto.ts
export interface UpdateProfileDTO {
  name?: string;
  photoFile?: File;
}
```

### Method Signature

```typescript
// In AuthApplicationService
updateProfile(data: UpdateProfileDTO): Observable<User>
```

### Implementation Flow

```
1. Validate inputs (name: 2-50 chars if provided)
2. If photoFile provided:
   a. Validate file (via StorageService)
   b. Upload to 'users/{uid}/profile.{ext}'
   c. Get download URL
3. Update Firebase Auth profile (displayName, photoURL)
4. Update Firestore document (name, photoUrl, updatedAt)
5. Refresh local auth state
6. Return updated User
```

### Code Location

```
frontend/src/app/application/services/auth-application.service.ts
```

### Implementation Skeleton

```typescript
import { StorageService } from '../../adapters/services/storage.service';

// In constructor
constructor(
  private readonly afAuth: AngularFireAuth,
  private readonly firestore: AngularFirestore,
  private readonly storageService: StorageService  // Add this
) { ... }

/**
 * Update user profile (name and/or photo)
 */
updateProfile(data: UpdateProfileDTO): Observable<User> {
  return from(this.afAuth.currentUser).pipe(
    switchMap(firebaseUser => {
      if (!firebaseUser) {
        return throwError(() => new Error('Not authenticated'));
      }

      // Validate name if provided
      if (data.name !== undefined) {
        if (data.name.length < 2 || data.name.length > 50) {
          return throwError(() => new ValidationError('Name must be 2-50 characters'));
        }
      }

      // Upload photo if provided
      const photoUpload$ = data.photoFile
        ? this.uploadProfilePhoto(firebaseUser.uid, data.photoFile)
        : of(undefined);

      return photoUpload$.pipe(
        switchMap(photoUrl => this.performProfileUpdate(firebaseUser, data.name, photoUrl))
      );
    })
  );
}

private uploadProfilePhoto(userId: string, file: File): Observable<string> {
  const validation = this.storageService.validateFile(file, {
    maxSizeBytes: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  if (!validation.valid) {
    return throwError(() => new StorageError(validation.error!, 'VALIDATION_FAILED'));
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `users/${userId}/profile.${ext}`;
  return this.storageService.uploadFile(file, path);
}

private performProfileUpdate(
  user: firebase.User,
  name?: string,
  photoUrl?: string
): Observable<User> {
  const updates: { displayName?: string; photoURL?: string } = {};
  const firestoreUpdates: Record<string, unknown> = { updatedAt: new Date().toISOString() };

  if (name !== undefined) {
    updates.displayName = name;
    firestoreUpdates['name'] = name;
  }

  if (photoUrl !== undefined) {
    updates.photoURL = photoUrl;
    firestoreUpdates['photoUrl'] = photoUrl;
  }

  return from(user.updateProfile(updates)).pipe(
    switchMap(() => this.firestore.collection('users').doc(user.uid).update(firestoreUpdates)),
    switchMap(() => user.reload()),
    map(() => {
      const updatedUser = this.mapFirebaseUser(user);
      // Update local state
      this.updateAuthState({
        ...this.authStateSubject.value,
        user: updatedUser
      });
      return updatedUser;
    })
  );
}
```

## Acceptance Criteria

- [x] `updateProfile()` method added to `AuthApplicationService`
- [x] Updates Firebase Auth displayName when name provided
- [x] Uploads photo to Storage when photoFile provided
- [x] Updates Firestore user document
- [x] Local auth state refreshed after update
- [x] Validation errors thrown for invalid data
- [x] Build compiles without errors

## Files to Modify

| File                                                                | Changes                          |
| ------------------------------------------------------------------- | -------------------------------- |
| `frontend/src/app/application/services/auth-application.service.ts` | Add `updateProfile()` method     |
| `frontend/src/app/application/dto/auth.dto.ts`                      | Add `UpdateProfileDTO` interface |

## Error Handling

| Scenario            | Error                                             |
| ------------------- | ------------------------------------------------- |
| Not authenticated   | `Error('Not authenticated')`                      |
| Name too short/long | `ValidationError('Name must be 2-50 characters')` |
| Invalid file type   | `InvalidFileTypeError` (from TASK-049)            |
| File too large      | `FileTooLargeError` (from TASK-049)               |
| Upload failed       | `StorageError`                                    |

## Testing Notes

```typescript
describe("AuthApplicationService.updateProfile", () => {
  it("should update name only", async () => {
    await service.updateProfile({ name: "New Name" }).toPromise();
    expect(mockFirebaseUser.updateProfile).toHaveBeenCalledWith({
      displayName: "New Name",
    });
  });

  it("should upload photo and update URL", async () => {
    const file = new File([""], "photo.jpg", { type: "image/jpeg" });
    await service.updateProfile({ photoFile: file }).toPromise();
    expect(mockStorageService.uploadFile).toHaveBeenCalled();
  });

  it("should reject short names", async () => {
    await expectAsync(
      service.updateProfile({ name: "A" }).toPromise(),
    ).toBeRejectedWithError(/2-50 characters/);
  });
});
```

---

## Execution Log

### Results

**Status:** ⏳ → ✅
**Files Modified:**

- `frontend/src/app/application/dto/auth.dto.ts` - Added `UpdateProfileDTO` interface
- `frontend/src/app/application/services/auth-application.service.ts` - Added `updateProfile()` method, imported `StorageService`, `StorageError`, and `ValidationError`

**Build:** ✅ Pass (TypeScript compilation successful; pre-existing bundle size warnings unrelated to this task)
**Tests:** N/A (not in scope)

**Implementation Details:**

- Added `StorageService` injection to `AuthApplicationService` constructor
- Implemented `updateProfile(data: UpdateProfileDTO)` public method
- Implemented `uploadProfilePhoto(userId, file)` private helper method
- Implemented `performProfileUpdate(user, name?, photoUrl?)` private helper method
- Validation: name must be 2-50 characters if provided
- Photo upload: to path `users/{uid}/profile.{ext}`
- Updates both Firebase Auth profile and Firestore document
- Refreshes local auth state after update

---

## Session Metrics

| Metric                 | Value                             |
| ---------------------- | --------------------------------- |
| **Model**              | Claude Opus 4.5                   |
| **Tokens In/Out**      | N/A                               |
| **Context Window**     | ~15%                              |
| **Duration**           | ~5 minutes                        |
| **Tool Calls**         | ~12                               |
| **Errors/Retries**     | 1 (TypeScript type inference fix) |
| **User Interventions** | No                                |
| **Files Modified**     | 2                                 |
| **Lines Changed**      | +115 / -5                         |
| **Difficulty**         | 2/5                               |

**Metrics Notes:** Token counts not accessible from this session. Duration estimated from workflow.
