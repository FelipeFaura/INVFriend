# TASK-018: Implement Raffle Algorithm

## Status: ✅ COMPLETED

**Sprint**: 5 - Raffle System Backend  
**Priority**: CRITICAL  
**Estimated Effort**: 6 hours  
**Dependencies**: TASK-017 (Assignment Entity - ✅ Completed)

---

## Description

Implement a fair Secret Santa assignment algorithm using Fisher-Yates shuffle with validation.

---

## Acceptance Criteria

### Algorithm Requirements

- [x] Each person gets exactly 1 secret santa
- [x] Each person is secret santa for exactly 1 person
- [x] No one is their own secret santa
- [x] Randomized but deterministic (testable with seed)
- [x] Handle edge cases (2 members minimum)

### Implementation

- [x] Fisher-Yates shuffle utility
- [x] Circular derangement algorithm (no fixed points)
- [x] Validation of results
- [x] Clear error messages for edge cases

### Testing

- [x] Unit tests for shuffle algorithm (7 tests)
- [x] Unit tests for assignment generation (12 tests)
- [x] Edge case tests (2 members, large groups)
- [x] Statistical distribution tests (randomness)
- [x] Validation tests (8 tests)
- [x] All 27 tests passing

---

## Technical Specification

### Algorithm Approach

Use a modified Fisher-Yates shuffle to create a derangement (permutation with no fixed points):

1. Shuffle the member list
2. Create assignments where member[i] → member[(i+1) % n]
3. This guarantees a valid derangement (circular assignment)

### Interface

```typescript
interface RaffleResult {
  assignments: Array<{
    receiverId: string;
    secretSantaId: string;
  }>;
}

function performRaffle(memberIds: string[]): RaffleResult;
```

---

## Files to Create

1. `backend/src/shared/utils/raffleAlgorithm.ts`
2. `backend/src/shared/utils/__tests__/raffleAlgorithm.spec.ts`

---

## Implementation Notes

- **Circular derangement approach**: Shuffle members, then assign each to the next in the list
- This guarantees a valid derangement without rejection sampling
- Deterministic testing via optional `randomFn` parameter
- Validation function can be used independently to verify any assignment set
- Handles duplicate member detection
- Returns structured RaffleResult with success/error information

---

## Test Results

- shuffleArray: 7 tests
- performRaffle: 12 tests (basic, derangement, bijection, errors, randomness)
- validateRaffleResult: 7 tests
- Integration: 1 test
- **Total: 27 tests passing**
