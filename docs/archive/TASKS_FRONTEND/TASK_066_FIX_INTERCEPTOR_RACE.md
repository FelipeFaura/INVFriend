# TASK-066: Fix Auth Interceptor Race Condition Logout

## 📝 Description

The auth interceptor aggressively calls `logout()` when token refresh fails. This is destructive during the Firebase auth initialization window, because:
1. The request goes out without a token (accessToken is still null)
2. Backend returns 401
3. Interceptor tries refresh → `afAuth.currentUser` is null (Firebase hasn't initialized) → throws error
4. Interceptor calls `this.authService.logout()` → wipes auth state → user is logged out

**Fix**: In `handle401Error`, do NOT call `logout()` if there was no token on the original request. If the original request had no token, it means auth wasn't ready — not that the session is invalid. Just propagate the error.

## 📍 Location

- File: `frontend/src/app/adapters/http/auth.interceptor.ts`

## 🏗️ Current Code (Reference)

```typescript
// In intercept():
const token = this.authService.accessToken;
if (token) {
  request = this.addAuthHeader(request, token);
}

// In handle401Error():
catchError((error) => {
  this.isRefreshing = false;
  this.authService.logout().subscribe();  // <-- DESTRUCTIVE during race condition
  return throwError(() => error);
}),
```

## 🎯 Specific Requirements

- [ ] If the original request had NO auth token attached (auth wasn't ready), skip refresh entirely — just propagate the 401 error
- [ ] Only attempt refresh + logout when the original request DID have a token (meaning the token expired)
- [ ] The `intercept()` method should track whether a token was added so `handle401Error` can decide
- [ ] Keep existing behavior for legitimately expired tokens (refresh works, retry with new token)
- [ ] All existing tests must continue passing

## 🚫 Scope / Limits

- ❌ Do NOT modify `auth-application.service.ts`
- ❌ Do NOT modify any other files
- ❌ Do NOT add new dependencies
- ❌ Do NOT change the public API of the interceptor

## ✅ Acceptance / Checklist

- [ ] Interceptor no longer calls logout() when auth wasn't initialized
- [ ] Interceptor still refreshes tokens for legitimately expired sessions
- [ ] No debug/console.log statements
- [ ] Build passes (`ng build --configuration=development`)

## Results

_To be filled by the implementing agent_
