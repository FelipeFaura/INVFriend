# Feature: Group Management Improvements

## Summary

Improve group management UX: add members by email instead of user ID, and implement edit group functionality.

## Status Dashboard

| Total | ✅ Done | 🔄 Active | ⏳ Pending | 🚫 Blocked |
| ----- | ------- | --------- | ---------- | ---------- |
| 5     | 0       | 0         | 5          | 0          |

## Tasks

| ID  | Description                        | Agent                | Dependencies | Status |
| --- | ---------------------------------- | -------------------- | ------------ | ------ |
| 053 | Backend - AddMemberByEmailUseCase  | @express-implementer | -            | ⏳     |
| 054 | Backend - Invite endpoint (email)  | @express-implementer | 053          | ⏳     |
| 055 | Frontend - Update Add Member modal | @angular-implementer | 054          | ⏳     |
| 056 | Frontend - Create Edit Group modal | @angular-implementer | -            | ⏳     |
| 057 | Frontend - Connect Edit to service | @angular-implementer | 056          | ⏳     |

## Execution Order

### Wave 1 (Parallel - No Dependencies)

- **TASK-053**: Backend use case for adding member by email - Can start immediately
- **TASK-056**: Frontend Edit Group modal UI - Can start immediately

### Wave 2 (Depends on Wave 1)

- **TASK-054**: Backend endpoint for invite by email - Depends on 053
- **TASK-057**: Connect Edit modal to updateGroup service - Depends on 056

### Wave 3 (Final)

- **TASK-055**: Update Add Member modal to use email - Depends on 054

## Architecture Impact

### Layers Affected

- [x] Domain (errors for user-not-found)
- [x] Application (new use case, DTOs)
- [x] Adapters (controllers, components, services)

### Key Files

**Backend:**

- `backend/src/application/use-cases/AddMemberByEmailUseCase.ts` - New use case
- `backend/src/application/dto/GroupDTOs.ts` - New DTO for email invite
- `backend/src/adapters/http/controllers/GroupController.ts` - New endpoint
- `backend/src/adapters/http/routes/groupRoutes.ts` - New route

**Frontend:**

- `frontend/src/app/adapters/components/group-detail/group-detail.component.ts` - Edit modal + email input
- `frontend/src/app/adapters/components/group-detail/group-detail.component.html` - Modal templates
- `frontend/src/app/adapters/services/group-http.service.ts` - New method for email invite

## Risks & Considerations

- **Risk 1**: Email not found in Firebase Auth → **Mitigation**: Return clear error "User not registered"
- **Risk 2**: User enters email of themselves → **Mitigation**: Existing validation already handles "already member" error

## Notes

- Backend already has `UpdateGroupUseCase` and PUT `/groups/:id` endpoint ready
- Frontend `updateGroup()` method in `GroupHttpService` already exists
- Firebase Admin SDK provides `auth.getUserByEmail()` which is already used in `FirebaseAuthAdapter`

## Change Log

| Date       | Change       | By            |
| ---------- | ------------ | ------------- |
| 2026-03-07 | Plan created | @project-lead |

## 📈 Efficiency Analysis

_(To be filled upon plan completion)_

### Task Metrics

| Task | Duration | Tool Calls | Errors | Lines Changed |
| ---- | -------- | ---------- | ------ | ------------- |
| 053  | -        | -          | -      | -             |
| 054  | -        | -          | -      | -             |
| 055  | -        | -          | -      | -             |
| 056  | -        | -          | -      | -             |
| 057  | -        | -          | -      | -             |

### Totals

- **Total Duration**: -
- **Total Tool Calls**: -
- **Issues Detected**: -

### Lessons Learned

_(To be filled upon completion)_
