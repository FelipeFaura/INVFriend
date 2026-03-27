# TASK-062: Frontend - User Profile HTTP Service

## 📝 Description

Create a service to fetch user public profiles (name, photo) from the backend. This will be used by dashboard and secret santa components.

## 📍 Location

- `frontend/src/app/adapters/services/user-http.service.ts` - New service
- `frontend/src/app/domain/models/user-profile.model.ts` - New model (or update existing)
- `frontend/src/app/application/dto/user.dto.ts` - New DTO file

## 🏗️ Model/Reference

**Model:**

```typescript
export interface UserPublicProfile {
  id: string;
  name: string;
  photoUrl: string | null;
}
```

**Service methods:**

```typescript
@Injectable({ providedIn: "root" })
export class UserHttpService {
  getPublicProfile(userId: string): Observable<UserPublicProfile>;

  // Optional: batch fetch for performance
  getPublicProfiles(
    userIds: string[],
  ): Observable<Map<string, UserPublicProfile>>;
}
```

## 🎯 Specific Requirements

- [ ] Create `UserHttpService` with `getPublicProfile` method
- [ ] API call: `GET /users/:id/profile`
- [ ] Create `UserPublicProfile` interface
- [ ] Handle errors gracefully (return null profile on 404?)
- [ ] Consider caching profiles to avoid duplicate requests
- [ ] Create `UserNotFoundError` if needed

## 🚫 Scope / Limits

**What NOT to do:**

- ❌ Do not implement batch endpoint if backend doesn't support it
- ❌ Do not store profiles in state management - simple service cache is enough
- ❌ Do not expose methods for updating profiles (that's in AuthApplicationService)

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Proper error handling
- [ ] Uses HttpClient with proper typing
- [ ] Documented with JSDoc
- [ ] Unit tests for service

## 📚 References

- [GUIDELINES.md](../GUIDELINES.md) - Coding conventions
- Similar service: `frontend/src/app/adapters/services/group-http.service.ts`
- Auth service: `frontend/src/app/application/services/auth-application.service.ts`

---

## 📊 Results

_(Filled by sub-agent upon completion)_

**Status:** ⏳ Pending

**Files Created/Modified:**

-

**Build:** ⏳
**Tests:** ⏳

**Notes:**

---

## 📈 Session Metrics

_(Filled by sub-agent upon completion)_
