# Multi-Agent Orchestration System

AI agent system for coordinated development. The system plans work, implements features, reviews code, and maintains quality through specialized agents.

---

## Agents

| Agent | Role | Writes Code | User-Invocable |
|-------|------|-------------|----------------|
| **@project-lead** | Coordinator — plans, delegates, reviews, commits | No | Yes |
| **@coder** | Full-stack implementation + unit tests | Yes | Yes |
| **@reviewer** | Code quality + security audit (OWASP) | No (read-only) | Yes |
| **@ui-designer** | SCSS, HTML templates, accessibility | Yes (.html/.scss only) | No |

---

## How It Works

### Via @project-lead (recommended)

1. Describe what you need to @project-lead
2. Lead analyzes the codebase and proposes a plan in chat
3. You approve or adjust the plan
4. Lead delegates to sub-agents, reviews output, commits per task
5. Lead verifies production build and reports status

### Direct agent invocation

- **@coder**: For quick fixes or when you know exactly what to change
- **@reviewer**: For on-demand code reviews or security checks

---

## Architecture

`
You (user)
  │
  ▼
@project-lead ──────── plans in chat, never in files
  │
  ├──▶ @coder ──────── implements + tests
  ├──▶ @reviewer ───── reviews (read-only)
  └──▶ @ui-designer ── styling + accessibility
`

### Enforcement Mechanisms

| Mechanism | Effect |
|-----------|--------|
| `tools:` in frontmatter | Restricts what each agent can do (e.g., reviewer can't edit) |
| `agents:` in project-lead | Only allows calling coder, reviewer, ui-designer |
| `copilot-instructions.md` | Base rules injected into ALL conversations |
| `coding-conventions.instructions.md` | Auto-loaded when any agent edits `.ts` files |
| `coding-guidelines SKILL` | Detailed patterns and code examples |

---

## File Structure

`
.github/
├── agents/
│   ├── project-lead.agent.md
│   ├── coder.agent.md
│   ├── reviewer.agent.md
│   └── ui-designer.agent.md
├── copilot-instructions.md         ← Base rules (all conversations)
├── instructions/
│   └── coding-conventions.instructions.md  ← Auto-loaded for .ts files
└── skills/
    └── coding-guidelines/
        └── SKILL.md                ← Detailed patterns + examples
`

---

## Key Rules

- **90%+ coverage** on new code (exceptions must be cited)
- **Conventional commits**: `feat|fix|docs|refactor(scope): description`
- **Never `git push`** — only the user pushes
- **Hexagonal architecture**: Dependencies flow inward (Adapters → Application → Domain)
- **No `any`, no `console.log()`** in production code
