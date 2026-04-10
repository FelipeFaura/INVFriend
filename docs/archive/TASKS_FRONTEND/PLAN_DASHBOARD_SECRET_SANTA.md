# Feature: Dashboard Secret Santa & User Display

## Summary

Transform the dashboard to show all Secret Santa assignments with user photos and names. Update Secret Santa reveal to show user info instead of IDs. Create a dedicated page to view assigned person's wishes.

## Status Dashboard

| Total | ✅ Done | 🔄 Active | ⏳ Pending | 🚫 Blocked |
| ----- | ------- | --------- | ---------- | ---------- |
| 8     | 8       | 0         | 0          | 0          |

**🎉 PLAN COMPLETADO - 2026-03-27**

## Tasks

| ID  | Description                                | Agent                | Dependencies  | Status |
| --- | ------------------------------------------ | -------------------- | ------------- | ------ |
| 058 | Backend - GetUserPublicProfileUseCase      | @express-implementer | -             | ✅     |
| 059 | Backend - User profile endpoint            | @express-implementer | 058           | ✅     |
| 060 | Backend - GetAllMyAssignmentsUseCase       | @express-implementer | -             | ✅     |
| 061 | Backend - All assignments endpoint         | @express-implementer | 060           | ✅     |
| 062 | Frontend - User profile service            | @angular-implementer | 059           | ✅     |
| 063 | Frontend - Assignment wishes page          | @angular-implementer | 062           | ✅     |
| 064 | Frontend - Update Secret Santa Reveal      | @angular-implementer | 062           | ✅     |
| 065 | Frontend - Dashboard with assignment cards | @angular-implementer | 061, 062, 063 | ✅     |

## Execution Order

### Wave 1 (Parallel - No Dependencies)

- **TASK-058**: Backend use case for getting user public profile (name, photoUrl)
- **TASK-060**: Backend use case for getting all user's assignments across groups

### Wave 2 (Depends on Wave 1)

- **TASK-059**: Backend endpoint `GET /users/:id/public-profile` - Depends on 058
- **TASK-061**: Backend endpoint `GET /assignments/mine` - Depends on 060

### Wave 3 (Depends on Wave 2)

- **TASK-062**: Frontend service to fetch user profiles - Depends on 059

### Wave 4 (Depends on Wave 3)

- **TASK-063**: New page `/groups/:groupId/assignment/:userId/wishes` - Depends on 062
- **TASK-064**: Update Secret Santa Reveal with photo and name - Depends on 062

### Wave 5 (Final)

- **TASK-065**: Dashboard showing all assignment cards - Depends on 061, 062, 063

## Architecture Impact

### Layers Affected

- [x] Domain (new DTOs)
- [x] Application (new use cases)
- [x] Adapters (controllers, routes, components, services)

### Key Files

**Backend:**

- `backend/src/application/use-cases/GetUserPublicProfileUseCase.ts` - Get name/photo
- `backend/src/application/use-cases/GetAllMyAssignmentsUseCase.ts` - All assignments
- `backend/src/adapters/http/controllers/UserController.ts` - New controller
- `backend/src/adapters/http/routes/userRoutes.ts` - New routes
- `backend/src/adapters/http/routes/assignmentRoutes.ts` - New routes

**Frontend:**

- `frontend/src/app/adapters/services/user-http.service.ts` - Fetch user profiles
- `frontend/src/app/adapters/components/assignment-wishes/` - New page component
- `frontend/src/app/adapters/components/secret-santa-reveal/` - Update existing
- `frontend/src/app/adapters/components/dashboard/` - Update existing
- `frontend/src/app/app.routes.ts` - New route

## UI Specifications

### Dashboard Cards

```
┌─────────────────────────────────┐
│  [Photo]  Juan García           │
│           Grupo: Familia        │
│           Budget: $50           │
│           [Ver deseos →]        │
└─────────────────────────────────┘
```

- Photo: 48x48px circle, or initial avatar if no photo
- Click entire card → Navigate to `/groups/:groupId/assignment/:userId/wishes`

### Secret Santa Reveal (Updated)

```
┌─────────────────────────────────┐
│         🎉                      │
│  Your Secret Santa Assignment   │
│  You are giving a gift to:      │
│                                 │
│     [Photo 64x64]               │
│     Juan García                 │
│                                 │
│  🤫 Remember to keep it secret! │
│  Budget: $50                    │
│                                 │
│  [Ver lista de deseos]          │ ← Button to navigate
└─────────────────────────────────┘
```

### Assignment Wishes Page

```
/groups/:groupId/assignment/:userId/wishes

┌─────────────────────────────────────────┐
│ ← Back to Group                         │
│                                         │
│  Gift Ideas for:                        │
│  [Photo 80x80]  Juan García             │
│  Budget: $50                            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🎁 Nintendo Switch Game         │    │
│  │    Any game is fine             │    │
│  │    ~$60  ⭐⭐⭐ High priority   │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 📚 Programming Book             │    │
│  │    Clean Code or similar        │    │
│  │    ~$40  ⭐⭐ Medium            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  (No wishes yet message if empty)       │
└─────────────────────────────────────────┘
```

## Risks & Considerations

- **Risk 1**: User profile data exposure → **Mitigation**: Only expose name and photoUrl (public info), require authentication
- **Risk 2**: Performance on dashboard with many groups → **Mitigation**: Paginate or lazy load if needed
- **Risk 3**: User without photo → **Mitigation**: Show initial avatar (first letter of name)

## Notes

- Existing `getAssignedWishes` endpoint already works, just needs user profile data added
- Firebase Firestore already stores user profiles with name and photoUrl in `users` collection
- Keep backward compatibility with existing components

## Change Log

| Date       | Change       | By            |
| ---------- | ------------ | ------------- |
| 2026-03-07 | Plan created | @project-lead |

## 📈 Efficiency Analysis

_(To be filled upon plan completion)_

### Task Metrics

| Task | Duration | Tool Calls | Errors | Lines Changed |
| ---- | -------- | ---------- | ------ | ------------- |
| 058  | -        | -          | -      | -             |
| 059  | -        | -          | -      | -             |
| 060  | -        | -          | -      | -             |
| 061  | -        | -          | -      | -             |
| 062  | -        | -          | -      | -             |
| 063  | -        | -          | -      | -             |
| 064  | -        | -          | -      | -             |
| 065  | -        | -          | -      | -             |

### Totals

- **Total Duration**: -
- **Total Tool Calls**: -
- **Issues Detected**: -

### Lessons Learned

_(To be filled upon completion)_
