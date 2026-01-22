# INVFriend - Task Template for AI

This is a template for assigning tasks to AI in a clear, specific, and controlled way.

## 📋 Standard Template

Copy and complete this template when assigning a task to AI:

```markdown
# TASK: [Descriptive task name]

## 📝 Description

[Exactly what needs to be done]

## 📍 Location

- File(s): [Exact paths where changes go]
- Example: `backend/src/application/use-cases/CreateGroupUseCase.ts`

## 🏗️ Model/Reference

[Existing interfaces, types, or models that must be followed]

- Reference to ARCHITECTURE.md if applicable
- Examples of similar existing code

## 🎯 Specific Requirements

- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## 🚫 Scope / Limits (VERY IMPORTANT)

**What NOT to do:**

- ❌ [Thing not to do 1]
- ❌ [Thing not to do 2]
- ❌ Do not create additional files not mentioned
- ❌ Do not change existing code without instruction

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md conventions
- [ ] Includes tests (if applicable)
- [ ] No debug logs
- [ ] Documented with JSDoc
- [ ] Files created follow exact naming

## 📚 References

- Relevant GUIDELINES.md section: [link]
- Related entities in ARCHITECTURE.md: [link]
- Similar example file: [path]
```

---

## 📖 Real Examples

### Example 1: Implement Entity

````markdown
# TASK: Create Group entity

## 📝 Description

Create the Group entity representing a Secret Santa group.
Must have basic validations and creation methods.

## 📍 Location

- File: `backend/src/domain/entities/Group.ts`

## 🏗️ Model/Reference

Based on structure defined in ARCHITECTURE.md, section "Data Models > Group":

```typescript
{
  id: string;                    // Generated UID
  name: string;                  // Group name
  description?: string;          // Optional description
  adminId: string;               // UID of admin who created the group
  members: string[];             // Array of member UIDs
  budgetLimit: number;           // Budget limit in currency
  raffleStatus: 'pending' | 'completed';
  raffleDate?: number;
  createdAt: number;
  updatedAt: number;
}
```
````

## 🎯 Specific Requirements

- [ ] Private constructor + factory method static `create()`
- [ ] Validate that `name` is not empty
- [ ] Validate that `budgetLimit > 0`
- [ ] Admin must be added to members array on creation
- [ ] `raffleStatus` default must be 'pending'
- [ ] Timestamps generated with `Date.now()`
- [ ] Method `isValidForRaffle()`: verifies at least 2 members

## 🚫 Scope / Limits

- ❌ Do not create repositories
- ❌ Do not create controllers
- ❌ Do not make Firebase calls
- ❌ Do not include notification logic
- ❌ Only the domain entity

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md section "TypeScript > Types"
- [ ] Includes JSDoc on public methods
- [ ] File is exactly: `backend/src/domain/entities/Group.ts`
- [ ] Class is named exactly `Group`
- [ ] Tests in: `backend/src/domain/entities/__tests__/Group.spec.ts`

## 📚 References

- GUIDELINES.md: Section "TypeScript > Variable Names"
- ARCHITECTURE.md: Section "🗄️ Data Models"

````

### Example 2: Implement Use Case
```markdown
# TASK: Implement CreateGroupUseCase

## 📝 Description
Use case that creates a new Secret Santa group.
Validates data, creates Group entity, persists to database and returns the created group.

## 📍 Location
- File: `backend/src/application/use-cases/CreateGroupUseCase.ts`
- DTO: `backend/src/application/dto/CreateGroupDTO.ts`

## 🏗️ Model/Reference
```typescript
// Expected DTO
export interface CreateGroupDTO {
  name: string;
  description?: string;
  budgetLimit: number;
  adminId: string;
}

// Use Case must return Group (from domain/entities)
```

Reference: Similar pattern in GUIDELINES.md, section "Node.js/Express > Use Cases"

## 🎯 Specific Requirements

- [ ] Inject `IGroupRepository` in constructor
- [ ] Validate that `budgetLimit > 0`, else throw `InvalidBudgetError`
- [ ] Validate that `name` is not empty, else throw `ValidationError`
- [ ] Use `Group.create()` to create the entity
- [ ] Save in repository using `repository.create(group)`
- [ ] Return the created entity
- [ ] Catch repository errors and re-throw them

## 🚫 Scope / Limits

- ❌ Do not create notifications
- ❌ Do not add authentication
- ❌ Do not create controller or endpoint
- ❌ Do not do logging beyond errors
- ❌ Only creation logic

## ✅ Acceptance / Checklist

- [ ] Follows GUIDELINES.md > Node.js/Express > Use Cases pattern
- [ ] JSDoc documents parameters, return and exceptions
- [ ] Tests in `backend/src/application/use-cases/__tests__/CreateGroupUseCase.spec.ts`
- [ ] Tests include cases: success, invalid budget, empty name
- [ ] Coverage >90%

## 📚 References

- GUIDELINES.md: "Best Practices > Dependency Injection"
- GUIDELINES.md: "Best Practices > Error Handling"
- ARCHITECTURE.md: "🎯 Use Cases (MVP)"

```

---

## 🎓 Guide for Task Assigners

1. **Be specific:** Include exact paths, exact names, examples
2. **Define limits:** What YES and what NO must do
3. **Reference code:** Point to similar existing examples
4. **Document context:** Why this task, what problem it solves
5. **Clear checklist:** What means "ready"

### ❌ Bad task:

```
"Implement authentication so users can log in"
```

### ✅ Good task:

```
TASK: Create FirebaseAuthAdapter

Exact location: backend/src/adapters/auth/FirebaseAuthAdapter.ts
Must implement IAuthPort interface (see backend/src/ports/IAuthPort.ts)
Required methods: loginWithEmail(), loginWithGoogle(), logout(), getCurrentUser()
DO NOT include: Controllers, endpoints, token handling
Follow pattern in GUIDELINES.md > Dependency Injection
```

---

## 📞 AI ↔ Human Communication

If AI is unsure about a task, it should ask:

**AI asks:**
- "The task says [X], but I also need [Y]. Is that in scope?"
- "Does file [Z] already exist or should I create it?"
- "Should validation be in Use Case or Controller?"

**Quick response expected:**
- "Yes, include [Y]"
- "It doesn't exist, create it"
- "Always in Use Case"

---

**Last updated:** January 2026
```
````
