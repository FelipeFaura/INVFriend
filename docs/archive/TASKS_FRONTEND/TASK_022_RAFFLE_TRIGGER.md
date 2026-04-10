# TASK-022: Implement Raffle Trigger Component

## Status: 🔄 IN PROGRESS

**Sprint**: 6 - Raffle System Frontend  
**Priority**: HIGH  
**Estimated Effort**: 4 hours  
**Dependencies**: TASK-021 (Assignment Models & HTTP Service - ✅ Completed)

---

## Description

Create an admin-only component to perform the Secret Santa raffle with confirmation dialog.

---

## Acceptance Criteria

### Component

- [ ] Display member count
- [ ] Validate minimum members (2 required)
- [ ] "Perform Raffle" button visible only to admin
- [ ] Confirmation dialog with warning
- [ ] Loading state during raffle
- [ ] Success message on completion
- [ ] Error handling with user-friendly messages

### Events

- [ ] Emit event when raffle is completed

### Testing

- [ ] Unit tests for component
- [ ] All tests passing

---

## Files to Create

1. `frontend/src/app/adapters/components/raffle-trigger/raffle-trigger.component.ts`
2. `frontend/src/app/adapters/components/raffle-trigger/raffle-trigger.component.html`
3. `frontend/src/app/adapters/components/raffle-trigger/raffle-trigger.component.scss`
4. `frontend/src/app/adapters/components/raffle-trigger/raffle-trigger.component.spec.ts`

---

## Implementation Notes

_To be filled after implementation_

---

## Test Results

_To be filled after tests pass_
