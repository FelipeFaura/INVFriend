# 🤖 Multi-Agent Orchestration System

This document describes the AI agent system for INVFriend development. The system coordinates specialized agents to implement features, fix bugs, and maintain code quality.

---

## 📋 Overview

The multi-agent system consists of:

| Agent                    | Role                                  | Code Writing    |
| ------------------------ | ------------------------------------- | --------------- |
| **@project-lead**        | Coordinator, task decomposition       | ❌ Never        |
| **@angular-implementer** | Frontend Angular code                 | ✅ Yes          |
| **@express-implementer** | Backend Node.js/Express code          | ✅ Yes          |
| **@angular-ui-designer** | UI/UX, templates, SCSS                | ✅ Yes          |
| **@test-writer**         | Unit and integration tests            | ✅ Yes          |
| **@security-reviewer**   | Security audits, vulnerability checks | ❌ Reports only |
| **@pr-reviewer**         | Code review, standards compliance     | ❌ Reviews only |

---

## 🚀 Quick Start

### Starting a New Feature

1. **Open a chat with @project-lead**

   ```
   I need to implement [feature description]
   ```

2. **Lead creates planning documents**
   - `docs/TASKS_BACKEND/PLAN_{feature}.md` or `docs/TASKS_FRONTEND/PLAN_{feature}.md`
   - Individual `TASK-XXX-*.md` files

3. **Open separate session with sub-agent**

   ```
   @angular-implementer work on docs/TASKS_FRONTEND/TASK-001-create-group-component.md
   ```

4. **Sub-agent completes task, documents results**

5. **Return to lead session**

   ```
   TASK-001 is complete, what's next?
   ```

6. **Repeat until all tasks done**

7. **Use @pr-reviewer for final code review**

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                              │
│              "Implement notification feature"                │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   @project-lead                              │
│  1. Analyze requirements                                     │
│  2. Create PLAN.md                                          │
│  3. Create TASK-001.md, TASK-002.md, ...                    │
│  4. Assign to sub-agents                                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ @express-     │   │ @angular-     │   │ @test-        │
│ implementer   │   │ implementer   │   │ writer        │
│               │   │               │   │               │
│ TASK-001      │   │ TASK-003      │   │ TASK-005      │
│ Backend code  │   │ Frontend code │   │ Tests         │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   @project-lead                              │
│  - Reviews results                                           │
│  - Handles escalations                                       │
│  - Updates PLAN.md                                          │
│  - Assigns next tasks                                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   @pr-reviewer                               │
│  - Final code review                                         │
│  - Standards compliance                                      │
│  - Pattern documentation                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
.github/
├── agents/
│   ├── project-lead.agent.md         ← Coordinator
│   ├── angular-implementer.agent.md  ← Frontend specialist
│   ├── express-implementer.agent.md  ← Backend specialist
│   ├── angular-ui-designer.agent.md  ← UI/UX specialist
│   ├── test-writer.agent.md          ← Testing specialist
│   ├── security-expert.md            ← Security reviewer
│   └── pr-reviewer.agent.md          ← Code reviewer
├── skills/
│   └── coding-guidelines/
│       └── SKILL.md                  ← Consolidated conventions
├── skill-spec-driven-development.md  ← Development workflow
└── skill-unit-testing.md             ← Testing standards

docs/
├── PLAN_TEMPLATE.md                  ← Feature plan template
├── TASK_TEMPLATE.md                  ← Individual task template
├── TASKS_BACKEND/
│   ├── PLAN_{feature}.md             ← Backend feature plans
│   └── TASK_XXX_*.md                 ← Backend tasks
└── TASKS_FRONTEND/
    ├── PLAN_{feature}.md             ← Frontend feature plans
    └── TASK_XXX_*.md                 ← Frontend tasks
```

---

## 🧠 Model Selection

| Task Complexity                               | Recommended Model |
| --------------------------------------------- | ----------------- |
| Simple (single file, clear requirements)      | Claude Sonnet 4.5 |
| Complex (multi-file, architectural decisions) | Claude Opus 4.5   |

**Examples:**

- Simple: "Create User entity with validation" → Sonnet 4.5
- Complex: "Design notification system architecture" → Opus 4.5

---

## 🚫 Scope Boundaries

Each sub-agent has strict scope boundaries:

### ✅ What Sub-Agents CAN Do

- Create/modify files listed in their task document
- Fix issues in their own code that cause build failures
- Document external issues they encounter

### ❌ What Sub-Agents CANNOT Do

- Fix code outside their task scope
- Modify files not assigned to them
- Add dependencies without approval
- Skip documentation

### When External Issues Are Found

Sub-agents report issues to `@project-lead` instead of fixing them:

```markdown
## External Issues Detected

- **File**: `path/to/file.ts:42`
- **Issue**: Missing import causes build error
- **Not in scope**: File not part of this task
- **Action needed**: @project-lead should review/reassign
```

---

## 📊 Task Status Legend

| Status   | Symbol | Meaning                              |
| -------- | ------ | ------------------------------------ |
| Pending  | ⏳     | Not started                          |
| Active   | 🔄     | Currently being worked on            |
| Complete | ✅     | Finished successfully                |
| Blocked  | 🚫     | Cannot proceed (external dependency) |
| Failed   | ❌     | Could not complete                   |

---

## 🔧 Common Scenarios

### Scenario 1: Feature Development

```
1. User → @project-lead: "Add group invite feature"
2. @project-lead creates:
   - PLAN_GROUP_INVITE.md
   - TASK-001-invite-entity.md → @express-implementer
   - TASK-002-invite-repository.md → @express-implementer
   - TASK-003-invite-use-cases.md → @express-implementer
   - TASK-004-invite-component.md → @angular-implementer
   - TASK-005-invite-tests.md → @test-writer
3. Sub-agents work on assigned tasks
4. @project-lead coordinates handoffs
5. @pr-reviewer does final review
```

### Scenario 2: Bug Fix

```
1. User → @project-lead: "Fix group creation error"
2. @project-lead investigates and creates:
   - TASK-FIX-001-group-validation.md → @express-implementer
3. @express-implementer fixes bug, documents result
4. @test-writer adds regression test if needed
5. @pr-reviewer verifies fix
```

### Scenario 3: Security Audit

```
1. User → @security-reviewer: "Audit authentication flow"
2. @security-reviewer analyzes code, produces report
3. @project-lead creates fix tasks from findings
4. Sub-agents implement fixes
5. @security-reviewer re-verifies
```

---

## ❓ Troubleshooting

### "Sub-agent went out of scope"

- Return to `@project-lead` and report
- Lead will reassess task boundaries

### "Build fails but my code is correct"

- Document in External Issues Detected section
- Mark task complete if your scope is done
- Escalate to `@project-lead`

### "Need clarification on requirements"

- Fill in Blockers/Questions section of task
- Notify user to consult `@project-lead`

### "Lost context mid-feature"

- `@project-lead` can reconstruct state from PLAN.md
- All decisions are documented in task files

---

## 📚 Reference Documents

| Document                                                                        | Purpose                        |
| ------------------------------------------------------------------------------- | ------------------------------ |
| [ARCHITECTURE.md](ARCHITECTURE.md)                                              | Hexagonal architecture details |
| [GUIDELINES.md](GUIDELINES.md)                                                  | Coding conventions             |
| [TASK_TEMPLATE.md](TASK_TEMPLATE.md)                                            | Task document format           |
| [PLAN_TEMPLATE.md](PLAN_TEMPLATE.md)                                            | Feature plan format            |
| [skill-spec-driven-development.md](../.github/skill-spec-driven-development.md) | Development workflow           |
| [skill-unit-testing.md](../.github/skill-unit-testing.md)                       | Testing standards              |

---

## ✅ Benefits of This System

| Problem                           | Solution                                     |
| --------------------------------- | -------------------------------------------- |
| Context overflow in long sessions | Each agent has minimal, focused context      |
| "Forgot what we were doing"       | All state persisted in task documents        |
| Agents fixing each other's code   | Strict scope boundaries with escalation      |
| Lost institutional knowledge      | Known Patterns sections accumulate learnings |
| Can't resume after session reset  | Lead reads PLAN.md and reconstructs state    |
| Inconsistent code quality         | PR reviewer ensures standards compliance     |

---

**Last updated:** March 2026
