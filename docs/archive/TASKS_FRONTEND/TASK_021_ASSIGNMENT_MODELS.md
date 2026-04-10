# TASK-021: Implement Assignment Models & HTTP Service

## Status: 🔄 IN PROGRESS

**Sprint**: 6 - Raffle System Frontend  
**Priority**: HIGH  
**Estimated Effort**: 2 hours  
**Dependencies**: TASK-020 (Raffle Controller - ✅ Completed)

---

## Description

Create frontend models, DTOs, errors, and HTTP service for raffle operations.

---

## Acceptance Criteria

### Models

- [ ] Assignment model interface
- [ ] RaffleResult interface

### DTOs

- [ ] PerformRaffleResponseDTO
- [ ] GetAssignmentResponseDTO

### Errors

- [ ] RaffleError base class
- [ ] Error classes for all raffle error types
- [ ] Error factory function

### HTTP Service

- [ ] performRaffle(groupId) method
- [ ] getMyAssignment(groupId) method
- [ ] Error handling

### Testing

- [ ] Unit tests for HTTP service
- [ ] All tests passing

---

## Files to Create

1. `frontend/src/app/domain/models/assignment.model.ts`
2. `frontend/src/app/domain/errors/raffle-errors.ts`
3. `frontend/src/app/application/dto/raffle.dto.ts`
4. `frontend/src/app/adapters/services/raffle-http.service.ts`
5. `frontend/src/app/adapters/services/raffle-http.service.spec.ts`

---

## Implementation Notes

_To be filled after implementation_

---

## Test Results

_To be filled after tests pass_
