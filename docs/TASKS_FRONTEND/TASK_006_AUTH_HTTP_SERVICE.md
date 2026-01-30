# TASK-006: Implement Auth HTTP Service (Frontend)

**Status**: ✅ COMPLETED  
**Started**: January 30, 2026  
**Completed**: January 30, 2026  
**Sprint**: 2 - Auth Frontend

---

## 📝 Description

Create HTTP service to communicate with backend auth API, including token management and interceptor.

## 📍 Location

- `frontend/src/app/adapters/services/auth-http.service.ts`
- `frontend/src/app/adapters/services/__tests__/auth-http.service.spec.ts`
- `frontend/src/app/application/services/auth-application.service.ts`
- `frontend/src/app/adapters/http/auth.interceptor.ts`
- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.prod.ts`

## 🏗️ Model/Reference

- DTOs: `frontend/src/app/application/dto/auth.dto.ts`
- User model: `frontend/src/app/domain/models/user.model.ts`
- Errors: `frontend/src/app/domain/errors/auth-errors.ts`

## 🎯 Specific Requirements

- [x] All API calls typed with RxJS Observables
- [x] Error handling with catchError
- [x] Token storage in localStorage
- [x] Automatic token refresh on 401
- [x] HTTP interceptor for adding Authorization header
- [x] Unit tests (10 tests passing)

## 🚫 Scope / Limits

❌ Do NOT include:

- UI components
- Route guards (TASK-008)
- Google Sign-In SDK integration (only HTTP call)

## ✅ Acceptance / Checklist

- [x] Follows GUIDELINES.md naming conventions
- [x] TypeScript compiles without errors
- [x] All tests pass (10/10)
- [x] No debug logs or console.log()
