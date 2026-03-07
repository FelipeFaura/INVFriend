# INVFriend - Feature/Bug Plan Template

This template is used by `@project-lead` to create a planning dashboard for multi-task features or bug fixes.

## 📋 Template

Copy this template when starting a new feature or bug fix:

```markdown
# {Feature/Bug}: {Title}

## Summary

One-line description of the goal.

## Status Dashboard

| Total | ✅ Done | 🔄 Active | ⏳ Pending | 🚫 Blocked |
| ----- | ------- | --------- | ---------- | ---------- |
| N     | 0       | 0         | N          | 0          |

## Tasks

| ID  | Description         | Agent       | Dependencies | Status |
| --- | ------------------- | ----------- | ------------ | ------ |
| 001 | [Short description] | @agent-name | -            | ⏳     |
| 002 | [Short description] | @agent-name | 001          | ⏳     |
| 003 | [Short description] | @agent-name | 001          | ⏳     |

## Execution Order

### Wave 1 (Parallel - No Dependencies)

- TASK-001: [Description] - Can start immediately
- TASK-002: [Description] - Can start immediately

### Wave 2 (Depends on Wave 1)

- TASK-003: [Description] - Depends on 001
- TASK-004: [Description] - Depends on 002

### Wave 3 (Final)

- TASK-005: [Description] - Depends on 003, 004

## Architecture Impact

### Layers Affected

- [ ] Domain (entities, errors)
- [ ] Application (use cases, services, DTOs)
- [ ] Adapters (controllers, repositories, components)

### Key Files

List main files that will be created or modified:

- `path/to/file1.ts` - [purpose]
- `path/to/file2.ts` - [purpose]

## Risks & Considerations

- **Risk 1**: [Description] → **Mitigation**: [How to handle]
- **Risk 2**: [Description] → **Mitigation**: [How to handle]

## Notes

Additional context, decisions made, or references:

- [Note 1]
- [Note 2]

## Change Log

| Date       | Change             | By                   |
| ---------- | ------------------ | -------------------- |
| YYYY-MM-DD | Plan created       | @project-lead        |
| YYYY-MM-DD | TASK-001 completed | @angular-implementer |

## 📈 Efficiency Analysis

_(Filled by @project-lead upon plan completion)_

### Session Metrics Summary

| Task | Model | Tokens In | Tokens Out | Duration | Tool Calls | Difficulty |
| ---- | ----- | --------- | ---------- | -------- | ---------- | ---------- |
| 001  | -     | -         | -          | -        | -          | -          |
| 002  | -     | -         | -          | -        | -          | -          |
| ...  | -     | -         | -          | -        | -          | -          |

**Totals:**

- Total Tokens: [sum]
- Total Duration: [sum] minutes
- Estimated Cost: ~$X.XX

### Project Lead Session

| Metric                | Value                           |
| --------------------- | ------------------------------- |
| **Model**             | [model used]                    |
| **Plan Duration**     | [total time managing this plan] |
| **Tokens Used**       | [if available]                  |
| **Tasks Coordinated** | [count]                         |

### Performance Analysis

**Most Efficient Task:**

- Task ID: [XXX]
- Reason: [low tokens, fast completion, etc.]

**Least Efficient Task:**

- Task ID: [XXX]
- Reason: [high tokens, many retries, user intervention, etc.]

**Model Recommendations:**

| Task Type      | Recommended Model | Reason                     |
| -------------- | ----------------- | -------------------------- |
| Simple styling | Sonnet            | Fast, low token usage      |
| Complex logic  | Opus              | Better first-time accuracy |
| Migrations     | [model]           | [reason]                   |
| Testing        | [model]           | [reason]                   |

### Lessons Learned

1. [Observation about what worked well]
2. [Observation about what could improve]
3. [Recommendation for future similar work]

### Efficiency Score

**Overall: X/10**

Criteria:

- Token efficiency: X/10
- Time efficiency: X/10
- First-attempt success rate: X%
- User intervention rate: X%
```

---

## 📖 Status Legend

| Status  | Symbol | Meaning                              |
| ------- | ------ | ------------------------------------ |
| Pending | ⏳     | Not started yet                      |
| Active  | 🔄     | Currently being worked on            |
| Done    | ✅     | Completed successfully               |
| Blocked | 🚫     | Cannot proceed due to external issue |

---

## 🗂️ File Location

PLAN files should be created in:

- **Backend features**: `docs/TASKS_BACKEND/PLAN_{FEATURE_NAME}.md`
- **Frontend features**: `docs/TASKS_FRONTEND/PLAN_{FEATURE_NAME}.md`
- **Cross-cutting features**: `docs/PLAN_{FEATURE_NAME}.md`

---

## 📝 Example: Notification Feature Plan

```markdown
# Feature: User Notifications

## Summary

Implement in-app notifications for group events (invites, raffle results, wish updates).

## Status Dashboard

| Total | ✅ Done | 🔄 Active | ⏳ Pending | 🚫 Blocked |
| ----- | ------- | --------- | ---------- | ---------- |
| 5     | 2       | 1         | 2          | 0          |

## Tasks

| ID  | Description                              | Agent                | Dependencies | Status |
| --- | ---------------------------------------- | -------------------- | ------------ | ------ |
| 001 | Create Notification entity               | @express-implementer | -            | ✅     |
| 002 | Create INotificationRepository port      | @express-implementer | 001          | ✅     |
| 003 | Implement FirebaseNotificationRepository | @express-implementer | 002          | 🔄     |
| 004 | Create notification use cases            | @express-implementer | 003          | ⏳     |
| 005 | Create notification component            | @angular-implementer | 004          | ⏳     |

## Execution Order

### Wave 1 (Domain)

- TASK-001: Notification entity - No dependencies

### Wave 2 (Infrastructure)

- TASK-002: Repository port - Depends on 001
- TASK-003: Firebase implementation - Depends on 002

### Wave 3 (Application + UI)

- TASK-004: Use cases - Depends on 003
- TASK-005: UI component - Depends on 004

## Architecture Impact

### Layers Affected

- [x] Domain (Notification entity, NotificationNotFoundError)
- [x] Application (CreateNotificationUseCase, GetUserNotificationsUseCase)
- [x] Adapters (FirebaseNotificationRepository, NotificationController, NotificationListComponent)

### Key Files

- `backend/src/domain/entities/Notification.ts` - Notification entity
- `backend/src/ports/INotificationRepository.ts` - Repository interface
- `backend/src/adapters/persistence/FirebaseNotificationRepository.ts` - Firestore implementation
- `frontend/src/app/adapters/components/notification-list/` - UI component

## Notes

- Notifications should be real-time via Firestore listeners
- Consider notification preferences per user in future sprint
```

---

## ✅ Plan Creation Checklist

Before sharing a plan with sub-agents:

- [ ] Summary clearly describes the goal
- [ ] All tasks have unique IDs
- [ ] Each task has one assigned agent
- [ ] Dependencies are correctly mapped
- [ ] Execution order is logical
- [ ] No circular dependencies
- [ ] Key files are identified
- [ ] Risks are documented
